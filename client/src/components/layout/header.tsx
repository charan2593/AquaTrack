import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Calendar, Activity } from "lucide-react";

export default function Header() {
  const { user } = useAuth();

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700" data-testid="header">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100" data-testid="text-page-title">
              Dashboard Overview
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, {user?.firstName || user?.email || 'User'}
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Current Date */}
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="mr-2 h-4 w-4" />
              <span data-testid="text-current-date">{getCurrentDate()}</span>
            </div>
            
            {/* Divider */}
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            
            {/* System Status */}
            <div className="flex items-center">
              <div className="flex items-center text-sm">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-green-600 dark:text-green-400 font-medium" data-testid="text-system-status">
                  System Online
                </span>
              </div>
            </div>

            {/* User Role Badge */}
            {user?.role && (
              <>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                <Badge variant="outline" className="capitalize" data-testid="badge-user-role">
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
