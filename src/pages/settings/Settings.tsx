
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Server, Shield, Cog, Wrench, ChevronRight } from 'lucide-react';

const settingsModules = [
  {
    title: "System Configuration",
    description: "Configure hierarchy, SMTP settings, parameters, and password policies",
    icon: Server,
    url: "/settings/system-configuration",
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    title: "User Management",
    description: "Manage user roles, email notifications, and copy masters",
    icon: Shield,
    url: "/settings/user-management",
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    iconColor: "text-green-600"
  },
  {
    title: "Process Configuration",
    description: "Configure procurement settings, document generation, and additional fields",
    icon: Cog,
    url: "/settings/process-configuration",
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    iconColor: "text-purple-600"
  },
  {
    title: "Advanced Setup",
    description: "Configure barcode/QR code profiles and advanced system settings",
    icon: Wrench,
    url: "/settings/advanced-setup",
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    iconColor: "text-orange-600"
  }
];

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-gray-900 font-medium">Settings</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-lg text-gray-600">
            Configure system settings, manage users, and customize your application
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsModules.map((module, index) => (
            <Card 
              key={module.title} 
              className={`${module.color} transition-all duration-300 hover:shadow-lg hover:scale-105 animate-slide-in-right`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white ${module.iconColor}`}>
                    <module.icon className="h-6 w-6" />
                  </div>
                  {module.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={module.url}>
                  <Button className="w-full group" variant="outline">
                    Configure Settings
                    <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Settings Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="text-2xl font-bold text-blue-600">4</div>
                <div className="text-sm text-gray-600">Active Modules</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600">User Roles</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                <div className="text-2xl font-bold text-purple-600">8</div>
                <div className="text-sm text-gray-600">Active Policies</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-100">
                <div className="text-2xl font-bold text-orange-600">15</div>
                <div className="text-sm text-gray-600">Configurations</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
