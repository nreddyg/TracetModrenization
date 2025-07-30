
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const VerificationMethods = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Physical Verification</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Verification Methods</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Verification Methods</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Manual Verification ⭐</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Conduct manual physical verification of assets.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Scanner Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Use barcode/QR scanners for verification.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Submitted Audit Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">View all submitted audit plans and their status.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VerificationMethods;
