
import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings, ShoppingCart, FileText, Plus, Save, Edit, Trash2 } from 'lucide-react';

const ProcessConfiguration = () => {
  const [procurementSettings, setProcurementSettings] = useState({
    autoApproval: false,
    approvalLimit: 10000,
    requirePOForAll: true,
    allowDirectPurchase: false
  });

  const documentTypes = [
    { id: 1, name: 'Purchase Order', prefix: 'PO', currentNumber: 1001, format: 'PO-YYYY-NNNN', status: 'Active' },
    { id: 2, name: 'Asset Tag', prefix: 'AT', currentNumber: 5001, format: 'AT-YYYY-NNNNN', status: 'Active' },
    { id: 3, name: 'Work Order', prefix: 'WO', currentNumber: 3001, format: 'WO-YYYY-NNNN', status: 'Active' },
    { id: 4, name: 'Service Request', prefix: 'SR', currentNumber: 2001, format: 'SR-YYYY-NNNN', status: 'Active' }
  ];

  const customFields = [
    { id: 1, name: 'Purchase Reason', type: 'Text', module: 'Procurement', required: true, status: 'Active' },
    { id: 2, name: 'Asset Category', type: 'Dropdown', module: 'Assets', required: true, status: 'Active' },
    { id: 3, name: 'Department Budget', type: 'Number', module: 'Finance', required: false, status: 'Inactive' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Settings</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Process Configuration</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Process Configuration</h1>
        
        <Tabs defaultValue="procurement" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="procurement" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Procurement
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Document Numbers
            </TabsTrigger>
            <TabsTrigger value="fields" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Additional Fields
            </TabsTrigger>
          </TabsList>

          <TabsContent value="procurement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Procurement Settings</CardTitle>
                <CardDescription>Configure procurement process rules and approval workflows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoApproval">Auto Approval</Label>
                      <p className="text-sm text-gray-600">Automatically approve purchases below threshold</p>
                    </div>
                    <Switch 
                      id="autoApproval"
                      checked={procurementSettings.autoApproval}
                      onCheckedChange={(checked) => setProcurementSettings({...procurementSettings, autoApproval: checked})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="approvalLimit">Auto Approval Limit ($)</Label>
                    <Input 
                      id="approvalLimit" 
                      type="number"
                      value={procurementSettings.approvalLimit}
                      onChange={(e) => setProcurementSettings({...procurementSettings, approvalLimit: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requirePOForAll">Require PO for All Purchases</Label>
                      <p className="text-sm text-gray-600">Mandate purchase orders for all procurement</p>
                    </div>
                    <Switch 
                      id="requirePOForAll"
                      checked={procurementSettings.requirePOForAll}
                      onCheckedChange={(checked) => setProcurementSettings({...procurementSettings, requirePOForAll: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowDirectPurchase">Allow Direct Purchase</Label>
                      <p className="text-sm text-gray-600">Allow purchases without formal requisition</p>
                    </div>
                    <Switch 
                      id="allowDirectPurchase"
                      checked={procurementSettings.allowDirectPurchase}
                      onCheckedChange={(checked) => setProcurementSettings({...procurementSettings, allowDirectPurchase: checked})}
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="defaultPaymentTerms">Default Payment Terms</Label>
                      <ReusableDropdown
                        defaultValue="net30"
                        options={[
                          { value: 'net15', label: 'Net 15 Days' },
                          { value: 'net30', label: 'Net 30 Days' },
                          { value: 'net60', label: 'Net 60 Days' },
                          { value: 'cod', label: 'Cash on Delivery' }
                        ]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="defaultCurrency">Default Currency</Label>
                      <ReusableDropdown
                        defaultValue="usd"
                        options={[
                          { value: 'usd', label: 'USD' },
                          { value: 'eur', label: 'EUR' },
                          { value: 'inr', label: 'INR' }
                        ]}
                      />
                    </div>
                  </div>
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Procurement Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Document Number Generation</CardTitle>
                    <CardDescription>Configure automatic document numbering for various types</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document Type
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Prefix</TableHead>
                      <TableHead>Current Number</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentTypes.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>{doc.prefix}</TableCell>
                        <TableCell>{doc.currentNumber}</TableCell>
                        <TableCell>{doc.format}</TableCell>
                        <TableCell>
                          <Badge variant={doc.status === 'Active' ? 'default' : 'secondary'}>
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fields" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Additional Field Configuration</CardTitle>
                    <CardDescription>Add custom fields to various modules and forms</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Field
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customFields.map((field) => (
                      <TableRow key={field.id}>
                        <TableCell className="font-medium">{field.name}</TableCell>
                        <TableCell>{field.type}</TableCell>
                        <TableCell>{field.module}</TableCell>
                        <TableCell>
                          <Badge variant={field.required ? 'destructive' : 'secondary'}>
                            {field.required ? 'Yes' : 'No'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={field.status === 'Active' ? 'default' : 'secondary'}>
                            {field.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProcessConfiguration;
