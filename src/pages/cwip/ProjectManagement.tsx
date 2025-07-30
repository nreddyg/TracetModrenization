
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProjectManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-4 sm:px-6 py-3 sm:py-4 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
            <span>CWIP</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Project Management</span>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 animate-fade-in">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Project Management</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Project ⭐</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Create new capital work in progress projects.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Manage Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">View and manage existing CWIP projects.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;
