import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Edit, Trash2 } from 'lucide-react';
import FilterCard from '@/components/common/FilterCard';

const AllRequests = () => {
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    assignee: ''
  });

  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = () => {
    console.log('Search filters:', filters);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const mockRequests = [
    {
      id: 'REQ-001',
      title: 'Email Setup Issue',
      category: 'IT Support',
      priority: 'High',
      status: 'Open',
      assignee: 'John Doe',
      created: '2024-01-15',
      updated: '2024-01-16'
    },
    {
      id: 'REQ-002',
      title: 'Password Reset Request',
      category: 'Access',
      priority: 'Medium',
      status: 'In Progress',
      assignee: 'Jane Smith',
      created: '2024-01-14',
      updated: '2024-01-15'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-700';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'closed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 pb-6 pt-6 space-y-6 animate-fade-in">
        <FilterCard
          actions={
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status :
              </Label>
              <ReusableDropdown
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                placeholder="Select Status"
                allowClear
                options={[
                  { value: 'open', label: 'Open' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'resolved', label: 'Resolved' },
                  { value: 'closed', label: 'Closed' }
                ]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority :
              </Label>
              <ReusableDropdown
                value={filters.priority}
                onChange={(value) => handleFilterChange('priority', value)}
                placeholder="Select Priority"
                allowClear
                options={[
                  { value: 'high', label: 'High' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'low', label: 'Low' }
                ]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category :
              </Label>
              <ReusableDropdown
                value={filters.category}
                onChange={(value) => handleFilterChange('category', value)}
                placeholder="Select Category"
                allowClear
                search
                options={[
                  { value: 'it-support', label: 'IT Support' },
                  { value: 'access', label: 'Access' },
                  { value: 'network', label: 'Network' },
                  { value: 'hardware', label: 'Hardware' },
                  { value: 'software', label: 'Software' }
                ]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee" className="text-sm font-medium">
                Assignee :
              </Label>
              <ReusableDropdown
                value={filters.assignee}
                onChange={(value) => handleFilterChange('assignee', value)}
                placeholder="Select Assignee"
                allowClear
                search
                options={[
                  { value: 'john-doe', label: 'John Doe' },
                  { value: 'jane-smith', label: 'Jane Smith' },
                  { value: 'mike-johnson', label: 'Mike Johnson' }
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
                    <TableHead className="font-semibold text-gray-900">ID</TableHead>
                    <TableHead className="font-semibold text-gray-900">Title</TableHead>
                    <TableHead className="font-semibold text-gray-900">Category</TableHead>
                    <TableHead className="font-semibold text-gray-900">Priority</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900">Assignee</TableHead>
                    <TableHead className="font-semibold text-gray-900">Created</TableHead>
                    <TableHead className="font-semibold text-gray-900">Updated</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.title}</TableCell>
                      <TableCell>{request.category}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                      </TableCell>
                      <TableCell>{request.assignee}</TableCell>
                      <TableCell>{request.created}</TableCell>
                      <TableCell>{request.updated}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button size="icon" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-red-500 hover:bg-red-100">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="flex items-center justify-center w-8 h-8 text-sm border rounded">
                  {currentPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                Showing page {currentPage} of {1}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AllRequests;
