
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import FilterCard from '@/components/common/FilterCard';

const ManageWorkOrder = () => {
  const [filters, setFilters] = useState({
    serviceRequestNo: '',
    workOrderNo: '',
    workOrderType: '',
    status: ''
  });

  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = () => {
    console.log('Search filters:', filters);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const workOrders = [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 pb-4 pt-4 space-y-4 animate-fade-in">
        <FilterCard
          actions={
            <Button onClick={handleSearch} className="bg-orange-600 hover:bg-orange-700 text-xs h-7" size="sm">
              Search
            </Button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="serviceRequestNo" className="text-xs font-medium">
                Service Request No :
              </Label>
              <ReusableDropdown
                value={filters.serviceRequestNo}
                onChange={(value) => handleFilterChange('serviceRequestNo', value)}
                placeholder="SR000002"
                size="sm"
                allowClear
                options={[
                  { value: 'SR000001', label: 'SR000001' },
                  { value: 'SR000002', label: 'SR000002' },
                  { value: 'SR000003', label: 'SR000003' }
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="workOrderNo" className="text-xs font-medium">
                Work Order No :
              </Label>
              <ReusableDropdown
                value={filters.workOrderNo}
                onChange={(value) => handleFilterChange('workOrderNo', value)}
                placeholder="Select Work Order"
                size="sm"
                allowClear
                options={[
                  { value: 'WO001', label: 'WO001' },
                  { value: 'WO002', label: 'WO002' },
                  { value: 'WO003', label: 'WO003' }
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="workOrderType" className="text-xs font-medium">
                Work Order Type :
              </Label>
              <ReusableDropdown
                value={filters.workOrderType}
                onChange={(value) => handleFilterChange('workOrderType', value)}
                placeholder="Select Work Order Type"
                size="sm"
                allowClear
                options={[
                  { value: 'maintenance', label: 'Maintenance' },
                  { value: 'repair', label: 'Repair' },
                  { value: 'installation', label: 'Installation' },
                  { value: 'inspection', label: 'Inspection' }
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-xs font-medium">
                Status :
              </Label>
              <ReusableDropdown
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                placeholder="Select Status"
                size="sm"
                allowClear
                options={[
                  { value: 'open', label: 'Open' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' }
                ]}
              />
            </div>
          </div>
        </FilterCard>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900 text-xs">Actions</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-xs">Work Order No</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-xs">Work Order Title</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-xs">Work Order Type</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-xs">Start Date</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-xs">End Date</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-xs">Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-gray-500 text-xs">
                        No Items To Display
                      </TableCell>
                    </TableRow>
                  ) : (
                    workOrders.map((order: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="text-xs">{/* Action buttons would go here */}</TableCell>
                        <TableCell className="text-xs">{order.workOrderNo}</TableCell>
                        <TableCell className="text-xs">{order.title}</TableCell>
                        <TableCell className="text-xs">{order.type}</TableCell>
                        <TableCell className="text-xs">{order.startDate}</TableCell>
                        <TableCell className="text-xs">{order.endDate}</TableCell>
                        <TableCell className="text-xs">{order.duration}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="h-6 w-6 p-0"
                >
                  <ChevronsLeft className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-6 w-6 p-0"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <span className="flex items-center justify-center w-6 h-6 text-xs border rounded">
                  {currentPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="h-6 w-6 p-0"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="h-6 w-6 p-0"
                >
                  <ChevronsRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageWorkOrder;
