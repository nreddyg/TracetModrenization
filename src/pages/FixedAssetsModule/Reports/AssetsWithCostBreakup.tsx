import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AssetPageHeader } from '@/components/fixedassets/AssetPageHeader';
import { DollarSign } from 'lucide-react';

const AssetsWithCostBreakup = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 pb-6 pt-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fixed Assets With Cost Breakup</h1>
            <p className="text-sm text-gray-500 mt-1">Analyze asset costs with detailed breakup</p>
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
                Main Category <span className="text-destructive">*</span>
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Main Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cat1">Category 1</SelectItem>
                  <SelectItem value="cat2">Category 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Sub Category <span className="text-destructive">*</span>
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Sub Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sub1">Sub Category 1</SelectItem>
                  <SelectItem value="sub2">Sub Category 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Group Name <span className="text-destructive">*</span>
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="group1">Group 1</SelectItem>
                  <SelectItem value="group2">Group 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline">level five location</Button>
            <Button variant="outline">level five department</Button>
            <Button variant="outline">level five cost center</Button>
            <Button variant="link" className="text-primary">
              Apply Filters
            </Button>
            <Button variant="link" className="text-muted-foreground">
              Reset
            </Button>
          </div>

          {/* Empty State */}
          <div className="border-t pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mb-4">
                <DollarSign className="h-8 w-8" />
              </div>
              <p>No data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsWithCostBreakup;
