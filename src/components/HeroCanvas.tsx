"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Utility to create evenly distributed points on a sphere (Fibonacci sphere)
function generateFibonacciSpherePoints(pointCount: number, radius: number): Float32Array {
  const positions = new Float32Array(pointCount * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < pointCount; i++) {
    const y = 1 - (i / (pointCount - 1)) * 2; // y from 1 to -1
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    positions[i * 3 + 0] = x * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = z * radius;
  }
  return positions;
}

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current!;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0); // transparant zodat bg zichtbaar blijft
    container.appendChild(renderer.domElement);

    // Scene & fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b0f14, 8, 18);

    // Camera
    const camera = new THREE.PerspectiveCamera(65, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 6);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.28);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(3, 5, 2);
    scene.add(dirLight);

    const rimLightColor = new THREE.Color("#18e1ff"); // teal/blue rim
    const rimLight = new THREE.DirectionalLight(rimLightColor, 0.8);
    rimLight.position.set(-4, 1.5, -3);
    scene.add(rimLight);

    // Groups
    const root = new THREE.Group();
    scene.add(root);

    // Neuron sphere points
    const particleCount = 2400; // ~2000–3000
    const sphereRadius = 2.0;
    const pointPositions = generateFibonacciSpherePoints(particleCount, sphereRadius);
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute("position", new THREE.BufferAttribute(pointPositions, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      color: new THREE.Color("#8be9ff"),
      size: 0.035,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.95,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    root.add(points);

    // Thin wireframe shell
    const shellGeometry = new THREE.IcosahedronGeometry(sphereRadius + 0.02, 2);
    const shellMaterial = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.08 });
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    root.add(shell);

    // Maestro batons
    const batonGroup = new THREE.Group();
    root.add(batonGroup);

    const batonCount = 4; // 3–5
    const batons: Array<{
      group: THREE.Group;
      speed: number;
      baseSpeed: number;
      radius: number;
      tilt: THREE.Euler;
      phase: number;
      color: THREE.Color;
    }> = [];

    for (let i = 0; i < batonCount; i++) {
      const group = new THREE.Group();

      // Thin cylinder body
      const bodyGeometry = new THREE.CylinderGeometry(0.025, 0.025, 2.2, 12);
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xe6f7ff, metalness: 0.2, roughness: 0.25 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);

      // Glow tip
      const glowColor = new THREE.Color(i % 2 === 0 ? "#4df3ff" : "#22d3ee");
      const tipGeometry = new THREE.SphereGeometry(0.075, 16, 16);
      const tipMaterial = new THREE.MeshStandardMaterial({ color: glowColor, emissive: glowColor, emissiveIntensity: 1.35, metalness: 0.1, roughness: 0.1 });
      const tip = new THREE.Mesh(tipGeometry, tipMaterial);
      tip.position.y = 1.1; // one end

      // Subtle point light at tip for rim reflections
      const tipLight = new THREE.PointLight(glowColor, 0.9, 3.5);
      tipLight.position.copy(tip.position);

      group.add(body);
      group.add(tip);
      group.add(tipLight);

      // Randomized orbit params
      const radius = 2.2 + Math.random() * 0.9;
      const baseSpeed = 0.35 + Math.random() * 0.45; // rad/sec
      const tilt = new THREE.Euler(
        (Math.random() - 0.5) * 0.9,
        (Math.random() - 0.5) * 0.9,
        (Math.random() - 0.5) * 0.9
      );
      const phase = Math.random() * Math.PI * 2;

      group.rotation.set(tilt.x, tilt.y, tilt.z);
      batonGroup.add(group);

      batons.push({ group, speed: baseSpeed, baseSpeed, radius, tilt, phase, color: glowColor });
    }

    // Interaction state via window/document (canvas is pointer-events none)
    let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;
    let hoverAmount = 0;
    let hovering = false;

    function handlePointerLike(xNorm: number, yNorm: number) {
      targetMouseX = xNorm;
      targetMouseY = yNorm;
      hovering = true;
    }

    const onPointerMove: EventListener = (ev) => {
      const e = ev as PointerEvent;
      const x = e.clientX / window.innerWidth; // 0..1
      const y = e.clientY / window.innerHeight; // 0..1
      handlePointerLike((x - 0.5) * 2, (0.5 - y) * 2);
    };
    const onMouseLeave: EventListener = () => {
      hovering = false;
    };
    const onTouchMove: EventListener = (ev) => {
      const e = ev as TouchEvent;
      if (e.touches && e.touches.length > 0) {
        const t = e.touches[0];
        const x = t.clientX / window.innerWidth;
        const y = t.clientY / window.innerHeight;
        handlePointerLike((x - 0.5) * 2, (0.5 - y) * 2);
      }
    };
    const onTouchEnd: EventListener = () => {
      hovering = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("mouseout", onMouseLeave);
    window.addEventListener("touchstart", onTouchMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // Resize handling
    function onResize() {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
    }
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
      const dt = Math.min(clock.getDelta(), 0.033);
      const t = clock.elapsedTime;

      // Mouse easing
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      // Hover easing
      const targetHover = hovering ? 1 : 0;
      hoverAmount += (targetHover - hoverAmount) * 0.08;

      // Parallax + subtle tilt of root
      camera.position.x = mouseX * 0.35;
      camera.position.y = mouseY * 0.25;
      camera.lookAt(0, 0, 0);

      // Base rotation
      root.rotation.y += 0.08 * dt + hoverAmount * 0.04 * dt;
      root.rotation.x += 0.02 * dt + hoverAmount * 0.01 * dt;
      // Additional tilt toward pointer
      const tiltX = mouseY * 0.15;
      const tiltY = -mouseX * 0.2;
      root.rotation.x += (tiltX - root.rotation.x) * 0.02;
      root.rotation.y += (tiltY - root.rotation.y) * 0.02;

      // Color shift over time (HSL)
      const hue = (0.55 + Math.sin(t * 0.1) * 0.02) % 1; // base cyan/teal range
      (pointsMaterial as THREE.PointsMaterial).color.setHSL(hue, 0.9, 0.75);

      // Rim light pulse when hover
      rimLight.intensity = 0.8 + hoverAmount * (0.6 + 0.2 * Math.sin(t * 6));

      // Update baton orbits; boost speed on hover
      for (let i = 0; i < batons.length; i++) {
        const b = batons[i];
        const speed = b.baseSpeed * (1 + hoverAmount * 0.35);
        const angle = t * speed + b.phase;
        // orbit in local XZ, then tilt applied via group rotation already set
        const x = Math.cos(angle) * b.radius;
        const z = Math.sin(angle) * b.radius;
        b.group.position.set(x, 0, z);
        b.group.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    }

    let frameId = window.requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mouseout", onMouseLeave);
      window.removeEventListener("touchstart", onTouchMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      pointsGeometry.dispose();
      (pointsMaterial as THREE.Material).dispose?.();
      shellGeometry.dispose();
      (shellMaterial as THREE.Material).dispose?.();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="pointer-events-none absolute inset-0 z-0" aria-hidden />;
} 