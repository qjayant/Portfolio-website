import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";

import Particles from "./Particles";
import { Suspense } from "react";

import { Robot_1 } from "./Robot_1";

const HeroExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });

  return (
    <Canvas camera={{ position: [0, 0,12], fov: 45 }}>
      <ambientLight intensity={0.3} color="#fcf5f5" />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <spotLight
        position={[0, 3, 10]}
        angle={0.3}
        penumbra={1}
        intensity={300}
        castShadow
      />
      {/* Configure OrbitControls to disable panning and control zoom based on device type */}

      <OrbitControls
        enablePan={false} // Prevents panning of the scene
        enableZoom={!isTablet}
        maxDistance={20}
        minDistance={5}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
      />
      <Suspense fallback={null}>
        <Particles count={100} />
        <group
          scale={isMobile ? 0.7 : 1.3}
          position={[0, -2.5, 0]}
          rotation={[0, 0, 0]}
        >
          <Robot_1 />
        </group>
      </Suspense>
    </Canvas>
  );
};

export default HeroExperience;
