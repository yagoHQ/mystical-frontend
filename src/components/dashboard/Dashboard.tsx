import { useEffect, useState } from 'react';
import { MapPin, Users, MessageSquare } from 'lucide-react';
import { StatCard } from './StatCard';
import { getDashboardData } from '@/api/environment.api';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    };

    fetchData();
  }, []);

  if (!dashboardData) return <div className="p-6">Loading...</div>;

  const stats = [
    {
      icon: <MapPin className="w-8 h-8" />,
      value: dashboardData.areaScanned.toLocaleString(),
      label: 'Area Scanned',
    },
    {
      icon: <Users className="w-8 h-8" />,
      value: dashboardData.totalUsers.toLocaleString(),
      label: 'Total Users',
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      value: dashboardData.totalSuggestions.toLocaleString(),
      label: 'Suggestions',
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      value: dashboardData.totalMarkings.toLocaleString(),
      label: 'Area Active',
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Data Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Areas */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Areas</h3>
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="border-b font-medium">
              <tr>
                <th className="px-2 py-2">Title</th>
                <th className="px-2 py-2">Location</th>
                <th className="px-2 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentAreas.map((area: any) => (
                <tr key={area.id} className="border-b">
                  <td className="px-2 py-2">{area.title}</td>
                  <td className="px-2 py-2">{area.location}</td>
                  <td className="px-2 py-2">
                    {new Date(area.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Markings */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Markings</h3>
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="border-b font-medium">
              <tr>
                <th className="px-2 py-2">Remark</th>
                <th className="px-2 py-2">Environment</th>
                <th className="px-2 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentMarkings.map((marking: any) => (
                <tr key={marking.id} className="border-b">
                  <td className="px-2 py-2">{marking.remark}</td>
                  <td className="px-2 py-2">{marking.environmentTitle}</td>
                  <td className="px-2 py-2">
                    {new Date(marking.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
