import { Suspense, useEffect, useState } from 'react';
import { Html, useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Raycaster, Group, Vector2 } from 'three';
import { useRef, useCallback } from 'react';

type Scan = { id: string; data: any; fileUrl: string };

export function EnvironmentModel({
  onAddMarking,
  isAddingMode,
  scans,
}: {
  onAddMarking: (position: [number, number, number]) => void;
  isAddingMode: boolean;
  scans: Scan[];
}) {
  // ⬇️ these hooks always run
  const [currentScan, setCurrentScan] = useState<Scan | null>(null);

  useEffect(() => {
    if (scans.length > 0 && scans[0].fileUrl) {
      setCurrentScan(scans[0]);
    }
  }, [scans]);

  // ⬇️ bail out early *without* touching any other hooks
  if (!currentScan) {
    return (
      <Html center>
        <div style={{ color: 'white', fontSize: '1.2em' }}>
          Initializing model…
        </div>
      </Html>
    );
  }

  // ⬇️ once we have a scan, delegate to the inner component,
  // wrapped in Suspense so we also get a loading fallback
  return (
    <Suspense
      fallback={
        <Html center>
          <div style={{ color: 'white', fontSize: '1.2em' }}>
            Loading model…
          </div>
        </Html>
      }
    >
      <EnvironmentModelInner
        fileUrl={currentScan.fileUrl}
        onAddMarking={onAddMarking}
        isAddingMode={isAddingMode}
      />
    </Suspense>
  );
}

function EnvironmentModelInner({
  fileUrl,
  onAddMarking,
  isAddingMode,
}: {
  fileUrl: string;
  onAddMarking: (position: [number, number, number]) => void;
  isAddingMode: boolean;
}) {
  // ⬇️ these hooks always run whenever this component is mounted
  const meshRef = useRef<Group>(null);
  const { gl, camera } = useThree();
  const gltf = useGLTF(fileUrl, true);

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (!isAddingMode || !meshRef.current) return;
      const mouse = new Vector2(
        (event.offsetX / gl.domElement.clientWidth) * 2 - 1,
        -(event.offsetY / gl.domElement.clientHeight) * 2 + 1
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
      return () => {
        canvas.removeEventListener('click', handleClick);
      };
    }
  }, [isAddingMode, gl.domElement, handleClick]);

  return <primitive ref={meshRef} object={gltf.scene} />;
}
