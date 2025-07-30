
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Receiving = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Consumables</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Receiving</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Receiving</h1>
        <Card>
          <CardHeader>
            <CardTitle>Goods Receipt ⭐</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Record receipt of consumable goods and update inventory.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Receiving;
