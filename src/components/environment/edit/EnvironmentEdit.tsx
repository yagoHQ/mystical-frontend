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
} from '@/api/environment.api';

export default function EnvironmentEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [environment, setEnvironment] = useState<EnvType | null>(null);
  const [markings, setMarkings] = useState<Marking[]>([]);
  const [tempPosition, setTempPosition] = useState<
    [number, number, number] | null
  >(null);
  const [newMarkingLabel, setNewMarkingLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Using the utility function from API

  // 1️⃣ Load environment + existing scans & markings
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getEnvironmentById(id)
      .then((env) => {
        setEnvironment(env);
        // Convert API markings to the format expected by the component
        if (env.markings && Array.isArray(env.markings)) {
          setMarkings(convertApiMarkingsToComponentFormat(env.markings));
        }
      })
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  // 2️⃣ Handlers for adding, saving, cancelling, deleting
  const handleAddMarking = useCallback((position: [number, number, number]) => {
    setTempPosition(position);
  }, []);

  const saveTempMarking = () => {
    if (!tempPosition || !newMarkingLabel.trim()) return;
    setMarkings((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`, // Use temp ID until server assigns one
        label: newMarkingLabel.trim(),
        position: tempPosition,
      },
    ]);
    setTempPosition(null);
    setNewMarkingLabel('');
  };

  const cancelTempMarking = () => {
    setTempPosition(null);
    setNewMarkingLabel('');
  };

  const deleteMarking = useCallback((id: string) => {
    setMarkings((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // 3️⃣ Persist back to server
  const saveAllMarkings = async () => {
    if (!id) return;
    setSaving(true);

    try {
      // Find new markings (ones with temp IDs)
      const newMarkings = markings.filter((mark) =>
        mark.id.startsWith('temp-')
      );

      // Add each new marking through API
      for (const mark of newMarkings) {
        await addMarkingToEnvironment({
          environmentId: id,
          createdById: environment?.scannedBy?.id || '', // May need to update based on your user context
          x: mark.position[0],
          y: mark.position[1],
          z: mark.position[2],
          remark: mark.label,
          metadata: '',
          url: '',
        });
      }

      // Navigate back to detail view after saving
      navigate(`/environment/${id}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to save markings');
      }
    } finally {
      setSaving(false);
    }
  };

  // 4️⃣ UI states
  if (loading) {
    return <div className="p-6 text-center">Loading environment…</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }
  if (!environment) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <h1 className="text-2xl font-semibold">
          {environment.title} – Edit Markings
        </h1>
        <div className="flex gap-2">
          <Button onClick={() => navigate(-1)} variant="outline">
            Cancel
          </Button>
          <Button onClick={saveAllMarkings} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* 3D + Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative">
          <Canvas camera={{ position: [20, 60, 20], fov: 45 }}>
            <Scene
              markings={markings}
              onAddMarking={handleAddMarking}
              onDeleteMarking={deleteMarking}
              isAddingMode={true}
              markerScale={5}
              scans={environment.scans}
            />
          </Canvas>

          {/* Prompt to click */}
          {!tempPosition && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full z-20">
              Click on the model to add a marking
            </div>
          )}

          {/* Temporary Label Entry */}
          {tempPosition && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30 bg-white p-4 shadow rounded-md flex gap-2 items-center">
              <input
                type="text"
                value={newMarkingLabel}
                onChange={(e) => setNewMarkingLabel(e.target.value)}
                placeholder="Enter marking text"
                className="p-2 border rounded flex-1"
                autoFocus
              />
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
          )}
        </div>

        {/* Sidebar */}
        <RightSidebar markings={markings} deleteMarking={deleteMarking} />
      </div>
    </div>
  );
}
