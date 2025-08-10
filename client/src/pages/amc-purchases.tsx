import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, DollarSign, Clock, Percent } from "lucide-react";

export default function AmcPurchases() {
  const { data: purchases, isLoading } = useQuery({
    queryKey: ["/api/amc-purchases"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'expired': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  const calculateStats = () => {
    if (!purchases) return { active: 0, revenue: 0, expiringSoon: 0, renewalRate: 0 };
    
    const active = purchases.filter((p: any) => p.status === 'active').length;
    const revenue = purchases.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0);
    const expiringSoon = purchases.filter((p: any) => {
      const endDate = new Date(p.endDate);
      const today = new Date();
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    }).length;
    
    return {
      active,
      revenue: Math.round(revenue / 100000 * 10) / 10, // Convert to lakhs
      expiringSoon,
      renewalRate: 85 // Mock renewal rate
    };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" data-testid="amc-purchases-page">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            AMC Purchases
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage Annual Maintenance Contracts and track renewals
          </p>
        </div>
        <Button className="bg-primary hover:bg-secondary text-white" data-testid="button-add-amc">
          <Plus className="mr-2 h-4 w-4" />
          Add AMC
        </Button>
      </div>

      {/* AMC Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="card-hover" data-testid="card-active-amcs">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active AMCs</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100" data-testid="text-active-amcs">
                  {stats.active}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover" data-testid="card-amc-revenue">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">AMC Revenue</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100" data-testid="text-amc-revenue">
                  ₹{stats.revenue}L
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover" data-testid="card-expiring-soon">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expiring Soon</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100" data-testid="text-expiring-soon">
                  {stats.expiringSoon}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover" data-testid="card-renewal-rate">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Percent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Renewal Rate</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100" data-testid="text-renewal-rate">
                  {stats.renewalRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AMC Table */}
      <Card data-testid="amc-contracts-table">
        <CardHeader>
          <CardTitle>AMC Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          {!purchases || purchases.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400" data-testid="empty-amc-purchases">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No AMC contracts found</p>
              <p className="text-sm">Add your first AMC contract to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {purchases.map((purchase: any) => (
                    <tr key={purchase.id} data-testid={`row-amc-${purchase.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100" data-testid={`text-customer-${purchase.id}`}>
                          Customer ID: {purchase.customerId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100" data-testid={`text-plan-${purchase.id}`}>
                          {purchase.planName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400" data-testid={`text-services-${purchase.id}`}>
                          {purchase.servicesPerYear} services/year
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100" data-testid={`text-amount-${purchase.id}`}>
                          ₹{purchase.amount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100" data-testid={`text-start-date-${purchase.id}`}>
                          {new Date(purchase.startDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100" data-testid={`text-end-date-${purchase.id}`}>
                          {new Date(purchase.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(purchase.status)} data-testid={`badge-status-${purchase.id}`}>
                          {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button variant="ghost" size="sm" data-testid={`button-view-${purchase.id}`}>
                          View
                        </Button>
                        <Button variant="ghost" size="sm" data-testid={`button-renew-${purchase.id}`}>
                          Renew
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
