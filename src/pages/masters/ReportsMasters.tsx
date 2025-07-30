
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ReportsMasters = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Masters</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Reports</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Master Reports</h1>
        <Card>
          <CardHeader>
            <CardTitle>Master Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Generate comprehensive reports for all master data categories.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsMasters;
