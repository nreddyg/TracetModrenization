
import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Settings, 
  Save,
  Trash2,
  Edit
} from 'lucide-react';

const Configuration = () => {
  const [serviceRequestConfig, setServiceRequestConfig] = useState({
    allowWorkOrderCreation: true,
    displayAssignedToField: true,
    displayCustomerField: true,
    displayAssetField: true,
    notifyBelowUsers: true,
    allowSingleServiceRequest: true,
    displayAssignedTo: true,
    displayCustomerField2: true,
    pauseSlaCalculation: false
  });

  const [newServiceRequestType, setNewServiceRequestType] = useState({
    type: '',
    userGroup: '',
    vendor: '',
    slaHours: '',
    reminderSla: '',
    escalationTo: '',
    calculateSlaStatus: '',
    description: '',
    typeAdmin: '',
    levelFive: ''
  });

  const [newServiceRequestStatus, setNewServiceRequestStatus] = useState({
    statusType: ''
  });

  const serviceRequestTypes = [
    { type: 'eg876', userGroups: '', vendors: '', slaHours: '0/0', reminderSla: '0/0', escalationTo: '' },
    { type: 'eg256', userGroups: '', vendors: '', slaHours: '0/0', reminderSla: '0/0', escalationTo: 'Cummins' }
  ];

  const serviceRequestStatuses = [
    { statusType: 'In Progress', index: 1 },
    { statusType: 'Hold', index: 2 },
    { statusType: 'Re-Open', index: 3 },
    { statusType: 'FirstType', index: 4 },
    { statusType: 'Test4', index: 5 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <Button 
            size="sm" 
            className="bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm px-2 sm:px-3 py-1.5"
          >
            <span className="hidden sm:inline">New Service Request</span>
            <span className="sm:hidden">New Request</span>
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-gray-900">Service Desk Configuration</h1>
        </div>

        <Tabs defaultValue="service-request-config" className="space-y-4">
          <div className="hidden sm:block">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="service-request-config" className="text-sm">Service Request Configuration</TabsTrigger>
              <TabsTrigger value="service-request-type" className="text-sm">Service Request Type</TabsTrigger>
              <TabsTrigger value="service-request-status" className="text-sm">Service Request Status</TabsTrigger>
            </TabsList>
          </div>
          <div className="sm:hidden">
            <TabsList className="flex flex-col gap-1 h-auto p-1">
              <TabsTrigger value="service-request-config" className="text-xs w-full">Configuration</TabsTrigger>
              <TabsTrigger value="service-request-type" className="text-xs w-full">Request Type</TabsTrigger>
              <TabsTrigger value="service-request-status" className="text-xs w-full">Request Status</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="service-request-config" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="allowWorkOrder"
                        checked={serviceRequestConfig.allowWorkOrderCreation}
                        onCheckedChange={(checked) => setServiceRequestConfig(prev => ({ ...prev, allowWorkOrderCreation: !!checked }))}
                        className="text-orange-500"
                      />
                      <Label htmlFor="allowWorkOrder" className="text-sm">Allow Work Order Creation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="displayAssigned"
                        checked={serviceRequestConfig.displayAssignedToField}
                        onCheckedChange={(checked) => setServiceRequestConfig(prev => ({ ...prev, displayAssignedToField: !!checked }))}
                        className="text-orange-500"
                      />
                      <Label htmlFor="displayAssigned" className="text-sm">Display Assigned To Field In Create Request</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="displayCustomer"
                        checked={serviceRequestConfig.displayCustomerField}
                        onCheckedChange={(checked) => setServiceRequestConfig(prev => ({ ...prev, displayCustomerField: !!checked }))}
                        className="text-orange-500"
                      />
                      <Label htmlFor="displayCustomer" className="text-sm">Display Customer Field In Create Request</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="displayAsset"
                        checked={serviceRequestConfig.displayAssetField}
                        onCheckedChange={(checked) => setServiceRequestConfig(prev => ({ ...prev, displayAssetField: !!checked }))}
                        className="text-orange-500"
                      />
                      <Label htmlFor="displayAsset" className="text-sm">Display Asset Field In Create Service Request</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="notifyUsers"
                        checked={serviceRequestConfig.notifyBelowUsers}
                        onCheckedChange={(checked) => setServiceRequestConfig(prev => ({ ...prev, notifyBelowUsers: !!checked }))}
                        className="text-orange-500"
                      />
                      <Label htmlFor="notifyUsers" className="text-sm">Notify Below Users On Service Request Edit</Label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="allowSingle"
                        checked={serviceRequestConfig.allowSingleServiceRequest}
                        onCheckedChange={(checked) => setServiceRequestConfig(prev => ({ ...prev, allowSingleServiceRequest: !!checked }))}
                        className="text-orange-500"
                      />
                      <Label htmlFor="allowSingle" className="text-sm">Allow Single Service Request For Multiple Assets Selection</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="displayAssigned2"
                        checked={serviceRequestConfig.displayAssignedTo}
                        onCheckedChange={(checked) => setServiceRequestConfig(prev => ({ ...prev, displayAssignedTo: !!checked }))}
                        className="text-orange-500"
                      />
                      <Label htmlFor="displayAssigned2" className="text-sm">Display Assigned To Field In My WorkBench</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="displayCustomer2"
                        checked={serviceRequestConfig.displayCustomerField2}
                        onCheckedChange={(checked) => setServiceRequestConfig(prev => ({ ...prev, displayCustomerField2: !!checked }))}
                        className="text-orange-500"
                      />
                      <Label htmlFor="displayCustomer2" className="text-sm">Display Customer Field In My WorkBench</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="pauseSla"
                        checked={serviceRequestConfig.pauseSlaCalculation}
                        onCheckedChange={(checked) => setServiceRequestConfig(prev => ({ ...prev, pauseSlaCalculation: !!checked }))}
                      />
                      <Label htmlFor="pauseSla" className="text-sm">Pause SLA Calculation</Label>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <ReusableDropdown
                    placeholder="All Selected (3)"
                    className="w-48"
                    options={[
                      { value: 'all', label: 'All Selected (3)' }
                    ]}
                  />
                </div>
                <div className="mt-6">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-sm px-4 py-2">
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="service-request-type" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Service Request Type*</Label>
                      <Input 
                        value={newServiceRequestType.type}
                        onChange={(e) => setNewServiceRequestType(prev => ({ ...prev, type: e.target.value }))}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">SLA Hours/Minutes</Label>
                      <Input 
                        placeholder="HH:MM"
                        value={newServiceRequestType.slaHours}
                        onChange={(e) => setNewServiceRequestType(prev => ({ ...prev, slaHours: e.target.value }))}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Set Status To Calculate SLA</Label>
                      <ReusableDropdown
                        size="small"
                        placeholder="Select Status"
                        options={[
                          { value: 'status1', label: 'Status 1' }
                        ]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Service Request Type Admin</Label>
                      <ReusableDropdown
                        size="small"
                        placeholder="Select Service Request Type Admin"
                        options={[
                          { value: 'admin1', label: 'Admin 1' }
                        ]}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">User Group</Label>
                      <ReusableDropdown
                        size="small"
                        placeholder="Select User Group"
                        options={[
                          { value: 'group1', label: 'Group 1' }
                        ]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Reminder For SLA</Label>
                      <Input 
                        placeholder="HH:MM"
                        value={newServiceRequestType.reminderSla}
                        onChange={(e) => setNewServiceRequestType(prev => ({ ...prev, reminderSla: e.target.value }))}
                        className="text-sm"
                      />
                      <div className="text-xs text-red-500">EX: 02:59,30:30,200:30</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Description</Label>
                      <Textarea 
                        value={newServiceRequestType.description}
                        onChange={(e) => setNewServiceRequestType(prev => ({ ...prev, description: e.target.value }))}
                        className="text-sm min-h-[80px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Level Five Company</Label>
                      <ReusableDropdown
                        size="small"
                        placeholder="Select Branches"
                        options={[
                          { value: 'branch1', label: 'Branch 1' }
                        ]}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <Label className="text-sm font-medium">Vendor</Label>
                  <ReusableDropdown
                    size="small"
                    placeholder="Select Vendors"
                    showSearch
                    options={[
                      { value: 'vendor1', label: 'Vendor 1' }
                    ]}
                  />
                </div>
                <div className="space-y-2 mb-6">
                  <Label className="text-sm font-medium">Escalation To</Label>
                  <ReusableDropdown
                    size="small"
                    placeholder="Select Escalation Users"
                    showSearch
                    options={[
                      { value: 'user1', label: 'User 1' }
                    ]}
                  />
                </div>
                <div className="flex gap-2 mb-6">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-sm px-4 py-2">Update</Button>
                  <Button variant="outline" className="text-sm px-4 py-2">Cancel</Button>
                </div>

                <div className="mt-8">
                  <h3 className="text-base font-semibold mb-4">Service Request Type List</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-sm font-medium">Actions</TableHead>
                          <TableHead className="text-sm font-medium">Service Request Type</TableHead>
                          <TableHead className="text-sm font-medium">User Groups</TableHead>
                          <TableHead className="text-sm font-medium">Vendors</TableHead>
                          <TableHead className="text-sm font-medium">SLA Hours/Minutes</TableHead>
                          <TableHead className="text-sm font-medium">Reminder For SLA Hours</TableHead>
                          <TableHead className="text-sm font-medium">Escalation To</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviceRequestTypes.map((type, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-xs px-2 py-1">
                                  <Edit className="h-3 w-3 mr-0.5" />
                                  Edit
                                </Button>
                                <Button size="sm" variant="destructive" className="text-xs px-2 py-1">
                                  <Trash2 className="h-3 w-3 mr-0.5" />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{type.type}</TableCell>
                            <TableCell className="text-sm">{type.userGroups}</TableCell>
                            <TableCell className="text-sm">{type.vendors}</TableCell>
                            <TableCell className="text-sm">{type.slaHours}</TableCell>
                            <TableCell className="text-sm">{type.reminderSla}</TableCell>
                            <TableCell className="text-sm">{type.escalationTo}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="service-request-status" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <Label className="text-sm font-medium">Status Type*</Label>
                  <Input 
                    value={newServiceRequestStatus.statusType}
                    onChange={(e) => setNewServiceRequestStatus(prev => ({ ...prev, statusType: e.target.value }))}
                    className="text-sm mt-2"
                  />
                </div>
                <div className="flex gap-2 mb-8">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-sm px-4 py-2">Save</Button>
                  <Button variant="outline" className="text-sm px-4 py-2">Clear</Button>
                </div>

                <div>
                  <h3 className="text-base font-semibold mb-4">Service Request Status List</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-sm font-medium">Status Type</TableHead>
                          <TableHead className="text-sm font-medium">Index</TableHead>
                          <TableHead className="text-sm font-medium">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviceRequestStatuses.map((status, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-sm">{status.statusType}</TableCell>
                            <TableCell className="text-sm">{status.index}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-xs px-2 py-1">
                                  <Edit className="h-3 w-3 mr-0.5" />
                                  Edit
                                </Button>
                                <Button size="sm" variant="destructive" className="text-xs px-2 py-1">
                                  <Trash2 className="h-3 w-3 mr-0.5" />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-sm px-4 py-2">
                      Update Index Sequence
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Configuration;
