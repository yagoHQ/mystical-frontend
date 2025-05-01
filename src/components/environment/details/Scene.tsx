// src/details/Scene.tsx
import { OrbitControls } from '@react-three/drei';
import { EnvironmentModel } from './EnvironmentModel';
import { Marking } from './Marking';

export interface MarkingData {
  id: string;
  label: string;
  position: [number, number, number];
}

interface SceneProps {
  markings: MarkingData[];
  onAddMarking: (position: [number, number, number]) => void;
  onDeleteMarking: (id: string) => void;
  isAddingMode: boolean;
  /** Uniform scale for each marking */
  markerScale?: number;
  scans: [];
}

export function Scene({
  markings,
  onAddMarking,
  onDeleteMarking,
  isAddingMode,
  markerScale = 1, // default 1×
  scans,
}: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} />

      <EnvironmentModel
        onAddMarking={onAddMarking}
        isAddingMode={isAddingMode}
        scans={scans}
      />

      {markings.map((mark) => (
        <Marking
          key={mark.id}
          marking={mark}
          onDelete={onDeleteMarking}
          scale={markerScale} // ← pass it down
        />
      ))}

      <OrbitControls
        makeDefault
        enabled={isAddingMode}
        minDistance={20}
        maxDistance={90}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}
