
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

type NavbarProps = {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    // Clear session data
    localStorage.removeItem('isLoggedIn');
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of BioMedBot"
    });
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <header className="h-16 border-b bg-background flex items-center px-4 sticky top-0 z-30">
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden mr-2" 
        onClick={onMenuClick}
      >
        <Menu />
      </Button>
      
      <div className="flex-1 flex items-center">
        <h1 className="text-xl font-semibold text-medical-dark hidden md:block">
          BioMedBot Dashboard
        </h1>
      </div>
      
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 p-1 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-medical-primary text-white">AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium">Admin</span>
                <span className="text-xs text-muted-foreground">Hospital Admin</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
