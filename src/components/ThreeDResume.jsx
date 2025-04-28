import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, useTexture } from '@react-three/drei';

export default function ThreeDResume() {
  const group = useRef();
  const texture = useTexture('/resume-texture.png');

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 2) / 4;
    group.current.rotation.x = Math.cos(t / 2) / 8;
  });

  return (
    <group ref={group}>
      {/* Main Resume Paper */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 4, 0.1]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0.2}
          map={texture}
        />
      </mesh>

      {/* Floating Elements */}
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          position={[
            Math.sin(i * 1.5) * 2,
            Math.cos(i * 1.5) * 2,
            Math.sin(i * 0.5) * 2,
          ]}
          scale={[0.4, 0.4, 0.4]}
        >
          <meshPhongMaterial
            color={i % 2 ? '#7C3AED' : '#00A3FF'}
            opacity={0.7}
            transparent
          />
        </Box>
      ))}

      {/* Glowing Text */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="#7C3AED"
        anchorX="center"
        anchorY="middle"
      >
        JobFit
      </Text>

      {/* Particles */}
      {[...Array(50)].map((_, i) => (
        <mesh
          key={`particle-${i}`}
          position={[
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
          ]}
        >
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial
            color={Math.random() > 0.5 ? '#7C3AED' : '#00A3FF'}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
