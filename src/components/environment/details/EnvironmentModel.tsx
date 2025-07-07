import { Suspense, useEffect, useMemo, useRef, useCallback } from 'react';
import { Html, TransformControls, useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Raycaster, Vector2, Vector3, Group, Box3 } from 'three';
import { Environment } from '@/api/environment.api';

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
  pickingOrigin,
  onSaveOrigin,
  setAutoCameraPosition,
}: {
  onAddMarking: (position: [number, number, number]) => void;
  isAddingMode: boolean;
  environment: Environment;
  controlMode: 'translate' | 'rotate' | 'scale' | 'pick-origin';
  setEnvironment: (env: Environment) => void;
  pickingOrigin?: boolean;
  onSaveOrigin?: (
    originPosition: [number, number, number],
    originRotation: [number, number, number]
  ) => void;
  setAutoCameraPosition?: (pos: [number, number, number]) => void;
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
          <div style={{ color: 'black', fontSize: '1.2em' }}>
            Loading models…
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
          pickingOrigin={pickingOrigin}
          onSaveOrigin={onSaveOrigin}
          setAutoCameraPosition={setAutoCameraPosition}
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
  pickingOrigin,
  onSaveOrigin,
  setAutoCameraPosition,
}: {
  scan: Scan;
  isEditingEnabled: boolean;
  isAddingMode: boolean;
  onAddMarking: (position: [number, number, number]) => void;
  environment: Environment;
  setEnvironment: (env: Environment) => void;
  controlMode: 'translate' | 'rotate' | 'scale' | 'pick-origin';
  pickingOrigin?: boolean;
  onSaveOrigin?: (
    originPosition: [number, number, number],
    originRotation: [number, number, number]
  ) => void;
  setAutoCameraPosition?: (pos: [number, number, number]) => void;
}) {
  const meshRef = useRef<Group>(null);
  const { gl, camera } = useThree();

  const currentRotation = scan.rotation || [0, 0, 0];
  const currentPosition = scan.position || [0, 0, 0];
  const currentScale = scan.scale || [1, 1, 1];

  const scanUrl =
    scan.fileUrl + (scan.fileUrl.includes('?') ? '&' : '?') + `id=${scan.id}`;

  // Load GLB model using useGLTF
  const { scene } = useGLTF(scanUrl, true);
  const sceneClone = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    if (!scene || !setAutoCameraPosition) return;

    const boundingBox = new Box3().setFromObject(scene);
    const size = new Vector3();
    const center = new Vector3();
    boundingBox.getSize(size);
    boundingBox.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * 2;

    setAutoCameraPosition([
      center.x + distance,
      center.y + distance,
      center.z + distance,
    ]);
  }, [scene]);

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (!meshRef.current) return;

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

        if (pickingOrigin && onSaveOrigin) {
          // For origin picking, use the hit point as the origin position
          // For rotation, we can use the surface normal or default to [0, 0, 0]
          const normal = hits[0].face?.normal || new Vector3(0, 1, 0);

          // Convert normal to euler angles (this is a simplified approach)
          // You might want to use a more sophisticated method based on your needs
          const originRotation: [number, number, number] = [
            Math.atan2(normal.y, normal.z),
            Math.atan2(
              -normal.x,
              Math.sqrt(normal.y * normal.y + normal.z * normal.z)
            ),
            0,
          ];

          console.log(
            `Picked origin at: [${x.toFixed(2)}, ${y.toFixed(
              2
            )}, ${z.toFixed(2)}] with rotation: [${originRotation
              .map((r) => r.toFixed(2))
              .join(', ')}]`
          );

          onSaveOrigin([x, y, z], originRotation);
        } else if (isAddingMode) {
          // Regular marking mode
          onAddMarking([x, y, z]);
        }
      }
    },
    [
      isAddingMode,
      pickingOrigin,
      gl.domElement,
      camera,
      onAddMarking,
      onSaveOrigin,
    ]
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
    if (isAddingMode || pickingOrigin) {
      canvas.addEventListener('click', handleClick);
      canvas.style.cursor = pickingOrigin ? 'crosshair' : 'pointer';
      return () => {
        canvas.removeEventListener('click', handleClick);
        canvas.style.cursor = 'default';
      };
    }
  }, [isAddingMode, pickingOrigin, handleClick, gl.domElement]);

  const showTransformControls =
    isEditingEnabled &&
    meshRef.current &&
    controlMode !== 'pick-origin' &&
    !pickingOrigin;

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
