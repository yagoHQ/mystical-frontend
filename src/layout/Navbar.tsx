import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Bell } from 'lucide-react';

// This is purely a UI example – adjust styles, text, and structure as you see fit.
const Navbar = () => {
  return (
    <header className="border-b rounded-2xl bg-white h-14 flex items-center justify-between px-6">
      {/* Left Section: Avatar + User Name + Search */}
      <div className="flex items-center space-x-28">
        <div className="flex items-center space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarImage
              className="rounded-full"
              src="https://github.com/shadcn.png"
              alt="@shadcn"
            />
            <AvatarFallback>TS</AvatarFallback>
          </Avatar>

          {/* User name */}
          <h1 className="text-base font-medium whitespace-nowrap">Test User</h1>
        </div>

        {/* Search input with magnifying glass icon */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Quick search"
            className="w-48 pl-8 h-8 text-sm"
          />
          {/* Magnifying glass icon */}
          <svg
            className="absolute left-2 top-2 w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM21 21l-4.35-4.35"
            />
          </svg>
        </div>
      </div>

      {/* Right Section: Notification Icon (Bell) + Badge */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          {/* Notification badge (red dot) */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
            3
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
