
import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Save, Server, Mail, Settings2, Lock } from 'lucide-react';

const SystemConfiguration = () => {
  const [smtpSettings, setSmtpSettings] = useState({
    host: '',
    port: '587',
    username: '',
    password: '',
    encryption: 'tls'
  });

  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90
  });

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Settings</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">System Configuration</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
        
        <Tabs defaultValue="hierarchy" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hierarchy" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Hierarchy
            </TabsTrigger>
            <TabsTrigger value="smtp" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              SMTP
            </TabsTrigger>
            <TabsTrigger value="parameters" className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Parameters
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password Policy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hierarchy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hierarchy Configuration</CardTitle>
                <CardDescription>Configure organizational hierarchy and reporting structure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxLevels">Maximum Hierarchy Levels</Label>
                    <Input id="maxLevels" type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultLevel">Default Starting Level</Label>
                    <Input id="defaultLevel" type="number" defaultValue="1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hierarchyNames">Level Names (comma-separated)</Label>
                  <Input id="hierarchyNames" defaultValue="Company, Division, Department, Team, Individual" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="autoAssign" />
                  <Label htmlFor="autoAssign">Auto-assign hierarchy on user creation</Label>
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Hierarchy Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="smtp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SMTP Configuration</CardTitle>
                <CardDescription>Configure email server settings for system notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input 
                      id="smtpHost" 
                      value={smtpSettings.host}
                      onChange={(e) => setSmtpSettings({...smtpSettings, host: e.target.value})}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">Port</Label>
                    <Input 
                      id="smtpPort" 
                      value={smtpSettings.port}
                      onChange={(e) => setSmtpSettings({...smtpSettings, port: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">Username</Label>
                    <Input 
                      id="smtpUsername" 
                      value={smtpSettings.username}
                      onChange={(e) => setSmtpSettings({...smtpSettings, username: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">Password</Label>
                    <Input 
                      id="smtpPassword" 
                      type="password"
                      value={smtpSettings.password}
                      onChange={(e) => setSmtpSettings({...smtpSettings, password: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="encryption">Encryption</Label>
                  <ReusableDropdown
                    value={smtpSettings.encryption}
                    onChange={(value) => setSmtpSettings({...smtpSettings, encryption: value})}
                    options={[
                      { value: 'none', label: 'None' },
                      { value: 'tls', label: 'TLS' },
                      { value: 'ssl', label: 'SSL' }
                    ]}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">Test Connection</Button>
                  <Button className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save SMTP Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parameters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Parameters</CardTitle>
                <CardDescription>Configure global system parameters and default values</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input id="sessionTimeout" type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Max File Upload Size (MB)</Label>
                    <Input id="maxFileSize" type="number" defaultValue="10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <ReusableDropdown
                    defaultValue="usd"
                    options={[
                      { value: 'usd', label: 'USD - US Dollar' },
                      { value: 'eur', label: 'EUR - Euro' },
                      { value: 'inr', label: 'INR - Indian Rupee' }
                    ]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemMessage">System Maintenance Message</Label>
                  <Textarea id="systemMessage" placeholder="Enter message to display during maintenance..." />
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Parameters
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password Policy</CardTitle>
                <CardDescription>Configure password requirements and security policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="minLength">Minimum Password Length</Label>
                  <Input 
                    id="minLength" 
                    type="number" 
                    value={passwordPolicy.minLength}
                    onChange={(e) => setPasswordPolicy({...passwordPolicy, minLength: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="requireUppercase"
                      checked={passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireUppercase: checked})}
                    />
                    <Label htmlFor="requireUppercase">Require uppercase letters</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="requireLowercase"
                      checked={passwordPolicy.requireLowercase}
                      onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireLowercase: checked})}
                    />
                    <Label htmlFor="requireLowercase">Require lowercase letters</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="requireNumbers"
                      checked={passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireNumbers: checked})}
                    />
                    <Label htmlFor="requireNumbers">Require numbers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="requireSpecialChars"
                      checked={passwordPolicy.requireSpecialChars}
                      onCheckedChange={(checked) => setPasswordPolicy({...passwordPolicy, requireSpecialChars: checked})}
                    />
                    <Label htmlFor="requireSpecialChars">Require special characters</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDays">Password Expiry (days)</Label>
                  <Input 
                    id="expiryDays" 
                    type="number" 
                    value={passwordPolicy.expiryDays}
                    onChange={(e) => setPasswordPolicy({...passwordPolicy, expiryDays: parseInt(e.target.value)})}
                  />
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Password Policy
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemConfiguration;
