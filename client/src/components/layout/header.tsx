import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Activity, Menu } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

export default function Header() {
  const { user } = useAuth();
  const { isMobile, toggleSidebar } = useSidebar();

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700" data-testid="header">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden"
                data-testid="button-mobile-menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-gray-100" data-testid="text-page-title">
                Dashboard Overview
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
                Welcome back, {user?.firstName || user?.email || 'User'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 lg:space-x-6">
            {/* Current Date - Hidden on small screens */}
            <div className="hidden md:flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="mr-2 h-4 w-4" />
              <span data-testid="text-current-date">{getCurrentDate()}</span>
            </div>
            
            {/* Divider - Hidden on small screens */}
            <div className="hidden md:block h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            
            {/* System Status */}
            <div className="flex items-center">
              <div className="flex items-center text-sm">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-green-600 dark:text-green-400 font-medium hidden sm:inline" data-testid="text-system-status">
                  System Online
                </span>
                <span className="text-green-600 dark:text-green-400 font-medium sm:hidden" data-testid="text-system-status-mobile">
                  Online
                </span>
              </div>
            </div>

            {/* User Role Badge */}
            {user?.role && (
              <>
                <div className="hidden sm:block h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                <Badge variant="outline" className="capitalize hidden sm:inline-flex" data-testid="badge-user-role">
                  {user.role}
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
