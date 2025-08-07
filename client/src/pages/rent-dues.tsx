import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, MessageSquare, Edit, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function RentDues() {
  const [selectedDues, setSelectedDues] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rentDues, isLoading } = useQuery({
    queryKey: ["/api/rent-dues/today"],
  });

  const updateRentDueMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PUT", `/api/rent-dues/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rent-dues/today"] });
      toast({
        title: "Success",
        description: "Rent due updated successfully",
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
        description: "Failed to update rent due",
        variant: "destructive",
      });
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDues(rentDues?.map((due: any) => due.id) || []);
    } else {
      setSelectedDues([]);
    }
  };

  const handleSelectDue = (dueId: string, checked: boolean) => {
    if (checked) {
      setSelectedDues([...selectedDues, dueId]);
    } else {
      setSelectedDues(selectedDues.filter(id => id !== dueId));
    }
  };

  const handleMarkAsPaid = (dueId: string) => {
    updateRentDueMutation.mutate({
      id: dueId,
      data: { status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedDues.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select rent dues to perform bulk actions",
        variant: "destructive",
      });
      return;
    }

    // Implement bulk actions
    toast({
      title: "Feature Coming Soon",
      description: `${action} for ${selectedDues.length} selected items will be implemented`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" data-testid="rent-dues-page">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Today's Rent Dues
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage rent payments due today and perform bulk actions
          </p>
        </div>
        <Button variant="outline" data-testid="button-export-report">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Bulk Actions */}
      <Card className="mb-6" data-testid="bulk-actions">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Bulk Actions</h3>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => handleBulkAction('Send Messages')}
                disabled={selectedDues.length === 0}
                data-testid="button-bulk-send-messages"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Messages
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleBulkAction('Change Status')}
                disabled={selectedDues.length === 0}
                data-testid="button-bulk-change-status"
              >
                <Edit className="mr-2 h-4 w-4" />
                Change Status
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleBulkAction('Update Due Date')}
                disabled={selectedDues.length === 0}
                data-testid="button-bulk-update-due-date"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Update Due Date
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {selectedDues.length} item(s) selected
          </p>
        </CardContent>
      </Card>

      {/* Dues Table */}
      <Card data-testid="rent-dues-table">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pending Dues</CardTitle>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <Checkbox 
                  checked={selectedDues.length === rentDues?.length && rentDues?.length > 0}
                  onCheckedChange={handleSelectAll}
                  data-testid="checkbox-select-all"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Select All</span>
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!rentDues || rentDues.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400" data-testid="empty-rent-dues">
              <p>No rent dues for today</p>
              <p className="text-sm">Check back later or view all rent dues</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <Checkbox 
                        checked={selectedDues.length === rentDues.length}
                        onCheckedChange={handleSelectAll}
                        data-testid="checkbox-header-select-all"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Due Date
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
                  {rentDues.map((due: any) => (
                    <tr key={due.id} data-testid={`row-rent-due-${due.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Checkbox 
                          checked={selectedDues.includes(due.id)}
                          onCheckedChange={(checked) => handleSelectDue(due.id, checked as boolean)}
                          data-testid={`checkbox-select-due-${due.id}`}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100" data-testid={`text-customer-id-${due.id}`}>
                            Customer ID: {due.customerId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100" data-testid={`text-amount-${due.id}`}>
                          ₹{due.amount}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Monthly Rent</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100" data-testid={`text-due-date-${due.id}`}>
                          {new Date(due.dueDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-red-500">
                          {new Date(due.dueDate) < new Date() ? 'Overdue' : 'Due Today'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(due.status)} data-testid={`badge-status-${due.id}`}>
                          {due.status.charAt(0).toUpperCase() + due.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button variant="ghost" size="sm" data-testid={`button-message-${due.id}`}>
                          Message
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleMarkAsPaid(due.id)}
                          disabled={updateRentDueMutation.isPending || due.status === 'paid'}
                          data-testid={`button-mark-paid-${due.id}`}
                        >
                          Mark Paid
                        </Button>
                        <Button variant="ghost" size="sm" data-testid={`button-reschedule-${due.id}`}>
                          Reschedule
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
