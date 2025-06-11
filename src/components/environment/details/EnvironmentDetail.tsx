import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Button } from '@/components/ui/button';
import { Scene } from './Scene';
import {
  getEnvironmentById,
  Environment as EnvType,
  Marking,
  deleteMarking,
  updateEnvironment,
  addOriginToEnvironment,
} from '@/api/environment.api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import QRModel from './QRModel';

export default function EnvironmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [environment, setEnvironment] = useState<EnvType | null>(null);
  const [markings, setMarkings] = useState<Marking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddingMode] = useState(true);
  const [controlMode, setControlMode] = useState<
    'translate' | 'rotate' | 'scale' | 'pick-origin'
  >('translate');
  const [openQR, setOpenQR] = useState(false);
  const [pickingOrigin, setPickingOrigin] = useState(false);

  const handleSaveOrigin = async (
    originPosition: [number, number, number],
    originRotation: [number, number, number]
  ) => {
    if (!environment) return;
    try {
      const updated = {
        ...environment,
        originPosition,
        originRotation,
      };
      setEnvironment(updated);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle control mode changes
  const handleControlModeChange = (value: string) => {
    const newMode = value as 'translate' | 'rotate' | 'scale';
    setControlMode(newMode);
  };

  const saveOrigin = async () => {
    if (!environment) return;
    if (!environment.originPosition || !environment.originRotation) {
      console.error('Origin position or rotation not set');
      return;
    }
    try {
      await addOriginToEnvironment(
        environment.id,
        environment.originPosition as [number, number, number],
        environment.originRotation as [number, number, number]
      );
      console.log('Origin saved successfully');
    } catch (err) {
      console.error('Failed to save origin:', err);
    } finally {
      setPickingOrigin(false);
    }
  };

  // Load environment once
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getEnvironmentById(id)
      .then((env) => {
        setEnvironment(env);
        setMarkings(
          (env.markings || []).map((m) => ({
            id: m.id,
            label: m.remark ?? '',
            position: [m.x, m.y, m.z] as [number, number, number],
            url: m.url ?? '',
            createdAt: m.createdAt ?? '',
          }))
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddMarking = () => {
    // implement your add-marking logic here
  };

  const handleDeleteMarking = async (markingId: string) => {
    try {
      await deleteMarking(markingId);
      setMarkings((prev) => prev.filter((m) => m.id !== markingId));
    } catch (err) {
      console.error('Failed to delete marking:', err);
    }
  };

  const handleEdit = () => navigate(`/environment/${id}/edit`);

  const handleToggleEditEnv = () => {
    setEnvironment((prev) => {
      if (!prev) return prev;
      if (prev.isEditable) {
        window.location.reload();
        return prev; // Explicitly return prev to avoid undefined
      } else {
        return { ...prev, isEditable: true };
      }
    });
  };

  const handleSaveChanges = async () => {
    try {
      if (!environment) return;
      const cleanEnvironment = {
        ...environment,
        isEditable: false,
        scans: environment.scans.map((scan) => ({
          ...scan,
          position: scan.position,
          rotation: scan.rotation,
          scale: scan.scale,
        })),
      };
      await updateEnvironment(cleanEnvironment);
      setEnvironment(cleanEnvironment);
      window.location.reload();
    } catch (err) {
      console.error('Failed to update environment:', err);
    }
  };

  // Normalize scan arrays
  useEffect(() => {
    if (!environment) return;
    const normalized = {
      ...environment,
      scans: environment.scans.map((scan) => ({
        ...scan,
        position: scan.position || [0, 0, 0],
        rotation: scan.rotation || [0, 0, 0],
        scale: scan.scale || [1, 1, 1],
      })),
    };
    if (JSON.stringify(normalized) !== JSON.stringify(environment)) {
      setEnvironment(normalized);
    }
  }, [environment]);

  if (loading)
    return <div className="p-6 text-center">Loading environment…</div>;
  if (error)
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  if (!environment) return null;

  // Detect valid .glb scans only
  const glbScans = environment.scans.filter((scan) =>
    /\.glb(\?|$)/i.test(scan.fileUrl)
  );
  const hasValid3DScans = glbScans.length > 0;

  const handleQrClick = () => {
    console.log('QR Code clicked');
    setOpenQR(true);
  };

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Info Bar */}
      <div className="flex flex-col px-8 py-5">
        <div className="bg-white rounded-full px-6 py-3 shadow-lg text-2xl font-semibold">
          {environment.title}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-lg">Created By:</span>
            <span className="text-lg font-semibold">
              {environment.scannedBy.name || environment.scannedBy.email}
            </span>
          </div>
          <div className="flex gap-4">
            {pickingOrigin ? (
              <Button
                variant="outline"
                onClick={saveOrigin}
                className="bg-white text-black hover:bg-gray-100 cursor-pointer"
              >
                <span className="text-sm">Save Origin</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setPickingOrigin(true);
                }}
                className="bg-white text-black hover:bg-gray-100 cursor-pointer"
              >
                <span className="text-sm">Add Origin</span>
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handleQrClick}
              disabled={!environment.originPosition?.length}
              className="bg-white text-black hover:bg-gray-100 cursor-pointer"
            >
              <span className="text-sm">QR Code</span>
            </Button>

            {environment.isEditable && (
              <Button variant="outline" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            )}

            <Button
              onClick={handleToggleEditEnv}
              className={
                environment.isEditable
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }
            >
              {environment.isEditable ? 'Cancel' : 'Edit Environment'}
            </Button>

            <Button
              onClick={handleEdit}
              className="bg-blue-500 text-white hover:bg-blue-600"
              disabled={environment.isEditable}
            >
              Edit Marking
            </Button>

            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      {!hasValid3DScans ? (
        <div className="flex-1 flex items-center justify-center bg-yellow-50 text-yellow-800 p-6">
          ⚠️ No supported 3D models (.glb only)
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden relative">
          {environment.scans.length > 0 && (
            <>
              {environment.isEditable && (
                <div className="absolute top-4 left-4 z-10 bg-gray-100 rounded-lg shadow-lg p-3 w-48">
                  <Select
                    value={controlMode}
                    onValueChange={handleControlModeChange}
                  >
                    <SelectTrigger className="bg-white text-black border-gray-300">
                      <SelectValue placeholder="Select Tool" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="translate">Move</SelectItem>
                      <SelectItem value="rotate">Rotate</SelectItem>
                      <SelectItem value="scale">Scale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {pickingOrigin && (
                <div className="absolute top-4 left-4 z-10 bg-gray-100 rounded-lg shadow-lg p-3 w-48">
                  <p className="text-sm text-blue-800 mb-2">
                    Click on any point in the 3D scene to set the origin
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPickingOrigin(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              <Canvas
                camera={{
                  position: [20, 60, 20],
                  fov: 45,
                  near: 0.01,
                  far: 5000,
                }}
              >
                <Scene
                  environment={environment}
                  setEnvironment={setEnvironment}
                  markings={markings}
                  onAddMarking={handleAddMarking}
                  onDeleteMarking={handleDeleteMarking}
                  isAddingMode={isAddingMode}
                  markerScale={1}
                  controlMode={controlMode}
                  pickingOrigin={pickingOrigin}
                  onSaveOrigin={handleSaveOrigin}
                />
              </Canvas>
            </>
          )}

          <QRModel
            open={openQR}
            onOpenChange={setOpenQR}
            id={environment.id}
            originPosition={environment.originPosition}
            originRotation={environment.originRotation}
          />
        </div>
      )}
    </div>
  );
}
