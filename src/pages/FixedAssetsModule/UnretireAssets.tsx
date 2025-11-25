import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

interface RetiredAsset {
  id: string;
  assetCode: string;
  assetName: string;
  customerAssetNo: string;
  barcodeNo: string;
}

const mockRetiredAssets: RetiredAsset[] = [
  { id: '1', assetCode: 'ZHC/LFIC/TB/IMP/000306', assetName: 'New USER ATTR', customerAssetNo: 'ZHC/LFIC/TB/IMP/000306', barcodeNo: '12345_4' },
  { id: '2', assetCode: 'ZHC//CH/am/000001', assetName: 'My Componentized Asset Code', customerAssetNo: 'ZHC//CH/am/000001', barcodeNo: 'ZHC//CH/an' },
  { id: '3', assetCode: 'ZHC/LFIC/CH/prosa/000212', assetName: 'Test IP Both2', customerAssetNo: 'ZHC/LFIC/CH/prosa/000212', barcodeNo: 'ZHC/LFIC/CI' },
  { id: '4', assetCode: 'ZHC/LFIC/CH/am/000193', assetName: 'enter', customerAssetNo: 'ZHC/LFIC/CH/am/000193', barcodeNo: '467_2' },
  { id: '5', assetCode: 'ZHC/LFIC/CH/am/000192', assetName: 'enter', customerAssetNo: 'ZHC/LFIC/CH/am/000192', barcodeNo: '467_1' },
  { id: '6', assetCode: 'ZHC/LFIC/CH/nc/000138', assetName: 'new maintain check', customerAssetNo: 'ZHC/LFIC/CH/nc/000138', barcodeNo: 'ZHC/LFIC/CI' },
  { id: '7', assetCode: 'ZHC/LFIC/CH/SF/000096', assetName: 'Leased Asset with Attr', customerAssetNo: 'ZHC/LFIC/CH/SF/000096', barcodeNo: 'ZHC/LFIC/CI' },
];

const UnretireAssets = () => {
  const [assets, setAssets] = useState<RetiredAsset[]>(mockRetiredAssets);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAssets(assets.map(a => a.id));
    } else {
      setSelectedAssets([]);
    }
  };

  const handleSelectAsset = (assetId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssets([...selectedAssets, assetId]);
    } else {
      setSelectedAssets(selectedAssets.filter(id => id !== assetId));
    }
  };

  const handleUnretire = () => {
    if (selectedAssets.length === 0) {
      toast.error('Please select at least one asset to unretire');
      return;
    }
    toast.success(`${selectedAssets.length} asset(s) unretired successfully`);
    setAssets(assets.filter(a => !selectedAssets.includes(a.id)));
    setSelectedAssets([]);
  };

  return (
    <div className="min-h-screen bg-background transition-all duration-300 ease-in-out">
      <header className="bg-card border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Fixed Assets</span>
            <span>/</span>
            <span className="text-foreground font-medium">Unretire Assets</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Unretire Assets</h1>
          <Button 
            className="bg-[hsl(var(--chart-1))] hover:bg-[hsl(var(--chart-1))]/90"
            onClick={handleUnretire}
            disabled={selectedAssets.length === 0}
          >
            Unretire
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Asset"
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
                  <Checkbox
                    checked={selectedAssets.length === assets.length && assets.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
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
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedAssets.includes(asset.id)}
                      onCheckedChange={(checked) => handleSelectAsset(asset.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{asset.assetCode}</TableCell>
                  <TableCell className="text-muted-foreground">{asset.assetName}</TableCell>
                  <TableCell>{asset.customerAssetNo}</TableCell>
                  <TableCell>{asset.barcodeNo}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing 1 to 10 of 23 entries
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
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

export default UnretireAssets;
