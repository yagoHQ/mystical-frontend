import { useEffect, useState } from 'react';
import heic2any from 'heic2any';
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
                <ImageButton key={url} url={url} onClick={onSelectImage} />
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

function ImageButton({ url, onClick }: { url: string; onClick?: (url: string) => void }) {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const ext = url.split('.').pop()?.toLowerCase();

  useEffect(() => {
    const load = async () => {
      if (ext === 'heic') {
        try {
          setLoading(true);
          const res = await fetch(url);
          const blob = await res.blob();
          const converted = await heic2any({ blob, toType: 'image/jpeg' });
          const objectUrl = URL.createObjectURL(converted as Blob);
          setSrc(objectUrl);
        } catch (e) {
          console.error('HEIC conversion failed', e);
        } finally {
          setLoading(false);
        }
      } else {
        setSrc(url);
      }
    };

    load();
  }, [url, ext]);

  return (
    <button
      onClick={() => src && onClick?.(src)}
      className="flex-shrink-0 rounded-md overflow-hidden hover:opacity-90 focus:outline-none"
    >
      {src ? (
        <img src={src} alt="preview" className="h-20 w-20 object-cover" />
      ) : (
        <div className="h-20 w-20 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
          {loading ? 'Converting...' : '.HEIC'}
        </div>
      )}
    </button>
  );
}
