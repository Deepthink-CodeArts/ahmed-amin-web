import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  FileText, 
  // Plane, // Commented out for now
  Map, 
  Home, 
  MessageSquare, 
  Settings,
  LogOut,
  Palette,
  FileCheck // Using FileCheck instead of Passport
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CMSSidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const CMSSidebar: React.FC<CMSSidebarProps> = ({ activeModule, onModuleChange }) => {
  const { user, signOut, hasRole, isAdmin } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['all'] },
    { id: 'site-management', label: 'Site Management', icon: Palette, roles: ['moderator', 'super_admin'] },
    { id: 'blog', label: 'Content Management', icon: FileText, roles: ['moderator', 'super_admin'] },
    { id: 'contacts', label: 'Contact Forms', icon: MessageSquare, roles: ['moderator', 'super_admin'] },
    { id: 'staff', label: 'Staff Management', icon: Settings, roles: ['super_admin'] },
  ];

  const canAccess = (roles: string[]) => {
    if (roles.includes('all')) return true;
    if (isAdmin()) return true;
    return roles.some(role => hasRole(role));
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gradient">Admin Panel</h2>
        <p className="text-sm text-gray-600 mt-1">{user?.full_name}</p>
        <span className="inline-block px-2 py-1 bg-aro-teal/10 text-aro-teal text-xs rounded-full mt-2">
          {user?.role?.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            if (!canAccess(item.roles)) return null;
            
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={activeModule === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeModule === item.id 
                      ? 'bg-aro-teal text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => onModuleChange(item.id)}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:bg-red-50"
          onClick={signOut}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default CMSSidebar;
