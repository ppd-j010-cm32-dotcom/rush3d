import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createRealisticCar, RealisticCar } from './CarModel';

interface CarShowcaseProps {
  color: string;
}

export const CarShowcase: React.FC<CarShowcaseProps> = ({ color }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<RealisticCar | null>(null);

  useEffect(() => {
    if (carRef.current) {
      carRef.current.setBodyColor(color);
    }
  }, [color]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = null; // Transparent background

    const camera = new THREE.PerspectiveCamera(36, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(5.5, 2.4, 6.0);
    camera.lookAt(0, 0.6, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Studio Environment map
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(10, 15, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    rimLight.position.set(-10, 8, -8);
    scene.add(rimLight);

    // Circular Studio Showcase Turntable
    const turntableGeo = new THREE.CylinderGeometry(3.2, 3.4, 0.15, 36);
    const turntableMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.25,
    });
    const turntable = new THREE.Mesh(turntableGeo, turntableMat);
    turntable.position.y = -0.08;
    turntable.receiveShadow = true;
    scene.add(turntable);

    // Glowing Neon Ring Edge on turntable
    const ringGeo = new THREE.TorusGeometry(3.2, 0.03, 8, 36);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 2.0,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.01;
    scene.add(ring);

    // Add Realistic Car
    const car = createRealisticCar(color, true);
    scene.add(car.group);
    carRef.current = car;

    // Interactive Touch & Mouse Drag Rotation with Inertia
    let animId: number;
    const clock = new THREE.Clock();
    let isDragging = false;
    let prevPointerX = 0;
    let dragVelocity = 0;

    const onPointerDown = (clientX: number) => {
      isDragging = true;
      prevPointerX = clientX;
      dragVelocity = 0;
    };

    const onPointerMove = (clientX: number) => {
      if (!isDragging) return;
      const deltaX = clientX - prevPointerX;
      prevPointerX = clientX;
      dragVelocity = deltaX * 0.012;
      car.group.rotation.y += dragVelocity;
      turntable.rotation.y += dragVelocity;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const handleMouseDown = (e: MouseEvent) => onPointerDown(e.clientX);
    const handleMouseMove = (e: MouseEvent) => onPointerMove(e.clientX);
    const handleMouseUp = () => onPointerUp();

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) onPointerDown(e.touches[0].clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) onPointerMove(e.touches[0].clientX);
    };
    const handleTouchEnd = () => onPointerUp();

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (!isDragging) {
        // Apply inertia drag damping and gentle auto rotation
        dragVelocity *= 0.92;
        const autoSpeed = 0.45;
        const currentRotStep = (autoSpeed + dragVelocity * 60) * delta;
        car.group.rotation.y += currentRotStep;
        turntable.rotation.y += currentRotStep;
        ring.rotation.z -= currentRotStep;
      } else {
        ring.rotation.z -= dragVelocity;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      resizeObserver.disconnect();
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="w-full h-36 sm:h-48 md:h-52 relative select-none touch-none">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />
      <div className="absolute bottom-1 right-2 text-[9px] sm:text-[10px] font-bold text-slate-500 bg-white/90 px-2 py-0.5 rounded-md shadow-xs pointer-events-none">
        Sentuh & Pusingkan Kereta 3D
      </div>
    </div>
  );
};
