
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AssetManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Fixed Assets</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Asset Management</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Asset Management</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Order ⭐</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Create purchase orders for new assets.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Manage Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Track and manage asset purchase orders.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Asset Acquisition</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Process new asset acquisitions.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Manage Assets ⭐</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">View and manage all fixed assets.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssetManagement;
