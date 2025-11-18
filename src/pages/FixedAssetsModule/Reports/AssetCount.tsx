import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AssetPageHeader } from '@/components/fixedassets/AssetPageHeader';

const AssetCount = () => {
  const [activeAssets, setActiveAssets] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 pb-6 pt-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Asset Count</h1>
            <p className="text-sm text-gray-500 mt-1">Generate asset count reports by various criteria</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Back</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Generate Report</Button>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 space-y-6">
          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>level five company</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Last Level Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company1">Company 1</SelectItem>
                  <SelectItem value="company2">Company 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>level five department</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dept1">Department 1</SelectItem>
                  <SelectItem value="dept2">Department 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>level five location</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loc1">Location 1</SelectItem>
                  <SelectItem value="loc2">Location 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Main Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Main Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cat1">Category 1</SelectItem>
                  <SelectItem value="cat2">Category 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sub Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sub Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sub1">Sub Category 1</SelectItem>
                  <SelectItem value="sub2">Sub Category 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end space-x-2">
              <Checkbox
                id="activeAssets"
                checked={activeAssets}
                onCheckedChange={(checked) => setActiveAssets(checked as boolean)}
              />
              <Label htmlFor="activeAssets" className="cursor-pointer">
                Active Assets
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCount;
