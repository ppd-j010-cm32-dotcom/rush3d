import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { QuestionData } from '../../types/game';
import { sfx } from '../../utils/audio';
import { createRealisticCar, RealisticCar } from './CarModel';

interface RoadSceneProps {
  carColor: string;
  isPaused: boolean;
  isCheckpointActive: boolean;
  currentQuestion: QuestionData | null;
  onLaneSelectedByCar: (laneIndex: number) => void;
  targetLane: number; // 0: Left, 1: Center, 2: Right
  onDistanceUpdate: (distTraveled: number, distToCheckpoint: number) => void;
  checkpointDistance: number;
  onTriggerCheckpoint: () => void;
}

const LANE_X = [-3.6, 0, 3.6];
const ROAD_WIDTH = 12.8;
const ROAD_SEGMENT_LENGTH = 140;
const MAX_CRUISE_SPEED = 40; // units/sec
const LEARNING_SPEED = 2; // safe crawl during checkpoint

export const RoadScene: React.FC<RoadSceneProps> = ({
  carColor,
  isPaused,
  isCheckpointActive,
  currentQuestion,
  onLaneSelectedByCar,
  targetLane,
  onDistanceUpdate,
  checkpointDistance,
  onTriggerCheckpoint,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // References to keep dynamic states fresh without tearing down the 3D scene
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const isCheckpointActiveRef = useRef(isCheckpointActive);
  isCheckpointActiveRef.current = isCheckpointActive;

  const onDistanceUpdateRef = useRef(onDistanceUpdate);
  onDistanceUpdateRef.current = onDistanceUpdate;

  const onTriggerCheckpointRef = useRef(onTriggerCheckpoint);
  onTriggerCheckpointRef.current = onTriggerCheckpoint;

  const onLaneSelectedByCarRef = useRef(onLaneSelectedByCar);
  onLaneSelectedByCarRef.current = onLaneSelectedByCar;

  const updateGateBoardsRef = useRef<((q: QuestionData | null) => void) | null>(null);
  const playerCarRef = useRef<RealisticCar | null>(null);

  // References to mutable values across render ticks
  const stateRef = useRef({
    currentLane: targetLane,
    carX: LANE_X[targetLane] || 0,
    carTargetX: LANE_X[targetLane] || 0,
    carSpeed: MAX_CRUISE_SPEED,
    totalDistance: 0,
    distanceToNextCheckpoint: checkpointDistance,
    isAtCheckpoint: false,
    selectedGatePassed: false,
    userSteeredLane: targetLane,
  });

  // Keep target lane synchronized when updated externally via buttons
  useEffect(() => {
    stateRef.current.carTargetX = LANE_X[targetLane] ?? 0;
    stateRef.current.currentLane = targetLane;
  }, [targetLane]);

  // Update car paint color dynamically without rebuilding scene
  useEffect(() => {
    if (playerCarRef.current) {
      playerCarRef.current.setBodyColor(carColor);
    }
  }, [carColor]);

  // Update gate boards whenever question changes without rebuilding the scene
  useEffect(() => {
    if (updateGateBoardsRef.current) {
      updateGateBoardsRef.current(currentQuestion);
    }
  }, [currentQuestion]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ==========================================
    // 1. SCENE, CAMERA, HIGH-FIDELITY RENDERER
    // ==========================================
    const scene = new THREE.Scene();

    // Atmosphere fog with warm distance horizon haze
    scene.fog = new THREE.FogExp2('#93c5fd', 0.0055);

    const camera = new THREE.PerspectiveCamera(56, container.clientWidth / container.clientHeight, 0.1, 600);
    camera.position.set(0, 4.3, 8.8);
    camera.lookAt(0, 1.5, -15);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Realistic PBR Environment Reflections using RoomEnvironment
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // ==========================================
    // 2. ATMOSPHERIC SKY DOME & SUNLIGHT
    // ==========================================
    // Create hemispherical Sky Dome with realistic sky gradient
    const skyGeo = new THREE.SphereGeometry(450, 32, 24);
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 1024;
    skyCanvas.height = 512;
    const skyCtx = skyCanvas.getContext('2d')!;
    const skyGrad = skyCtx.createLinearGradient(0, 0, 0, 512);
    skyGrad.addColorStop(0, '#0369a1');    // Deep zenith blue
    skyGrad.addColorStop(0.45, '#38bdf8'); // Mid tropical sky
    skyGrad.addColorStop(0.75, '#bae6fd'); // Atmospheric sky haze
    skyGrad.addColorStop(0.95, '#fed7aa'); // Warm golden sunset glow at horizon
    skyGrad.addColorStop(1, '#fde68a');
    skyCtx.fillStyle = skyGrad;
    skyCtx.fillRect(0, 0, 1024, 512);

    // Sun disc in sky
    const sunGrad = skyCtx.createRadialGradient(512, 380, 5, 512, 380, 160);
    sunGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    sunGrad.addColorStop(0.2, 'rgba(254, 240, 138, 0.8)');
    sunGrad.addColorStop(0.6, 'rgba(253, 186, 116, 0.3)');
    sunGrad.addColorStop(1, 'rgba(253, 186, 116, 0)');
    skyCtx.fillStyle = sunGrad;
    skyCtx.fillRect(0, 0, 1024, 512);

    const skyTex = new THREE.CanvasTexture(skyCanvas);
    skyTex.colorSpace = THREE.SRGBColorSpace;
    const skyMat = new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyDome);

    // Drifting 3D Cumulus Clouds
    const cloudGroup = new THREE.Group();
    scene.add(cloudGroup);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0.05,
      transparent: true,
      opacity: 0.78,
    });

    for (let c = 0; c < 14; c++) {
      const cloud = new THREE.Group();
      const numPuffs = 4 + Math.floor(Math.random() * 4);
      for (let p = 0; p < numPuffs; p++) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(12 + Math.random() * 10, 8, 8),
          cloudMat
        );
        puff.position.set((p - numPuffs / 2) * 14, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 10);
        cloud.add(puff);
      }
      cloud.position.set(
        (Math.random() - 0.5) * 400,
        65 + Math.random() * 45,
        -100 - Math.random() * 250
      );
      cloudGroup.add(cloud);
    }

    // Directional Sunlight with soft realistic shadows
    const sunLight = new THREE.DirectionalLight(0xfffae0, 2.4);
    sunLight.position.set(40, 60, -30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 180;
    sunLight.shadow.camera.left = -22;
    sunLight.shadow.camera.right = 22;
    sunLight.shadow.camera.top = 22;
    sunLight.shadow.camera.bottom = -22;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    // Ambient light with sky/ground color balance
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x14532d, 0.9);
    scene.add(hemiLight);

    // ==========================================
    // 3. LAYERED BANJARAN GUNUNG (MOUNTAIN RANGES)
    // ==========================================
    // Layer 1: Distant misty peaks
    const mountainGroup = new THREE.Group();
    scene.add(mountainGroup);

    const distantMountainMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 1.0,
      metalness: 0.05,
    });
    for (let i = 0; i < 9; i++) {
      const mGeo = new THREE.ConeGeometry(55 + Math.random() * 30, 75 + Math.random() * 25, 6);
      const m = new THREE.Mesh(mGeo, distantMountainMat);
      m.position.set((i - 4) * 65 + (Math.random() - 0.5) * 20, 22, -340);
      mountainGroup.add(m);
    }

    // Layer 2: Mid-range lush rainforest ridges (Banjaran Titiwangsa style)
    const midMountainMat = new THREE.MeshStandardMaterial({
      color: 0x065f46,
      roughness: 0.95,
      metalness: 0.0,
    });
    for (let i = 0; i < 11; i++) {
      const mGeo = new THREE.ConeGeometry(40 + Math.random() * 20, 50 + Math.random() * 20, 7);
      const m = new THREE.Mesh(mGeo, midMountainMat);
      m.position.set((i - 5) * 48 + (Math.random() - 0.5) * 15, 12, -240);
      mountainGroup.add(m);
    }

    // ==========================================
    // 4. REALISTIC HIGHWAY ASPHALT & MARKINGS
    // ==========================================
    const roadGroup = new THREE.Group();
    scene.add(roadGroup);

    // Procedural high-resolution realistic asphalt texture
    const createRealisticAsphaltTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      // Deep dark asphalt base
      ctx.fillStyle = '#181e26';
      ctx.fillRect(0, 0, 1024, 1024);

      // Aggregate micro-stone noise
      for (let i = 0; i < 18000; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const gray = Math.floor(Math.random() * 55 + 28);
        ctx.fillStyle = `rgb(${gray}, ${gray + 2}, ${gray + 4})`;
        ctx.fillRect(x, y, 2, 2);
      }

      // Tire wear tracks in lanes (dark subtle rubber tracks)
      const laneCenters = [1024 * 0.22, 1024 * 0.5, 1024 * 0.78];
      laneCenters.forEach((lX) => {
        // Dual wheel tracks per lane
        [-45, 45].forEach((wOffset) => {
          const trackGrad = ctx.createLinearGradient(lX + wOffset - 25, 0, lX + wOffset + 25, 0);
          trackGrad.addColorStop(0, 'rgba(15, 23, 42, 0)');
          trackGrad.addColorStop(0.5, 'rgba(12, 18, 30, 0.35)');
          trackGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
          ctx.fillStyle = trackGrad;
          ctx.fillRect(lX + wOffset - 25, 0, 50, 1024);
        });
      });

      // Continuous Highway Solid Shoulder Lines (Yellow)
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(16, 0, 14, 1024);
      ctx.fillRect(1024 - 30, 0, 14, 1024);

      // White Dashed Lane Dividers (Sharp Highway Standard)
      ctx.fillStyle = '#f8fafc';
      const laneDiv1 = 1024 * 0.36;
      const laneDiv2 = 1024 * 0.64;
      for (let y = 0; y < 1024; y += 96) {
        ctx.fillRect(laneDiv1 - 4, y, 8, 48);
        ctx.fillRect(laneDiv2 - 4, y, 8, 48);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 10);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    };

    const asphaltTex = createRealisticAsphaltTexture();
    const roadGeo = new THREE.PlaneGeometry(ROAD_WIDTH, ROAD_SEGMENT_LENGTH);
    const roadMat = new THREE.MeshStandardMaterial({
      map: asphaltTex,
      roughness: 0.82,
      metalness: 0.12,
    });

    const roadSegments: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const road = new THREE.Mesh(roadGeo, roadMat);
      road.rotation.x = -Math.PI / 2;
      road.position.z = -i * ROAD_SEGMENT_LENGTH;
      road.receiveShadow = true;
      roadGroup.add(road);
      roadSegments.push(road);
    }

    // Roadside Terrain Embankment (Lush grass with texture)
    const terrainGeo = new THREE.PlaneGeometry(220, ROAD_SEGMENT_LENGTH * 3);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x15803d, // Malaysian rainforest deep green
      roughness: 0.95,
      metalness: 0.0,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -0.06;
    terrain.position.z = -ROAD_SEGMENT_LENGTH;
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Concrete Jersey Barrier Curbs with Hazard Reflective Stripes
    const barrierMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.2,
      roughness: 0.7,
    });
    const barrierGeo = new THREE.BoxGeometry(0.4, 0.75, ROAD_SEGMENT_LENGTH * 3);

    const leftBarrier = new THREE.Mesh(barrierGeo, barrierMat);
    leftBarrier.position.set(-ROAD_WIDTH / 2 - 0.25, 0.35, -ROAD_SEGMENT_LENGTH);
    leftBarrier.castShadow = true;
    leftBarrier.receiveShadow = true;
    scene.add(leftBarrier);

    const rightBarrier = new THREE.Mesh(barrierGeo, barrierMat);
    rightBarrier.position.set(ROAD_WIDTH / 2 + 0.25, 0.35, -ROAD_SEGMENT_LENGTH);
    rightBarrier.castShadow = true;
    rightBarrier.receiveShadow = true;
    scene.add(rightBarrier);

    // Modern Curved Highway Streetlight Poles (Tiang Lampu Lebuhraya)
    const streetlights: THREE.Group[] = [];
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.25 });
    const lampGlowMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    const createStreetlight = (isLeft: boolean) => {
      const lightGroup = new THREE.Group();
      // Vertical Mast
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 7.5, 8), poleMat);
      mast.position.y = 3.75;
      mast.castShadow = true;
      lightGroup.add(mast);

      // Curved Arch Arm
      const arm = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 0.12), poleMat);
      arm.position.set(isLeft ? 1.0 : -1.0, 7.4, 0);
      arm.rotation.z = isLeft ? -0.15 : 0.15;
      lightGroup.add(arm);

      // LED Luminaire Head fixture
      const fixture = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.14, 0.35), poleMat);
      fixture.position.set(isLeft ? 2.1 : -2.1, 7.25, 0);
      lightGroup.add(fixture);

      // Glowing lens
      const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.25), lampGlowMat);
      lens.position.set(isLeft ? 2.1 : -2.1, 7.17, 0);
      lens.rotation.x = Math.PI / 2;
      lightGroup.add(lens);

      return lightGroup;
    };

    for (let i = 0; i < 12; i++) {
      const isLeft = i % 2 === 0;
      const pole = createStreetlight(isLeft);
      pole.position.set(isLeft ? -ROAD_WIDTH / 2 - 1.8 : ROAD_WIDTH / 2 + 1.8, 0, -i * 32);
      scene.add(pole);
      streetlights.push(pole);
    }

    // Realistic Tropical Royal Palm Trees along highway
    const palmTrees: THREE.Group[] = [];
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3818, roughness: 0.95 });
    const palmFrondMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
    const palmFrondGoldMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.5 });

    const createRealisticPalmTree = () => {
      const tree = new THREE.Group();
      // Segmented curved trunk
      for (let s = 0; s < 5; s++) {
        const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.24 - s * 0.02, 0.28 - s * 0.02, 1.3, 8), trunkMat);
        seg.position.set(Math.sin(s * 0.2) * 0.15, 0.65 + s * 1.25, Math.cos(s * 0.2) * 0.1);
        seg.castShadow = true;
        tree.add(seg);
      }

      // Dense fan of realistic palm fronds
      for (let i = 0; i < 10; i++) {
        const frond = new THREE.Mesh(
          new THREE.ConeGeometry(1.9, 2.2, 5),
          i % 2 === 0 ? palmFrondMat : palmFrondGoldMat
        );
        const angle = (i / 10) * Math.PI * 2;
        frond.position.set(Math.cos(angle) * 1.1, 6.7, Math.sin(angle) * 1.1);
        frond.rotation.z = Math.cos(angle) * 0.65;
        frond.rotation.x = Math.sin(angle) * 0.65;
        frond.castShadow = true;
        tree.add(frond);
      }
      return tree;
    };

    for (let i = 0; i < 28; i++) {
      const tree = createRealisticPalmTree();
      const isLeft = i % 2 === 0;
      tree.position.set(
        isLeft ? -ROAD_WIDTH / 2 - 5.5 - Math.random() * 6 : ROAD_WIDTH / 2 + 5.5 + Math.random() * 6,
        0,
        -i * 12
      );
      scene.add(tree);
      palmTrees.push(tree);
    }

    // ==========================================
    // 5. HIGH-FIDELITY PLAYER CAR
    // ==========================================
    const playerCar = createRealisticCar(carColor, true);
    scene.add(playerCar.group);
    playerCarRef.current = playerCar;

    // Forward Headlight Beam Cones on Asphalt
    const headlightBeamMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });
    [-0.64, 0.64].forEach((hX) => {
      const beam = new THREE.Mesh(new THREE.ConeGeometry(1.5, 12, 16), headlightBeamMat);
      beam.position.set(hX, 0.55, -7.5);
      beam.rotation.x = Math.PI / 2;
      playerCar.group.add(beam);
    });

    // ==========================================
    // 6. MODERN HIGHWAY OVERHEAD GANTRY (3D ZON SOALAN)
    // ==========================================
    const gateGroup = new THREE.Group();
    scene.add(gateGroup);
    gateGroup.position.set(0, 0, -500); // starts far away

    // Heavy-duty steel truss columns & crossbeam
    const trussMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const colGeo = new THREE.CylinderGeometry(0.32, 0.32, 5.4, 8);

    const leftGantryCol = new THREE.Mesh(colGeo, trussMat);
    leftGantryCol.position.set(-ROAD_WIDTH / 2 - 0.45, 2.7, 0);
    gateGroup.add(leftGantryCol);

    const rightGantryCol = new THREE.Mesh(colGeo, trussMat);
    rightGantryCol.position.set(ROAD_WIDTH / 2 + 0.45, 2.7, 0);
    gateGroup.add(rightGantryCol);

    const mainTruss = new THREE.Mesh(new THREE.BoxGeometry(ROAD_WIDTH + 1.8, 0.6, 0.6), trussMat);
    mainTruss.position.set(0, 5.1, 0);
    gateGroup.add(mainTruss);

    // Gantry Top Malaysian VMS Signboard: "ZON PILIHAN LORONG PANDU & BACA"
    const headerCanvas = document.createElement('canvas');
    headerCanvas.width = 768;
    headerCanvas.height = 96;
    const hCtx = headerCanvas.getContext('2d')!;
    hCtx.fillStyle = '#0369a1';
    hCtx.fillRect(0, 0, 768, 96);
    hCtx.strokeStyle = '#facc15';
    hCtx.lineWidth = 6;
    hCtx.strokeRect(4, 4, 760, 88);
    hCtx.fillStyle = '#ffffff';
    hCtx.font = 'bold 36px "Fredoka", "Plus Jakarta Sans", sans-serif';
    hCtx.textAlign = 'center';
    hCtx.textBaseline = 'middle';
    hCtx.fillText('★ ZON PILIHAN LORONG PANDU & BACA ★', 384, 48);

    const headerTex = new THREE.CanvasTexture(headerCanvas);
    headerTex.colorSpace = THREE.SRGBColorSpace;
    const headerSign = new THREE.Mesh(
      new THREE.PlaneGeometry(9.6, 1.15),
      new THREE.MeshBasicMaterial({ map: headerTex })
    );
    headerSign.position.set(0, 5.9, 0);
    gateGroup.add(headerSign);

    // 3 Lane Electronic LED Matrix Boards (Lorong 1 / A, Lorong 2 / B, Lorong 3 / C)
    const laneBoards: { mesh: THREE.Mesh; canvas: HTMLCanvasElement; tex: THREE.CanvasTexture }[] = [];
    const laneLabels = ['LORONG 1 (A)', 'LORONG 2 (B)', 'LORONG 3 (C)'];

    for (let i = 0; i < 3; i++) {
      const bCanvas = document.createElement('canvas');
      bCanvas.width = 512;
      bCanvas.height = 256;
      const bTex = new THREE.CanvasTexture(bCanvas);
      bTex.colorSpace = THREE.SRGBColorSpace;

      const boardMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(3.4, 1.65),
        new THREE.MeshBasicMaterial({ map: bTex, side: THREE.DoubleSide })
      );
      boardMesh.position.set(LANE_X[i], 3.4, 0);
      gateGroup.add(boardMesh);

      // Glowing Neon Arch surround
      const neonFrame = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 1.75, 0.12),
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.9,
        })
      );
      neonFrame.position.set(LANE_X[i], 3.4, -0.06);
      gateGroup.add(neonFrame);

      laneBoards.push({ mesh: boardMesh, canvas: bCanvas, tex: bTex });
    }

    // Function to update the 3D lane boards when question changes
    const updateGateBoards = (q: QuestionData | null) => {
      laneBoards.forEach((board, idx) => {
        const ctx = board.canvas.getContext('2d')!;
        ctx.fillStyle = idx === 1 ? '#075985' : '#0369a1';
        ctx.fillRect(0, 0, 512, 256);

        // Neon border
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 8;
        ctx.strokeRect(6, 6, 500, 244);

        // Header Lane tag
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(laneLabels[idx], 256, 48);

        // Word option text
        const optionWord = q?.options[idx] || `L ${idx + 1}`;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 58px "Fredoka", "Plus Jakarta Sans", sans-serif';
        ctx.fillText(optionWord, 256, 142);

        // Instruction sub-line
        ctx.font = '22px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#bae6fd';
        ctx.fillText(`Tekan [${idx + 1}] / Pandu ke sini`, 256, 212);

        board.tex.needsUpdate = true;
      });
    };

    updateGateBoardsRef.current = updateGateBoards;
    updateGateBoards(currentQuestion);

    // ==========================================
    // 7. REALISTIC AI TRAFFIC VEHICLES
    // ==========================================
    const trafficCars: { car: RealisticCar; speed: number; lane: number }[] = [];
    const trafficHexColors = ['#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#64748b'];

    for (let i = 0; i < 4; i++) {
      const col = trafficHexColors[i % trafficHexColors.length];
      const tCar = createRealisticCar(col, false);
      const initialLane = (i + 1) % 3;
      tCar.group.position.set(LANE_X[initialLane], 0, -45 - i * 38);
      scene.add(tCar.group);
      trafficCars.push({
        car: tCar,
        speed: MAX_CRUISE_SPEED * (0.62 + Math.random() * 0.22),
        lane: initialLane,
      });
    }

    // ==========================================
    // 8. KEYBOARD & MOBILE TOUCH CONTROLS
    // ==========================================
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        const next = Math.max(0, stateRef.current.userSteeredLane - 1);
        stateRef.current.userSteeredLane = next;
        stateRef.current.carTargetX = LANE_X[next];
        onLaneSelectedByCarRef.current(next);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        const next = Math.min(2, stateRef.current.userSteeredLane + 1);
        stateRef.current.userSteeredLane = next;
        stateRef.current.carTargetX = LANE_X[next];
        onLaneSelectedByCarRef.current(next);
      } else if (e.key === '1') {
        stateRef.current.userSteeredLane = 0;
        stateRef.current.carTargetX = LANE_X[0];
        onLaneSelectedByCarRef.current(0);
      } else if (e.key === '2') {
        stateRef.current.userSteeredLane = 1;
        stateRef.current.carTargetX = LANE_X[1];
        onLaneSelectedByCarRef.current(1);
      } else if (e.key === '3') {
        stateRef.current.userSteeredLane = 2;
        stateRef.current.carTargetX = LANE_X[2];
        onLaneSelectedByCarRef.current(2);
      } else if (e.key === 'h' || e.key === 'H' || e.key === ' ') {
        sfx.playCarHorn();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Mobile Touch & Tap steering support on the 3D Canvas
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length > 0) {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        const elapsed = Date.now() - touchStartTime;

        // If quick swipe (> 30px)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
          if (deltaX < 0) {
            // Swipe Left
            const next = Math.max(0, stateRef.current.userSteeredLane - 1);
            stateRef.current.userSteeredLane = next;
            stateRef.current.carTargetX = LANE_X[next];
            onLaneSelectedByCarRef.current(next);
          } else {
            // Swipe Right
            const next = Math.min(2, stateRef.current.userSteeredLane + 1);
            stateRef.current.userSteeredLane = next;
            stateRef.current.carTargetX = LANE_X[next];
            onLaneSelectedByCarRef.current(next);
          }
        } else if (Math.abs(deltaX) < 15 && Math.abs(deltaY) < 15 && elapsed < 350) {
          // Tap on screen to steer directly:
          // Left 35% of screen -> Lane 0
          // Middle 30% of screen -> Lane 1
          // Right 35% of screen -> Lane 2
          const tapX = e.changedTouches[0].clientX;
          const screenWidth = window.innerWidth;
          let targetL = 1;
          if (tapX < screenWidth * 0.35) targetL = 0;
          else if (tapX > screenWidth * 0.65) targetL = 2;
          else targetL = 1;

          stateRef.current.userSteeredLane = targetL;
          stateRef.current.carTargetX = LANE_X[targetL];
          onLaneSelectedByCarRef.current(targetL);
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    // ==========================================
    // 9. ANIMATION LOOP
    // ==========================================
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const tick = () => {
      animationFrameId = requestAnimationFrame(tick);
      const delta = Math.min(clock.getDelta(), 0.1);

      if (isPausedRef.current) {
        renderer.render(scene, camera);
        return;
      }

      const state = stateRef.current;

      // Determine target speed:
      // If at checkpoint, smoothly decelerate to safe learning crawl
      let targetSpeed = MAX_CRUISE_SPEED;
      if (isCheckpointActiveRef.current || state.isAtCheckpoint) {
        targetSpeed = LEARNING_SPEED;
      }
      state.carSpeed = THREE.MathUtils.damp(state.carSpeed, targetSpeed, 3.5, delta);

      // Distance tracking
      const stepDist = state.carSpeed * delta;
      state.totalDistance += stepDist;
      state.distanceToNextCheckpoint -= stepDist;

      // Notify parent HUD of distance
      onDistanceUpdateRef.current(
        Math.floor(state.totalDistance),
        Math.max(0, Math.floor(state.distanceToNextCheckpoint))
      );

      // Trigger educational checkpoint when reaching gate
      if (state.distanceToNextCheckpoint <= 20 && !state.isAtCheckpoint && !isCheckpointActiveRef.current) {
        state.isAtCheckpoint = true;
        gateGroup.position.z = playerCar.group.position.z - 30;
        onTriggerCheckpointRef.current();
      }

      // Smooth Car X Steering
      state.carX = THREE.MathUtils.damp(state.carX, state.carTargetX, 9.0, delta);
      playerCar.group.position.x = state.carX;

      // Aerodynamic Car Body Roll & Yaw while changing lanes
      const steerVelocity = (state.carTargetX - state.carX) * 0.08;
      playerCar.group.rotation.z = THREE.MathUtils.damp(playerCar.group.rotation.z, -steerVelocity * 1.2, 7.0, delta);
      playerCar.group.rotation.y = THREE.MathUtils.damp(playerCar.group.rotation.y, -steerVelocity * 0.9, 7.0, delta);

      // Spin Wheels of Player Car
      const wheelRotationStep = (state.carSpeed / 0.36) * delta;
      playerCar.wheels.forEach((w) => {
        w.rotation.x += wheelRotationStep;
      });

      // Move Infinite Road Segments
      roadSegments.forEach((seg) => {
        seg.position.z += stepDist;
        if (seg.position.z > ROAD_SEGMENT_LENGTH) {
          seg.position.z -= ROAD_SEGMENT_LENGTH * 3;
        }
      });

      // Move Palm Trees
      palmTrees.forEach((tree) => {
        tree.position.z += stepDist;
        if (tree.position.z > 25) {
          tree.position.z -= 28 * 12;
        }
      });

      // Move Streetlights
      streetlights.forEach((pole) => {
        pole.position.z += stepDist;
        if (pole.position.z > 25) {
          pole.position.z -= 12 * 32;
        }
      });

      // Drift Clouds slowly in sky
      cloudGroup.children.forEach((c) => {
        c.position.x += delta * 1.5;
        if (c.position.x > 220) c.position.x = -220;
      });

      // Move Overhead Gantry relative to highway
      if (state.isAtCheckpoint) {
        gateGroup.position.z += stepDist;

        // When user confirmed answer and car zooms through gate
        if (gateGroup.position.z > playerCar.group.position.z + 10 && !state.selectedGatePassed) {
          state.selectedGatePassed = true;
          setTimeout(() => {
            state.isAtCheckpoint = false;
            state.selectedGatePassed = false;
            state.distanceToNextCheckpoint = checkpointDistance;
            gateGroup.position.z = -500;
          }, 1200);
        }
      }

      // Traffic Simulation
      trafficCars.forEach((t) => {
        // Spin traffic wheels
        const tWheelStep = (t.speed / 0.36) * delta;
        t.car.wheels.forEach((w) => {
          w.rotation.x += tWheelStep;
        });

        if (state.isAtCheckpoint) {
          // Clear traffic ahead to prevent collision
          t.car.group.position.z -= delta * 18;
        } else {
          // Normal traffic flow
          t.car.group.position.z += (state.carSpeed - t.speed) * delta;
          if (t.car.group.position.z > 20) {
            t.car.group.position.z = -130 - Math.random() * 45;
            t.lane = Math.floor(Math.random() * 3);
            t.car.group.position.x = LANE_X[t.lane];
          }
        }
      });

      // Silky camera follow with road perspective tracking
      const camTargetX = state.carX * 0.38;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, camTargetX, 4.0, delta);
      camera.lookAt(camTargetX * 0.22, 1.6, -14);

      renderer.render(scene, camera);
    };

    tick();

    // Responsive Camera & Sizing for Mobile & Laptop Viewports
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      const aspect = width / height;
      camera.aspect = aspect;

      // In mobile portrait (aspect < 1), dynamically calculate FOV and camera distance
      // so all 3 lanes, car, and overhead gate signs are 100% visible on any smartphone
      if (aspect < 1) {
        camera.position.set(0, 4.6, 10.8);
        camera.lookAt(0, 1.6, -14);
        const desiredHalfWidth = 5.4;
        const dist = 10.8;
        const horizHalfAngle = Math.atan(desiredHalfWidth / dist);
        const targetFov = 2 * Math.atan(Math.tan(horizHalfAngle) / aspect) * (180 / Math.PI);
        camera.fov = Math.min(84, Math.max(60, targetFov));
      } else {
        // Laptop / widescreen landscape
        camera.position.set(0, 3.6, 7.8);
        camera.lookAt(0, 1.6, -14);
        camera.fov = 50;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      resizeObserver.disconnect();
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [checkpointDistance]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden touch-none">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />
    </div>
  );
};
