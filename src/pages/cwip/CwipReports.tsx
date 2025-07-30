
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CwipReports = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>CWIP</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Reports & Analytics</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Generate detailed CWIP project reports.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>MIS Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Management information system reports for CWIP.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CwipReports;
