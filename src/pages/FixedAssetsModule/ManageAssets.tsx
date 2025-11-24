import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Search, Calendar as CalendarIcon, Info } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Asset {
  id: string;
  assetCode: string;
  assetName: string;
  customerAssetNo: string;
  barcodeNo: string;
  selected?: boolean;
}

const mockAssets: Asset[] = [
  { id: '1', assetCode: 'ZHC/LFIC/TB/IMP/000306', assetName: 'New USER ATTR', customerAssetNo: 'ZHC/LFIC/TB/IMP/000306', barcodeNo: '12345_4' },
  { id: '2', assetCode: 'ZHC/LFIC/TB/IMP/000305', assetName: 'New USER ATTR', customerAssetNo: 'ZHC/LFIC/TB/IMP/000305', barcodeNo: '12345_3' },
  { id: '3', assetCode: 'ZHC/LFIC/TB/IMP/000304', assetName: 'New USER ATTR', customerAssetNo: 'ZHC/LFIC/TB/IMP/000304', barcodeNo: '12345_2' },
  { id: '4', assetCode: 'ZHC/LFIC/TB/IMP/000303', assetName: 'New USER ATTR', customerAssetNo: 'ZHC/LFIC/TB/IMP/000303', barcodeNo: '12345_1' },
  { id: '5', assetCode: 'ZHC//CH/am/000054', assetName: 'Componentized with Qty', customerAssetNo: 'ZHC//CH/am/000054', barcodeNo: 'ZHC//CH/am/0' },
  { id: '6', assetCode: 'ZHC//CH/SFs/000002', assetName: 'Componentized barcode test', customerAssetNo: 'test', barcodeNo: 'test' },
];

const ManageAssets = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [activeTab, setActiveTab] = useState('main');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showParametersModal, setShowParametersModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form states
  const [insuranceStartDate, setInsuranceStartDate] = useState<Date>();
  const [insuranceEndDate, setInsuranceEndDate] = useState<Date>();
  const [maintenanceFromDate, setMaintenanceFromDate] = useState<Date>();
  const [maintenanceToDate, setMaintenanceToDate] = useState<Date>();
  const [assignmentDate, setAssignmentDate] = useState<Date>();

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

  const handleInsuranceSubmit = () => {
    toast.success('Asset insurance details saved successfully');
    setShowInsuranceModal(false);
  };

  const handleMaintenanceSubmit = () => {
    toast.success('Asset maintenance details saved successfully');
    setShowMaintenanceModal(false);
  };

  const handleAssignmentSubmit = () => {
    toast.success('Asset assignment completed successfully');
    setShowAssignmentModal(false);
  };

  const handleDocumentSubmit = () => {
    toast.success('Document added successfully');
    setShowDocumentModal(false);
  };

  const handleDeleteAssets = () => {
    setAssets(assets.filter(a => !selectedAssets.includes(a.id)));
    setSelectedAssets([]);
    toast.success('Selected assets deleted successfully');
    setShowDeleteModal(false);
  };

  const handleAssetClick = (assetCode: string) => {
    navigate(`/fixedassets/manageassets/${assetCode}`);
  };

  return (
    // <div className="min-h-screen bg-background transition-all duration-300 ease-in-out">
    <ScrollArea className="h-full">

      <div className="bg-card border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Fixed Assets</span>
            <span>/</span>
            <span className="text-foreground font-medium">Manage Assets</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Manage Assets</h1>
            <Info className="h-5 w-5 text-primary" />
          </div>
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
              <SelectValue placeholder="level five department..." />
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

          <Button variant="outline" onClick={() => setShowParametersModal(true)}>More +</Button>
          <Button>Apply Filters</Button>
          <Button variant="outline">Reset</Button>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Asset"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => selectedAssets.length > 0 && setShowDeleteModal(true)}
              disabled={selectedAssets.length === 0}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
            <Button onClick={() => setShowAssignmentModal(true)}>Assignment</Button>
            <Button onClick={() => setShowMaintenanceModal(true)}>Maintenance</Button>
            <Button variant="outline" onClick={() => setShowDocumentModal(true)}>More +</Button>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedAssets.length === assets.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Asset code</TableHead>
                <TableHead>Asset Name</TableHead>
                <TableHead>Customer Asset No</TableHead>
                <TableHead>Barcode No</TableHead>
                <TableHead className="w-12"></TableHead>
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
                  <TableCell
                    className="text-primary font-medium cursor-pointer hover:underline"
                    onClick={() => handleAssetClick(asset.assetCode)}
                  >
                    {asset.assetCode}
                  </TableCell>
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
            Showing 1 to 10 of 412 entries
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">4</Button>
            <Button variant="outline" size="sm">5</Button>
            <Button variant="outline" size="sm">...</Button>
            <Button variant="outline" size="sm">42</Button>
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

      {/* Insurance Modal */}
      {/* <Dialog open={showInsuranceModal} onOpenChange={setShowInsuranceModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asset Insurance</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="policyNo">Insurance Policy No. <span className="text-destructive">*</span></Label>
              <Input id="policyNo" placeholder="Insurance Policy No." />
            </div>
            <div className="space-y-2">
              <Label>Start Date <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !insuranceStartDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {insuranceStartDate ? format(insuranceStartDate, "PPP") : "Insurance Start Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={insuranceStartDate} onSelect={setInsuranceStartDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Date <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !insuranceEndDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {insuranceEndDate ? format(insuranceEndDate, "PPP") : "Insurance End Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={insuranceEndDate} onSelect={setInsuranceEndDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount <span className="text-destructive">*</span></Label>
              <Input id="amount" placeholder="Amount" type="number" />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="vendor">Vendor <span className="text-destructive">*</span></Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendor1">Vendor 1</SelectItem>
                  <SelectItem value="vendor2">Vendor 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInsuranceModal(false)}>Clear</Button>
            <Button onClick={handleInsuranceSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* Maintenance Modal */}
      {/* <Dialog open={showMaintenanceModal} onOpenChange={setShowMaintenanceModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asset Maintenance</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Date <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !maintenanceFromDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {maintenanceFromDate ? format(maintenanceFromDate, "PPP") : "Maintenance From Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={maintenanceFromDate} onSelect={setMaintenanceFromDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>To Date <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !maintenanceToDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {maintenanceToDate ? format(maintenanceToDate, "PPP") : "Maintenance To Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={maintenanceToDate} onSelect={setMaintenanceToDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenanceCost">Maintenance Cost <span className="text-destructive">*</span></Label>
              <Input id="maintenanceCost" placeholder="Maintenance Cost" type="number" />
            </div>
            <div className="space-y-2">
              <Label>Maintenance Type <span className="text-destructive">*</span></Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Maintenance Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventive">Preventive</SelectItem>
                  <SelectItem value="corrective">Corrective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendor1">Vendor 1</SelectItem>
                  <SelectItem value="vendor2">Vendor 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="engineer">Service Engineer</Label>
              <Input id="engineer" placeholder="Service Engineer" />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Description" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMaintenanceModal(false)}>Clear</Button>
            <Button onClick={handleMaintenanceSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* Assignment Modal */}
      {/* <Dialog open={showAssignmentModal} onOpenChange={setShowAssignmentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asset Assignment</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>User Name <span className="text-destructive">*</span></Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select User Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">User 1</SelectItem>
                  <SelectItem value="user2">User 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assigned Date <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !assignmentDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {assignmentDate ? format(assignmentDate, "PPP") : "Assignment Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={assignmentDate} onSelect={setAssignmentDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignmentModal(false)}>Clear</Button>
            <Button onClick={handleAssignmentSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* Document Modal */}
      {/* <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="docName">Name <span className="text-destructive">*</span></Label>
              <Input id="docName" placeholder="Name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="docFile">Select File</Label>
              <div className="flex gap-2">
                <Input id="docFile" placeholder="Choose file" disabled />
                <Button variant="outline">Browse</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="docDesc">Description</Label>
              <Textarea id="docDesc" placeholder="Description" rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocumentModal(false)}>Clear</Button>
            <Button onClick={handleDocumentSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* Parameters Modal */}
      {/* <Dialog open={showParametersModal} onOpenChange={setShowParametersModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Parameters</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="level five cost center" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cc1">Cost Center 1</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Asset Code" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seller" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seller1">Seller 1</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Barcode No" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Manufacturer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mfg1">Manufacturer 1</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Customer AssetNo" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Assigned To" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user1">User 1</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="PO Number" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Acquisition Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purchase">Purchase</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Bill No" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Dependency Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dep1">Type 1</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Working Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="working">Working</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Retire Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="User Attributes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attr1">Attribute 1</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Purchased Price From" type="number" />
            <Input placeholder="Purchased Price To" type="number" />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Assets Under Warranty Fro...
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" initialFocus className="pointer-events-auto" />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Assets Under Warranty to D...
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" initialFocus className="pointer-events-auto" />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Assets Under Insurance Fro...
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" initialFocus className="pointer-events-auto" />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Assets Under Insurance to ...
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" initialFocus className="pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <Button variant="outline">Reset</Button>
            <Button onClick={() => setShowParametersModal(false)}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* Delete Confirmation Modal */}
      {/* <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              Delete All Button Will Delete All Assets And Could Not Revert Back.
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="justify-center">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAssets}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </ScrollArea>
  );
};

export default ManageAssets;
