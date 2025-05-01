import * as React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-sm flex flex-col gap-4 justify-between">
      <div className="text-blue-500 text-3xl">{icon}</div>
      <div>
        <div className="text-3xl font-semibold text-black">{value}</div>
        <div className="text-gray-500 text-sm">{label}</div>
      </div>
    </div>
  );
};
