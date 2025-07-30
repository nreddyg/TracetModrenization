
import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Home, Save, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface PaymentFormData {
  customerName: string;
  productName: string;
  orderValue: string;
  paymentMode: string;
  bankName: string;
  chequeNo: string;
  chequeDate: Date | undefined;
  amount: string;
  currency: string;
  currencyAmount: string;
  subscriptionType: string;
  subscriptionFromDate: Date | undefined;
  subscriptionToDate: Date | undefined;
  subscriptionPaidDate: Date | undefined;
  subscriptionExpiryDate: Date | undefined;
  noOfCountDetails: string;
  perAdditionalCountCost: string;
  overUsageCount: string;
  remarks: string;
}

const PaymentDetails = () => {
  const form = useForm<PaymentFormData>({
    defaultValues: {
      customerName: 'Keerthi',
      productName: 'Udyog',
      orderValue: '637.00',
      paymentMode: '',
      bankName: '',
      chequeNo: '',
      chequeDate: undefined,
      amount: '',
      currency: '',
      currencyAmount: '',
      subscriptionType: '',
      subscriptionFromDate: undefined,
      subscriptionToDate: undefined,
      subscriptionPaidDate: undefined,
      subscriptionExpiryDate: undefined,
      noOfCountDetails: '0',
      perAdditionalCountCost: '',
      overUsageCount: '0',
      remarks: '',
    },
  });

  const onSubmit = (data: PaymentFormData) => {
    console.log('Form submitted:', data);
  };

  const handleClear = () => {
    form.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <span>/</span>
            <Link to="/service-desk" className="hover:text-blue-600 transition-colors">Service Desk</Link>
            <span>/</span>
            <Link to="/service-desk/subscription" className="hover:text-blue-600 transition-colors">Subscription</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Payment Details</span>
          </nav>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Details</h1>
            <p className="text-gray-600 mt-1">Manage subscription payment information</p>
          </div>
          <Button 
            size="sm" 
            className="bg-orange-500 hover:bg-orange-600"
          >
            New Service Request
          </Button>
        </div>

        {/* Payment Form */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Customer Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Customer Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-gray-200 bg-gray-50" readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="productName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Product Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-gray-200 bg-gray-50" readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="orderValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Order Value</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-gray-200 bg-gray-50" readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Payment Section */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-orange-600 font-semibold mb-4">Payment</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FormField
                      control={form.control}
                      name="paymentMode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Payment Mode*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Cheque" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cheque">Cheque</SelectItem>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="online">Online</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Bank Name*</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter Bank Name" className="border-gray-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="chequeNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Cheque No*</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter Cheque Number" className="border-gray-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="chequeDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Cheque Date*</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal border-gray-200",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>Select Cheque Date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Amount</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter Amount" className="border-gray-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Currency*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="India-Rupees" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="inr">India-Rupees</SelectItem>
                              <SelectItem value="usd">USD</SelectItem>
                              <SelectItem value="eur">EUR</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="currencyAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Currency Amount</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter Currency Amount" className="border-gray-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Subscription Details */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-orange-600 font-semibold mb-4">Subscription Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <FormField
                      control={form.control}
                      name="subscriptionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Type*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Monthly" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="annual">Annual</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subscriptionFromDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Subscription From Date*</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal border-gray-200",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>08/07/2025</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subscriptionToDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Subscription To Date*</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal border-gray-200",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>07/10/2025</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subscriptionPaidDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Subscription Paid Date*</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal border-gray-200",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>Select AMC Paid Date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subscriptionExpiryDate"
                    render={({ field }) => (
                      <FormItem className="w-full md:w-1/4">
                        <FormLabel className="text-sm font-medium">Subscription Expiry Date*</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal border-gray-200",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>07/10/2025</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* API Details */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-orange-600 font-semibold mb-4">API Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <FormField
                      control={form.control}
                      name="noOfCountDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">No Of Count Details</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-gray-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="perAdditionalCountCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Per Additional Count Cost</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter Per API Cost" className="border-gray-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="overUsageCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Over Usage Count</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-gray-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Remark</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter Remarks" className="border-gray-200" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleClear}
                    className="border-orange-500 text-orange-500 hover:bg-orange-50"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentDetails;
