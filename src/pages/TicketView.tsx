import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReusableUpload, UploadFile } from '@/components/ui/reusable-upload';
import { ReusableRichTextEditor } from '@/components/ui/reusable-rich-text-editor';
import { ReusableTimePicker } from '@/components/ui/reusable-time-picker';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ReusableMultiSelect } from '@/components/ui/reusable-multi-select';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, Edit, Save, X, Clock, User, Calendar, Tag, Paperclip, Link, MoreHorizontal, Copy, Trash2, CheckCircle, Search, ChevronLeft, ChevronRight, Bell, UserCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { useForm } from 'react-hook-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion';
import { Separator } from '@radix-ui/react-separator';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import ReusableTable from '@/components/ui/reusable-table';

interface ChangeHistory {
  id: string;
  timestamp: string;
  user: string;
  field: string;
  oldValue: string;
  newValue: string;
  changeType: 'field_change' | 'status_change' | 'comment' | 'attachment';
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  type: 'Bug' | 'Feature' | 'Request' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo: string;
  createdBy: string;
  createdOn: string;
  estimatedTime: string;
  sprintNo?: string;
  assetCode?: string;
  tags: string[];
  attachments: string[];
  linkedTickets: string[];
}

interface ActivityLog {
  id: string;
  user: string;
  date: string;
  app: string;
  description: string;
  hoursSpent: string;
  status: 'Linked' | 'Unlinked' | 'Manual Entry';
}

interface Comment {
  id: string;
  user: string;
  date: string;
  text: string;
  type: 'comment' | 'status_change' | 'time_logged';
}
const mockTickets: Ticket[] = [
  {
    id: 'TCK-10245',
    title: 'Fix UI in Login Form',
    description: 'The login form has alignment issues on mobile devices. The submit button is not properly aligned and the input fields overlap on smaller screens.',
    type: 'Bug',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'John Doe',
    createdBy: 'Jane Smith',
    createdOn: '2025-06-10',
    estimatedTime: '4h',
    sprintNo: 'Sprint-14',
    assetCode: 'LAP-0921',
    tags: ['UI', 'High Impact', 'Mobile'],
    attachments: ['login-form-screenshot.png', 'mobile-view.jpg'],
    linkedTickets: ['TCK-10241', 'TCK-10242'],
  },
  {
    id: 'TCK-10246',
    title: 'Add Dashboard Analytics',
    description: 'Implement comprehensive analytics dashboard with charts and metrics for user engagement and system performance.',
    type: 'Feature',
    priority: 'Medium',
    status: 'Open',
    assignedTo: 'Alice Johnson',
    createdBy: 'Bob Wilson',
    createdOn: '2025-06-11',
    estimatedTime: '8h',
    sprintNo: 'Sprint-15',
    assetCode: 'LAP-0922',
    tags: ['Analytics', 'Dashboard', 'Charts'],
    attachments: ['dashboard-mockup.png'],
    linkedTickets: ['TCK-10247'],
  },
  {
    id: 'TCK-10247',
    title: 'Update User Profile Settings',
    description: 'Enhance user profile page with additional settings and preferences options.',
    type: 'Request',
    priority: 'Low',
    status: 'Resolved',
    assignedTo: 'Mike Brown',
    createdBy: 'Sarah Davis',
    createdOn: '2025-06-09',
    estimatedTime: '2h',
    assetCode: 'LAP-0923',
    tags: ['Profile', 'Settings'],
    attachments: [],
    linkedTickets: [],
  },
  {
    id: 'TCK-10248',
    title: 'Performance Optimization',
    description: 'Optimize database queries and improve overall application performance.',
    type: 'Bug',
    priority: 'Critical',
    status: 'Open',
    assignedTo: 'David Lee',
    createdBy: 'Emma Wilson',
    createdOn: '2025-06-12',
    estimatedTime: '6h',
    sprintNo: 'Sprint-14',
    assetCode: 'LAP-0924',
    tags: ['Performance', 'Database', 'Optimization'],
    attachments: ['performance-report.pdf'],
    linkedTickets: ['TCK-10245'],
  },
];

const mockChangeHistory: ChangeHistory[] = [
  {
    id: '1',
    timestamp: '2025-06-13 10:30:00',
    user: 'John Doe',
    field: 'status',
    oldValue: 'Open',
    newValue: 'In Progress',
    changeType: 'status_change'
  },
  {
    id: '2',
    timestamp: '2025-06-12 14:15:00',
    user: 'Jane Smith',
    field: 'priority',
    oldValue: 'Medium',
    newValue: 'High',
    changeType: 'field_change'
  },
  {
    id: '3',
    timestamp: '2025-06-11 09:00:00',
    user: 'Jane Smith',
    field: 'assignedTo',
    oldValue: 'Unassigned',
    newValue: 'John Doe',
    changeType: 'field_change'
  },
  {
    id: '4',
    timestamp: '2025-06-10 16:45:00',
    user: 'Jane Smith',
    field: 'description',
    oldValue: 'Login form has issues',
    newValue: 'The login form has alignment issues on mobile devices. The submit button is not properly aligned and the input fields overlap on smaller screens.',
    changeType: 'field_change'
  }
];

const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    user: 'John Doe',
    date: '2025-06-13',
    app: 'VS Code',
    description: 'Fixed alignment issues in login component',
    hoursSpent: '01:30',
    status: 'Linked',
  },
  {
    id: '2',
    user: 'John Doe',
    date: '2025-06-12',
    app: 'Chrome',
    description: 'Testing UI changes',
    hoursSpent: '00:45',
    status: 'Linked',
  },
];

const mockComments: Comment[] = [
  {
    id: '1',
    user: 'Jane Smith',
    date: '2025-06-10 09:00',
    text: 'Ticket created',
    type: 'comment',
  },
  {
    id: '2',
    user: 'John Doe',
    date: '2025-06-11 14:30',
    text: 'Started working on the mobile responsiveness issue',
    type: 'comment',
  },
  {
    id: '3',
    user: 'System',
    date: '2025-06-12 10:15',
    text: 'Status changed from Open to In Progress',
    type: 'status_change',
  },
];

const TicketView = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [tickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(id || mockTickets[0].id);
  const [selectedTicket, setSelectedTicket] = useState<Ticket>(mockTickets.find(t => t.id === selectedTicketId) || mockTickets[0]);
  const [originalTicket, setOriginalTicket] = useState<Ticket>(selectedTicket);
  const [hasChanges, setHasChanges] = useState(false);
  const [changeHistory] = useState<ChangeHistory[]>(mockChangeHistory);
  const [activityLogs] = useState<ActivityLog[]>(mockActivityLogs);
  const [comments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isInboxCollapsed, setIsInboxCollapsed] = useState(false);
  const [attachments, setAttachments] = useState<UploadFile[]>([]);
  const [estimatedTime, setEstimatedTime] = useState('08:00');
  const[cols,setCols]=useState([{header:"Product Name",dataIndex:"Product Name",id:"1"},{header:"Start date",id:"2"},{header:"End date",id:"3"},{header:"Expiry date",id:"4"},{header:"Subscription Type",id:"5"},{header:"Subscription Status",id:"6"},{header:"Actions"}])
  const [dataSource,setDataSource]=useState([])
  const form = useForm()

  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const ticket = tickets.find(t => t.id === selectedTicketId);
    if (ticket) {
      setSelectedTicket(ticket);
      setOriginalTicket(ticket);
      setHasChanges(false);
    }
  }, [selectedTicketId, tickets]);

  const handleTicketSelect = (ticketId: string) => {
    if (hasChanges) {
      const confirmDiscard = window.confirm('You have unsaved changes. Do you want to discard them?');
      if (!confirmDiscard) return;
    }
    setSelectedTicketId(ticketId);
    window.history.replaceState(null, '', `/tickets/${ticketId}`);
  };

  const handleFieldChange = (field: string, value: string | string[]) => {
    const newTicket = { ...selectedTicket, [field]: value };
    setSelectedTicket(newTicket);

    const hasChangesNow = JSON.stringify(newTicket) !== JSON.stringify(originalTicket);
    setHasChanges(hasChangesNow);
  };

  const handleSaveAll = () => {
    const changes = [];
    Object.keys(selectedTicket).forEach(key => {
      if (selectedTicket[key as keyof Ticket] !== originalTicket[key as keyof Ticket]) {
        changes.push({
          field: key,
          oldValue: String(originalTicket[key as keyof Ticket]),
          newValue: String(selectedTicket[key as keyof Ticket])
        });
      }
    });

    setOriginalTicket(selectedTicket);
    setHasChanges(false);
    toast({
      title: "Changes Saved",
      description: `All ticket changes have been saved successfully. ${changes.length} field(s) updated.`,
    });
  };

  const handleDiscardChanges = () => {
    setSelectedTicket(originalTicket);
    setHasChanges(false);
    toast({
      title: "Changes Discarded",
      description: "All unsaved changes have been discarded.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-600 text-white';
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-orange-100 text-orange-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'Linked': return 'text-green-600';
      case 'Unlinked': return 'text-red-600';
      case 'Manual Entry': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const InlineEditField = ({ field, value, multiline = false, type = 'text' }: { field: string; value: string; multiline?: boolean; type?: string }) => {
    if (multiline) {
      return (
        <Textarea
          value={value}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          className="min-h-[100px] resize-none"
          rows={4}
        />
      );
    }

    if (type === 'select' && (field === 'status' || field === 'priority' || field === 'type')) {
      let options: { value: string; label: string }[] = [];
      if (field === 'status') options = [
        { value: 'Open', label: 'Open' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Resolved', label: 'Resolved' },
        { value: 'Closed', label: 'Closed' }
      ];
      if (field === 'priority') options = [
        { value: 'Low', label: 'Low' },
        { value: 'Medium', label: 'Medium' },
        { value: 'High', label: 'High' },
        { value: 'Critical', label: 'Critical' }
      ];
      if (field === 'type') options = [
        { value: 'Bug', label: 'Bug' },
        { value: 'Feature', label: 'Feature' },
        { value: 'Request', label: 'Request' },
        { value: 'Other', label: 'Other' }
      ];

      return (
        <ReusableDropdown
          options={options}
          value={value}
          onChange={(newValue) => handleFieldChange(field, newValue.toString())}
          placeholder={`Select ${field}...`}
          className="w-full"
          showSearch={true}
          allowClear={true}
        
          
          
        />
      );
    }

    // Handle assignee field with multi-select
    if (field === 'assignedTo') {
      const assigneeOptions = [
        { label: 'John Doe', value: 'john-doe' },
        { label: 'Jane Smith', value: 'jane-smith' },
        { label: 'Mike Johnson', value: 'mike-johnson' },
        { label: 'Sarah Wilson', value: 'sarah-wilson' },
        { label: 'David Brown', value: 'david-brown' },
        { label: 'Lisa Anderson', value: 'lisa-anderson' },
        { label: 'Tom Davis', value: 'tom-davis' },
        { label: 'Emma Taylor', value: 'emma-taylor' }
      ];

      // Convert current value to array if it's a string
      const currentValues = Array.isArray(value) ? value : (typeof value === 'string' && value ? [value] : []);

      return (
        <ReusableMultiSelect
          options={assigneeOptions}
          value={currentValues}
          onChange={(newValues) => handleFieldChange(field, newValues)}
          placeholder="Select assignees..."
          searchable={true}
          allowClear={true}
        />
      );
    }

    return (
      <Input
        value={value}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        className="w-full"
        type={type}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Company Bar */}
      {/* <div className="bg-white border-b shadow-sm px-4 lg:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">Z</span>
            </div>
            <span className="text-sm text-gray-700">Zoho Corp.</span>
          </div>
          <div className="hidden lg:block h-6 w-px bg-gray-300"></div>
          <span className="hidden lg:block text-sm text-gray-600">Hyderabad</span>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <UserCircle className="h-4 w-4" />
          </Button>
          <SidebarTrigger />
        </div>
      </div> */}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Ticket Inbox */}
        <div className={`${isInboxCollapsed ? 'w-12' : 'w-80'} bg-white border-r flex flex-col transition-all duration-300 shrink-0 hidden lg:flex`}>
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-semibold text-gray-900 ${isInboxCollapsed ? 'hidden' : ''}`}>
                Tickets ({filteredTickets.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsInboxCollapsed(!isInboxCollapsed)}
                className="p-1"
              >
                {isInboxCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
            {!isInboxCollapsed && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
          </div>

          {!isInboxCollapsed && (
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`p-3 rounded-lg mb-2 cursor-pointer transition-all hover:bg-gray-50 ${selectedTicketId === ticket.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'border border-gray-200'
                      }`}
                    onClick={() => handleTicketSelect(ticket.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600">{ticket.id}</span>
                      <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                        {ticket.priority}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                      {ticket.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Badge className={getStatusColor(ticket.status)} variant="outline">
                        {ticket.status}
                      </Badge>
                      <span>•</span>
                      <span>{ticket.assignedTo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Navigation and Action Bar */}
          <div className="bg-white border-b shadow-sm px-4 lg:px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <ReusableButton
                  variant="primary"
                  size="small"
                  onClick={() => navigate('/tickets')}
                  icon={<ArrowLeft className="h-4 w-4" />}
                  className="text-gray-600 hover:text-gray-900 p-1"
                />
                <span className="text-gray-600 text-sm">All Tickets</span>
                <span className="text-gray-400">|</span>
                <span className="text-blue-600 font-medium">{selectedTicket.id}</span>
                <Badge className={getPriorityColor(selectedTicket.priority)}>{selectedTicket.priority}</Badge>
                <Badge className={getStatusColor(selectedTicket.status)}>{selectedTicket.status}</Badge>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-gray-900 truncate">{selectedTicket.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasChanges && (
                <ReusableButton
                  variant="primary"
                  size="small"
                  onClick={handleDiscardChanges}
                  icon={<X className="h-4 w-4" />}
                />
              )}
              <ReusableButton
                size="small"
                onClick={handleSaveAll}
                disabled={!hasChanges}
                className={hasChanges ? 'bg-green-600 hover:bg-green-700' : ''}
                icon={<Save className="h-4 w-4" />}
              >
                Save
              </ReusableButton>
            </div>
          </div>

          {/* Content Grid with Individual Scroll Areas */}
          <div className="flex-1 p-4 lg:p-6 overflow-hidden">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full">
              {/* Left Column - Main Content */}
              <div className="xl:col-span-8 flex flex-col min-h-0">
                <ScrollArea className="flex-1">
                  <div className="space-y-6 pr-4">
                    {/* Removed duplicate Quick Info Fields section - fields are available in Details Grid */}

                    {/* Ticket Details */}
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="pt-6">
                        <div className="space-y-6">
                          {/* <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Title</label>
                            <InlineEditField field="title" value={selectedTicket.title} />
                          </div> */}
                          <div className='flex space-x-3 space-y-1'>
                          <ReusableInput
                            label='Title'
                            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base'
                          />
                             <ReusableDropdown
                              label='Service Request Type'
                              options={[]}
                            />
                            </div>
                        
                          {/* <ReusableInput
                          label='Title'
                          />
                          <ReusableInput
                          label='Title'
                          />
                          <ReusableInput
                          label='Title'
                          /> */}
                          <ReusableRichTextEditor
                            label="Description"
                            placeholder="Write your Description here..."
                            value={newComment}
                            onChange={setNewComment}
                            minHeight={120}
                            maxHeight={300}
                            showToolbar={true}
                          />
                          {/* <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                            <InlineEditField field="description" value={selectedTicket.description} multiline />
                          </div> */}
                          <ReusableDropdown
                            label='Customer'
                            options={[
                              { value: "Nagendra1", label: "Nagendra1" },
                              { value: "Nagendra2", label: "Nagendra2" },
                              { value: "Nagendra3", label: "Nagendra3" },
                              { value: "Nagendra4", label: "Nagendra4" }
                            ]}
                          />
                          <div>
                            <ReusableTable
                              data={[]}
                              columns={cols}
                            />
                          </div>
                          <div>
                            <ReusableUpload
                              label="Attachments"
                              multiple={true}
                              accept="image/*,application/pdf,.doc,.docx,.txt"
                              maxSize={10}
                              maxFiles={5}
                              value={attachments}
                              onChange={setAttachments}
                              showPreview={true}
                              dragAndDrop={true}
                            />
                          </div>


                        </div>
                      </CardContent>
                    </Card>
                    <Card className='shadow-lg'>
                      <CardContent className="p-0">
                        <Accordion type="single" collapsible >
                          <AccordionItem value="additional-fields" className="border-none">
                            <AccordionTrigger className="px-6 py-4 hover:no-underline">
                              <div className="flex items-center gap-2">
                                <Tag className="h-5 w-5" />
                                <span className="font-semibold">Additional Fields</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <ReusableDropdown
                                    label="Urgency Level"
                                    tooltip="Select urgency"
                                    placeholder="Select urgency"
                                    options={[
                                      { value: 'Low', label: 'Low' },
                                      { value: 'Medium', label: 'Medium' },
                                      { value: 'High', label: 'High' },
                                      { value: 'Critical', label: 'Critical' }
                                    ]}
                                    value={form.watch('urgency')}
                                    onChange={(value) => form.setValue('urgency', value as any)}
                                  // error={form.formState.errors.urgency?.message}
                                  />

                                  <ReusableDropdown
                                    label="Business Impact"
                                    tooltip="Select impact level"
                                    placeholder="Select impact level"
                                    options={[
                                      { value: 'Low', label: 'Low Impact' },
                                      { value: 'Medium', label: 'Medium Impact' },
                                      { value: 'High', label: 'High Impact' }
                                    ]}
                                    value={form.watch('businessImpact')}
                                    onChange={(value) => form.setValue('businessImpact', value as any)}
                                  // error={form.formState.errors.businessImpact?.message}
                                  />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <ReusableDropdown
                                    label="Service Category"
                                    tooltip="Select service category"
                                    placeholder="Select service category"
                                    options={[
                                      { value: 'Incident', label: 'Incident' },
                                      { value: 'Service Request', label: 'Service Request' },
                                      { value: 'Change Request', label: 'Change Request' },
                                      { value: 'Problem', label: 'Problem' }
                                    ]}
                                    value={form.watch('serviceCategory')}
                                    onChange={(value) => form.setValue('serviceCategory', value as any)}
                                  // error={form.formState.errors.serviceCategory?.message}
                                  />

                                  <ReusableDropdown
                                    label="Customer Impact"
                                    tooltip="Select customer impact"
                                    placeholder="Select customer impact"
                                    options={[
                                      { value: 'None', label: 'No Impact' },
                                      { value: 'Low', label: 'Low Impact' },
                                      { value: 'Medium', label: 'Medium Impact' },
                                      { value: 'High', label: 'High Impact' }
                                    ]}
                                    value={form.watch('customerImpact')}
                                    onChange={(value) => form.setValue('customerImpact', value as any)}
                                  // error={form.formState.errors.customerImpact?.message}
                                  />
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                  <h4 className="font-medium">Environment Information</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ReusableDropdown
                                      label="Operating System"
                                      tooltip="Select OS"
                                      placeholder="Select OS"
                                      options={[
                                        { value: 'windows', label: 'Windows' },
                                        { value: 'macos', label: 'macOS' },
                                        { value: 'linux', label: 'Linux' },
                                        { value: 'other', label: 'Other' }
                                      ]}
                                      value={form.watch('operatingSystem')}
                                      onChange={(value) => form.setValue('operatingSystem', value)}
                                    // error={form.formState.errors.operatingSystem?.message}
                                    />

                                    <ReusableDropdown
                                      label="Browser"
                                      tooltip="Select browser"
                                      placeholder="Select browser"
                                      options={[
                                        { value: 'chrome', label: 'Chrome' },
                                        { value: 'firefox', label: 'Firefox' },
                                        { value: 'safari', label: 'Safari' },
                                        { value: 'edge', label: 'Edge' }
                                      ]}
                                      value={form.watch('browser')}
                                      onChange={(value) => form.setValue('browser', value)}
                                    // error={form.formState.errors.browser?.message}
                                    />
                                  </div>
                                </div>

                                <ReusableTextarea
                                  label="Expected Resolution"
                                  tooltip="Describe the expected outcome or resolution"
                                  placeholder="Describe the expected outcome or resolution"
                                  value={form.watch('expectedResolution')}
                                  onChange={(e) => form.setValue('expectedResolution', e.target.value)}
                                  // error={form.formState.errors.expectedResolution?.message}
                                  numberOfRows={3}
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
                    </Card>

                    {/* Activity & Comments */}
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle>Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="comments" className="space-y-4">
                          <TabsList className="grid w-full grid-cols-3 h-auto">
                            <TabsTrigger value="comments" className="text-xs sm:text-sm px-2 sm:px-4 py-2">Comments</TabsTrigger>
                            <TabsTrigger value="history" className="text-xs sm:text-sm px-2 sm:px-4 py-2">History</TabsTrigger>
                            <TabsTrigger value="worklog" className="text-xs sm:text-sm px-2 sm:px-4 py-2">Work Log</TabsTrigger>
                          </TabsList>

                          <TabsContent value="comments" className="space-y-4">
                            <div className="space-y-4">
                              <ReusableRichTextEditor
                                label="Add Comment"
                                placeholder="Write your comment here..."
                                value={newComment}
                                onChange={setNewComment}
                                minHeight={120}
                                maxHeight={300}
                                showToolbar={true}
                              />
                              <div className="flex justify-end">
                                <ReusableButton size="small">
                                  Post Comment
                                </ReusableButton>
                              </div>
                            </div>

                            {comments.map((comment) => (
                              <div key={comment.id} className="flex gap-3 p-4 border rounded">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                                  {comment.user.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">{comment.user}</span>
                                    <span className="text-sm text-gray-500">{comment.date}</span>
                                  </div>
                                  <div className="text-sm text-gray-700">
                                    {comment.text}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </TabsContent>

                          <TabsContent value="history" className="space-y-4">
                            {changeHistory.map((change) => (
                              <div key={change.id} className="flex gap-3 p-4 border rounded">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                                  {change.user.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">{change.user}</span>
                                    <span className="text-sm text-gray-500">{change.timestamp}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {change.changeType.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                  <div className="text-sm">
                                    <span className="text-gray-700">Changed </span>
                                    <span className="font-medium">{change.field}</span>
                                    <span className="text-gray-700"> from </span>
                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">{change.oldValue}</span>
                                    <span className="text-gray-700"> to </span>
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{change.newValue}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </TabsContent>

                          <TabsContent value="worklog" className="space-y-4">
                            {activityLogs.length === 0 && (
                              <p className="text-sm text-gray-500 text-center py-8">No work log entries found</p>
                            )}
                            {activityLogs.map((log) => (
                              <div key={log.id} className="flex justify-between items-center p-4 border rounded">
                                <div className="space-y-1 flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{log.user}</span>
                                    <span className="text-sm text-gray-500">{log.date}</span>
                                    <Badge variant="outline">{log.app}</Badge>
                                  </div>
                                  <p className="text-gray-700 truncate">{log.description}</p>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                  <p className="font-semibold">{log.hoursSpent}</p>
                                  <p className={`text-sm ${getActivityStatusColor(log.status)}`}>
                                    {log.status}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </div>

              {/* Right Column - Details Panel */}
              <div className="xl:col-span-4 flex flex-col min-h-0">
                <ScrollArea className="flex-1">
                  <div className="pr-4">
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="p-0">
                        <Tabs defaultValue="details" className="w-full">
                          <TabsList className="grid w-full grid-cols-3 rounded-t-lg">
                            <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
                            {/* <TabsTrigger value="timetracking" className="text-xs">Time</TabsTrigger> */}
                            <TabsTrigger value="linkedissues" className="text-xs">Links</TabsTrigger>
                          </TabsList>

                          <TabsContent value="details" className="p-6 space-y-4">
                            {/* <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</label>
                              <InlineEditField field="type" value={selectedTicket.type} type="select" />
                            </div> */}
                           
                            <ReusableMultiSelect
                              label='Assign To'
                              options={[]} />
                            <ReusableDropdown
                              label='Severity'
                              options={[]}
                            />
                            <ReusableMultiSelect
                              label='Asset Codes'
                              options={[]} />
                            <ReusableDatePicker
                              label='Requested Date'
                            />

                            <ReusableDropdown
                              label='Requested By'
                              options={[]}
                            />
                            <ReusableDropdown
                              label='Branch'
                              options={[]}
                            />

                            <ReusableMultiSelect
                              label='CC List'
                              options={[]} />

                            <ReusableDropdown
                              label='Link To'
                              options={[]}
                            />
                            {/* <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                              <InlineEditField field="status" value={selectedTicket.status} type="select" />
                            </div> */}

                            {/* <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Priority</label>
                              <InlineEditField field="priority" value={selectedTicket.priority} type="select" />
                            </div>

                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assignee</label>
                              <InlineEditField field="assignedTo" value={selectedTicket.assignedTo} />
                            </div>

                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reporter</label>
                              <p className="mt-1 text-sm">{selectedTicket.createdBy}</p>
                            </div>

                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created</label>
                              <InlineEditField field="createdOn" value={selectedTicket.createdOn} type="date" />
                            </div>

                            {selectedTicket.sprintNo && (
                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sprint</label>
                                <InlineEditField field="sprintNo" value={selectedTicket.sprintNo} />
                              </div>
                            )}

                            {selectedTicket.assetCode && (
                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Asset Code</label>
                                <InlineEditField field="assetCode" value={selectedTicket.assetCode} />
                              </div>
                            )} */}

                            {/* <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Labels</label>
                              <div className="mt-1 flex gap-1 flex-wrap">
                                {selectedTicket.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
                                ))}
                              </div>
                            </div> */}
                          </TabsContent>

                          {/* <TabsContent value="timetracking" className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-center">
                              <div>
                                <p className="text-xs text-gray-500">Estimated</p>
                                <p className="text-lg font-semibold">{selectedTicket.estimatedTime}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Logged</p>
                                <p className="text-lg font-semibold">
                                  {activityLogs.reduce((total, log) => {
                                    const [hours, minutes] = log.hoursSpent.split(':').map(Number);
                                    return total + hours + minutes / 60;
                                  }, 0).toFixed(1)}h
                                </p>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span>
                                  {(() => {
                                    const totalLoggedHours = activityLogs.reduce((total, log) => {
                                      const [hours, minutes] = log.hoursSpent.split(':').map(Number);
                                      return total + hours + minutes / 60;
                                    }, 0);
                                    const estimatedHours = parseFloat(selectedTicket.estimatedTime.replace('h', ''));
                                    const percentageLogged = (totalLoggedHours / estimatedHours) * 100;
                                    return percentageLogged.toFixed(0);
                                  })()}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ 
                                    width: `${(() => {
                                      const totalLoggedHours = activityLogs.reduce((total, log) => {
                                        const [hours, minutes] = log.hoursSpent.split(':').map(Number);
                                        return total + hours + minutes / 60;
                                      }, 0);
                                      const estimatedHours = parseFloat(selectedTicket.estimatedTime.replace('h', ''));
                                      const percentageLogged = (totalLoggedHours / estimatedHours) * 100;
                                      return Math.min(percentageLogged, 100);
                                    })()}%` 
                                  }}
                                ></div>
                              </div>
                            </div>

                            <Button variant="outline" className="w-full text-sm">
                              Log Work
                            </Button>
                          </TabsContent> */}

                          <TabsContent value="linkedissues" className="p-6 space-y-3">
                            {selectedTicket.linkedTickets.map((linkedId) => (
                              <div key={linkedId} className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
                                <Link className="h-4 w-4 text-blue-600" />
                                <div className="flex-1">
                                  <span className="text-blue-600 font-medium text-sm">{linkedId}</span>
                                  <p className="text-xs text-gray-600">Click to view details</p>
                                </div>
                              </div>
                            ))}
                            {selectedTicket.linkedTickets.length === 0 && (
                              <p className="text-sm text-gray-500 text-center py-4">No linked tickets</p>
                            )}
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketView;
