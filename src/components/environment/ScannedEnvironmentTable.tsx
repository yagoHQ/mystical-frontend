// src/components/ScannedEnvironmentTable.tsx
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getEnvironments, Environment } from '@/api/environment.api';

export default function ScannedEnvironmentTable() {
  const navigate = useNavigate();

  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getEnvironments();
        setEnvironments(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load environments');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading environments…</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_1fr_40px] items-center px-4 py-3 border-b text-sm font-semibold text-gray-600 bg-gray-50">
        <Checkbox />
        <span>Area Name</span>
        <span>Scanned By</span>
        <span>AreaID</span>
        <span>Scanned Date</span>
        <span>Scans</span>
        <span></span>
      </div>

      {/* Table Rows */}
      {environments.map((env) => (
        <div
          key={env.id}
          onClick={() => navigate(`/environment/${env.id}`)}
          className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_1fr_40px] items-center px-4 py-3 border-b text-sm hover:bg-gray-50 cursor-pointer"
        >
          <Checkbox />
          <div>
            <div className="font-medium">{env.title}</div>
            <div className="text-xs text-gray-500">{env.location}</div>
          </div>
          <span>{env.scannedBy.name ?? env.scannedBy.email}</span>
          <span>{env.id}</span>
          <span>
            {new Date(env.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </span>
          <span>{env.scans.length}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: hook up delete if you want
              console.log('delete', env.id);
            }}
          >
            <Trash2 className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      ))}

      {/* Pagination (keep or replace) */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 text-sm text-gray-600">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <span>
          Page {/* you can wire this up to real pagination later */}1 of{' '}
          {Math.ceil(environments.length / 10)}
        </span>
        <Button variant="outline" size="sm" disabled>
          Next
        </Button>
      </div>
    </div>
  );
}
