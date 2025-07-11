// src/components/ScannedEnvironmentTable.tsx
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  getEnvironments,
  Environment,
  Scan,
  deleteEnvironment,
  deleteScan,
} from '@/api/environment.api';
import { ConfirmDeleteModal } from '@/shared/ConfirmDeleteModal';

export default function ScannedEnvironmentTable() {
  const navigate = useNavigate();
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEnvId, setSelectedEnvId] = useState<string | null>(null);
  const [selectedEnvTitle, setSelectedEnvTitle] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'environment' | 'scan' | null>(
    null
  );
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
  const [selectedScanName, setSelectedScanName] = useState<string | null>(null);
  const [parentEnvId, setParentEnvId] = useState<string | null>(null);

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

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const onConfirmDelete = async () => {
    try {
      if (deleteType === 'environment' && selectedEnvId) {
        await deleteEnvironment(selectedEnvId);
        setEnvironments((prev) =>
          prev.filter((env) => env.id !== selectedEnvId)
        );
      }

      if (deleteType === 'scan' && selectedScanId && parentEnvId) {
        await deleteScan(selectedScanId);
        setEnvironments((prev) =>
          prev.map((env) =>
            env.id === parentEnvId
              ? {
                  ...env,
                  scans: env.scans.filter((scan) => scan.id !== selectedScanId),
                }
              : env
          )
        );
      }
    } catch (err) {
      console.error('Deletion failed:', err);
      // Optionally show a toast here
    } finally {
      // Reset modal + state
      setDeleteModalOpen(false);
      setSelectedEnvId(null);
      setSelectedEnvTitle(null);
      setSelectedScanId(null);
      setSelectedScanName(null);
      setParentEnvId(null);
      setDeleteType(null);
    }
  };

  const handleDelete = (id: string, title: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEnvId(id);
    setSelectedEnvTitle(title);
    setDeleteModalOpen(true);
    setDeleteType('environment');
  };

  const handleScanDelete =
    (scanId: string, scanName: string, envId: string) =>
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedScanId(scanId);
      setSelectedScanName(scanName);
      setParentEnvId(envId);
      setDeleteType('scan');
      setDeleteModalOpen(true);
    };

  if (loading)
    return <div className="p-6 text-center">Loading environments…</div>;
  if (error)
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[32px_2fr_1fr_1fr_1fr_1fr_40px] items-center px-4 py-3 border-b text-sm font-semibold text-gray-600 bg-gray-50">
        <span /> {/* toggle */}
        <span>Area Name</span>
        <span>Scanned By</span>
        <span>Area ID</span>
        <span>Scanned Date</span>
        <span>Number of Scans</span>
        <span /> {/* actions */}
      </div>

      {/* Rows */}
      {environments.map((env) => {
        const isOpen = expandedRows.has(env.id);
        return (
          <div key={env.id}>
            {/* main row */}
            <div
              onClick={() => navigate(`/environment/${env.id}`)}
              className="grid grid-cols-[32px_2fr_1fr_1fr_1fr_1fr_40px] items-center px-4 py-3 border-b text-sm hover:bg-gray-50 cursor-pointer"
            >
              {/* toggle icon */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRow(env.id);
                }}
              >
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </div>

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
                onClick={handleDelete(env.id, env.title)}
              >
                <Trash2 className="h-4 w-4 text-gray-500" />
              </Button>
            </div>

            {/* expanded detail panel */}
            {isOpen && (
              <div className="px-4 py-3 bg-gray-100 space-y-4">
                {env.scans.map((scan: Scan) => (
                  <div
                    key={scan.id}
                    className="border rounded p-3 bg-white space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{scan.scanName}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleScanDelete(
                          scan.id,
                          scan.scanName,
                          env.id
                        )}
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <ConfirmDeleteModal
        title={
          deleteType === 'environment'
            ? selectedEnvTitle || 'this environment'
            : selectedScanName || 'this scan'
        }
        isOpen={deleteModalOpen}
        onConfirm={onConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 text-sm text-gray-600">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <span>Page 1 of {Math.ceil(environments.length / 10)}</span>
        <Button variant="outline" size="sm" disabled>
          Next
        </Button>
      </div>
    </div>
  );
}
