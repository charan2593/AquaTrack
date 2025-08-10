import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, AlertTriangle, Package } from "lucide-react";
import ServiceTrendsChart from "@/components/charts/service-trends-chart";
import CustomerStatusChart from "@/components/charts/customer-status-chart";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: customerStats, isLoading: customerStatsLoading } = useQuery({
    queryKey: ["/api/customers/stats"],
  });

  if (statsLoading || customerStatsLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" data-testid="dashboard-overview">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to your water purifier service management dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="card-hover" data-testid="card-total-customers">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Customers</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100" data-testid="text-total-customers">
                  {stats?.totalCustomers || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover" data-testid="card-todays-services">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Today's Services</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100" data-testid="text-todays-services">
                  {stats?.todaysServices || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover" data-testid="card-pending-dues">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Dues</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100" data-testid="text-pending-dues">
                  {stats?.pendingDues || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover" data-testid="card-inventory-items">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Inventory Items</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100" data-testid="text-inventory-items">
                  {stats?.inventoryItems || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card data-testid="chart-service-trends">
          <CardHeader>
            <CardTitle>Monthly Service Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceTrendsChart />
          </CardContent>
        </Card>

        <Card data-testid="chart-customer-status">
          <CardHeader>
            <CardTitle>Customer Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerStatusChart data={customerStats} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card data-testid="recent-activities">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No recent activities to display</p>
              <p className="text-sm">Activities will appear here when services are completed or updates are made</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
