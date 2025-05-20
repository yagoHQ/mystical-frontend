// src/pages/MarkingDetails.tsx
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMarkingById } from '@/api/marking.api';

interface Comment {
  id: string;
  comment: string;
  user: {
    name: string;
  };
  createdAt: string;
}

export default function MarkingDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<any>(null); // Adjust type as needed

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const marking = await getMarkingById(id);
        setComments(marking.comments || []);
        setMarking(marking);
        console.log('Marking:', marking);
      } catch (err) {
        console.error('Error fetching marking:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="space-y-6 p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-full px-6 py-3 shadow-lg text-2xl font-semibold">
        {marking?.environment?.title || 'Environment Details'}
      </div>

      <div className="rounded-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-medium">Assign To:</span>
          <span className="font-semibold">{marking?.createdBy?.name}</span>
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

      <div className="bg-white rounded-full px-6 py-3 shadow-lg text-xl font-semibold">
        {marking?.remark || 'Marking Details'}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <span className="text-sm text-gray-600">
            {comments.length} row(s) found
          </span>
        </div>

        <div className="w-full sm:w-80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input type="text" placeholder="Search" className="pl-10" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_40px] items-center px-4 py-3 border-b text-sm font-semibold text-gray-600 bg-gray-50">
          <div>Comment</div>
          <div>Comment By</div>
          <div>Timestamp</div>
          <div>Actions</div>
        </div>

        {/* Table Rows */}
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : comments.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No comments available
          </div>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-[2fr_1fr_1fr_40px] items-center px-4 py-3 border-b text-sm hover:bg-gray-50 cursor-pointer"
            >
              <div className="font-medium">{c.comment}</div>
              <div className="text-xs text-gray-500">
                {c.user?.name || 'Unknown'}
              </div>
              <div>
                {new Intl.DateTimeFormat('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(new Date(c.createdAt))}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // delete handler
                }}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}

        {/* Pagination Placeholder */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 text-sm text-gray-600">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <span>Page 1 of 1</span>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
