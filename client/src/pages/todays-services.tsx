import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock } from "lucide-react";
import ServiceDistributionChart from "@/components/charts/service-distribution-chart";

export default function TodaysServices() {
  const { data: services, isLoading } = useQuery({
    queryKey: ["/api/services/today"],
  });

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'rental': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'amc': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const rentalServices = services?.filter((s: any) => s.serviceType === 'rental') || [];
  const amcServices = services?.filter((s: any) => s.serviceType === 'amc') || [];

  return (
    <div className="p-6" data-testid="todays-services-page">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Today's Services
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track all services scheduled for today
          </p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-primary hover:bg-secondary text-white" data-testid="button-schedule-service">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Service
          </Button>
          <Button variant="outline" data-testid="button-view-calendar">
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
        </div>
      </div>

      {/* Service Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card data-testid="chart-service-distribution">
          <CardHeader>
            <CardTitle>Service Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceDistributionChart 
              rentalCount={rentalServices.length} 
              amcCount={amcServices.length} 
            />
          </CardContent>
        </Card>
        
        <Card className="col-span-2" data-testid="service-stats-summary">
          <CardHeader>
            <CardTitle>Today's Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100" data-testid="text-total-services-today">
                  {services?.length || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Services</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400" data-testid="text-rental-services-today">
                  {rentalServices.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rental Services</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400" data-testid="text-amc-services-today">
                  {amcServices.length}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">AMC Services</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service List */}
      <Card data-testid="services-list">
        <CardHeader>
          <CardTitle>Scheduled Services</CardTitle>
        </CardHeader>
        <CardContent>
          {!services || services.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400" data-testid="empty-services">
              <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No services scheduled for today</p>
              <p className="text-sm">Schedule services to see them appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service: any) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  data-testid={`service-item-${service.id}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      service.status === 'completed' ? 'bg-green-500' :
                      service.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100" data-testid={`text-service-customer-${service.id}`}>
                        Customer ID: {service.customerId}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400" data-testid={`text-service-notes-${service.id}`}>
                        {service.notes || 'No notes available'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={getServiceTypeColor(service.serviceType)} data-testid={`badge-service-type-${service.id}`}>
                      {service.serviceType.charAt(0).toUpperCase() + service.serviceType.slice(1)} Service
                    </Badge>
                    <Badge className={getStatusColor(service.status)} data-testid={`badge-service-status-${service.id}`}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400" data-testid={`text-service-time-${service.id}`}>
                      {service.scheduledTime}
                    </span>
                    <Button variant="ghost" size="sm" data-testid={`button-view-service-${service.id}`}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
