import * as React from 'react';

interface RecentCardProps {
  title: string;
}

export const RecentCard: React.FC<RecentCardProps> = ({ title }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full min-h-[200px] flex flex-col">
      <h2 className="text-lg font-semibold mb-6">{title}</h2>
      <p className="text-gray-400 text-sm text-center mt-auto mb-auto">
        There are no action items assigned.
      </p>
    </div>
  );
};
