import { MapPin, Users, MessageSquare } from 'lucide-react';
import { StatCard } from './StatCard';
import { RecentCard } from './RecentCard';

export default function Dashboard() {
  const stats = [
    {
      icon: <MapPin className="w-8 h-8" />,
      value: '2,450',
      label: 'Area Scanned',
    },
    {
      icon: <Users className="w-8 h-8" />,
      value: '1,235',
      label: 'Total Users',
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      value: '234',
      label: 'Suggestions',
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      value: '2,356',
      label: 'Area Active',
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        <RecentCard title="Recent Areas" />
        <RecentCard title="Recent Users" />
        <RecentCard title="Recent Suggestions" />
      </div>
    </div>
  );
}
