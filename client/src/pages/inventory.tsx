import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, Filter, Zap, Settings, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Inventory() {
  const [activeTab, setActiveTab] = useState("rental");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: inventoryItems, isLoading } = useQuery({
    queryKey: ["/api/inventory/items"],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/inventory/categories"],
  });

  const updateInventoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PUT", `/api/inventory/items/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/items"] });
      toast({
        title: "Success",
        description: "Inventory item updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update inventory item",
        variant: "destructive",
      });
    },
  });

  const getStockStatus = (quantity: number, minLevel: number = 5) => {
    if (quantity === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" };
    if (quantity <= minLevel) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" };
    return { label: "Well Stocked", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" };
  };

  const filterItemsByType = (type: string) => {
    if (!inventoryItems || !categories) return [];
    const categoryIds = categories
      .filter((cat: any) => cat.type === type)
      .map((cat: any) => cat.id);
    return inventoryItems.filter((item: any) => categoryIds.includes(item.categoryId));
  };

  const renderRentalProducts = () => {
    const rentalItems = filterItemsByType("rental");
    
    if (rentalItems.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400" data-testid="empty-rental-products">
          <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No rental products available</p>
          <p className="text-sm">Add rental products to your inventory</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rentalItems.map((item: any) => (
          <Card key={item.id} className="card-hover" data-testid={`rental-product-${item.id}`}>
            <CardContent className="p-6">
              <div className="mb-4">
                <Package className="w-12 h-12 text-primary mx-auto mb-2" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2" data-testid={`text-product-name-${item.id}`}>
                {item.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3" data-testid={`text-product-model-${item.id}`}>
                Model: {item.model || 'N/A'}
              </p>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Available</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100" data-testid={`text-available-quantity-${item.id}`}>
                    {item.quantity}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <Badge className={getStockStatus(item.quantity, item.minStockLevel).color} data-testid={`badge-stock-status-${item.id}`}>
                    {getStockStatus(item.quantity, item.minStockLevel).label}
                  </Badge>
                </div>
              </div>
              {item.rentalRate && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Rental Rate</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100" data-testid={`text-rental-rate-${item.id}`}>
                      ₹{item.rentalRate}/month
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderRetailProducts = () => {
    const retailItems = filterItemsByType("retail");
    
    if (retailItems.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400" data-testid="empty-retail-products">
          <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No retail products available</p>
          <p className="text-sm">Add retail products to your inventory</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price
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
            {retailItems.map((item: any) => (
              <tr key={item.id} data-testid={`row-retail-${item.id}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100" data-testid={`text-retail-name-${item.id}`}>
                    {item.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100" data-testid={`text-retail-model-${item.id}`}>
                  {item.model || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100" data-testid={`text-retail-stock-${item.id}`}>
                  {item.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100" data-testid={`text-retail-price-${item.id}`}>
                  {item.price ? `₹${item.price}` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={getStockStatus(item.quantity, item.minStockLevel).color} data-testid={`badge-retail-status-${item.id}`}>
                    {getStockStatus(item.quantity, item.minStockLevel).label}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button variant="ghost" size="sm" data-testid={`button-edit-retail-${item.id}`}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" data-testid={`button-reorder-retail-${item.id}`}>
                    Reorder
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderFilterTypes = () => {
    const filterItems = filterItemsByType("filters");
    
    if (filterItems.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400" data-testid="empty-filter-types">
          <Filter className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No filter types available</p>
          <p className="text-sm">Add filter types to your inventory</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filterItems.map((item: any) => (
          <Card key={item.id} className="text-center p-6" data-testid={`filter-type-${item.id}`}>
            <CardContent className="p-6">
              <Filter className="mx-auto h-8 w-8 text-blue-600 dark:text-blue-400 mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2" data-testid={`text-filter-name-${item.id}`}>
                {item.name}
              </h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1" data-testid={`text-filter-quantity-${item.id}`}>
                {item.quantity}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Units Available</p>
              <div className="mt-3">
                <Badge className={getStockStatus(item.quantity, item.minStockLevel).color} data-testid={`badge-filter-status-${item.id}`}>
                  {getStockStatus(item.quantity, item.minStockLevel).label}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderMotors = () => {
    const motorItems = filterItemsByType("motors");
    
    if (motorItems.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400" data-testid="empty-motors">
          <Settings className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No motors available</p>
          <p className="text-sm">Add motors to your inventory</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {motorItems.map((item: any) => (
          <Card key={item.id} className="p-6" data-testid={`motor-${item.id}`}>
            <CardContent className="p-6">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3" data-testid={`text-motor-name-${item.id}`}>
                {item.name}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Available</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100" data-testid={`text-motor-quantity-${item.id}`}>
                    {item.quantity}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <Badge className={getStockStatus(item.quantity, item.minStockLevel).color} data-testid={`badge-motor-status-${item.id}`}>
                    {getStockStatus(item.quantity, item.minStockLevel).label}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderUVLights = () => {
    const uvItems = filterItemsByType("uvlights");
    
    if (uvItems.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400" data-testid="empty-uv-lights">
          <Lightbulb className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No UV lights available</p>
          <p className="text-sm">Add UV lights to your inventory</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {uvItems.map((item: any) => (
          <Card key={item.id} className="text-center p-6" data-testid={`uv-light-${item.id}`}>
            <CardContent className="p-6">
              <Lightbulb className="mx-auto h-8 w-8 text-yellow-600 dark:text-yellow-400 mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2" data-testid={`text-uv-name-${item.id}`}>
                {item.name}
              </h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1" data-testid={`text-uv-quantity-${item.id}`}>
                {item.quantity}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Units Available</p>
              <div className="mt-3">
                <Badge className={getStockStatus(item.quantity, item.minStockLevel).color} data-testid={`badge-uv-status-${item.id}`}>
                  {getStockStatus(item.quantity, item.minStockLevel).label}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" data-testid="inventory-page">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Inventory Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track all inventory items across different categories
          </p>
        </div>
        <Button className="bg-primary hover:bg-secondary text-white" data-testid="button-add-stock">
          <Plus className="mr-2 h-4 w-4" />
          Add Stock
        </Button>
      </div>

      <Card className="overflow-hidden" data-testid="inventory-tabs">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <TabsList className="h-auto p-0 bg-transparent w-full justify-start">
              <TabsTrigger 
                value="rental" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-6 py-4"
                data-testid="tab-rental-products"
              >
                <Package className="mr-2 h-4 w-4" />
                Rental Products
              </TabsTrigger>
              <TabsTrigger 
                value="retail" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-6 py-4"
                data-testid="tab-retail-products"
              >
                <Package className="mr-2 h-4 w-4" />
                Retail Products
              </TabsTrigger>
              <TabsTrigger 
                value="filters" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-6 py-4"
                data-testid="tab-filter-types"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter Types
              </TabsTrigger>
              <TabsTrigger 
                value="motors" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-6 py-4"
                data-testid="tab-motors"
              >
                <Settings className="mr-2 h-4 w-4" />
                Motors
              </TabsTrigger>
              <TabsTrigger 
                value="uvlights" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-6 py-4"
                data-testid="tab-uv-lights"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                UV Lights
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="rental" className="p-6" data-testid="content-rental-products">
            {renderRentalProducts()}
          </TabsContent>

          <TabsContent value="retail" className="p-6" data-testid="content-retail-products">
            {renderRetailProducts()}
          </TabsContent>

          <TabsContent value="filters" className="p-6" data-testid="content-filter-types">
            {renderFilterTypes()}
          </TabsContent>

          <TabsContent value="motors" className="p-6" data-testid="content-motors">
            {renderMotors()}
          </TabsContent>

          <TabsContent value="uvlights" className="p-6" data-testid="content-uv-lights">
            {renderUVLights()}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
