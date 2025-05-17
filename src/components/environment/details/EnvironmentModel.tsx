import { Suspense, useEffect, useMemo, useRef, useCallback } from 'react';
import { Html, TransformControls, useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Raycaster, Vector2, Group } from 'three';

// Define a scan type
type Scan = {
  id: string;
  fileUrl: string;
  originX: number;
  originY: number;
  originZ: number;
  isEditable: boolean;
  position: [number, number, number];
};

export function EnvironmentModel({
  onAddMarking,
  isAddingMode,
  scans,
  controlMode,
  isEditable,
}: {
  onAddMarking: (position: [number, number, number]) => void;
  isAddingMode: boolean;
  scans: Scan[];
  controlMode: 'translate' | 'rotate' | 'scale';
  isEditable: boolean;
}) {
  if (scans.length === 0) {
    return (
      <Html center>
        <div style={{ color: 'white', fontSize: '1.2em' }}>
          No scans available…
        </div>
      </Html>
    );
  }

  console.log('scans', scans);

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
      {scans.map((scan) => (
        <EnvironmentScanMesh
          key={scan.id}
          scan={scan}
          isEditingEnabled={isEditable}
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
}: {
  scan: Scan;
  isEditingEnabled: boolean;
  isAddingMode: boolean;
  onAddMarking: (position: [number, number, number]) => void;
  controlMode: 'translate' | 'rotate' | 'scale';
}) {
  const meshRef = useRef<Group>(null);
  const { gl, camera } = useThree();

  // Load and deep-clone the scene per scan
  const gltf = useGLTF(scan.fileUrl + `?id=${scan.id}`, true);
  const sceneClone = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  // Click-to-mark logic
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

  useEffect(() => {
    const canvas = gl.domElement;
    if (isAddingMode) {
      canvas.addEventListener('click', handleClick);
      return () => canvas.removeEventListener('click', handleClick);
    }
  }, [isAddingMode, handleClick, gl.domElement]);

  console.log('isEditingEnabled', isEditingEnabled);

  return (
    <>
      {isEditingEnabled && meshRef.current && (
        <TransformControls
          object={meshRef.current}
          mode={controlMode}
          onChange={() => {
            const obj = meshRef.current;
            if (obj) {
              console.log(`[${scan.id}] transform changed:`, {
                position: obj.position.toArray(),
                rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
                scale: obj.scale.toArray(),
              });
            }
          }}
        />
      )}
      <group
        ref={meshRef}
        position={[scan.position[0], scan.position[1], scan.position[2]]}
      >
        <primitive object={sceneClone} />
      </group>
    </>
  );
}
