import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Home, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const CreateWorkOrder = () => {
  const form = useForm({
    defaultValues: {
      workOrderTitle: '',
      workOrderType: '',
      priority: '',
      visitedDate: '',
      visitedTime: '',
      startDate: '',
      startTime: '',
      totalDuration: '',
      serviceRequest: '',
      asset: '',
      serviceEngineer: '',
      intimationDate: '',
      intimationTime: '',
      breakdownDuration: ''
    }
  });

  const onSubmit = (data: any) => {
    console.log('Work Order Data:', data);
  };

  const handleClear = () => {
    form.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-3 shadow-sm">
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
            <span className="text-gray-900 font-medium">Create Work Order</span>
          </nav>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* First Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="workOrderTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Work Order Title <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Work Order Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workOrderType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Work Order Type <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <ReusableDropdown
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Work Order Type"
                            options={[
                              { value: 'maintenance', label: 'Maintenance' },
                              { value: 'repair', label: 'Repair' },
                              { value: 'installation', label: 'Installation' },
                              { value: 'inspection', label: 'Inspection' }
                            ]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Priority <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <ReusableDropdown
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select Priority"
                            
                            options={[
                              { value: 'low', label: 'Low' },
                              { value: 'medium', label: 'Medium' },
                              { value: 'high', label: 'High' },
                              { value: 'critical', label: 'Critical' }
                            ]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="visitedDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Visited Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type="date" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="visitedTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium invisible">Time</FormLabel>
                          <FormControl>
                            <Input type="time" placeholder="HH:MM" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Start Date <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium invisible">Time</FormLabel>
                          <FormControl>
                            <Input type="time" placeholder="HH:MM" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="totalDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Total Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="HH:MM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Third Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="serviceRequest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Service Request</FormLabel>
                        <FormControl>
                          <ReusableDropdown
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select Service Request"
                            showSearch
                            options={[
                              { value: 'sr001', label: 'SR001 - Hardware Issue' },
                              { value: 'sr002', label: 'SR002 - Software Problem' },
                              { value: 'sr003', label: 'SR003 - Network Issue' }
                            ]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="asset"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Asset <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input placeholder="Select Asset Code" {...field} />
                          </FormControl>
                          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="serviceEngineer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Service Engineer</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter The Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Fourth Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="intimationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Intimation Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="intimationTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium invisible">Time</FormLabel>
                          <FormControl>
                            <Input type="time" placeholder="HH:MM" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="breakdownDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Breakdown Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="--:-- --" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div></div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6">
                  <Button type="button" variant="outline" onClick={handleClear}>
                    Clear
                  </Button>
                  <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="asset" className="w-full">
              <TabsList className="grid w-full grid-cols-9 rounded-none border-b">
                <TabsTrigger value="asset" className="text-orange-600 border-b-2 border-orange-600">Asset</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="parts">Parts</TabsTrigger>
                <TabsTrigger value="people">People</TabsTrigger>
                <TabsTrigger value="service-centers">Service Centers</TabsTrigger>
                <TabsTrigger value="asset-replacement">Asset Replacement</TabsTrigger>
                <TabsTrigger value="calibration">Calibration</TabsTrigger>
                <TabsTrigger value="penalty">Penalty</TabsTrigger>
                <TabsTrigger value="costs">Costs</TabsTrigger>
              </TabsList>
              <TabsContent value="asset" className="p-6">
                <p className="text-gray-600">Asset details not available</p>
              </TabsContent>
              <TabsContent value="instructions" className="p-6">
                <p className="text-gray-600">Instructions will be displayed here</p>
              </TabsContent>
              <TabsContent value="tasks" className="p-6">
                <p className="text-gray-600">Tasks will be displayed here</p>
              </TabsContent>
              <TabsContent value="parts" className="p-6">
                <p className="text-gray-600">Parts information will be displayed here</p>
              </TabsContent>
              <TabsContent value="people" className="p-6">
                <p className="text-gray-600">People assignments will be displayed here</p>
              </TabsContent>
              <TabsContent value="service-centers" className="p-6">
                <p className="text-gray-600">Service centers information will be displayed here</p>
              </TabsContent>
              <TabsContent value="asset-replacement" className="p-6">
                <p className="text-gray-600">Asset replacement details will be displayed here</p>
              </TabsContent>
              <TabsContent value="calibration" className="p-6">
                <p className="text-gray-600">Calibration information will be displayed here</p>
              </TabsContent>
              <TabsContent value="penalty" className="p-6">
                <p className="text-gray-600">Penalty details will be displayed here</p>
              </TabsContent>
              <TabsContent value="costs" className="p-6">
                <p className="text-gray-600">Cost information will be displayed here</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateWorkOrder;
