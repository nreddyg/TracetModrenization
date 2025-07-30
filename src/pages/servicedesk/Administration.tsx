
import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Users, 
  Settings, 
  Shield, 
  Mail, 
  Edit,
  Plus,
  Search
} from 'lucide-react';

const Administration = () => {
  const [searchUser, setSearchUser] = useState('');
  const [emailSettings, setEmailSettings] = useState({
    welcomeEmail: true,
    passwordReset: true,
    systemNotifications: true,
    weeklyReports: false
  });

  const mockUsers = [
    { id: 1, username: 'john.doe', email: 'john.doe@example.com', role: 'Admin' },
    { id: 2, username: 'jane.smith', email: 'jane.smith@example.com', role: 'User' },
    { id: 3, username: 'mike.johnson', email: 'mike.johnson@example.com', role: 'Manager' },
  ];

  const mockRoles = [
    { id: 1, name: 'Admin', permissions: 'All Permissions', users: 2, status: 'Active' },
    { id: 2, name: 'User', permissions: 'Read Only', users: 15, status: 'Active' },
    { id: 3, name: 'Manager', permissions: 'Limited Access', users: 5, status: 'Active' },
  ];

  const filteredUsers = mockUsers.filter(user => 
    user.username.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/30">
      <header className="bg-white border-b px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <Button 
            size="sm" 
            className="bg-orange-500 hover:bg-orange-600 text-sm px-3 py-1.5"
          >
            New Service Request
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100">
            <TabsTrigger value="users" className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4" />
              Roles & Permissions
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4" />
              System Settings
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              Email Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <Button 
                    size="sm" 
                    className="bg-blue-500 hover:bg-blue-600 text-sm px-3 py-1.5"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add New User
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-4">
                  <Label className="text-sm font-medium">Search User:</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                    <Input
                      placeholder="Enter username or email"
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      className="pl-8 text-sm h-8 border-gray-200"
                    />
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                        <TableHead className="font-medium text-gray-900 py-3 text-sm">USERNAME</TableHead>
                        <TableHead className="font-medium text-gray-900 py-3 text-sm">EMAIL</TableHead>
                        <TableHead className="font-medium text-gray-900 py-3 text-sm">ROLE</TableHead>
                        <TableHead className="font-medium text-gray-900 py-3 text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors border-gray-100">
                          <TableCell className="py-3 text-sm font-medium">{user.username}</TableCell>
                          <TableCell className="py-3 text-sm">{user.email}</TableCell>
                          <TableCell className="py-3 text-sm">{user.role}</TableCell>
                          <TableCell className="py-3">
                            <Button 
                              size="sm" 
                              className="bg-blue-500 hover:bg-blue-600 text-white h-7 px-2 text-xs"
                            >
                              <Edit className="h-3 w-3 mr-0.5" />
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Roles & Permissions Management
                  </CardTitle>
                  <Button 
                    size="sm" 
                    className="bg-blue-500 hover:bg-blue-600 text-sm px-3 py-1.5"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add New Role
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                        <TableHead className="font-medium text-gray-900 py-3 text-sm">Role Name</TableHead>
                        <TableHead className="font-medium text-gray-900 py-3 text-sm">Permissions</TableHead>
                        <TableHead className="font-medium text-gray-900 py-3 text-sm">Users Assigned</TableHead>
                        <TableHead className="font-medium text-gray-900 py-3 text-sm">Status</TableHead>
                        <TableHead className="font-medium text-gray-900 py-3 text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRoles.map((role) => (
                        <TableRow key={role.id} className="hover:bg-gray-50/50 transition-colors border-gray-100">
                          <TableCell className="py-3 text-sm font-medium">{role.name}</TableCell>
                          <TableCell className="py-3 text-sm">{role.permissions}</TableCell>
                          <TableCell className="py-3 text-sm">{role.users}</TableCell>
                          <TableCell className="py-3">
                            <Badge className="bg-green-100 text-green-800 border-green-300 text-xs px-2 py-0.5">
                              {role.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3">
                            <Button 
                              size="sm" 
                              className="bg-blue-500 hover:bg-blue-600 text-white h-7 px-2 text-xs"
                            >
                              <Edit className="h-3 w-3 mr-0.5" />
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">System Name</Label>
                  <Input 
                    type="text" 
                    defaultValue="Service Desk System" 
                    className="text-sm h-8 border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Default Language</Label>
                  <ReusableDropdown
                    placeholder="English"
                    size="sm"
                    options={[
                      { value: 'en', label: 'English' },
                      { value: 'fr', label: 'French' },
                      { value: 'es', label: 'Spanish' }
                    ]}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Time Zone</Label>
                  <ReusableDropdown
                    placeholder="Select Time Zone"
                    size="sm"
                    search
                    options={[
                      { value: 'UTC', label: 'UTC' },
                      { value: 'America/Los_Angeles', label: 'America/Los_Angeles' },
                      { value: 'Europe/London', label: 'Europe/London' }
                    ]}
                  />
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-sm px-4 py-2">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">New Ticket Email</Label>
                      <p className="text-xs text-gray-600">Send email notifications for new tickets</p>
                    </div>
                    <Switch 
                      checked={emailSettings.welcomeEmail}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, welcomeEmail: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Ticket Update Email</Label>
                      <p className="text-xs text-gray-600">Send email notifications for ticket updates</p>
                    </div>
                    <Switch 
                      checked={emailSettings.passwordReset}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, passwordReset: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Assignment Email</Label>
                      <p className="text-xs text-gray-600">Send email notifications for ticket assignments</p>
                    </div>
                    <Switch 
                      checked={emailSettings.systemNotifications}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, systemNotifications: checked})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">SMTP Server</Label>
                    <Input 
                      placeholder="smtp.example.com" 
                      className="text-sm h-8 border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">SMTP Port</Label>
                    <Input 
                      type="number" 
                      placeholder="587" 
                      className="text-sm h-8 border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">From Email Address</Label>
                    <Input 
                      defaultValue="noreply@tracet.com" 
                      className="text-sm h-8 border-gray-200"
                    />
                  </div>
                </div>
                
                <Button className="bg-orange-500 hover:bg-orange-600 text-sm px-4 py-2">
                  Save Email Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Administration;
