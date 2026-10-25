import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// PCB-like grid plane
const PCBGrid: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[12, 12, 24, 24]} />
      <meshStandardMaterial
        color="#EAE6DE"
        wireframe
        opacity={0.3}
        transparent
        emissive={new THREE.Color('#226192')}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

// Floating circuit board geometry
const CircuitBoard: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main PCB board */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[3, 0.12, 2]} />
        <meshStandardMaterial
          color="#226192"
          roughness={0.4}
          metalness={0.1}
          emissive={new THREE.Color('#226192')}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Copper traces (horizontal) */}
      {[-0.5, 0, 0.5].map((z, i) => (
        <mesh key={`h-trace-${i}`} position={[0, 0.07, z]}>
          <boxGeometry args={[2.8, 0.02, 0.06]} />
          <meshStandardMaterial color="#EF8557" roughness={0.2} metalness={0.8} />
        </mesh>
      ))}

      {/* Copper traces (vertical) */}
      {[-0.8, -0.2, 0.4, 1.0].map((x, i) => (
        <mesh key={`v-trace-${i}`} position={[x, 0.07, 0]}>
          <boxGeometry args={[0.06, 0.02, 1.8]} />
          <meshStandardMaterial color="#EF8557" roughness={0.2} metalness={0.8} />
        </mesh>
      ))}

      {/* IC Chip */}
      <mesh position={[-0.4, 0.15, 0]} castShadow>
        <boxGeometry args={[0.7, 0.18, 0.5]} />
        <meshStandardMaterial color="#252B30" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Capacitors */}
      {[
        [0.9, 0.2, -0.5],
        [0.9, 0.2, 0.3],
        [1.2, 0.2, 0],
      ].map(([x, y, z], i) => (
        <mesh key={`cap-${i}`} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
          <meshStandardMaterial color="#226192" roughness={0.3} metalness={0.5} />
        </mesh>
      ))}

      {/* LEDs with emissive glow */}
      {[
        [1.1, 0.15, -0.7],
        [1.1, 0.15, 0.6],
      ].map(([x, y, z], i) => (
        <mesh key={`led-${i}`} position={[x, y, z]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial
            color={i === 0 ? '#EF8557' : '#226192'}
            emissive={new THREE.Color(i === 0 ? '#EF8557' : '#226192')}
            emissiveIntensity={2}
          />
        </mesh>
      ))}

      {/* Connector pins */}
      {[-0.7, -0.4, -0.1, 0.2, 0.5].map((z, i) => (
        <mesh key={`pin-${i}`} position={[-1.55, 0.06, z - 0.1]}>
          <boxGeometry args={[0.06, 0.08, 0.04]} />
          <meshStandardMaterial color="#D4CEC4" roughness={0.1} metalness={0.95} />
        </mesh>
      ))}
    </group>
  );
};

// Floating geometric decorations
const FloatingOrbs: React.FC = () => {
  const positions: [number, number, number][] = [
    [-3, 2, -2],
    [3, 1.5, -1],
    [-2, -1, -3],
    [2.5, -1.5, -2],
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <Float
          key={i}
          speed={1.5 + i * 0.3}
          rotationIntensity={0.5}
          floatIntensity={0.8}
          position={pos}
        >
          <mesh>
            <icosahedronGeometry args={[0.25 + i * 0.05, 0]} />
            <MeshDistortMaterial
              color={i % 2 === 0 ? '#226192' : '#EF8557'}
              roughness={0.1}
              metalness={0.8}
              distort={0.3}
              speed={2}
              opacity={0.7}
              transparent
            />
          </mesh>
        </Float>
      ))}
    </>
  );
};

// WebGL availability check
const HeroScene: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 2, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#FFFFFF" />
        <pointLight position={[-3, 3, 2]} intensity={2} color="#226192" />
        <pointLight position={[3, -2, 2]} intensity={1.5} color="#226192" />
        <pointLight position={[0, 0, 4]} intensity={0.8} color="#EF8557" />

        <Suspense fallback={null}>
          <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
            <CircuitBoard />
          </Float>
          <FloatingOrbs />
          <PCBGrid />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
};

export default HeroScene;
