
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CategoryManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Physical Verification</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Category Management</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Level Create Audit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Create audits at category level.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Category Level Review Audit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Review category-level audit results.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Category Level Manual Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Manual verification by category.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>User Self Audit Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Allow users to create their own audits.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
