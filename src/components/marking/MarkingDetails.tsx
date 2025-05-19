// src/pages/MarkingDetails.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Row {
  id: string;
  comment: string;
  commentBy: string;
  timestamp: string;
  status: 'Open' | 'Closed' | 'Pending';
  reply: string;
}

export default function MarkingDetails() {
  const navigate = useNavigate();
  // static “environment” info
  const title = 'Marking Details';
  const assignedTo = {
    name: 'Test User',
    avatarUrl: 'https://i.pravatar.cc/40?img=32',
  };
  // static table rows
  const [rows] = useState<Row[]>(
    Array.from({ length: 5 }).map((_, i) => ({
      id: String(i + 1),
      comment: 'This lamp is defective, Replace it.',
      commentBy: 'JohnDoe',
      timestamp: '2025-03-20T10:30',
      status: 'Closed',
      reply: 'Please suggest new lamps',
    }))
  );

  return (
    <div className="space-y-6 p-8 bg-gray-50 min-h-screen">
      {/* Top Bar: Title */}
      <div className="bg-white rounded-full px-6 py-3 shadow-lg text-2xl font-semibold">
        {title}
      </div>

      {/* Assign + Actions */}
      <div className="rounded-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-medium">Assign To:</span>
          <span className="font-semibold">{assignedTo.name}</span>
        </div>
        <div className="flex gap-3">
          <Button className="bg-blue-500 text-white hover:bg-blue-600">
            Save Marking
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>

      {/* Secondary Title */}
      <div className="bg-white rounded-full px-6 py-3 shadow-lg text-xl font-semibold">
        Costly Lamp
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filters & Selection Count */}
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <span className="text-sm text-gray-600">1 row selected</span>
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input type="text" placeholder="Search" className="pl-10" />
          </div>
        </div>
      </div>

      {/* Table Controls + Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        {/* Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] items-center px-4 py-3 border-b text-sm font-semibold text-gray-600 bg-gray-50">
          <div>Comments</div>
          <div>Comment By</div>
          <div>Timestamp</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* Rows */}
        {rows.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] items-center px-4 py-3 border-b text-sm hover:bg-gray-50 cursor-pointer"
          >
            <div className="font-medium">{r.comment}</div>
            <div className="text-xs text-gray-500">{r.commentBy}</div>
            <div>{new Date(r.timestamp).toLocaleString()}</div>
            <div>{r.status}</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                /* your delete handler */
              }}
              className="text-gray-400 hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 text-sm text-gray-600">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <span>Page 1 of {Math.ceil(rows.length / 10)}</span>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
