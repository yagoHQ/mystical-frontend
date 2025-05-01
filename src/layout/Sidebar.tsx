import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Grid, ClipboardList, Settings as SettingsIcon } from 'lucide-react';

export default function Sidebar() {
  const { pathname } = useLocation();

  const links = [
    {
      label: 'Dashboard',
      icon: <Grid className="h-5 w-5" />,
      to: '/dashboard',
    },
    {
      label: 'Scan Environment',
      icon: <ClipboardList className="h-5 w-5" />,
      to: '/environment',
    },
    {
      label: 'Settings',
      icon: <SettingsIcon className="h-5 w-5" />,
      to: '/settings',
    },
  ];

  return (
    <aside className="w-64 bg-white p-4 shadow-sm rounded-md mx-4 my-4">
      <nav className="space-y-2">
        {links.map(({ label, icon, to }) => {
          const isActive = pathname === to;

          return (
            <Link to={to} key={to} className="block">
              <Button
                variant="ghost"
                className={`w-full flex items-center justify-start ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-800 hover:bg-gray-100'
                }`}
              >
                <span
                  className={`mr-2 ${isActive ? 'text-blue-600' : 'text-gray-600'}`}
                >
                  {icon}
                </span>
                {label}
              </Button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
