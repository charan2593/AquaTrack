import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, ChevronUp, ChevronDown, Edit, Trash2, Phone, MapPin } from "lucide-react";
import { type Customer } from "@shared/schema";
import EditCustomerDialog from "./edit-customer-dialog";

interface CustomersTableProps {
  customers: Customer[];
  onDeleteCustomer: (customerId: string) => void;
  isLoading?: boolean;
}

type SortField = "name" | "phone" | "city" | "serviceType" | "status" | "createdAt";
type SortDirection = "asc" | "desc";

export default function CustomersTable({ customers, onDeleteCustomer, isLoading }: CustomersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers.filter((customer) => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.doorNo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
      const matchesService = serviceFilter === "all" || customer.serviceType === serviceFilter;
      const matchesProduct = productFilter === "all" || customer.productType === productFilter;

      return matchesSearch && matchesStatus && matchesService && matchesProduct;
    });

    // Sort customers
    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "createdAt") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = aVal?.toString().toLowerCase() || "";
        bVal = bVal?.toString().toLowerCase() || "";
      }

      if (sortDirection === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [customers, searchTerm, statusFilter, serviceFilter, productFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredAndSortedCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setServiceFilter("all");
    setProductFilter("all");
    setSortField("createdAt");
    setSortDirection("desc");
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'Rental': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'AMC': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Retail': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="customers-table">
      <CardHeader>
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <CardTitle>All Customers ({filteredAndSortedCustomers.length})</CardTitle>
          
          {/* Search and Filters */}
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 w-64"
                data-testid="input-search-customers"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-32" data-testid="select-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={serviceFilter} onValueChange={(value) => {
              setServiceFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-32" data-testid="select-service-filter">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="Rental">Rental</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="AMC">AMC</SelectItem>
              </SelectContent>
            </Select>

            <Select value={productFilter} onValueChange={(value) => {
              setProductFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-40" data-testid="select-product-filter">
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="Aqua Fresh_Type1">Aqua Fresh Type 1</SelectItem>
                <SelectItem value="Fonix">Fonix</SelectItem>
                <SelectItem value="Aqua Fresh_Type2">Aqua Fresh Type 2</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={resetFilters}
              data-testid="button-reset-filters"
            >
              <Filter className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th 
                  className="text-left py-3 px-4 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleSort("name")}
                  data-testid="header-name"
                >
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    <SortIcon field="name" />
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleSort("phone")}
                  data-testid="header-phone"
                >
                  <div className="flex items-center space-x-1">
                    <span>Phone</span>
                    <SortIcon field="phone" />
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleSort("city")}
                  data-testid="header-location"
                >
                  <div className="flex items-center space-x-1">
                    <span>Location</span>
                    <SortIcon field="city" />
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleSort("serviceType")}
                  data-testid="header-service"
                >
                  <div className="flex items-center space-x-1">
                    <span>Service</span>
                    <SortIcon field="serviceType" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-medium">Product</th>
                <th 
                  className="text-left py-3 px-4 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleSort("status")}
                  data-testid="header-status"
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    <SortIcon field="status" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800" data-testid={`customer-row-${customer.id}`}>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100" data-testid={`customer-name-${customer.id}`}>
                        {customer.name}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-gray-100" data-testid={`customer-phone-${customer.id}`}>
                        {customer.phone}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400" data-testid={`customer-location-${customer.id}`}>
                        {customer.city}, {customer.state}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getServiceTypeColor(customer.serviceType)} data-testid={`customer-service-${customer.id}`}>
                      {customer.serviceType}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-600 dark:text-gray-400" data-testid={`customer-product-${customer.id}`}>
                      {customer.productType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getStatusColor(customer.status)} data-testid={`customer-status-${customer.id}`}>
                      {customer.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <EditCustomerDialog customer={customer}>
                        <Button variant="ghost" size="sm" data-testid={`button-edit-${customer.id}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </EditCustomerDialog>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onDeleteCustomer(customer.id)}
                        className="text-red-600 hover:text-red-800"
                        data-testid={`button-delete-${customer.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {paginatedCustomers.map((customer) => (
            <Card key={customer.id} className="border border-gray-200 dark:border-gray-700" data-testid={`customer-card-${customer.id}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100" data-testid={`customer-card-name-${customer.id}`}>
                      {customer.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-3 w-3" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <EditCustomerDialog customer={customer}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </EditCustomerDialog>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDeleteCustomer(customer.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-1 text-sm">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {customer.city}, {customer.state}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getServiceTypeColor(customer.serviceType)}>
                      {customer.serviceType}
                    </Badge>
                    <Badge className={getStatusColor(customer.status)}>
                      {customer.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Product: {customer.productType.replace('_', ' ')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mt-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Show</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                setItemsPerPage(parseInt(value));
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-20" data-testid="select-items-per-page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                per page. Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedCustomers.length)} of {filteredAndSortedCustomers.length} customers
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                data-testid="button-previous-page"
              >
                Previous
              </Button>
              
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                data-testid="button-next-page"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {filteredAndSortedCustomers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== "all" || serviceFilter !== "all" || productFilter !== "all"
                ? "No customers found matching your filters"
                : "No customers added yet"
              }
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}