
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AssetOperations = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>CWIP</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Asset Operations</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Asset Operations</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Transfer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Transfer assets between projects or locations.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Asset Check In ⭐</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Check in assets to projects for tracking.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Capitalization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Convert CWIP assets to fixed assets.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssetOperations;
