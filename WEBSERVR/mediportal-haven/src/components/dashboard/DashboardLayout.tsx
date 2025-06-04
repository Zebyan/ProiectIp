
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from "@/hooks/use-toast";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in with consistent token names
    const token = localStorage.getItem('token');
    const authToken = localStorage.getItem('authToken'); 
    const tokenType = localStorage.getItem('tokenType');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Either token should be valid
    const hasValidToken = !!token || !!authToken;
    
    console.log("Authentication check:", {
      token: token ? `${token.substring(0, 10)}... (${token.length} chars)` : 'Not found',
      authToken: authToken ? `${authToken.substring(0, 10)}... (${authToken.length} chars)` : 'Not found',
      tokenType: tokenType || 'Not found',
      isLoggedIn: isLoggedIn,
      hasValidToken: hasValidToken
    });
    
    if (!isLoggedIn || !hasValidToken) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to access this page",
      });
      navigate('/login');
    } else {
      // Ensure both token keys exist if one exists
      if (token && !authToken) {
        localStorage.setItem('authToken', token);
      } else if (authToken && !token) {
        localStorage.setItem('token', authToken);
      }
      
      // Ensure token type exists
      if (!tokenType) {
        localStorage.setItem('tokenType', 'Bearer');
      }
    }
  }, [navigate, toast]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setIsSidebarOpen(false)}>
          <div className="h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar isMobile onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
