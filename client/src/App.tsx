import { Switch, Route } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import Dashboard from "@/pages/dashboard";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "@/lib/protected-route";

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <Switch>
      {user ? (
        <>
          <ProtectedRoute path="/" component={Dashboard} />
          <ProtectedRoute path="/customers" component={() => <div>Customers Page</div>} />
          <ProtectedRoute path="/services" component={() => <div>Services Page</div>} />
          <ProtectedRoute path="/inventory" component={() => <div>Inventory Page</div>} />
          <ProtectedRoute path="/rent-dues" component={() => <div>Rent Dues Page</div>} />
          <ProtectedRoute path="/purchases" component={() => <div>Purchases Page</div>} />
        </>
      ) : (
        <Route path="/auth" component={AuthPage} />
      )}
      <Route component={() => <div>Not Found</div>} />
    </Switch>
  );
}

export default App;