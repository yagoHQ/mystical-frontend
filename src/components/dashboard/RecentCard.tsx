import * as React from 'react';

interface RecentItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
}

interface RecentCardProps {
  title: string;
  items?: RecentItem[];
}

export const RecentCard: React.FC<RecentCardProps> = ({
  title,
  items = [],
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full min-h-[200px] flex flex-col">
      <h2 className="text-lg font-semibold mb-6">{title}</h2>

      {items.length === 0 ? (
        <p className="text-gray-400 text-sm text-center mt-auto mb-auto">
          There are no action items assigned.
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="text-sm">
              <div className="font-medium">{item.title}</div>
              {item.subtitle && (
                <div className="text-gray-500">{item.subtitle}</div>
              )}
              {item.date && (
                <div className="text-gray-400 text-xs">{item.date}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
