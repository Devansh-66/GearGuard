import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wrench, 
  Hammer, 
  CalendarDays, 
  BarChart3,
  LogOut,
  Users
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Wrench, label: 'Equipment', path: '/equipment' },
  { icon: Hammer, label: 'Maintenance', path: '/maintenance' },
  { icon: Users, label: 'Teams', path: '/teams' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
];

export function Sidebar() {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card text-card-foreground">
      {/* ... (keep header) */}
      <div className="flex h-16 items-center px-6 border-b">
        <h1 className="text-xl font-bold tracking-tight text-primary">GearGuard</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t">
        <button 
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
