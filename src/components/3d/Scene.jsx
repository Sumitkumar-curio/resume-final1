import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import { ResumeModel } from './ResumeModel';

export function Scene() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 10], fov: 25 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      
      <Suspense fallback={null}>
        <Float
          speed={1.5}
          rotationIntensity={1}
          floatIntensity={2}
          floatingRange={[0, 0.5]}
        >
          <ResumeModel />
        </Float>
        <Environment preset="city" />
      </Suspense>
      
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
