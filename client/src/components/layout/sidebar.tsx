import { useState } from "react";
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
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
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

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 shadow-lg sidebar-transition",
        isCollapsed ? "w-16" : "w-64"
      )} data-testid="sidebar">
        {/* Toggle button for mobile */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="absolute top-4 -right-12 lg:hidden bg-white dark:bg-gray-800 shadow-md"
          data-testid="button-toggle-sidebar"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>

        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-primary">
            <div className="flex items-center">
              <Droplets className="text-white text-2xl h-8 w-8" />
              {!isCollapsed && (
                <span className="ml-3 text-xl font-bold text-white" data-testid="text-app-name">
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
                    <a
                      className={cn(
                        "nav-item w-full justify-start",
                        isActive(section.href) && "active"
                      )}
                      data-testid={section.testId}
                    >
                      <section.icon className="h-5 w-5" />
                      {!isCollapsed && <span className="ml-3">{section.title}</span>}
                    </a>
                  </Link>
                ) : (
                  // Section with sub-items
                  <div>
                    {!isCollapsed && (
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {section.title}
                      </div>
                    )}
                    {section.items?.map((item, itemIndex) => (
                      <Link key={itemIndex} href={item.href}>
                        <a
                          className={cn(
                            "nav-item w-full justify-start",
                            isActive(item.href) && "active"
                          )}
                          data-testid={item.testId}
                        >
                          <item.icon className="h-5 w-5" />
                          {!isCollapsed && <span className="ml-3">{item.title}</span>}
                        </a>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {!isCollapsed && (
              <div className="flex items-center mb-3">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300" data-testid="text-user-name">
                    {user?.firstName || user?.email || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400" data-testid="text-user-role">
                    {user?.role || 'User'}
                  </p>
                </div>
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="ghost"
              className={cn(
                "w-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                isCollapsed ? "justify-center px-2" : "justify-start"
              )}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Spacer for main content */}
      <div className={cn("transition-all duration-300", isCollapsed ? "ml-16" : "ml-64")} />
    </>
  );
}
