"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { typeColors, type EnneagramTypeId } from "@/data/enneagram-system";

const personality: Record<EnneagramTypeId, { speed: number; bounce: number; shape: "cone" | "sphere" | "box" | "torus" | "octa" }> = {
  one: { speed: 0.65, bounce: 0.08, shape: "cone" },
  two: { speed: 0.9, bounce: 0.18, shape: "sphere" },
  three: { speed: 1.15, bounce: 0.22, shape: "octa" },
  four: { speed: 0.72, bounce: 0.2, shape: "torus" },
  five: { speed: 0.42, bounce: 0.06, shape: "box" },
  six: { speed: 0.78, bounce: 0.12, shape: "octa" },
  seven: { speed: 1.45, bounce: 0.3, shape: "sphere" },
  eight: { speed: 0.95, bounce: 0.26, shape: "box" },
  nine: { speed: 0.38, bounce: 0.12, shape: "sphere" },
};

function CoreShape({ type, color }: { type: EnneagramTypeId; color: string }) {
  const shape = personality[type].shape;
  const material = <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.75} roughness={0.32} metalness={0.08} />;
  if (shape === "cone") return <mesh><coneGeometry args={[0.55, 1.2, 5]} />{material}</mesh>;
  if (shape === "box") return <mesh><boxGeometry args={[0.9, 0.9, 0.9]} />{material}</mesh>;
  if (shape === "torus") return <mesh><torusKnotGeometry args={[0.38, 0.13, 96, 12]} />{material}</mesh>;
  if (shape === "octa") return <mesh><octahedronGeometry args={[0.7]} />{material}</mesh>;
  return <mesh><sphereGeometry args={[0.62, 32, 32]} />{material}</mesh>;
}

export function TypeAvatar3D({ type }: { type: EnneagramTypeId }) {
  const groupRef = useRef<THREE.Group>(null);
  const color = typeColors[type].primary;
  const config = personality[type];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime * config.speed;
    groupRef.current.rotation.y = t * 0.55;
    groupRef.current.rotation.z = Math.sin(t) * 0.08;
    groupRef.current.position.y = Math.sin(t * 1.8) * config.bounce;
    const pulse = 1 + Math.sin(t * 2.2) * (type === "eight" ? 0.08 : 0.035);
    groupRef.current.scale.setScalar(pulse);
  });

  return (
    <group ref={groupRef}>
      <CoreShape type={type} color={color} />
      <mesh position={[0, -0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.025, 12, 72]} />
        <meshBasicMaterial color={color} transparent opacity={0.38} />
      </mesh>
      <mesh position={[0.55, 0.52, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[-0.55, 0.52, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

export default TypeAvatar3D;
