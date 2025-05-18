// src/pages/RightSidebar.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Marking as ApiMarking } from '@/api/environment.api';
import { ConfirmDeleteModal } from '@/shared/ConfirmDeleteModal';

export function RightSidebar({
  markings,
  deleteMarking,
}: {
  markings: ApiMarking[];
  deleteMarking: (id: string) => void;
}) {
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // NEW: which marking are we about to delete?
  const [markingToDelete, setMarkingToDelete] = useState<string | null>(null);

  // initialize selectedId when markings arrive
  useEffect(() => {
    if (markings.length && !selectedId) {
      setSelectedId(markings[0].id);
    }
  }, [markings, selectedId]);

  useEffect(() => {
    console.log('markings', markings);
  }, [markings]);

  // user confirmed in the modal
  const handleConfirmDelete = () => {
    if (markingToDelete) {
      deleteMarking(markingToDelete);
      setMarkingToDelete(null);
      // if the deleted item was selected, clear selection
      if (selectedId === markingToDelete) {
        setSelectedId(null);
      }
    }
  };

  // user cancelled
  const handleCancelDelete = () => {
    setMarkingToDelete(null);
  };

  return (
    <div className="w-[400px] bg-white shadow-inner flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-xl font-bold">Markings</h2>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      {/* List of Markings */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {markings.map((m, idx) => {
          const isSelected = m.id === selectedId;
          return (
            <div
              key={m.id}
              onClick={() => setSelectedId(m.id)}
              className={`flex justify-between items-start p-3 rounded-md cursor-pointer transition-colors
                ${isSelected ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}`}
            >
              <div>
                <div className="text-xs text-blue-500 font-semibold">
                  #{idx + 1}
                </div>
                <div className="mt-1 font-semibold text-gray-900">
                  {m.label}
                </div>
                {m.url && (
                  <div className="mt-1 text-xs text-gray-500">
                    <a
                      href={
                        /^https?:\/\//.test(m.url) ? m.url : `https://${m.url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {m.url}
                    </a>
                  </div>
                )}
                <div className="mt-1 text-xs text-gray-500">
                  {new Date(m.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Delete Button now opens the modal */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMarkingToDelete(m.id);
                }}
                className="text-gray-400 hover:text-red-600 ml-4"
                title="Delete this marking"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="px-6 py-4 text-sm text-gray-600 border-t">
        Double-click on the 3D model to add a new marking.
      </div>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDeleteModal
        title="Marking"
        isOpen={!!markingToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
