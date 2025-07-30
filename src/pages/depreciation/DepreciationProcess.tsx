
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DepreciationProcess = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Depreciation</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Depreciation Process</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Depreciation Process</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Run Depreciation ⭐</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Execute depreciation calculations for assets.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Manage Depreciation Result</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Review and manage depreciation results.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DepreciationProcess;
