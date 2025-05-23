// src/pages/EnvironmentEdit.tsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Button } from '@/components/ui/button';
import { Scene } from '../details/Scene';
import { RightSidebar } from './RightSidebar';
import {
  getEnvironmentById,
  addMarkingToEnvironment,
  Environment as EnvType,
  Marking,
  convertApiMarkingsToComponentFormat,
  deleteMarking,
} from '@/api/environment.api';
import { LeftSidebar } from './LeftSidebar';

export default function EnvironmentEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [environment, setEnvironment] = useState<EnvType | null>(null);
  const [markings, setMarkings] = useState<Marking[]>([]);
  const [tempPosition, setTempPosition] = useState<
    [number, number, number] | null
  >(null);
  const [newMarkingLabel, setNewMarkingLabel] = useState('');
  const [newMarkingUrl, setNewMarkingUrl] = useState(''); // <-- new state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1️⃣ Load the environment & existing markings
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getEnvironmentById(id)
      .then((env) => {
        setEnvironment(env);
        if (env.markings && Array.isArray(env.markings)) {
          setMarkings(convertApiMarkingsToComponentFormat(env.markings));
        }
      })
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  // 2️⃣ Handlers to start/cancel adding a marking
  const handleAddMarking = useCallback((position: [number, number, number]) => {
    setTempPosition(position);
  }, []);

  const saveTempMarking = () => {
    if (!tempPosition || !newMarkingLabel.trim()) return;

    setMarkings((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        label: newMarkingLabel.trim(),
        position: tempPosition,
        url: newMarkingUrl.trim() || '', // <-- include URL
      } as Marking,
    ]);

    // reset
    setTempPosition(null);
    setNewMarkingLabel('');
    setNewMarkingUrl('');
  };

  const cancelTempMarking = () => {
    setTempPosition(null);
    setNewMarkingLabel('');
    setNewMarkingUrl('');
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

  // 3️⃣ Persist new markings
  const saveAllMarkings = async () => {
    if (!id) return;
    setSaving(true);

    try {
      const newMarkings = markings.filter((m) => m.id.startsWith('temp-'));
      for (const m of newMarkings) {
        await addMarkingToEnvironment({
          environmentId: id,
          createdById: environment?.scannedBy?.id || '',
          x: m.position[0],
          y: m.position[1],
          z: m.position[2],
          remark: m.label,
          metadata: '',
          url: m.url || '', // ← pass the URL
        });
      }
      navigate(`/environment/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save markings');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (environment) {
      console.log('Environment loaded:', environment);
    }
  }, [environment]);

  // 4️⃣ Render loading / error
  if (loading)
    return <div className="p-6 text-center">Loading environment…</div>;
  if (error)
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  if (!environment) return null;

  const hasUSDZ = environment.scans.some((scan) =>
    /\.usdz(\?|$)/i.test(scan.fileUrl)
  );

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <h1 className="text-2xl font-semibold">
          {environment.title} – Edit Markings
          {hasUSDZ && (
            <span className="ml-4 inline-block bg-yellow-200 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
              USDZ Model
            </span>
          )}
        </h1>
        <div className="flex gap-2">
          <Button onClick={() => navigate(-1)} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={saveAllMarkings}
            className="bg-blue-500 text-white hover:bg-blue-600"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* 3D + Sidebar */}

      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar
          scans={environment.scans}
          onSelectImage={(url) => {
            // you could pan/zoom your Scene to focus on a texture, etc.
            console.log('thumbnail clicked:', url);
          }}
        />
        {/* Canvas */}

        {hasUSDZ ? (
          <div className="flex-1 flex items-center justify-center bg-yellow-50 text-yellow-800 p-6">
            ⚠️ This environment uses USDZ files, which aren’t supported for 3D
            viewing yet.
          </div>
        ) : (
          <div className="flex-1 relative">
            <Canvas camera={{ position: [20, 60, 20], fov: 45 }}>
              <Scene
                environment={environment}
                markings={markings}
                onAddMarking={handleAddMarking}
                onDeleteMarking={handleDeleteMarking}
                isAddingMode={true}
                markerScale={5}
              />
            </Canvas>

            {/* Temporary Label + URL Entry */}
            {tempPosition && (
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30 bg-white p-4 shadow rounded-md space-y-2">
                <input
                  type="text"
                  value={newMarkingLabel}
                  onChange={(e) => setNewMarkingLabel(e.target.value)}
                  placeholder="Enter marking text"
                  className="w-64 p-2 border rounded"
                  autoFocus
                />
                <input
                  type="url"
                  value={newMarkingUrl}
                  onChange={(e) => setNewMarkingUrl(e.target.value)}
                  placeholder="Enter a URL"
                  className="w-64 p-2 border rounded"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={saveTempMarking}
                    disabled={!newMarkingLabel.trim()}
                  >
                    Save
                  </Button>
                  <Button variant="outline" onClick={cancelTempMarking}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sidebar */}
        <RightSidebar markings={markings} deleteMarking={handleDeleteMarking} />
      </div>
    </div>
  );
}
