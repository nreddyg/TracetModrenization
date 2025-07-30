
import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Save, QrCode, Wrench, Database, Shield, Plus, Edit, Trash2, Download } from 'lucide-react';

const AdvancedSetup = () => {
  const [barcodeSettings, setBarcodeSettings] = useState({
    enableBarcode: true,
    enableQRCode: true,
    autoGenerate: true,
    includeCompanyCode: true
  });

  const barcodeProfiles = [
    { id: 1, name: 'Asset Standard', type: 'QR Code', size: '2x2 cm', format: 'Square', status: 'Active' },
    { id: 2, name: 'Asset Compact', type: 'Barcode', size: '1x0.5 cm', format: 'Rectangle', status: 'Active' },
    { id: 3, name: 'Inventory Tags', type: 'QR Code', size: '1.5x1.5 cm', format: 'Square', status: 'Active' },
    { id: 4, name: 'Equipment Labels', type: 'Barcode', size: '3x1 cm', format: 'Rectangle', status: 'Inactive' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Settings</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Advanced Setup</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Advanced Setup</h1>
        
        <Tabs defaultValue="barcode" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="barcode" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Barcode/QR
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Backup
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="barcode" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Barcode/QR Code Configuration</CardTitle>
                <CardDescription>Configure barcode and QR code generation settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableBarcode">Enable Barcode Generation</Label>
                      <p className="text-sm text-gray-600">Generate barcodes for assets and inventory</p>
                    </div>
                    <Switch 
                      id="enableBarcode"
                      checked={barcodeSettings.enableBarcode}
                      onCheckedChange={(checked) => setBarcodeSettings({...barcodeSettings, enableBarcode: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableQRCode">Enable QR Code Generation</Label>
                      <p className="text-sm text-gray-600">Generate QR codes for enhanced tracking</p>
                    </div>
                    <Switch 
                      id="enableQRCode"
                      checked={barcodeSettings.enableQRCode}
                      onCheckedChange={(checked) => setBarcodeSettings({...barcodeSettings, enableQRCode: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoGenerate">Auto Generate on Asset Creation</Label>
                      <p className="text-sm text-gray-600">Automatically create codes when assets are added</p>
                    </div>
                    <Switch 
                      id="autoGenerate"
                      checked={barcodeSettings.autoGenerate}
                      onCheckedChange={(checked) => setBarcodeSettings({...barcodeSettings, autoGenerate: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="includeCompanyCode">Include Company Code</Label>
                      <p className="text-sm text-gray-600">Prefix codes with company identifier</p>
                    </div>
                    <Switch 
                      id="includeCompanyCode"
                      checked={barcodeSettings.includeCompanyCode}
                      onCheckedChange={(checked) => setBarcodeSettings({...barcodeSettings, includeCompanyCode: checked})}
                    />
                  </div>
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Barcode Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Barcode/QR Code Profiles</CardTitle>
                    <CardDescription>Manage different barcode and QR code profiles for various use cases</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profile Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {barcodeProfiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">{profile.name}</TableCell>
                        <TableCell>{profile.type}</TableCell>
                        <TableCell>{profile.size}</TableCell>
                        <TableCell>{profile.format}</TableCell>
                        <TableCell>
                          <Badge variant={profile.status === 'Active' ? 'default' : 'secondary'}>
                            {profile.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
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

          <TabsContent value="integration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Third-Party Integrations</CardTitle>
                <CardDescription>Configure integrations with external systems and APIs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="erpIntegration">ERP System Integration</Label>
                  <ReusableDropdown
                    placeholder="Select ERP system"
                    options={[
                      { value: 'sap', label: 'SAP' },
                      { value: 'oracle', label: 'Oracle ERP' },
                      { value: 'dynamics', label: 'Microsoft Dynamics' },
                      { value: 'custom', label: 'Custom API' }
                    ]}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiEndpoint">API Endpoint</Label>
                    <Input id="apiEndpoint" placeholder="https://api.example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input id="apiKey" type="password" placeholder="Enter API key" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="syncFrequency">Sync Frequency</Label>
                  <ReusableDropdown
                    defaultValue="hourly"
                    options={[
                      { value: 'realtime', label: 'Real-time' },
                      { value: 'hourly', label: 'Hourly' },
                      { value: 'daily', label: 'Daily' },
                      { value: 'weekly', label: 'Weekly' }
                    ]}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">Test Connection</Button>
                  <Button className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Integration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup Configuration</CardTitle>
                <CardDescription>Configure automated backup settings and schedules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <ReusableDropdown
                    defaultValue="daily"
                    options={[
                      { value: 'hourly', label: 'Hourly' },
                      { value: 'daily', label: 'Daily' },
                      { value: 'weekly', label: 'Weekly' },
                      { value: 'monthly', label: 'Monthly' }
                    ]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupTime">Backup Time</Label>
                  <Input id="backupTime" type="time" defaultValue="02:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
                  <Input id="retentionPeriod" type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupLocation">Backup Location</Label>
                  <Textarea id="backupLocation" placeholder="Enter backup storage path or cloud configuration" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">Run Backup Now</Button>
                  <Button className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Backup Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure advanced security features and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Require 2FA for all user accounts</p>
                  </div>
                  <Switch id="twoFactor" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ipWhitelist">IP Whitelisting</Label>
                    <p className="text-sm text-gray-600">Restrict access to specific IP addresses</p>
                  </div>
                  <Switch id="ipWhitelist" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowedIPs">Allowed IP Addresses</Label>
                  <Textarea id="allowedIPs" placeholder="Enter IP addresses or ranges (one per line)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionDuration">Session Duration (minutes)</Label>
                  <Input id="sessionDuration" type="number" defaultValue="480" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auditLogging">Audit Logging</Label>
                    <p className="text-sm text-gray-600">Log all user activities and system changes</p>
                  </div>
                  <Switch id="auditLogging" defaultChecked />
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvancedSetup;
