import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarContextType {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  closeMobileSidebar: () => void;
  getSidebarWidth: () => string;
  getMainContentMargin: () => string;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Set default collapsed state based on screen size
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
      setIsMobileOpen(false);
    }
  }, [isMobile]);

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

  const getSidebarWidth = () => {
    if (isMobile) {
      return "w-64"; // Full width on mobile
    }
    return isCollapsed ? "w-16" : "w-64";
  };

  const getMainContentMargin = () => {
    if (isMobile) {
      return "ml-0"; // No margin on mobile
    }
    return isCollapsed ? "ml-16" : "ml-64";
  };

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobileOpen,
        isMobile,
        toggleSidebar,
        closeMobileSidebar,
        getSidebarWidth,
        getMainContentMargin,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}