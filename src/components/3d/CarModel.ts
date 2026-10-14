import * as THREE from 'three';

export interface RealisticCar {
  group: THREE.Group;
  wheels: THREE.Mesh[];
  brakeLights: THREE.Mesh[];
  headlights: THREE.Mesh[];
  setBodyColor: (color: string) => void;
}

/**
 * Creates a detailed, low-poly 3D Malaysian passenger sedan (inspired by modern Proton Saga / Persona / Perodua Bezza):
 * - Classic 3-box sedan silhouette (front engine bay, spacious passenger cabin, stepped rear trunk/boot)
 * - Constructed using grouped Three.js primitives (BoxGeometry, CylinderGeometry, TorusGeometry, PlaneGeometry)
 * - PBR-like material properties:
 *    - Deep shiny metallic paint with clearcoat reflections
 *    - Realistic transmissive window glass with A/B/C pillars
 *    - Polished chrome front winged grille, window trim, door handles & rear trunk garnish
 *    - Detailed multi-part sedan alloy wheels with rubber tires & brake discs
 *    - Modern projector headlights, fog lamps, rear combination taillights & Malaysian number plate
 */
export function createRealisticCar(initialColor: string = '#0284c7', isPlayer: boolean = true): RealisticCar {
  const group = new THREE.Group();

  // ==========================================
  // 1. PBR-LIKE MATERIALS
  // ==========================================
  // Automotive metallic paint with glossy clearcoat
  const carPaintMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(initialColor),
    metalness: 0.82,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  });

  // Window glass shader (dark tinted, glossy, transmissive)
  const windowGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0f172a,
    metalness: 0.9,
    roughness: 0.05,
    transmission: 0.8,
    thickness: 0.35,
    transparent: true,
    opacity: 0.85,
  });

  // Polished chrome trim (front grille, door handles, trunk garnish)
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.98,
    roughness: 0.08,
  });

  // Matte black trim (window pillars, lower bumper grilles, mudguards)
  const matteTrimMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.6,
    metalness: 0.3,
  });

  // Interior upholstery
  const interiorMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.85,
  });

  // Rubber tires
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    roughness: 0.9,
    metalness: 0.1,
  });

  // Alloy rim metal
  const alloyRimMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.85,
    roughness: 0.22,
  });

  // Brake disc steel
  const brakeDiscMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.9,
    roughness: 0.3,
  });

  // ==========================================
  // 2. SEDAN 3-BOX BODY GEOMETRY (GROUPED PRIMITIVES)
  // ==========================================

  // --- A. MAIN CHASSIS & UNDERCARRIAGE ---
  const underbodyGeo = new THREE.BoxGeometry(1.72, 0.18, 4.25);
  const underbody = new THREE.Mesh(underbodyGeo, matteTrimMat);
  underbody.position.y = 0.26;
  underbody.castShadow = true;
  group.add(underbody);

  // Main lower door & body tub
  const lowerBodyGeo = new THREE.BoxGeometry(1.76, 0.44, 4.15);
  const lowerBody = new THREE.Mesh(lowerBodyGeo, carPaintMat);
  lowerBody.position.y = 0.52;
  lowerBody.castShadow = true;
  lowerBody.receiveShadow = true;
  group.add(lowerBody);

  // --- B. BOX 1: FRONT HOOD & ENGINE BAY ---
  // Sloping sedan hood
  const hoodGeo = new THREE.BoxGeometry(1.68, 0.22, 1.35);
  const hood = new THREE.Mesh(hoodGeo, carPaintMat);
  hood.position.set(0, 0.68, -1.35);
  hood.rotation.x = 0.12; // gentle sedan forward rake
  hood.castShadow = true;
  group.add(hood);

  // Front nose cone & bumper upper
  const frontNoseGeo = new THREE.BoxGeometry(1.65, 0.28, 0.4);
  const frontNose = new THREE.Mesh(frontNoseGeo, carPaintMat);
  frontNose.position.set(0, 0.54, -2.02);
  frontNose.castShadow = true;
  group.add(frontNose);

  // Malaysian Winged Chrome Front Grille (signature Proton/Perodua sedan style)
  const grilleWingGeo = new THREE.BoxGeometry(1.35, 0.08, 0.06);
  const grilleWing = new THREE.Mesh(grilleWingGeo, chromeMat);
  grilleWing.position.set(0, 0.6, -2.23);
  group.add(grilleWing);

  // Center brand emblem badge
  const emblemGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16);
  const emblem = new THREE.Mesh(emblemGeo, chromeMat);
  emblem.rotation.x = Math.PI / 2;
  emblem.position.set(0, 0.6, -2.25);
  group.add(emblem);

  // Lower bumper air intake mesh
  const lowerIntakeGeo = new THREE.BoxGeometry(1.25, 0.18, 0.08);
  const lowerIntake = new THREE.Mesh(lowerIntakeGeo, matteTrimMat);
  lowerIntake.position.set(0, 0.4, -2.21);
  group.add(lowerIntake);

  // Front bumper lower lip / chin
  const frontLipGeo = new THREE.BoxGeometry(1.72, 0.06, 0.35);
  const frontLip = new THREE.Mesh(frontLipGeo, matteTrimMat);
  frontLip.position.set(0, 0.27, -2.05);
  group.add(frontLip);

  // Front fog light housings on lower bumper
  [-0.65, 0.65].forEach((fogX) => {
    const fogPod = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.06), matteTrimMat);
    fogPod.position.set(fogX, 0.4, -2.18);
    group.add(fogPod);

    const fogLens = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 12), chromeMat);
    fogLens.rotation.x = Math.PI / 2;
    fogLens.position.set(fogX, 0.4, -2.21);
    group.add(fogLens);
  });

  // --- C. BOX 2: PASSENGER CABIN & GLASS (GLAZING) ---
  // Raked Windshield, Roof & Rear Windshield
  const cabinGlassGeo = new THREE.BoxGeometry(1.5, 0.58, 2.15);
  const cabinGlass = new THREE.Mesh(cabinGlassGeo, windowGlassMat);
  cabinGlass.position.set(0, 1.05, -0.05);
  cabinGlass.castShadow = true;
  group.add(cabinGlass);

  // Sedan Metal Roof Panel
  const roofGeo = new THREE.BoxGeometry(1.44, 0.06, 1.48);
  const roof = new THREE.Mesh(roofGeo, carPaintMat);
  roof.position.set(0, 1.34, -0.02);
  roof.castShadow = true;
  group.add(roof);

  // Roof shark-fin radio antenna (standard modern sedan feature)
  const antennaGeo = new THREE.ConeGeometry(0.04, 0.12, 4);
  const antenna = new THREE.Mesh(antennaGeo, carPaintMat);
  antenna.position.set(0, 1.42, 0.58);
  antenna.rotation.x = -0.4;
  group.add(antenna);

  // A-Pillars (Windshield pillars)
  [-0.7, 0.7].forEach((pX) => {
    const aPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.88, 6), carPaintMat);
    aPillar.position.set(pX, 1.04, -0.84);
    aPillar.rotation.x = 0.55;
    aPillar.rotation.z = -pX * 0.12;
    group.add(aPillar);
  });

  // B-Pillars (Center door frame divider in matte black)
  [-0.74, 0.74].forEach((pX) => {
    const bPillar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.56, 0.12), matteTrimMat);
    bPillar.position.set(pX, 1.04, -0.02);
    group.add(bPillar);
  });

  // C-Pillars (Rear sedan roof pillars sloping into trunk)
  [-0.7, 0.7].forEach((pX) => {
    const cPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.92, 6), carPaintMat);
    cPillar.position.set(pX, 1.02, 0.78);
    cPillar.rotation.x = -0.58;
    cPillar.rotation.z = -pX * 0.1;
    group.add(cPillar);
  });

  // 4 Sedan Door Handles (Chrome / Body color)
  [
    [-0.88, 0.72, -0.42], // Front Left Door Handle
    [0.88, 0.72, -0.42],  // Front Right Door Handle
    [-0.88, 0.72, 0.35],  // Rear Left Door Handle
    [0.88, 0.72, 0.35],   // Rear Right Door Handle
  ].forEach(([hx, hy, hz]) => {
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.16), chromeMat);
    handle.position.set(hx, hy, hz);
    group.add(handle);
  });

  // Aerodynamic Door-Mounted Side Mirrors
  [-0.86, 0.86].forEach((mX) => {
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.12, 6), matteTrimMat);
    stalk.position.set(mX, 0.9, -0.75);
    stalk.rotation.z = mX * 0.45;
    group.add(stalk);

    const mirrorCap = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.11, 0.12), carPaintMat);
    mirrorCap.position.set(mX * 1.08, 0.94, -0.75);
    group.add(mirrorCap);

    // Reflective glass face
    const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.08), chromeMat);
    mirrorGlass.position.set(mX * 1.08, 0.94, -0.68);
    mirrorGlass.rotation.y = Math.PI;
    group.add(mirrorGlass);
  });

  // Interior: Passenger sedan seats & steering wheel
  const frontSeatGeo = new THREE.BoxGeometry(0.42, 0.48, 0.44);
  [-0.35, 0.35].forEach((sX) => {
    const seat = new THREE.Mesh(frontSeatGeo, interiorMat);
    seat.position.set(sX, 0.86, -0.15);
    group.add(seat);

    const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, 0.12), interiorMat);
    headrest.position.set(sX, 1.15, -0.05);
    group.add(headrest);
  });

  // Rear passenger bench
  const rearBench = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.44, 0.46), interiorMat);
  rearBench.position.set(0, 0.84, 0.52);
  group.add(rearBench);

  // Sedan steering wheel
  const steeringWheel = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.022, 8, 16), matteTrimMat);
  steeringWheel.position.set(-0.35, 0.94, -0.48);
  steeringWheel.rotation.x = 0.45;
  group.add(steeringWheel);

  // --- D. BOX 3: REAR TRUNK / BOOT & BUMPER ---
  // Stepped Sedan Trunk Deck
  const trunkDeckGeo = new THREE.BoxGeometry(1.64, 0.26, 0.95);
  const trunkDeck = new THREE.Mesh(trunkDeckGeo, carPaintMat);
  trunkDeck.position.set(0, 0.72, 1.55);
  trunkDeck.rotation.x = -0.05;
  trunkDeck.castShadow = true;
  group.add(trunkDeck);

  // Rear Sedan Chrome Boot Garnish Bar (prominent Malaysian sedan feature)
  const trunkGarnishGeo = new THREE.BoxGeometry(1.2, 0.06, 0.04);
  const trunkGarnish = new THREE.Mesh(trunkGarnishGeo, chromeMat);
  trunkGarnish.position.set(0, 0.7, 2.06);
  group.add(trunkGarnish);

  // Rear bumper
  const rearBumperGeo = new THREE.BoxGeometry(1.72, 0.35, 0.4);
  const rearBumper = new THREE.Mesh(rearBumperGeo, carPaintMat);
  rearBumper.position.set(0, 0.48, 1.95);
  rearBumper.castShadow = true;
  group.add(rearBumper);

  // Rear lower bumper apron & reflectors
  const lowerApron = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.12, 0.38), matteTrimMat);
  lowerApron.position.set(0, 0.28, 1.96);
  group.add(lowerApron);

  // Rear red reflectors
  [-0.65, 0.65].forEach((refX) => {
    const reflector = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.04, 0.02),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    reflector.position.set(refX, 0.34, 2.16);
    group.add(reflector);
  });

  // Single Polished Chrome Sedan Exhaust Pipe
  const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.2, 16), chromeMat);
  exhaust.rotation.x = Math.PI / 2;
  exhaust.position.set(0.55, 0.26, 2.12);
  group.add(exhaust);

  // --- E. LIGHTING ASSEMBLIES ---
  // Modern Swept Headlights
  const headlights: THREE.Mesh[] = [];
  const headlightBulbMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    emissive: 0xe0f2fe,
    emissiveIntensity: 3.5,
  });

  const headlightGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.92,
    roughness: 0.05,
    transparent: true,
    opacity: 0.82,
  });

  [-0.64, 0.64].forEach((hlX) => {
    // Chrome reflector bucket
    const bucket = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.32), chromeMat);
    bucket.position.set(hlX, 0.62, -1.95);
    bucket.rotation.y = -hlX * 0.15;
    group.add(bucket);

    // Projector LED Bulb
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), headlightBulbMat);
    bulb.position.set(hlX, 0.62, -2.08);
    group.add(bulb);
    headlights.push(bulb);

    // Outer clear lens
    const lens = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.18, 0.15), headlightGlassMat);
    lens.position.set(hlX, 0.62, -2.06);
    lens.rotation.y = -hlX * 0.15;
    group.add(lens);
  });

  // Rear Horizontal Sedan Taillight Clusters
  const brakeLights: THREE.Mesh[] = [];
  const brakeLightMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 3.0,
  });

  [-0.62, 0.62].forEach((tlX) => {
    // Red main brake light
    const redLight = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.14, 0.08), brakeLightMat);
    redLight.position.set(tlX, 0.68, 2.05);
    group.add(redLight);
    brakeLights.push(redLight);

    // White reverse / amber indicator strip
    const reverseStrip = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.05, 0.09),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    reverseStrip.position.set(tlX > 0 ? tlX - 0.08 : tlX + 0.08, 0.68, 2.055);
    group.add(reverseStrip);
  });

  // Malaysian Vehicle Number Plate (Black plate with white lettering)
  const plateCanvas = document.createElement('canvas');
  plateCanvas.width = 256;
  plateCanvas.height = 64;
  const pCtx = plateCanvas.getContext('2d')!;
  pCtx.fillStyle = '#0f172a';
  pCtx.fillRect(0, 0, 256, 64);
  pCtx.strokeStyle = '#ffffff';
  pCtx.lineWidth = 3;
  pCtx.strokeRect(3, 3, 250, 58);
  pCtx.fillStyle = '#ffffff';
  pCtx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
  pCtx.textAlign = 'center';
  pCtx.textBaseline = 'middle';
  pCtx.fillText(isPlayer ? 'BACA 1' : 'MY 2026', 128, 32);

  const plateTex = new THREE.CanvasTexture(plateCanvas);
  plateTex.colorSpace = THREE.SRGBColorSpace;
  const plateMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.65, 0.18),
    new THREE.MeshBasicMaterial({ map: plateTex })
  );
  plateMesh.position.set(0, 0.52, 2.07);
  plateMesh.rotation.y = Math.PI;
  group.add(plateMesh);

  // Front number plate
  const frontPlateMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.55, 0.15),
    new THREE.MeshBasicMaterial({ map: plateTex })
  );
  frontPlateMesh.position.set(0, 0.32, -2.25);
  group.add(frontPlateMesh);

  // --- F. 4 SEDAN ALLOY WHEELS (CYLINDER GEOMETRY) ---
  const wheels: THREE.Mesh[] = [];
  const wheelPositions = [
    [-0.92, 0.34, -1.35], // Front Left
    [0.92, 0.34, -1.35],  // Front Right
    [-0.92, 0.34, 1.35],   // Rear Left
    [0.92, 0.34, 1.35],    // Rear Right
  ];

  wheelPositions.forEach(([wx, wy, wz]) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(wx, wy, wz);

    // 1. Rubber Tire using CylinderGeometry
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 24), tireMat);
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = true;
    wheelGroup.add(tire);

    // 2. Alloy Wheel Rim
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.25, 20), alloyRimMat);
    rim.rotation.z = Math.PI / 2;
    wheelGroup.add(rim);

    // 3. Alloy Multi-Spoke Hub
    for (let s = 0; s < 5; s++) {
      const angle = (s / 5) * Math.PI * 2;
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.21, 0.035), chromeMat);
      spoke.position.set(0, Math.sin(angle) * 0.1, Math.cos(angle) * 0.1);
      spoke.rotation.x = angle;
      wheelGroup.add(spoke);
    }

    // 4. Center Wheel Cap
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.26, 12), matteTrimMat);
    cap.rotation.z = Math.PI / 2;
    wheelGroup.add(cap);

    // 5. Brake Disc & Caliper inside wheel
    const brakeDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 16), brakeDiscMat);
    brakeDisc.rotation.z = Math.PI / 2;
    wheelGroup.add(brakeDisc);

    group.add(wheelGroup);
    wheels.push(tire); // Reference for wheel spin in game loop
  });

  // --- G. CONTACT GROUND SHADOW ---
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const sCtx = shadowCanvas.getContext('2d')!;
  const grad = sCtx.createRadialGradient(128, 128, 20, 128, 128, 120);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, 256, 256);

  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const contactShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.5, 4.6),
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.9,
    })
  );
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.025;
  group.add(contactShadow);

  return {
    group,
    wheels,
    brakeLights,
    headlights,
    setBodyColor: (newColor: string) => {
      carPaintMat.color.set(newColor);
    },
  };
}
