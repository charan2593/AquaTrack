import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Droplets,
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  ShoppingCart,
  FileText,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Sidebar() {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  // Set default collapsed state based on screen size
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
      setIsMobileOpen(false);
    }
  }, [isMobile]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      testId: "nav-dashboard"
    },
    {
      title: "Service Management",
      items: [
        {
          title: "Customers List",
          href: "/customers",
          icon: Users,
          testId: "nav-customers"
        },
        {
          title: "Today's Services",
          href: "/todays-services",
          icon: Calendar,
          testId: "nav-todays-services"
        },
        {
          title: "Rent Dues",
          href: "/rent-dues",
          icon: DollarSign,
          testId: "nav-rent-dues"
        },
        {
          title: "Purifier Purchases",
          href: "/purifier-purchases",
          icon: ShoppingCart,
          testId: "nav-purifier-purchases"
        },
        {
          title: "AMC Purchases",
          href: "/amc-purchases",
          icon: FileText,
          testId: "nav-amc-purchases"
        }
      ]
    },
    {
      title: "Inventory",
      items: [
        {
          title: "Inventory Dashboard",
          href: "/inventory",
          icon: Package,
          testId: "nav-inventory"
        }
      ]
    }
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  // Determine sidebar visibility and width
  const sidebarWidth = isCollapsed ? "w-16" : "w-64";
  const showSidebar = isMobile ? isMobileOpen : true;
  const sidebarTransform = isMobile && !isMobileOpen ? "-translate-x-full" : "translate-x-0";

  return (
    <>
      {/* Mobile toggle button - always visible on mobile */}
      {isMobile && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 shadow-md lg:hidden"
          data-testid="button-mobile-toggle"
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}

      {/* Mobile overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 ease-in-out",
        sidebarWidth,
        sidebarTransform
      )} data-testid="sidebar">
        {/* Desktop toggle button */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="absolute top-4 -right-3 bg-white dark:bg-gray-800 border shadow-sm hover:shadow-md"
            data-testid="button-toggle-sidebar"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}

        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={cn(
            "flex items-center h-16 px-4 bg-primary",
            isCollapsed && !isMobile ? "justify-center" : "justify-start"
          )}>
            <div className="flex items-center">
              <Droplets className="text-white h-8 w-8 flex-shrink-0" />
              {(!isCollapsed || isMobile) && (
                <span className="ml-3 text-xl font-bold text-white whitespace-nowrap" data-testid="text-app-name">
                  AquaFlow
                </span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.href ? (
                  // Single menu item
                  <Link href={section.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full h-12 px-3 text-left font-normal transition-all duration-200",
                        isCollapsed ? "justify-center" : "justify-start",
                        isActive(section.href) 
                          ? "bg-primary/10 text-primary border-r-2 border-primary" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                      data-testid={section.testId}
                      onClick={closeMobileSidebar}
                    >
                      <section.icon className="h-5 w-5 flex-shrink-0" />
                      {(!isCollapsed || isMobile) && (
                        <span className="ml-3 truncate">{section.title}</span>
                      )}
                    </Button>
                  </Link>
                ) : (
                  // Section with sub-items
                  <div className="space-y-1">
                    {(!isCollapsed || isMobile) && (
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {section.title}
                      </div>
                    )}
                    {section.items?.map((item, itemIndex) => (
                      <Link key={itemIndex} href={item.href}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full h-12 px-3 text-left font-normal transition-all duration-200",
                            isCollapsed ? "justify-center" : "justify-start",
                            isActive(item.href) 
                              ? "bg-primary/10 text-primary border-r-2 border-primary" 
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          )}
                          data-testid={item.testId}
                          onClick={closeMobileSidebar}
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          {(!isCollapsed || isMobile) && (
                            <span className="ml-3 truncate">{item.title}</span>
                          )}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {(!isCollapsed || isMobile) && (
              <div className="flex items-center mb-3">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate" data-testid="text-user-name">
                    {user?.firstName || user?.email || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate" data-testid="text-user-role">
                    {user?.role || 'User'}
                  </p>
                </div>
              </div>
            )}
            
            {/* Collapsed user avatar */}
            {isCollapsed && !isMobile && (
              <div className="flex justify-center mb-3">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
            )}
            
            <Button
              onClick={handleLogout}
              variant="ghost"
              className={cn(
                "w-full h-10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200",
                isCollapsed && !isMobile ? "justify-center px-2" : "justify-start"
              )}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {(!isCollapsed || isMobile) && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Spacer for main content - only on desktop */}
      {!isMobile && (
        <div className={cn(
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "ml-16" : "ml-64"
        )} />
      )}
    </>
  );
}
