import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search } from 'lucide-react';

const ChangeAssetCategory = () => {
  const [searchTab, setSearchTab] = useState<'asset' | 'barcode'>('asset');

  return (
    <div className="min-h-screen bg-background transition-all duration-300 ease-in-out">
      <header className="bg-card border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Fixed Assets</span>
            <span>/</span>
            <span className="text-foreground font-medium">Change Asset Category</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Change Asset Category</h1>
          <Button className="bg-[hsl(var(--chart-1))] hover:bg-[hsl(var(--chart-1))]/90">Submit</Button>
        </div>

        {/* Category Selection */}
        <div className="grid grid-cols-2 gap-6 bg-card p-6 rounded-lg border">
          <div className="space-y-2">
            <Label htmlFor="sourceMain">Source Main Category <span className="text-destructive">*</span></Label>
            <Select>
              <SelectTrigger id="sourceMain">
                <SelectValue placeholder="Source Main Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cat1">Category 1</SelectItem>
                <SelectItem value="cat2">Category 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetMain">Target Main Category <span className="text-destructive">*</span></Label>
            <Select>
              <SelectTrigger id="targetMain">
                <SelectValue placeholder="Target Main Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cat1">Category 1</SelectItem>
                <SelectItem value="cat2">Category 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceSub">Source Sub Category <span className="text-destructive">*</span></Label>
            <Select>
              <SelectTrigger id="sourceSub">
                <SelectValue placeholder="Source Sub Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sub1">Sub Category 1</SelectItem>
                <SelectItem value="sub2">Sub Category 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetSub">Target Sub Category <span className="text-destructive">*</span></Label>
            <Select>
              <SelectTrigger id="targetSub">
                <SelectValue placeholder="Target Sub Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sub1">Sub Category 1</SelectItem>
                <SelectItem value="sub2">Sub Category 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Tabs */}
        <div className="flex gap-2">
          <Button
            variant={searchTab === 'asset' ? 'default' : 'outline'}
            onClick={() => setSearchTab('asset')}
            className="rounded-b-none"
          >
            Asset Code
          </Button>
          <Button
            variant={searchTab === 'barcode' ? 'default' : 'outline'}
            onClick={() => setSearchTab('barcode')}
            className="rounded-b-none"
          >
            Barcode No
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="level five location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="loc1">Location 1</SelectItem>
              <SelectItem value="loc2">Location 2</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="level five department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dept1">Department 1</SelectItem>
              <SelectItem value="dept2">Department 2</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">More +</Button>
          <Button>Apply Filters</Button>
          <Button variant="outline">Reset</Button>
        </div>

        {/* Table */}
        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset code</TableHead>
                <TableHead>Asset Name</TableHead>
                <TableHead>Customer Asset No</TableHead>
                <TableHead>Barcode No</TableHead>
                <TableHead className="w-12">
                  <div className="w-4 h-4 rounded border border-primary bg-primary flex items-center justify-center">
                    <span className="text-xs text-primary-foreground">≡</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm">No data</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ChangeAssetCategory;
