
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AssetOps = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Fixed Assets</span>
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
              <CardTitle>Asset Transfer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Transfer assets between locations or departments.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Let Out(Issue)/Let In(Return)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Issue assets temporarily and track returns.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Asset Split</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Split assets into multiple units for tracking.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssetOps;
