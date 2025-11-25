import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Asset {
  id: string;
  assetCode: string;
  assetName: string;
  customerAssetNo: string;
  barcodeNo: string;
}

const mockAssets: Asset[] = [
  { id: '1', assetCode: 'ZHC//CH/am/000054', assetName: 'Componentized with Qty', customerAssetNo: 'ZHC//CH/am/000054', barcodeNo: 'ZHC//CH/am/0000' },
  { id: '2', assetCode: 'ZHC//CH/SFs/000002', assetName: 'Componentized barcode test', customerAssetNo: 'test', barcodeNo: 'test' },
  { id: '3', assetCode: 'ZHC/LFIC/CH/SFs/000302', assetName: 'Independent Both All Barcode Testing', customerAssetNo: 'ZHC/LFIC/CH/SFs/000302', barcodeNo: 'ZHC/LFIC/CH/SFs/' },
  { id: '4', assetCode: 'ZHC/LFIC/CH/nc/000301', assetName: 'Leased Asset', customerAssetNo: 'ZHC/LFIC/CH/nc/000301', barcodeNo: 'ZHC/LFIC/CH/nc/0' },
  { id: '5', assetCode: 'ZHC/LFIC/CH/CHS/000300', assetName: 'Purchase testA', customerAssetNo: 'ZHC/LFIC/CH/CHS/000300', barcodeNo: 'ZHC/LFIC/CH/CHS' },
  { id: '6', assetCode: 'ZHC/LFIC/CH/CHS/000299', assetName: 'Purchase testA emptydates', customerAssetNo: 'ZHC/LFIC/CH/CHS/000299', barcodeNo: '1231231345' },
  { id: '7', assetCode: 'ZHC/LFIC/CH/CHS/000298', assetName: 'Purchase testA emptydates', customerAssetNo: 'ZHC/LFIC/CH/CHS/000298', barcodeNo: '123123134' },
];

const AssetSplit = () => {
  const [assets] = useState<Asset[]>(mockAssets);
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-background transition-all duration-300 ease-in-out">
      <header className="bg-card border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Fixed Assets</span>
            <span>/</span>
            <span className="text-foreground font-medium">Asset Split</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Asset Split</h1>
          <Button className="bg-[#FF9800] hover:bg-[#F57C00] text-white">Split Asset</Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Ass..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="level five locati..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="loc1">Location 1</SelectItem>
              <SelectItem value="loc2">Location 2</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="level five depa..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dept1">Department 1</SelectItem>
              <SelectItem value="dept2">Department 2</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Main Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cat1">Category 1</SelectItem>
              <SelectItem value="cat2">Category 2</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sub Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sub1">Sub Category 1</SelectItem>
              <SelectItem value="sub2">Sub Category 2</SelectItem>
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
                <TableHead className="w-12">
                  <div className="w-4 h-4 rounded border border-primary bg-primary flex items-center justify-center">
                    <span className="text-xs text-primary-foreground">≡</span>
                  </div>
                </TableHead>
                <TableHead>Asset code</TableHead>
                <TableHead>Asset Name</TableHead>
                <TableHead>Customer Asset No</TableHead>
                <TableHead>Barcode No</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset, index) => (
                <TableRow key={asset.id}>
                  <TableCell>
                    <div 
                      className={cn(
                        "w-4 h-4 rounded-full border-2 cursor-pointer",
                        index === 0 
                          ? "border-primary bg-primary" 
                          : "border-muted-foreground"
                      )}
                      onClick={() => setSelectedAsset(asset.id)}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{asset.assetCode}</TableCell>
                  <TableCell className="text-muted-foreground">{asset.assetName}</TableCell>
                  <TableCell>{asset.customerAssetNo}</TableCell>
                  <TableCell>{asset.barcodeNo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing 1 to 10 of 327 entries
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">4</Button>
            <Button variant="outline" size="sm">5</Button>
            <Button variant="outline" size="sm">...</Button>
            <Button variant="outline" size="sm">33</Button>
          </div>
          <Select defaultValue="10">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / Page</SelectItem>
              <SelectItem value="25">25 / Page</SelectItem>
              <SelectItem value="50">50 / Page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AssetSplit;
