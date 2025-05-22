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

       
      </div>

      {/* Right Section: Notification Icon (Bell) + Badge */}
     
    </header>
  );
};

export default Navbar;
