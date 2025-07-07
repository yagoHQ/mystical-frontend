// src/details/Origin.tsx
import React from 'react';
import { Html } from '@react-three/drei';
import { MapPin } from 'lucide-react';

export interface OriginProps {
  /** 3-element world position [x,y,z] */
  position: [number, number, number];
  /** optional rotation to align the label (radians) */
  rotation?: [number, number, number];
  /** how big the HTML scales with distance */
  distanceFactor?: number;
  markerScale?: number; // optional scale for the marker
}

const Origin: React.FC<OriginProps> = (
  { position, rotation = [0, 0, 0] },
  markerScale = 1
) => {
  return (
    <group
      position={position}
      rotation={rotation}
      scale={[2, 2, 2]} // Ensure the group is not scaled
    >
      <Html
        transform
        center
        distanceFactor={markerScale} // Adjust distance factor for visibility
        occlude={false}
        zIndexRange={[100, 0]}
        sprite
      >
        <div className="inline-flex items-center border border-red-400 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded space-x-1 cursor-pointer hover:bg-red-200 transition-colors">
          <MapPin size={16} />
          Origin
        </div>
      </Html>
    </group>
  );
};

export default Origin;
