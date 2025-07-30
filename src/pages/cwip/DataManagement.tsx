
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DataManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>CWIP</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Data Management</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Data Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>CWIP Import</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Import CWIP data from external systems and spreadsheets.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataManagement;
