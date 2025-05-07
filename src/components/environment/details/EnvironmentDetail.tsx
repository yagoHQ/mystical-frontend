import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Button } from '@/components/ui/button';
import { Scene } from './Scene';
import {
  getEnvironmentById,
  Environment as EnvType,
  Marking,
} from '@/api/environment.api';

export default function EnvironmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [environment, setEnvironment] = useState<EnvType | null>(null);
  const [markings, setMarkings] = useState<Marking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddingMode] = useState(true);

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

  const deleteMarking = (markId: string) =>
    setMarkings((prev) => prev.filter((m) => m.id !== markId));

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
      <div className="flex flex-1 overflow-hidden">
        <Canvas camera={{ position: [20, 60, 20], fov: 45 }}>
          <Scene
            markings={markings}
            onAddMarking={handleAddMarking}
            onDeleteMarking={deleteMarking}
            isAddingMode={isAddingMode}
            markerScale={1}
            scans={environment.scans}
          />
        </Canvas>
      </div>
    </div>
  );
}
