import { OrbitControls } from '@react-three/drei';
import { EnvironmentModel } from './EnvironmentModel';
import { Marking } from './Marking';
import { Environment } from '@/api/environment.api';

export interface MarkingData {
  id: string;
  label: string;
  position: [number, number, number];
  url?: string; // optional URL
}

interface SceneProps {
  markings: MarkingData[];
  environment: Environment;
  setEnvironment: (env: Environment) => void;
  onAddMarking: (position: [number, number, number]) => void;
  onDeleteMarking: (id: string) => void;
  isAddingMode: boolean;
  /** Uniform scale for each marking */
  markerScale?: number;
  controlMode: 'translate' | 'rotate' | 'scale';
}

export function Scene({
  environment,
  setEnvironment,
  markings,
  onAddMarking,
  onDeleteMarking,
  isAddingMode,
  markerScale = 1, // default 1×
  controlMode,
}: SceneProps) {
  // Ensure environment is properly normalized before passing to children
  const normalizedEnvironment = {
    ...environment,
    scans: environment.scans.map((scan) => ({
      ...scan,
      // Ensure required properties exist
      position: scan.position || [0, 0, 0],
      rotation: scan.rotation || [0, 0, 0],
      scale: scan.scale || [1, 1, 1],
    })),
  };

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} />

      <EnvironmentModel
        environment={normalizedEnvironment}
        setEnvironment={setEnvironment}
        onAddMarking={onAddMarking}
        isAddingMode={isAddingMode}
        controlMode={controlMode}
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
