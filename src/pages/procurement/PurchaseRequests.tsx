
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PurchaseRequests = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Procurement</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Purchase Requests</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Purchase Requests</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Request ⭐</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Create new purchase requests for procurement approval.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Manage Purchase Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">View and manage existing purchase requests.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequests;
