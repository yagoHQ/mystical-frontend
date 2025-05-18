// src/pages/LeftSidebar.tsx
import { Scan } from '@/api/environment.api';

export function LeftSidebar({
  scans,
  onSelectImage,
}: {
  scans: Scan[];
  onSelectImage?: (url: string) => void;
}) {
  return (
    <div className="w-64 bg-white shadow-inner flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-bold">Scan Images</h2>
      </div>

      {/* Scan Groups */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {scans.map((scan) => (
          <div key={scan.id}>
            <div className="text-sm font-semibold mb-2">{scan.scanName}</div>
            <div className="flex space-x-2 overflow-x-auto">
              {scan.images.map((url) => (
                <button
                  key={url}
                  onClick={() => onSelectImage?.(url)}
                  className="flex-shrink-0 rounded-md overflow-hidden hover:opacity-90 focus:outline-none"
                >
                  <img
                    src={url}
                    alt={scan.scanName}
                    className="h-20 w-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 text-sm text-gray-600 border-t">
        Click a thumbnail to focus on that scan image.
      </div>
    </div>
  );
}
