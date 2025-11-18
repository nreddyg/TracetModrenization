import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar } from 'lucide-react';
import { AssetPageHeader } from '@/components/fixedassets/AssetPageHeader';
import { AssetSearchBar } from '@/components/fixedassets/AssetSearchBar';
import { AssetFilterBar } from '@/components/fixedassets/AssetFilterBar';
import { AssetEmptyState } from '@/components/fixedassets/AssetEmptyState';

const AssetsByMasters = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 pb-6 pt-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fixed Assets By Masters</h1>
            <p className="text-sm text-gray-500 mt-1">Generate reports based on master data filters</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Back</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Export To Excel</Button>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 space-y-6">
          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>
                Fixed Assets By <span className="text-destructive">*</span>
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Type</Label>
              <Select defaultValue="purchased">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchased">Purchased date</SelectItem>
                  <SelectItem value="acquisition">Acquisition date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>From - To Date</Label>
              <div className="flex gap-2">
                <Input type="text" placeholder="From Date" />
                <span className="flex items-center">-</span>
                <Input type="text" placeholder="To Date" />
                <Button variant="outline" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <AssetFilterBar
            onApplyFilters={() => {}}
            onReset={() => {}}
            onDownload={() => {}}
          >
            <AssetSearchBar value={searchTerm} onChange={setSearchTerm} />
            <Button variant="outline">level five location</Button>
            <Button variant="outline">level five department</Button>
            <Button variant="outline">Main Category</Button>
            <Button variant="outline">Sub Category</Button>
            <Button variant="outline">More +</Button>
          </AssetFilterBar>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Code</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Acquisition Type</TableHead>
                  <TableHead>Dependency Type</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AssetEmptyState colSpan={5} />
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsByMasters;
