
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
import { Save, Users, Mail, Copy, Plus, Edit, Trash2 } from 'lucide-react';

const UserManagement = () => {
  const [emailSettings, setEmailSettings] = useState({
    welcomeEmail: true,
    passwordReset: true,
    systemNotifications: true,
    weeklyReports: false
  });

  const userRoles = [
    { id: 1, name: 'Super Admin', permissions: 'All', users: 2, status: 'Active' },
    { id: 2, name: 'Admin', permissions: 'Most', users: 5, status: 'Active' },
    { id: 3, name: 'Manager', permissions: 'Limited', users: 12, status: 'Active' },
    { id: 4, name: 'User', permissions: 'Basic', users: 45, status: 'Active' },
    { id: 5, name: 'Guest', permissions: 'Read Only', users: 8, status: 'Inactive' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Settings</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">User Management</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        
        <Tabs defaultValue="roles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Roles
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Notifications
            </TabsTrigger>
            <TabsTrigger value="masters" className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Copy Masters
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Roles Management</CardTitle>
                    <CardDescription>Create and manage user roles and permissions</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Role
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Permission Level</TableHead>
                      <TableHead>Users Assigned</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.permissions}</TableCell>
                        <TableCell>{role.users}</TableCell>
                        <TableCell>
                          <Badge variant={role.status === 'Active' ? 'default' : 'secondary'}>
                            {role.status}
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

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notification Settings</CardTitle>
                <CardDescription>Configure system email notifications and templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="welcomeEmail">Welcome Email</Label>
                      <p className="text-sm text-gray-600">Send welcome email to new users</p>
                    </div>
                    <Switch 
                      id="welcomeEmail"
                      checked={emailSettings.welcomeEmail}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, welcomeEmail: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="passwordReset">Password Reset</Label>
                      <p className="text-sm text-gray-600">Send password reset confirmation emails</p>
                    </div>
                    <Switch 
                      id="passwordReset"
                      checked={emailSettings.passwordReset}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, passwordReset: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="systemNotifications">System Notifications</Label>
                      <p className="text-sm text-gray-600">Send important system notifications</p>
                    </div>
                    <Switch 
                      id="systemNotifications"
                      checked={emailSettings.systemNotifications}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, systemNotifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weeklyReports">Weekly Reports</Label>
                      <p className="text-sm text-gray-600">Send weekly summary reports</p>
                    </div>
                    <Switch 
                      id="weeklyReports"
                      checked={emailSettings.weeklyReports}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, weeklyReports: checked})}
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">From Email Address</Label>
                    <Input id="fromEmail" defaultValue="noreply@tracet.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fromName">From Name</Label>
                    <Input id="fromName" defaultValue="Tracet System" />
                  </div>
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="masters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Copy Masters</CardTitle>
                <CardDescription>Copy configuration from one environment to another</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sourceEnv">Source Environment</Label>
                    <ReusableDropdown
                      placeholder="Select source environment"
                      options={[
                        { value: 'production', label: 'Production' },
                        { value: 'staging', label: 'Staging' },
                        { value: 'development', label: 'Development' }
                      ]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetEnv">Target Environment</Label>
                    <ReusableDropdown
                      placeholder="Select target environment"
                      options={[
                        { value: 'production', label: 'Production' },
                        { value: 'staging', label: 'Staging' },
                        { value: 'development', label: 'Development' }
                      ]}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Data to Copy</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="copyUsers" />
                      <Label htmlFor="copyUsers">User Accounts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="copyRoles" />
                      <Label htmlFor="copyRoles">User Roles</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="copySettings" />
                      <Label htmlFor="copySettings">System Settings</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="copyMasters" />
                      <Label htmlFor="copyMasters">Master Data</Label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">Preview Changes</Button>
                  <Button className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Execute Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserManagement;
