// src/details/Marking.tsx
import { Html } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useState } from 'react';
import { Vector3 } from 'three';
import type { MarkingData } from './Scene';

interface MarkingProps {
  marking: MarkingData;
  onDelete: (id: string) => void;
  scale?: number;
}

export function Marking({ marking, onDelete, scale = 1 }: MarkingProps) {
  const { camera } = useThree();
  const [isBehindCamera, setIsBehindCamera] = useState(false);

  useFrame(() => {
    const vec = new Vector3(...marking.position);
    const dirToCamera = new Vector3()
      .subVectors(camera.position, vec)
      .normalize();
    const camForward = camera.getWorldDirection(new Vector3());
    setIsBehindCamera(dirToCamera.dot(camForward) >= 0);
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (marking.url) {
      window.open(marking.url, '_blank');
    }
  };

  return (
    <group position={marking.position} scale={[scale, scale, scale]}>
      {!isBehindCamera && (
        <Html
          transform
          distanceFactor={15}
          sprite
          zIndexRange={[100, 0]}
          occlude={false}
        >
          <div
            className="bg-white px-3 py-2 rounded-lg shadow text-sm flex items-center cursor-pointer"
            onClick={handleClick}
          >
            {/* larger dot */}
            <span className="w-4 h-4 bg-black rounded-full inline-block mr-2" />
            {marking.label}
            <button
              className="ml-3 text-red-500 hover:text-red-700 font-bold"
              onClick={() => onDelete(marking.id)}
            >
              ×
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}
