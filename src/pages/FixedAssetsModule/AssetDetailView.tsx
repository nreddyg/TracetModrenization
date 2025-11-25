import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  ChevronLeft, ChevronRight, Trash2, MoreVertical, Calendar as CalendarIcon,
  FileText, User, ArrowRightLeft, Shield, Wrench, Power, Settings,
  GitBranch, ClipboardCheck, History
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type ViewSection = 'details' | 'shiftwise' | 'documents' | 'assign' | 'transfer' | 
  'insurance' | 'maintenance' | 'retire' | 'service' | 'children' | 'verification' | 'history';

const AssetDetailView = () => {
  const navigate = useNavigate();
  const { assetId } = useParams();
  const [activeSection, setActiveSection] = useState<ViewSection>('details');
  const [showRetireModal, setShowRetireModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [retireDate, setRetireDate] = useState<Date>();
  const [insuranceStartDate, setInsuranceStartDate] = useState<Date>();
  const [insuranceEndDate, setInsuranceEndDate] = useState<Date>();
  const [maintenanceStartDate, setMaintenanceStartDate] = useState<Date>();
  const [maintenanceEndDate, setMaintenanceEndDate] = useState<Date>();
  const [assignmentDate, setAssignmentDate] = useState<Date>();

  // Mock data
  const assetData = {
    code: assetId || 'ZHC/LFIC/TB/IMP/000306',
    name: 'New USER ATTR',
    customerAssetNo: 'ZHC/LFIC/TB/IMP/000306',
    isRetired: true,
    retirementType: 'Sold',
    retiredOn: '03/10/2025',
    soldAmount: '12345432',
    soldTo: 'Gnapika Traders',
    taxAmount: '0',
    consumptionType: 'Extended Warranty',
    invoiceSerialNo: '23451234',
    serviceCardNo: '',
    invoiceDate: '11/10/2025',
    assignedTo: 'Nagendra Venkata'
  };

  const historyData = [
    { assetCode: 'ZHC/LFIC/TB/IMP/000306', action: 'Asset is retired', doneBy: 'Sachin', date: '29/09/2025' },
    { assetCode: 'ZHC/LFIC/TB/IMP/000306', action: 'Assignment Details Changed', doneBy: 'Nagendra', date: '23/06/2025' },
    { assetCode: 'ZHC/LFIC/TB/IMP/000306', action: 'Asset Added', doneBy: 'Nagendra', date: '23/06/2025' }
  ];

  const assignmentHistory = [
    { assignFrom: '', assignTo: 'Nagendra Venkata', assignedOn: '23/06/2025', initiatedBy: 'Nagendra Venkata' }
  ];

  const transferHistory = [
    { fromLocation: 'INDIA->TELANGANA->HYDERABAD->KONDAPUR->Hitex', toLocation: 'Gajuwaka->Pendurthi->Ananthagiri->Koyyuruu->Chintapalli' },
    { fromLocation: 'INDIA->TELANGANA->HYDERABAD->KONDAPUR->Hitex', toLocation: 'INDIA->TELANGANA->HYDERABAD->KONDAPUR->Hitex' }
  ];

  const physicalVerificationData: any[] = [];

  const [retireFormData, setRetireFormData] = useState({
    retireType: 'Sold',
    consumptionType: '',
    soldTo: '',
    amount: '',
    invoiceSerialNo: '',
    serviceCardNo: '',
    invoiceDate: undefined as Date | undefined,
    taxAmount: '',
    retireDate: undefined as Date | undefined,
    description: ''
  });

  const menuItems = [
    { id: 'details' as ViewSection, label: 'Asset Details', icon: FileText },
    { id: 'shiftwise' as ViewSection, label: 'Shift Wise', icon: GitBranch },
    { id: 'documents' as ViewSection, label: 'Documents', icon: FileText },
    { id: 'assign' as ViewSection, label: 'Assign', icon: User },
    { id: 'transfer' as ViewSection, label: 'Transfer', icon: ArrowRightLeft },
    { id: 'insurance' as ViewSection, label: 'Insurance', icon: Shield },
    { id: 'maintenance' as ViewSection, label: 'Maintenance', icon: Wrench },
    { id: 'retire' as ViewSection, label: 'Retire', icon: Power },
    { id: 'service' as ViewSection, label: 'Service Maintenance', icon: Settings },
    { id: 'children' as ViewSection, label: 'Child Assets', icon: GitBranch },
    { id: 'verification' as ViewSection, label: 'Physical Verification', icon: ClipboardCheck },
    { id: 'history' as ViewSection, label: 'Asset History', icon: History }
  ];

  const handleRetireSubmit = () => {
    toast.success('Asset retired successfully');
    setShowRetireModal(false);
  };

  const handleInsuranceSubmit = () => {
    toast.success('Insurance record added successfully');
    setShowInsuranceModal(false);
  };

  const handleMaintenanceSubmit = () => {
    toast.success('Maintenance record added successfully');
    setShowMaintenanceModal(false);
  };

  const handleDocumentSubmit = () => {
    toast.success('Document added successfully');
    setShowDocumentModal(false);
  };

  const handleAssignmentSubmit = () => {
    toast.success('Asset assigned successfully');
    setShowAssignmentModal(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'history':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Asset History: <span className="text-orange-500">({assetData.code})</span>{' '}
                {assetData.isRetired && <span className="text-red-500">(Retired)</span>}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Trash2 className="h-4 w-4" /></Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setActiveSection('details')}>View Asset Details</DropdownMenuItem>
                    <DropdownMenuItem>Clone</DropdownMenuItem>
                    <DropdownMenuItem>Asset Card</DropdownMenuItem>
                    <DropdownMenuItem>Group Asset Card</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <Card className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Code</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Done By</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.assetCode}</TableCell>
                      <TableCell>{item.action}</TableCell>
                      <TableCell>{item.doneBy}</TableCell>
                      <TableCell>{item.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        );

      case 'retire':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Retire: <span className="text-orange-500">({assetData.code})</span>{' '}
                {assetData.isRetired && <span className="text-red-500">(Retired)</span>}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Trash2 className="h-4 w-4" /></Button>
                <Button className="bg-orange-500 hover:bg-orange-600">Save</Button>
                <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>

            {assetData.isRetired ? (
              // View Mode - Already Retired
              <>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
                  <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center">!</div>
                  <span className="text-red-600 font-semibold">This Asset is Retired</span>
                </div>
                <Card className="p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <Label className="text-sm text-gray-600">Retirement Type : {assetData.retirementType}</Label>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">With Reason :</Label>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Retired On : {assetData.retiredOn}</Label>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Sold Amount Is : {assetData.soldAmount}</Label>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Tax/GST Amount : {assetData.taxAmount}</Label>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Sold To : {assetData.soldTo}</Label>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Consumption Type : {assetData.consumptionType}</Label>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Invoice Serial NO : {assetData.invoiceSerialNo}</Label>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Service Card No : {assetData.serviceCardNo || '-'}</Label>
                    </div>
                    <div className="col-span-3">
                      <Label className="text-sm text-gray-600">Invoice Date : {assetData.invoiceDate}</Label>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-4">
                    <Button className="bg-orange-500 hover:bg-orange-600">View Sale Memo</Button>
                    <Button className="bg-orange-500 hover:bg-orange-600">View Sale Invoice</Button>
                  </div>
                </Card>
              </>
            ) : (
              // Edit Mode - Retire Form
              <Card className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <Label>Retire Type *</Label>
                    <Select value={retireFormData.retireType} onValueChange={(val) => setRetireFormData({...retireFormData, retireType: val})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sold">Sold</SelectItem>
                        <SelectItem value="Scrapped">Scrapped</SelectItem>
                        <SelectItem value="Donated">Donated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Consumption Type *</Label>
                    <Select value={retireFormData.consumptionType} onValueChange={(val) => setRetireFormData({...retireFormData, consumptionType: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Consumption Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Extended Warranty">Extended Warranty</SelectItem>
                        <SelectItem value="Normal">Normal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Sold To *</Label>
                    <Select value={retireFormData.soldTo} onValueChange={(val) => setRetireFormData({...retireFormData, soldTo: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gnapika Traders">Gnapika Traders</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Amount *</Label>
                    <Input type="number" value={retireFormData.amount} onChange={(e) => setRetireFormData({...retireFormData, amount: e.target.value})} />
                  </div>
                  <div>
                    <Label>Invoice Serial Number *</Label>
                    <Input value={retireFormData.invoiceSerialNo} onChange={(e) => setRetireFormData({...retireFormData, invoiceSerialNo: e.target.value})} />
                  </div>
                  <div>
                    <Label>Service Card No</Label>
                    <Input value={retireFormData.serviceCardNo} onChange={(e) => setRetireFormData({...retireFormData, serviceCardNo: e.target.value})} />
                  </div>
                  <div>
                    <Label>Invoice Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !retireFormData.invoiceDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {retireFormData.invoiceDate ? format(retireFormData.invoiceDate, 'dd/MM/yyyy') : <span>DD/MM/YYYY</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={retireFormData.invoiceDate} onSelect={(date) => setRetireFormData({...retireFormData, invoiceDate: date})} initialFocus className="pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>Tax/GST Amount</Label>
                    <Input type="number" value={retireFormData.taxAmount} onChange={(e) => setRetireFormData({...retireFormData, taxAmount: e.target.value})} />
                  </div>
                  <div>
                    <Label>Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !retireFormData.retireDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {retireFormData.retireDate ? format(retireFormData.retireDate, 'dd/MM/yyyy') : <span>DD/MM/YYYY</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={retireFormData.retireDate} onSelect={(date) => setRetireFormData({...retireFormData, retireDate: date})} initialFocus className="pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="col-span-3">
                    <Label>Description</Label>
                    <Textarea value={retireFormData.description} onChange={(e) => setRetireFormData({...retireFormData, description: e.target.value})} rows={4} />
                  </div>
                </div>
              </Card>
            )}
          </div>
        );

      case 'assign':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Currently Assigned To: <span className="text-orange-500">({assetData.assignedTo})</span>
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Trash2 className="h-4 w-4" /></Button>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setShowAssignmentModal(true)}>Add New</Button>
                <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600 mb-4">Free Asset</Button>
            <Card className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assign From</TableHead>
                    <TableHead>Assign To</TableHead>
                    <TableHead>Assigned On</TableHead>
                    <TableHead>Assignment Initiated By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignmentHistory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.assignFrom || '-'}</TableCell>
                      <TableCell>{item.assignTo}</TableCell>
                      <TableCell>{item.assignedOn}</TableCell>
                      <TableCell>{item.initiatedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 text-sm text-gray-600">Showing 1 to 1 of 1 entries</div>
            </Card>
          </div>
        );

      case 'children':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Child Assets: <span className="text-orange-500">({assetData.code})</span>{' '}
                {assetData.isRetired && <span className="text-red-500">(Retired)</span>}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Trash2 className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>
            <Card className="p-6">
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-500">No data</p>
              </div>
            </Card>
          </div>
        );

      case 'documents':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Asset Documents: <span className="text-orange-500">({assetData.code})</span>
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Trash2 className="h-4 w-4" /></Button>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setShowDocumentModal(true)}>Add New</Button>
                <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>
            <Card className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-gray-500">No data</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </div>
        );

      case 'insurance':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Insurance: <span className="text-orange-500">({assetData.code})</span>
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Trash2 className="h-4 w-4" /></Button>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setShowInsuranceModal(true)}>Add New</Button>
                <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>
            <Card className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy Number</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500">No data</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </div>
        );

      case 'maintenance':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Maintenance: <span className="text-orange-500">({assetData.code})</span>
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Trash2 className="h-4 w-4" /></Button>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setShowMaintenanceModal(true)}>Add New</Button>
                <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>
            <Card className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Maintenance Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Vendor Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-gray-500">No data</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </div>
        );

      case 'service':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Service Maintenance: <span className="text-orange-500">({assetData.code})</span>{' '}
                {assetData.isRetired && <span className="text-red-500">(Retired)</span>}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Trash2 className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>
            <Card className="p-6">
              <Tabs defaultValue="logs">
                <TabsList>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                  <TabsTrigger value="readings">Readings</TabsTrigger>
                  <TabsTrigger value="history">Service Maintenance History</TabsTrigger>
                </TabsList>

                <TabsContent value="logs" className="mt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>Show Log For The Period</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal text-muted-foreground">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              DD/MM/YYYY
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" initialFocus className="pointer-events-auto" />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label>To</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal text-muted-foreground">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              DD/MM/YYYY
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" initialFocus className="pointer-events-auto" />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>log Date</TableHead>
                          <TableHead>log Time</TableHead>
                          <TableHead>Work Order Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-12 text-gray-500">No data</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="readings" className="mt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Unit Of Measure*</Label>
                        <Input placeholder="Enter Units" />
                        <span className="text-xs text-gray-500">(Kg,Miles,.....)</span>
                      </div>
                      <div>
                        <Label>Schedule Tasks By *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="option1">Option 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button className="bg-orange-500 hover:bg-orange-600">Submit Units</Button>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Maintenance History *</Label>
                      <Select defaultValue="workorders">
                        <SelectTrigger className="w-64">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="workorders">Work Orders</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Work Order No</TableHead>
                          <TableHead>Work Order Title</TableHead>
                          <TableHead>Work Order Type</TableHead>
                          <TableHead>Start Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12 text-gray-500">No data</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        );

      case 'shiftwise':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Add Shift Details: <span className="text-orange-500">({assetData.code})</span>{' '}
                {assetData.isRetired && <span className="text-red-500">(Retired)</span>}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Trash2 className="h-4 w-4" /></Button>
                <Button className="bg-orange-500 hover:bg-orange-600">Save</Button>
                <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>
            <Card className="p-6">
              <Tabs defaultValue="add">
                <TabsList>
                  <TabsTrigger value="add">Add</TabsTrigger>
                  <TabsTrigger value="view">View</TabsTrigger>
                </TabsList>

                <TabsContent value="add" className="mt-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Date Range *</Label>
                        <div className="flex items-center gap-2 border rounded-md px-3 py-2">
                          <span className="text-sm text-muted-foreground">Start date</span>
                          <span>-</span>
                          <span className="text-sm text-muted-foreground">End date</span>
                          <CalendarIcon className="ml-auto h-4 w-4" />
                        </div>
                      </div>
                      <div>
                        <Label>Shift Type *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Shift Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning</SelectItem>
                            <SelectItem value="evening">Evening</SelectItem>
                            <SelectItem value="night">Night</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Exclude Days (Max: 6)</Label>
                      <div className="grid grid-cols-7 gap-2 mt-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                          <div key={day} className="text-center py-2 border rounded">{day}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="view" className="mt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Financial Year *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal text-muted-foreground">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              Select Financial Year
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" initialFocus className="pointer-events-auto" />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label>Month *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="jan">January</SelectItem>
                            <SelectItem value="feb">February</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Shift Date</TableHead>
                          <TableHead>Shift Type</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-12 text-gray-500">No data</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        );

      case 'transfer':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Transfer: <span className="text-orange-500">({assetData.code})</span>
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Trash2 className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">From Location</h3>
                  {transferHistory.map((transfer, idx) => (
                    <div key={idx} className="mb-2 text-sm">{transfer.fromLocation}</div>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold mb-4">To Location</h3>
                  {transferHistory.map((transfer, idx) => (
                    <div key={idx} className="mb-2 text-sm">{transfer.toLocation}</div>
                  ))}
                </div>
              </div>
              <div className="mt-6 text-sm text-gray-600">
                Showing 1 to 2 of 2 entries
              </div>
            </Card>
          </div>
        );

      case 'verification':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Physical Verification: <span className="text-orange-500">({assetData.code})</span>{' '}
                {assetData.isRetired && <span className="text-red-500">(Retired)</span>}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Trash2 className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>
            <Card className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action Done By</TableHead>
                    <TableHead>Asset Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {physicalVerificationData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <p className="text-gray-500">No data</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    physicalVerificationData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.actionBy}</TableCell>
                        <TableCell>{item.status}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.remarks}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        );
      default:
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Edit Asset: <span className="text-orange-500">{assetData.code}</span>
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Trash2 className="h-4 w-4" /></Button>
                <Button className="bg-orange-500 hover:bg-orange-600">Update</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Asset Details</DropdownMenuItem>
                    <DropdownMenuItem>Clone</DropdownMenuItem>
                    <DropdownMenuItem>Asset Card</DropdownMenuItem>
                    <DropdownMenuItem>Group Asset Card</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <Card className="p-6">
              <Tabs defaultValue="asset-details">
                <TabsList>
                  <TabsTrigger value="asset-details">Asset Details</TabsTrigger>
                  <TabsTrigger value="purchase">Purchase Details</TabsTrigger>
                  <TabsTrigger value="allocation">Allocation Details</TabsTrigger>
                  <TabsTrigger value="depreciation">Depreciation</TabsTrigger>
                </TabsList>
                <TabsContent value="asset-details" className="mt-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <Label>Name *</Label>
                      <Input defaultValue={assetData.name} />
                    </div>
                    <div>
                      <Label>Acquisition Type *</Label>
                      <Select defaultValue="purchased">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="purchased">Purchased</SelectItem>
                          <SelectItem value="leased">Leased</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Customer Asset No</Label>
                      <Input defaultValue={assetData.customerAssetNo} />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input type="number" defaultValue="1" />
                    </div>
                    <div>
                      <Label>Dependency Type *</Label>
                      <Select defaultValue="independent">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="independent">Independent</SelectItem>
                          <SelectItem value="dependent">Dependent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Main Category</Label>
                      <Select defaultValue="table">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="table">Table</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/fixedassets/manageassets')}>
              Fixed Assets
            </span>
            <span>/</span>
            <span className="cursor-pointer hover:text-gray-900" onClick={() => navigate('/fixedassets/manageassets')}>
              Manage Assets
            </span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Asset Details</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar Menu */}
        <div className="w-64 bg-white border-r min-h-screen p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                    activeSection === item.id 
                      ? "bg-orange-50 text-orange-600" 
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                  {activeSection === item.id && <ChevronRight className="h-4 w-4 ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>

      {/* Retirement Modal */}
      <Dialog open={showRetireModal} onOpenChange={setShowRetireModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asset Retirement</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Retire Type *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Retire Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="scrapped">Scrapped</SelectItem>
                  <SelectItem value="donated">Donated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !retireDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {retireDate ? format(retireDate, 'PPP') : <span>Retirement Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={retireDate} onSelect={setRetireDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea placeholder="Description" rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRetireModal(false)}>Clear</Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleRetireSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Insurance Modal */}
      <Dialog open={showInsuranceModal} onOpenChange={setShowInsuranceModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Insurance</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Policy Number *</Label>
              <Input placeholder="Policy Number" />
            </div>
            <div>
              <Label>Amount *</Label>
              <Input type="number" placeholder="Amount" />
            </div>
            <div>
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !insuranceStartDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {insuranceStartDate ? format(insuranceStartDate, 'PPP') : <span>Start Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={insuranceStartDate} onSelect={setInsuranceStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !insuranceEndDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {insuranceEndDate ? format(insuranceEndDate, 'PPP') : <span>End Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={insuranceEndDate} onSelect={setInsuranceEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="col-span-2">
              <Label>Vendor *</Label>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInsuranceModal(false)}>Clear</Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleInsuranceSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Maintenance Modal */}
      <Dialog open={showMaintenanceModal} onOpenChange={setShowMaintenanceModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Maintenance</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>From Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !maintenanceStartDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {maintenanceStartDate ? format(maintenanceStartDate, 'PPP') : <span>From Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={maintenanceStartDate} onSelect={setMaintenanceStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>To Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !maintenanceEndDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {maintenanceEndDate ? format(maintenanceEndDate, 'PPP') : <span>To Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={maintenanceEndDate} onSelect={setMaintenanceEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Maintenance Cost</Label>
              <Input type="number" placeholder="Cost" />
            </div>
            <div>
              <Label>Maintenance Type *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventive">Preventive</SelectItem>
                  <SelectItem value="corrective">Corrective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Vendor *</Label>
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
            <div>
              <Label>Engineer *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Engineer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eng1">Engineer 1</SelectItem>
                  <SelectItem value="eng2">Engineer 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea placeholder="Maintenance Description" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMaintenanceModal(false)}>Clear</Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleMaintenanceSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Modal */}
      <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Document Name *</Label>
              <Input placeholder="Document Name" />
            </div>
            <div>
              <Label>Upload File *</Label>
              <Input type="file" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Document Description" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocumentModal(false)}>Cancel</Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleDocumentSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assignment Modal */}
      <Dialog open={showAssignmentModal} onOpenChange={setShowAssignmentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Asset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Assign To *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">User 1</SelectItem>
                  <SelectItem value="user2">User 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Assigned Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !assignmentDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {assignmentDate ? format(assignmentDate, 'PPP') : <span>Select Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={assignmentDate} onSelect={setAssignmentDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignmentModal(false)}>Cancel</Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleAssignmentSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssetDetailView;
