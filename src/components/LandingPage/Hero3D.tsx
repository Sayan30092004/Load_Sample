import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

interface Hero3DProps {
  className?: string;
}

const Hero3D: React.FC<Hero3DProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const frameIdRef = useRef<number>(0);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1128); // Deep navy blue like in the image
    scene.fog = new THREE.FogExp2(0x0a1128, 0.015); // Lighter fog for better star visibility
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
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight,
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Store a reference to the container for cleanup
    const container = containerRef.current;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add post-processing
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.6, // strength - increased for more glow
      0.4, // radius - increased for softer glow
      0.7, // threshold - lowered to make more elements glow
    );

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composerRef.current = composer;

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.3;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;
    controls.minPolarAngle = Math.PI / 3; // Limit vertical rotation
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    // Add point lights for dramatic effect
    const pointLight1 = new THREE.PointLight(0x4287f5, 2.5, 25); // Brighter blue like in the image
    pointLight1.position.set(-5, 5, -5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4287f5, 2.5, 25); // Matching blue
    pointLight2.position.set(5, 5, 5);
    scene.add(pointLight2);

    // Add a subtle central light for the logo area
    const centerLight = new THREE.PointLight(0x4287f5, 1.5, 15);
    centerLight.position.set(0, 3, 0);
    scene.add(centerLight);

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

      // Render scene with post-processing
      if (composerRef.current) {
        composerRef.current.render();
      }
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (
        !containerRef.current ||
        !cameraRef.current ||
        !rendererRef.current ||
        !composerRef.current
      )
        return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(width, height);
      composerRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameIdRef.current);

      // Safely remove renderer's DOM element if it exists and is a child of the container
      if (rendererRef.current) {
        // First, cancel any pending animation frame
        cancelAnimationFrame(frameIdRef.current);

        // Dispose of all geometries and materials
        if (sceneRef.current) {
          sceneRef.current.traverse((object) => {
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
        }

        // Dispose of renderer and its resources
        rendererRef.current.dispose();

        // Dispose of composer resources if they exist
        if (composerRef.current) {
          composerRef.current.renderTarget1.dispose();
          composerRef.current.renderTarget2.dispose();
        }

        // Remove the canvas element from DOM - use the stored container reference
        // and check if the element is still in the DOM and is a child of the container
        try {
          const canvas = rendererRef.current.domElement;
          if (canvas.parentNode === container) {
            container.removeChild(canvas);
          }
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
      }
    };
  }, []);

  // Create power grid elements
  const createPowerGrid = (scene: THREE.Scene) => {
    // Create power lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4287f5, // Matching blue from the image
      transparent: true,
      opacity: 0.8, // Slightly more visible
    });

    // Create power towers
    const towerGeometry = new THREE.CylinderGeometry(0.1, 0.15, 2, 8);
    const towerMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.8,
      roughness: 0.2,
    });

    // Create power nodes
    const nodeGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0x4287f5, // Matching blue from the image
      emissive: 0x2563eb,
      emissiveIntensity: 0.7, // Brighter glow
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.9,
    });

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
    const particleGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0x4287f5, // Matching blue from the image
      transparent: true,
      opacity: 0.9, // More visible
    });

    // Add stars to the background
    const starGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    const starMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    });

    // Add 500 stars randomly positioned in the background
    for (let i = 0; i < 500; i++) {
      const star = new THREE.Mesh(starGeometry, starMaterial);
      // Position stars further away and all around
      const radius = 50 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      star.position.x = radius * Math.sin(phi) * Math.cos(theta);
      star.position.y = radius * Math.sin(phi) * Math.sin(theta);
      star.position.z = radius * Math.cos(phi);

      // Random sizes for stars
      const scale = 0.5 + Math.random() * 1.5;
      star.scale.set(scale, scale, scale);

      star.userData = { type: "star", twinkleSpeed: 0.3 + Math.random() * 0.7 };
      scene.add(star);
    }

    for (let i = 0; i < 200; i++) {
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
        // Animate stars (twinkle effect)
        if (object.userData.type === "star") {
          const twinkleSpeed = object.userData.twinkleSpeed || 0.5;
          const opacity = 0.4 + 0.6 * Math.sin(time * twinkleSpeed);
          if (object.material) {
            object.material.opacity = opacity;
          }
        }
        if (object.userData.type === "node") {
          // Pulse the nodes
          const phase = object.userData.pulsePhase || 0;
          const scale = 0.8 + 0.2 * Math.sin(time * 2 + phase);
          object.scale.set(scale, scale, scale);

          // Occasionally emit a flash
          if (Math.random() < 0.002) {
            object.material.emissive = new THREE.Color(0x4287f5); // Matching blue
            object.material.emissiveIntensity = 4; // Brighter flash
            setTimeout(() => {
              if (object.material) {
                object.material.emissiveIntensity = 0.7; // Return to normal glow
              }
            }, 200); // Slightly longer flash
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
      className={`w-full h-full bg-gradient-to-b from-[#0a1128] to-[#0a1640] ${className}`}
      aria-label="3D visualization of an electricity power grid"
    />
  );
};

export default Hero3D;
