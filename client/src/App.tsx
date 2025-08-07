import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Customers from "@/pages/customers";
import TodaysServices from "@/pages/todays-services";
import RentDues from "@/pages/rent-dues";
import PurifierPurchases from "@/pages/purifier-purchases";
import AmcPurchases from "@/pages/amc-purchases";
import Inventory from "@/pages/inventory";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="flex-1">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/customers" component={Customers} />
            <Route path="/todays-services" component={TodaysServices} />
            <Route path="/rent-dues" component={RentDues} />
            <Route path="/purifier-purchases" component={PurifierPurchases} />
            <Route path="/amc-purchases" component={AmcPurchases} />
            <Route path="/inventory" component={Inventory} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
