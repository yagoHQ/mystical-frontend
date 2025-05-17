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
} from '@/api/environment.api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function EnvironmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [environment, setEnvironment] = useState<EnvType | null>(null);
  const [markings, setMarkings] = useState<Marking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddingMode] = useState(true);
  const [controlMode, setControlMode] = useState<
    'translate' | 'rotate' | 'scale'
  >('translate');

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
            url: m.url ? m.url : '',
          }))
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddMarking = () => {
    return;
  };

  const handleDeleteMarking = async (markingId: string) => {
    try {
      // 1️⃣ delete on the server
      await deleteMarking(markingId);

      // 2️⃣ update local state
      setMarkings((prev) => prev.filter((m) => m.id !== markingId));
    } catch (err) {
      console.error('Failed to delete marking:', err);
    }
  };

  const handleEdit = () => navigate(`/environment/${id}/edit`);

  if (loading)
    return <div className="p-6 text-center">Loading environment…</div>;
  if (error)
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  if (!environment) return null;

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Info Bar */}
      <div className="flex flex-col px-8 py-5 bg-white">
        <div className="text-2xl font-semibold px-6 py-3 rounded-full shadow-lg">
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
            <Button onClick={handleEdit}>Edit Marking</Button>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex flex-2 overflow-hidden">
        <div className="p-4 bg-gray-500">
          <Select
            value={controlMode}
            onValueChange={(value) =>
              setControlMode(value as typeof controlMode)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Tool" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="translate">Move</SelectItem>
              <SelectItem value="rotate">Rotate</SelectItem>
              <SelectItem value="scale">Scale</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Canvas
          camera={{
            position: [20, 60, 20],
            fov: 45,
            near: 0.01, // super-close zoom
            far: 5000, // super-far zoom
          }}
        >
          {' '}
          <Scene
            markings={markings}
            onAddMarking={handleAddMarking}
            onDeleteMarking={handleDeleteMarking}
            isAddingMode={isAddingMode}
            markerScale={1}
            isEditable={environment.isEditable}
            scans={environment.scans}
            controlMode={controlMode}
          />
        </Canvas>
      </div>
    </div>
  );
}
