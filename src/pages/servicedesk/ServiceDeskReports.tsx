
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { CalendarIcon, Filter, Eye, Settings2, Download, RefreshCw, Search, Check, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SidebarTrigger } from '@/components/ui/sidebar';
import FilterCard from '@/components/common/FilterCard';

const ServiceDeskReports = () => {
  const [filters, setFilters] = useState({
    serviceRequestType: '',
    status: '',
    levelFiveCompany: '',
    requestedBy: '',
    customer: ''
  });

  const [dateRange, setDateRange] = useState({
    fromDate: null as Date | null,
    toDate: null as Date | null
  });

  const availableColumns = [
    { key: 'serviceRequestType', label: 'Service Request Type' },
    { key: 'status', label: 'Status' },
    { key: 'serviceRequestNo', label: 'Service Request No' },
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'requestedBy', label: 'Requested By' },
    { key: 'requestedDateTime', label: 'Requested Date Time' },
    { key: 'requestedByEmailId', label: 'Requested By Email ID' },
    { key: 'requestedByEmployeeId', label: 'Requested By Employee ID' },
    { key: 'assignedTo', label: 'Assigned To' },
    { key: 'severity', label: 'Severity' },
    { key: 'priority', label: 'Priority' },
    { key: 'createdBy', label: 'Created By' },
    { key: 'createdDateTime', label: 'Created Date Time' }
  ];

  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    availableColumns.map(col => col.key) // Default to all columns selected
  );
  const [columnDropdownOpen, setColumnDropdownOpen] = useState(false);

  const [reportTabs] = useState([
    'Service Request Details',
    'Service Request Type',
    'Service Request SLA Met/SLA Violated',
    'Service Request Detail History',
    'Work Orders List',
    'Work Order Details',
    'Scheduled Work Order List',
    'Work Order Task Details',
    'Work Order Penalty'
  ]);

  const [activeTab, setActiveTab] = useState('Service Request Details');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns(prev => {
      if (prev.includes(columnKey)) {
        return prev.filter(key => key !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };

  const handleSelectAllColumns = () => {
    if (selectedColumns.length === availableColumns.length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(availableColumns.map(col => col.key));
    }
  };

  const handleViewReport = async () => {
    setIsGeneratingReport(true);
    console.log('Generating report with filters:', filters);
    console.log('Date range:', dateRange);
    console.log('Selected columns:', selectedColumns);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGeneratingReport(false);
  };

  const handleClearFilters = () => {
    setFilters({
      serviceRequestType: '',
      status: '',
      levelFiveCompany: '',
      requestedBy: '',
      customer: ''
    });
    setDateRange({
      fromDate: null,
      toDate: null
    });
  };

  const handleExportReport = () => {
    console.log('Exporting report...');
  };

  const filteredReportTabs = reportTabs.filter(tab =>
    tab.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getColumnDisplayText = () => {
    if (selectedColumns.length === 0) return 'No columns selected';
    if (selectedColumns.length === availableColumns.length) return 'All Columns';
    if (selectedColumns.length === 1) {
      const column = availableColumns.find(col => col.key === selectedColumns[0]);
      return column?.label || '';
    }
    return `${selectedColumns.length} columns selected`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <header className="bg-white border-b px-6 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Service Desk Reports</h1>
            <p className="text-sm text-gray-600">Generate comprehensive reports with advanced filtering and customization options</p>
          </div>
        </div>
      </header>

      <div className="px-6 pb-6 pt-6 space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Enhanced Left Sidebar - Report Types */}
          <div className="xl:col-span-1">
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-blue-600" />
                  Report Types
                </CardTitle>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-1 max-h-96 overflow-y-auto">
                {filteredReportTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "w-full text-left px-3 py-3 rounded-lg text-sm transition-all duration-200 flex items-center gap-2",
                      activeTab === tab
                        ? "bg-orange-100 text-orange-700 font-medium border border-orange-200 shadow-sm"
                        : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                    )}
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      activeTab === tab ? "bg-orange-500" : "bg-gray-300"
                    )} />
                    <span className="leading-tight">{tab}</span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Enhanced Filters Section */}
            <FilterCard
              title="Report Filters"
              actions={
                <>
                  <Button 
                    onClick={handleViewReport} 
                    disabled={isGeneratingReport}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isGeneratingReport ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={handleExportReport} 
                    variant="outline" 
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button 
                    onClick={handleClearFilters} 
                    variant="outline"
                  >
                    Clear All
                  </Button>
                </>
              }
            >
              <div className="space-y-6">
                {/* Primary Filters */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Primary Filters</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Service Request Type</Label>
                      <ReusableDropdown
                        value={filters.serviceRequestType}
                        onChange={(value) => handleFilterChange('serviceRequestType', value as string)}
                        placeholder="Select type"
                        allowClear
                        options={[
                          { value: 'incident', label: 'Incident' },
                          { value: 'request', label: 'Request' },
                          { value: 'change', label: 'Change' },
                          { value: 'problem', label: 'Problem' }
                        ]}
                        className="bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Status</Label>
                      <ReusableDropdown
                        value={filters.status}
                        onChange={(value) => handleFilterChange('status', value as string)}
                        placeholder="Select status"
                        allowClear
                        options={[
                          { value: 'open', label: 'Open' },
                          { value: 'in-progress', label: 'In Progress' },
                          { value: 'resolved', label: 'Resolved' },
                          { value: 'closed', label: 'Closed' }
                        ]}
                        className="bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Column Configuration</Label>
                      <Popover open={columnDropdownOpen} onOpenChange={setColumnDropdownOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={columnDropdownOpen}
                            className="w-full justify-between bg-white"
                          >
                            <span className="truncate">{getColumnDisplayText()}</span>
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search columns..." />
                            <CommandList>
                              <CommandEmpty>No columns found.</CommandEmpty>
                              <CommandGroup>
                                <CommandItem onSelect={handleSelectAllColumns}>
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedColumns.length === availableColumns.length
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <span className="font-medium">All Columns</span>
                                </CommandItem>
                                {availableColumns.map((column) => (
                                  <CommandItem
                                    key={column.key}
                                    onSelect={() => handleColumnToggle(column.key)}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedColumns.includes(column.key)
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {column.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Additional Filters</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Level Five Company</Label>
                      <ReusableDropdown
                        value={filters.levelFiveCompany}
                        onChange={(value) => handleFilterChange('levelFiveCompany', value as string)}
                        placeholder="Select company"
                        allowClear
                        showSearch
                        options={[
                          { value: 'company1', label: 'Company 1' },
                          { value: 'company2', label: 'Company 2' },
                          { value: 'company3', label: 'Company 3' }
                        ]}
                        className="bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Requested By</Label>
                      <ReusableDropdown
                        value={filters.requestedBy}
                        onChange={(value) => handleFilterChange('requestedBy', value as string)}
                        placeholder="Select user"
                        allowClear
                        showSearch
                        options={[
                          { value: 'user1', label: 'User 1' },
                          { value: 'user2', label: 'User 2' },
                          { value: 'user3', label: 'User 3' }
                        ]}
                        className="bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Customer</Label>
                      <ReusableDropdown
                        value={filters.customer}
                        onChange={(value) => handleFilterChange('customer', value as string)}
                        placeholder="Select customer"
                        allowClear
                        showSearch
                        options={[
                          { value: 'customer1', label: 'Customer 1' },
                          { value: 'customer2', label: 'Customer 2' },
                          { value: 'customer3', label: 'Customer 3' }
                        ]}
                        className="bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Date Range</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">From Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-white",
                              !dateRange.fromDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.fromDate ? format(dateRange.fromDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.fromDate}
                            onSelect={(date) => setDateRange(prev => ({ ...prev, fromDate: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">To Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-white",
                              !dateRange.toDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.toDate ? format(dateRange.toDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.toDate}
                            onSelect={(date) => setDateRange(prev => ({ ...prev, toDate: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            </FilterCard>

            {/* Report Preview Section */}
            {isGeneratingReport && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Report</h3>
                    <p className="text-gray-600">Please wait while we process your request...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDeskReports;
