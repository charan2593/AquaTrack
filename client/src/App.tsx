import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Customers from "@/pages/customers";
import TodaysServices from "@/pages/todays-services";
import RentDues from "@/pages/rent-dues";
import PurifierPurchases from "@/pages/purifier-purchases";
import AmcPurchases from "@/pages/amc-purchases";
import Inventory from "@/pages/inventory";
import UserManagement from "@/pages/user-management";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { cn } from "@/lib/utils";

function AuthenticatedLayout() {
  const { getMainContentMargin } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        getMainContentMargin()
      )}>
        <Header />
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/customers" component={Customers} />
            <Route path="/todays-services" component={TodaysServices} />
            <Route path="/rent-dues" component={RentDues} />
            <Route path="/purifier-purchases" component={PurifierPurchases} />
            <Route path="/amc-purchases" component={AmcPurchases} />
            <Route path="/inventory" component={Inventory} />
            <Route path="/user-management" component={UserManagement} />
            <Route path="/auth" component={AuthPage} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="/" component={AuthPage} />
        <Route component={AuthPage} />
      </Switch>
    );
  }

  return (
    <SidebarProvider>
      <AuthenticatedLayout />
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
