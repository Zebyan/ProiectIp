import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, PillIcon, Users, 
  ChevronLeft, ChevronRight, HospitalIcon, UserRound 
} from 'lucide-react';

type SidebarItemProps = {
  icon: React.ElementType;
  title: string;
  path: string;
  isCollapsed: boolean;
}

const SidebarItem = ({ icon: Icon, title, path, isCollapsed }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  
  return (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive 
          ? "bg-sidebar-primary text-sidebar-primary-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isCollapsed && "justify-center py-3"
      )}
    >
      <Icon size={20} />
      {!isCollapsed && <span>{title}</span>}
    </Link>
  );
};

type SidebarProps = {
  isMobile?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isMobile, onClose }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleCollapse = () => {
    if (isMobile && onClose) {
      onClose();
      return;
    }
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Patients", icon: UserRound, path: "/dashboard/patients" },
    { title: "Medication", icon: PillIcon, path: "/dashboard/medication" },
    { title: "Users", icon: Users, path: "/dashboard/users" },
  ];

  return (
    <div className={cn(
      "h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all",
      isCollapsed ? "w-[70px]" : "w-[240px]",
      isMobile && "fixed z-40 shadow-xl"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2 text-sidebar-foreground">
            <HospitalIcon className="text-medical-primary" size={24} />
            <span className="font-bold text-lg">BioMedBot</span>
          </div>
        )}
        {isCollapsed && (
          <HospitalIcon className="text-medical-primary mx-auto" size={24} />
        )}
        
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        )}

        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronLeft size={18} />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.title}
              icon={item.icon}
              title={item.title}
              path={item.path}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
