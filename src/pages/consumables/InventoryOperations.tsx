
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InventoryOperations = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Consumables</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Inventory Operations</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Operations</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Internal Stock Transfer ⭐</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Transfer stock between locations or departments.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Indent Request</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Create requests for consumable items.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>List Of Indent Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">View and manage all indent requests.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InventoryOperations;
