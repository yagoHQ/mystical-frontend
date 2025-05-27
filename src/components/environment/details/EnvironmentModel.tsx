import { Suspense, useEffect, useMemo, useRef, useCallback } from 'react';
import { Html, TransformControls } from '@react-three/drei';
import { useThree, useLoader } from '@react-three/fiber';
import { Raycaster, Vector2, Group, MeshStandardMaterial } from 'three';
import { Environment } from '@/api/environment.api';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TextureLoader } from 'three';

// Define a scan type
type Scan = {
  id: string;
  fileUrl: string;
  isEditable?: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

export function EnvironmentModel({
  environment,
  setEnvironment,
  onAddMarking,
  isAddingMode,
  controlMode,
}: {
  onAddMarking: (position: [number, number, number]) => void;
  isAddingMode: boolean;
  environment: Environment;
  controlMode: 'translate' | 'rotate' | 'scale';
  setEnvironment: (env: Environment) => void;
}) {
  if (!environment.scans || environment.scans.length === 0) {
    return (
      <Html center>
        <div style={{ color: 'white', fontSize: '1.2em' }}>
          No scans available…
        </div>
      </Html>
    );
  }

  return (
    <Suspense
      fallback={
        <Html center>
          <div style={{ color: 'white', fontSize: '1.2em' }}>
            Loading scans…
          </div>
        </Html>
      }
    >
      {environment.scans.map((scan) => (
        <EnvironmentScanMesh
          environment={environment}
          setEnvironment={setEnvironment}
          key={scan.id}
          scan={scan}
          isEditingEnabled={environment.isEditable}
          isAddingMode={isAddingMode}
          onAddMarking={onAddMarking}
          controlMode={controlMode}
        />
      ))}
    </Suspense>
  );
}

function EnvironmentScanMesh({
  scan,
  isEditingEnabled,
  isAddingMode,
  onAddMarking,
  controlMode,
  environment,
  setEnvironment,
}: {
  scan: Scan;
  isEditingEnabled: boolean;
  isAddingMode: boolean;
  onAddMarking: (position: [number, number, number]) => void;
  environment: Environment;
  setEnvironment: (env: Environment) => void;
  controlMode: 'translate' | 'rotate' | 'scale';
}) {
  const meshRef = useRef<Group>(null);
  const { gl, camera } = useThree();

  const currentRotation = scan.rotation || [0, 0, 0];
  const currentPosition = scan.position || [0, 0, 0];
  const currentScale = scan.scale || [1, 1, 1];

  const scanUrl =
    scan.fileUrl + (scan.fileUrl.includes('?') ? '&' : '?') + `id=${scan.id}`;

  const obj = useLoader(OBJLoader, scanUrl);

  const [diffuseMap, , normalMap] = useLoader(
    TextureLoader,
    scan.textures || []
  );

  const sceneClone = useMemo(() => {
    const cloned = obj.clone(true);
    cloned.traverse((child) => {
      if ((child as any).isMesh) {
        (child as any).material = new MeshStandardMaterial({
          map: diffuseMap,
          normalMap: normalMap,
          metalness: 0.4,
          roughness: 0.6,
        });
      }
    });
    return cloned;
  }, [obj, diffuseMap, normalMap]);

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (!isAddingMode || !meshRef.current) return;
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObject(meshRef.current, true);
      if (hits.length) {
        const { x, y, z } = hits[0].point;
        onAddMarking([x, y, z]);
      }
    },
    [isAddingMode, gl.domElement, camera, onAddMarking]
  );

  const handleTransformChange = useCallback(() => {
    const obj = meshRef.current;
    if (!obj) return;
    const newPosition = obj.position.toArray() as [number, number, number];
    const newRotation = [obj.rotation.x, obj.rotation.y, obj.rotation.z] as [
      number,
      number,
      number,
    ];
    const newScale = obj.scale.toArray() as [number, number, number];
    setEnvironment({
      ...environment,
      scans: environment.scans.map((s) =>
        s.id === scan.id
          ? {
              ...s,
              position: newPosition,
              rotation: newRotation,
              scale: newScale,
            }
          : s
      ),
    });
  }, [scan.id, environment, setEnvironment]);

  useEffect(() => {
    const canvas = gl.domElement;
    if (isAddingMode) {
      canvas.addEventListener('click', handleClick);
      return () => canvas.removeEventListener('click', handleClick);
    }
  }, [isAddingMode, handleClick, gl.domElement]);

  const showTransformControls = isEditingEnabled && meshRef.current;

  return (
    <>
      {showTransformControls && (
        <TransformControls
          object={meshRef as React.RefObject<Group>}
          mode={controlMode}
          onChange={handleTransformChange}
        />
      )}
      <group
        ref={meshRef}
        position={currentPosition}
        rotation={currentRotation}
        scale={currentScale}
      >
        <primitive object={sceneClone} />
      </group>
    </>
  );
}
