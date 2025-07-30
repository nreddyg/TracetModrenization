
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PurchaseOrders = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Procurement</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Purchase Orders</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Order ⭐</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Create and manage purchase orders for vendors.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Manage Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Track and update existing purchase orders.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrders;
