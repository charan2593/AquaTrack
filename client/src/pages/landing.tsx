import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Droplets } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 winter-gradient">
      <div className="max-w-md w-full space-y-8">
        <Card className="shadow-xl">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <Droplets className="text-white text-2xl h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">AquaFlow</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Water Purifier Service Management
              </p>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Sign in to access your dashboard and manage water purifier services, inventory, and customer data.
              </p>
            </div>
            
            <div className="mt-8">
              <Button 
                onClick={handleLogin}
                className="w-full bg-primary hover:bg-secondary text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                data-testid="button-login"
              >
                <Droplets className="mr-2 h-4 w-4" />
                Sign in
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Secure authentication powered by Replit
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
