import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

export function ResumeModel({ ...props }) {
  const group = useRef();
  
  // Create a simple 3D document model
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 2) / 4;
    group.current.position.y = Math.sin(t / 1.5) / 4;
  });

  return (
    <group ref={group} {...props}>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        {/* Document base */}
        <boxGeometry args={[3, 4, 0.2]} />
        <meshStandardMaterial color="#ffffff" />
        
        {/* Document lines */}
        {[...Array(8)].map((_, i) => (
          <mesh key={i} position={[0, 1 - i/2, 0.11]}>
            <boxGeometry args={[2, 0.1, 0.01]} />
            <meshStandardMaterial color="#e0e0e0" />
          </mesh>
        ))}
      </mesh>
    </group>
  );
}
