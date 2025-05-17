// src/details/Scene.tsx
import { OrbitControls } from '@react-three/drei';
import { EnvironmentModel } from './EnvironmentModel';
import { Marking } from './Marking';

export interface MarkingData {
  id: string;
  label: string;
  position: [number, number, number];
  url?: string; // optional URL
}

interface SceneProps {
  markings: MarkingData[];
  onAddMarking: (position: [number, number, number]) => void;
  onDeleteMarking: (id: string) => void;
  isAddingMode: boolean;
  /** Uniform scale for each marking */
  markerScale?: number;
  scans: [];
  controlMode: 'translate' | 'rotate' | 'scale';
  isEditable: boolean; // whether the environment is editable
}

export function Scene({
  markings,
  onAddMarking,
  onDeleteMarking,
  isAddingMode,
  markerScale = 1, // default 1×
  scans,
  controlMode,
  isEditable,
}: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} />

      <EnvironmentModel
        onAddMarking={onAddMarking}
        isAddingMode={isAddingMode}
        scans={scans}
        controlMode={controlMode}
        isEditable={isEditable} // pass down the isEditable prop
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
        enableZoom={true}
        enablePan={true}
        enableRotate={true} // allow rotation in both modes
        minDistance={0.1} // as close as you like
        maxDistance={2000} // as far as you like
        minPolarAngle={0} // full vertical sweep
        maxPolarAngle={Math.PI}
        zoomSpeed={1.5} // faster zoom
      />
    </>
  );
}
