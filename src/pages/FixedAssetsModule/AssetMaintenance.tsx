
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AssetMaintenance = () => {
  return (
    <div className="min-h-screen bg-background transition-all duration-300 ease-in-out">
      <header className="bg-card border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Fixed Assets</span>
            <span>/</span>
            <span className="text-foreground font-medium">Asset Maintenance</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Asset Maintenance</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Change In Asset Category</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Update asset categories and classifications.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Unretire Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Restore retired assets back to active status.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssetMaintenance;
