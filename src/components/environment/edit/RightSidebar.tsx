// File: pages/RightSidebar.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface Marking {
  id: string;
  label: string;
  position: [number, number, number];
}

export function RightSidebar({
  markings,
  deleteMarking,
}: {
  markings: Marking[];
  deleteMarking: (id: string) => void;
}) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(
    markings.length > 0 ? markings[0].id : null
  );

  return (
    <div className="w-[400px] bg-white shadow-inner flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-xl font-bold">Restaurant ABC</h2>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      {/* Subtitle */}
      <div className="px-6 py-2 border-b">
        <span className="text-sm font-medium">Markings</span>
      </div>

      {/* List of Markings */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {markings.map((marking, index) => {
          const isSelected = marking.id === selectedId;
          return (
            <div
              key={marking.id}
              onClick={() => setSelectedId(marking.id)}
              className={`flex justify-between items-start p-3 rounded-md cursor-pointer transition-colors
                ${isSelected ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}`}
            >
              <div>
                <div className="text-xs text-blue-500 font-semibold">
                  CB00{index + 1}
                </div>
                <div className="mt-1 font-semibold text-gray-900">
                  {marking.label}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {new Date(Number(marking.id)).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => deleteMarking(marking.id)}
                className="text-gray-400 hover:text-red-600 ml-4"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="px-6 py-4 text-sm text-gray-600 border-t">
        To add a marking, double click on the position and enter text.
      </div>
    </div>
  );
}
