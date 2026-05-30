"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { typeColors, type EnneagramTypeId } from "@/data/enneagram-system";

const order: EnneagramTypeId[] = ["nine", "one", "two", "three", "four", "five", "six", "seven", "eight"];
const hexad: EnneagramTypeId[] = ["one", "four", "two", "eight", "five", "seven", "one"];
const triangle: EnneagramTypeId[] = ["three", "six", "nine", "three"];

function pointFor(index: number, radius = 2.4): [number, number, number] {
  const angle = Math.PI / 2 - (index / 9) * Math.PI * 2;
  return [Math.cos(angle) * radius, Math.sin(angle) * radius, 0];
}

function BoardMesh({ primaryType, activeTypes = [], ambient = false }: { primaryType?: EnneagramTypeId; activeTypes?: EnneagramTypeId[]; ambient?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const positions = useMemo(() => Object.fromEntries(order.map((type, index) => [type, pointFor(index)])) as Record<EnneagramTypeId, [number, number, number]>, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.12) * 0.08 + clock.elapsedTime * (ambient ? 0.035 : 0.06);
    groupRef.current.rotation.x = ambient ? -0.35 : -0.18;
  });

  return (
    <group ref={groupRef}>
      <Line points={[...order.map((type) => positions[type]), positions.nine]} color="#6366f1" transparent opacity={ambient ? 0.12 : 0.28} lineWidth={1.2} />
      <Line points={hexad.map((type) => positions[type])} color="#a78bfa" transparent opacity={ambient ? 0.14 : 0.36} lineWidth={1.4} />
      <Line points={triangle.map((type) => positions[type])} color="#38bdf8" transparent opacity={ambient ? 0.12 : 0.3} lineWidth={1.3} />
      {order.map((type) => {
        const color = typeColors[type].primary;
        const isPrimary = type === primaryType;
        const isActive = activeTypes.includes(type) || isPrimary;
        const scale = isPrimary ? 1.45 : isActive ? 1.2 : 1;
        return (
          <group key={type} position={positions[type]} scale={scale}>
            <mesh>
              <sphereGeometry args={[ambient ? 0.085 : 0.13, 24, 24]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isPrimary ? 1.8 : isActive ? 1.1 : 0.45} roughness={0.35} />
            </mesh>
            <mesh scale={1.9}>
              <sphereGeometry args={[ambient ? 0.09 : 0.13, 16, 16]} />
              <meshBasicMaterial color={color} transparent opacity={isPrimary ? 0.18 : isActive ? 0.1 : 0.04} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function EnneagramBoard3D({ primaryType, activeTypes = [], ambient = false, className = "" }: { primaryType?: EnneagramTypeId; activeTypes?: EnneagramTypeId[]; ambient?: boolean; className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: "high-performance", alpha: true }} camera={{ position: [0, 0, ambient ? 7 : 6], fov: 45 }}>
        <ambientLight intensity={0.9} />
        <pointLight position={[2.5, 3, 4]} intensity={ambient ? 0.8 : 1.3} />
        <BoardMesh primaryType={primaryType} activeTypes={activeTypes} ambient={ambient} />
      </Canvas>
    </div>
  );
}

export default EnneagramBoard3D;
