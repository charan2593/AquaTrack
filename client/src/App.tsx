import { Switch, Route, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import Dashboard from "@/pages/dashboard";
import AuthPage from "@/pages/auth-page";
import { useEffect } from "react";

function App() {
  const { user, isLoading } = useAuth();
  const [location, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!user && location !== "/auth") {
        navigate("/auth");
      } else if (user && location === "/auth") {
        navigate("/");
      }
    }
  }, [user, isLoading, location, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/auth" component={AuthPage} />
      <Route component={() => <div>Not Found</div>} />
    </Switch>
  );
}

export default App;