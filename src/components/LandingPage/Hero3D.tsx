import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface Hero3DProps {
  className?: string;
}

const Hero3D: React.FC<Hero3DProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const frameIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 15;
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight,
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = false;
    controlsRef.current = controls;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create power grid elements
    createPowerGrid(scene);

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Animate power grid elements
      animatePowerGrid(scene);

      // Render scene
      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.render(scene, cameraRef.current);
      }
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current)
        return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameIdRef.current);

      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      // Dispose of all geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
    };
  }, []);

  // Create power grid elements
  const createPowerGrid = (scene: THREE.Scene) => {
    // Create power lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });

    // Create power towers
    const towerGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
    const towerMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });

    // Create power nodes
    const nodeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const nodeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff });

    // Create a grid of power towers and connect them with lines
    for (let x = -10; x <= 10; x += 4) {
      for (let z = -10; z <= 10; z += 4) {
        // Add tower
        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        tower.position.set(x, 0, z);
        tower.userData = { type: "tower" };
        scene.add(tower);

        // Add node on top of tower
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.set(x, 1.2, z);
        node.userData = {
          type: "node",
          pulsePhase: Math.random() * Math.PI * 2,
        };
        scene.add(node);

        // Connect to adjacent towers with power lines
        if (x < 10) {
          const points = [];
          points.push(new THREE.Vector3(x, 1.2, z));
          points.push(new THREE.Vector3(x + 4, 1.2, z));
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(lineGeometry, lineMaterial);
          line.userData = { type: "line" };
          scene.add(line);
        }

        if (z < 10) {
          const points = [];
          points.push(new THREE.Vector3(x, 1.2, z));
          points.push(new THREE.Vector3(x, 1.2, z + 4));
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(lineGeometry, lineMaterial);
          line.userData = { type: "line" };
          scene.add(line);
        }
      }
    }

    // Add some floating particles to represent electricity
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });

    for (let i = 0; i < 100; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(
        (Math.random() - 0.5) * 20,
        1.2 + (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 20,
      );
      particle.userData = {
        type: "particle",
        speed: 0.02 + Math.random() * 0.03,
        direction: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
        ),
      };
      scene.add(particle);
    }
  };

  // Animate power grid elements
  const animatePowerGrid = (scene: THREE.Scene) => {
    const time = Date.now() * 0.001;

    scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
        if (object.userData.type === "node") {
          // Pulse the nodes
          const phase = object.userData.pulsePhase || 0;
          const scale = 0.8 + 0.2 * Math.sin(time * 2 + phase);
          object.scale.set(scale, scale, scale);

          // Occasionally emit a flash
          if (Math.random() < 0.001) {
            object.material.emissive = new THREE.Color(0x00ffff);
            object.material.emissiveIntensity = 2;
            setTimeout(() => {
              if (object.material) {
                object.material.emissiveIntensity = 0;
              }
            }, 100);
          }
        }

        if (object.userData.type === "particle") {
          // Move particles along power lines
          object.position.x += object.userData.direction.x;
          object.position.y += object.userData.direction.y;
          object.position.z += object.userData.direction.z;

          // If particle goes out of bounds, reset it
          if (
            Math.abs(object.position.x) > 10 ||
            Math.abs(object.position.y - 1.2) > 0.5 ||
            Math.abs(object.position.z) > 10
          ) {
            // Find a random position on a power line
            const x = Math.floor(Math.random() * 6) * 4 - 10;
            const z = Math.floor(Math.random() * 6) * 4 - 10;
            object.position.set(x, 1.2, z);

            // Set a new direction along a power line
            const goX = Math.random() > 0.5;
            object.userData.direction = new THREE.Vector3(
              goX ? object.userData.speed : 0,
              (Math.random() - 0.5) * 0.01,
              goX ? 0 : object.userData.speed,
            );

            // Randomly flip direction
            if (Math.random() > 0.5) {
              object.userData.direction.x *= -1;
              object.userData.direction.z *= -1;
            }
          }
        }
      }
    });
  };

  return (
    <div
      ref={containerRef}
      className={`w-full h-full bg-black ${className}`}
      aria-label="3D visualization of an electricity power grid"
    />
  );
};

export default Hero3D;
