
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MaintenanceMasters = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Masters</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Maintenance</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Masters</h1>
        <Card>
          <CardHeader>
            <CardTitle>Service Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Configure maintenance schedules, service types, and vendor management.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaintenanceMasters;
