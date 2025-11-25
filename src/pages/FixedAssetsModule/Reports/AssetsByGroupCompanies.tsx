import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Calendar, Download } from 'lucide-react';
import { AssetPageHeader } from '@/components/fixedassets/AssetPageHeader';
import { AssetEmptyState } from '@/components/fixedassets/AssetEmptyState';

const AssetsByGroupCompanies = () => {
  const [showRetireAssets, setShowRetireAssets] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 pb-6 pt-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fixed Assets By Group Companies</h1>
            <p className="text-sm text-gray-500 mt-1">View assets distributed across group companies</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Back</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Export To Excel</Button>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 space-y-6">
          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Select Company</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company1">Company 1</SelectItem>
                  <SelectItem value="company2">Company 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Date Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase Date</SelectItem>
                  <SelectItem value="acquisition">Acquisition Date</SelectItem>
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="showRetireAssets"
              checked={showRetireAssets}
              onCheckedChange={(checked) => setShowRetireAssets(checked as boolean)}
            />
            <Label htmlFor="showRetireAssets" className="cursor-pointer">
              Show Retire Assets
            </Label>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <div className="flex justify-end p-2">
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Asset Code</TableHead>
                  <TableHead>Main Category</TableHead>
                  <TableHead>Sub Cat</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AssetEmptyState colSpan={6} />
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsByGroupCompanies;
