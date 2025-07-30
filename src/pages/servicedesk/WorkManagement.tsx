
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/common/PageLayout';

const WorkManagement = () => {
  return (
    <PageLayout>
      <div className="px-4 pb-4 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Plus className="h-4 w-4 text-blue-600" />
                </div>
                <CardTitle className="text-sm">Create Work Order</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 mb-3">Create new work orders for service delivery and maintenance tasks.</p>
              <Link to="/service-desk/create-work-order">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs h-7">
                  Create New Order
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-orange-100 rounded-lg">
                  <Settings className="h-4 w-4 text-orange-600" />
                </div>
                <CardTitle className="text-sm">Manage Work Orders</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 mb-3">Track, search, and manage existing work orders and their status.</p>
              <Link to="/service-desk/manage-work-order">
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-xs h-7">
                  Manage Orders
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default WorkManagement;
