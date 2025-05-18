import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';

export default function ScannedEnvironmentHeader() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-full px-6 py-3 shadow-lg text-2xl font-semibold">
        Scanned Environment
      </div>

      {/* Controls Section */}
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
    </div>
  );
}
