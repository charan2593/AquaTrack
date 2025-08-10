import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ShoppingCart, DollarSign, Calendar, TrendingUp } from "lucide-react";

export default function PurifierPurchases() {
  const { data: purchases, isLoading } = useQuery({
    queryKey: ["/api/purifier-purchases"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const calculateStats = () => {
    if (!purchases) return { total: 0, revenue: 0, thisMonth: 0, growth: 0 };
    
    const total = purchases.length;
    const revenue = purchases.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0);
    const currentMonth = new Date().getMonth();
    const thisMonth = purchases.filter((p: any) => 
      new Date(p.purchaseDate).getMonth() === currentMonth
    ).length;
    
    return {
      total,
      revenue: Math.round(revenue / 100000 * 10) / 10, // Convert to lakhs
      thisMonth,
      growth: 15 // Mock growth percentage
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
    <div className="p-6" data-testid="purifier-purchases-page">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Purifier Purchases
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage all purifier sales and customer purchases
          </p>
        </div>
        <Button className="bg-primary hover:bg-secondary text-white" data-testid="button-add-purchase">
          <Plus className="mr-2 h-4 w-4" />
          Add Purchase
        </Button>
      </div>

      {/* Purchase Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="card-hover" data-testid="card-total-purchases">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Purchases</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100" data-testid="text-total-purchases">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover" data-testid="card-total-revenue">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100" data-testid="text-total-revenue">
                  ₹{stats.revenue}L
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover" data-testid="card-this-month">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">This Month</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100" data-testid="text-this-month">
                  {stats.thisMonth}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover" data-testid="card-growth">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Growth</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100" data-testid="text-growth">
                  +{stats.growth}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchases Table */}
      <Card data-testid="purchases-table">
        <CardHeader>
          <CardTitle>Recent Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          {!purchases || purchases.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400" data-testid="empty-purchases">
              <ShoppingCart className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No purchases recorded</p>
              <p className="text-sm">Add your first purchase to get started</p>
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
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
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
                    <tr key={purchase.id} data-testid={`row-purchase-${purchase.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100" data-testid={`text-customer-${purchase.id}`}>
                          Customer ID: {purchase.customerId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100" data-testid={`text-product-${purchase.id}`}>
                          {purchase.productName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400" data-testid={`text-model-${purchase.id}`}>
                          Model: {purchase.modelNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100" data-testid={`text-amount-${purchase.id}`}>
                          ₹{purchase.amount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100" data-testid={`text-date-${purchase.id}`}>
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
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
                        <Button variant="ghost" size="sm" data-testid={`button-invoice-${purchase.id}`}>
                          Invoice
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
