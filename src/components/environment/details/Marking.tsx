// src/details/Marking.tsx
import { Html } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useState } from 'react';
import { Vector3 } from 'three';
import type { MarkingData } from './Scene';

interface MarkingProps {
  marking: MarkingData;
  scale?: number;
}

export function Marking({ marking, scale = 1 }: MarkingProps) {
  const { camera } = useThree();
  const [isBehindCamera, setIsBehindCamera] = useState(false);

  const markingPos = new Vector3(...marking.position);

  useFrame(() => {
    const dirToCamera = new Vector3()
      .subVectors(camera.position, markingPos)
      .normalize();
    const camForward = camera.getWorldDirection(new Vector3());
    setIsBehindCamera(dirToCamera.dot(camForward) >= 0);
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { url } = marking;
    if (!url) return;

    const href = /^https?:\/\//.test(url) ? url : `https://${url}`;
    window.open(href, '_blank');
  };

  return (
    <group position={marking.position} scale={[scale, scale, scale]}>
      {!isBehindCamera && (
        <Html
          transform
          distanceFactor={scale}
          sprite
          zIndexRange={[100, 0]}
          occlude={false}
        >
          <div
            className="bg-white px-3 py-2 rounded-lg shadow text-sm flex items-center cursor-pointer"
            onClick={handleClick}
          >
            <span className="w-4 h-4 bg-black rounded-full inline-block mr-2" />
            {marking.label}
          </div>
        </Html>
      )}
    </group>
  );
}
