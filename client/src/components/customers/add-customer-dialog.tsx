import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertCustomerSchema, type InsertCustomer } from "@shared/schema";
import { Plus, Phone, CheckCircle } from "lucide-react";

interface AddCustomerDialogProps {
  children?: React.ReactNode;
}

export default function AddCustomerDialog({ children }: AddCustomerDialogProps) {
  const [open, setOpen] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [phoneToVerify, setPhoneToVerify] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertCustomer>({
    resolver: zodResolver(insertCustomerSchema),
    defaultValues: {
      name: "",
      phone: "",
      doorNo: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      pincode: "",
      serviceType: "Rental",
      productType: "Aqua Fresh_Type1",
      status: "Active",
    },
  });

  const createCustomerMutation = useMutation({
    mutationFn: async (customer: InsertCustomer) => {
      const response = await apiRequest("POST", "/api/customers", customer);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customers/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Customer added successfully",
      });
      setOpen(false);
      setOtpStep(false);
      form.reset();
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
        description: "Failed to add customer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateOtp = () => {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    
    // In real implementation, this would send SMS via API
    toast({
      title: "OTP Sent",
      description: `OTP sent to ${phoneToVerify}. For demo: ${otp}`,
    });
  };

  const verifyOtp = () => {
    if (otpCode === generatedOtp) {
      toast({
        title: "Phone Verified",
        description: "Phone number verified successfully",
      });
      setOtpStep(false);
      // Proceed with form submission
      const formData = form.getValues();
      createCustomerMutation.mutate(formData);
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct OTP",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: InsertCustomer) => {
    // Start OTP verification process
    setPhoneToVerify(data.phone);
    setOtpStep(true);
    generateOtp();
  };

  const handlePhoneVerification = () => {
    const phone = form.getValues("phone");
    if (phone && phone.length === 10) {
      setPhoneToVerify(phone);
      setOtpStep(true);
      generateOtp();
    } else {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-primary hover:bg-secondary text-white" data-testid="button-add-customer">
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-add-customer">
        <DialogHeader>
          <DialogTitle>
            {otpStep ? "Verify Phone Number" : "Add New Customer"}
          </DialogTitle>
        </DialogHeader>

        {otpStep ? (
          <div className="space-y-4">
            <div className="text-center">
              <Phone className="mx-auto h-12 w-12 text-primary mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We've sent a verification code to
              </p>
              <p className="font-semibold text-lg">{phoneToVerify}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  data-testid="input-otp"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOtpStep(false)}
                  className="flex-1"
                  data-testid="button-back"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={generateOtp}
                  variant="outline"
                  className="flex-1"
                  data-testid="button-resend-otp"
                >
                  Resend OTP
                </Button>
                <Button
                  type="button"
                  onClick={verifyOtp}
                  disabled={otpCode.length !== 6}
                  className="flex-1"
                  data-testid="button-verify-otp"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Customer Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer name" {...field} data-testid="input-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Mobile Number *</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input 
                            placeholder="Enter 10-digit mobile number" 
                            {...field} 
                            maxLength={10}
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePhoneVerification}
                          disabled={!field.value || field.value.length !== 10}
                          data-testid="button-verify-phone"
                        >
                          Verify
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address Fields */}
                <FormField
                  control={form.control}
                  name="doorNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Door No. *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter door number" {...field} data-testid="input-door-no" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1 *</FormLabel>
                      <FormControl>
                        <Input placeholder="Street, area" {...field} data-testid="input-address1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2 (Locality)</FormLabel>
                      <FormControl>
                        <Input placeholder="Locality, landmark" {...field} data-testid="input-address2" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} data-testid="input-city" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter state" {...field} data-testid="input-state" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter 6-digit pincode" 
                          {...field} 
                          maxLength={6}
                          data-testid="input-pincode"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Service Type */}
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-service-type">
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Rental">Rental</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="AMC">AMC</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Product Type */}
                <FormField
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-product-type">
                            <SelectValue placeholder="Select product type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Aqua Fresh_Type1">Aqua Fresh Type 1</SelectItem>
                          <SelectItem value="Fonix">Fonix</SelectItem>
                          <SelectItem value="Aqua Fresh_Type2">Aqua Fresh Type 2</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createCustomerMutation.isPending}
                  data-testid="button-submit"
                >
                  {createCustomerMutation.isPending ? "Adding..." : "Add Customer"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}