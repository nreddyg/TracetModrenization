import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Calendar,
  Filter,
  Download,
  Eye,
  Edit,
  Search,
  X,
  Users,
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  Check,
  ChevronsUpDown,
  BarChart3,
  Table as TableIcon
} from 'lucide-react';
import TicketRecordsView from '@/components/tickets/TicketRecordsView';
import TicketGraphsView from '@/components/tickets/TicketGraphsView';
import { Form } from '@/components/ui/form';
import { Controller, useForm } from 'react-hook-form';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { TICKET_PROGRESS_DB } from '@/Local_DB/Form_JSON_Data/TicketProgressDashBoardDB';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import { ReusableMultiSelect } from '@/components/ui/reusable-multi-select';
import { ReusableButton } from '@/components/ui/reusable-button';
import { GetServiceRequestAssignToLookups } from '@/services/ticketServices';
import { useAppSelector } from '@/store';
import { getAnalyticsData } from '@/services/ticketProgressDashboardServices';

interface Ticket {
  id: string;
  title: string;
  type: 'Bug' | 'Feature' | 'Request' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo: string;
  createdBy: string;
  createdOn: string;
  estimatedTime: string;
  sprintNo?: string;
  project: string;
  description: string;
  dueDate?: string;
  resolution?: string;
  category: string;
  slaBreached?: boolean;
  firstResponseTime?: string;
  resolutionTime?: string;
  reopenCount?: number;
  escalated?: boolean;
  csatScore?: number;
}

const mockTickets: Ticket[] = [
  {
    id: 'TCK-10245',
    title: 'Fix UI inconsistencies in Login Form',
    type: 'Bug',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'John Doe',
    createdBy: 'Jane Smith',
    createdOn: '2025-06-10',
    estimatedTime: '4h',
    sprintNo: 'Sprint-14',
    project: 'ERP System Upgrade',
    description: 'Login form has UI inconsistencies across different browsers',
    dueDate: '2025-06-20',
    category: 'UI/UX',
    slaBreached: false,
    firstResponseTime: '2h',
    resolutionTime: '6h',
    reopenCount: 0,
    escalated: false,
    csatScore: 4
  },
  {
    id: 'TCK-10246',
    title: 'Add Dashboard Analytics Feature',
    type: 'Feature',
    priority: 'Medium',
    status: 'Open',
    assignedTo: 'Alice Johnson',
    createdBy: 'Bob Wilson',
    createdOn: '2025-06-11',
    estimatedTime: '8h',
    sprintNo: 'Sprint-15',
    project: 'Mobile App Development',
    description: 'Implement comprehensive analytics dashboard for user insights',
    dueDate: '2025-06-25',
    category: 'Analytics',
    slaBreached: false,
    firstResponseTime: '1h',
    resolutionTime: '',
    reopenCount: 0,
    escalated: false
  },
  {
    id: 'TCK-10247',
    title: 'Update User Profile Settings',
    type: 'Request',
    priority: 'Low',
    status: 'Resolved',
    assignedTo: 'Mike Brown',
    createdBy: 'Sarah Davis',
    createdOn: '2025-06-09',
    estimatedTime: '2h',
    project: 'Security Audit',
    description: 'Users need ability to update profile settings',
    dueDate: '2025-06-15',
    resolution: 'Profile settings updated with new fields',
    category: 'User Management',
    slaBreached: false,
    firstResponseTime: '30m',
    resolutionTime: '2h',
    reopenCount: 1,
    escalated: false,
    csatScore: 5
  },
  {
    id: 'TCK-10248',
    title: 'Database Performance Optimization',
    type: 'Bug',
    priority: 'Critical',
    status: 'Open',
    assignedTo: 'David Lee',
    createdBy: 'Emma Wilson',
    createdOn: '2025-06-12',
    estimatedTime: '12h',
    project: 'ERP System Upgrade',
    description: 'Database queries are running slower than expected',
    dueDate: '2025-06-18',
    category: 'Performance',
    slaBreached: true,
    firstResponseTime: '4h',
    resolutionTime: '',
    reopenCount: 0,
    escalated: true
  },
  {
    id: 'TCK-10249',
    title: 'Mobile App Push Notifications',
    type: 'Feature',
    priority: 'Medium',
    status: 'In Progress',
    assignedTo: 'Carol Davis',
    createdBy: 'Alice Johnson',
    createdOn: '2025-06-13',
    estimatedTime: '6h',
    sprintNo: 'Sprint-15',
    project: 'Mobile App Development',
    description: 'Implement push notification system for mobile app',
    dueDate: '2025-06-22',
    category: 'Mobile',
    slaBreached: false,
    firstResponseTime: '1h',
    resolutionTime: '',
    reopenCount: 0,
    escalated: false
  },
  {
    id: 'TCK-10250',
    title: 'Security Vulnerability Assessment',
    type: 'Other',
    priority: 'High',
    status: 'Closed',
    assignedTo: 'David Lee',
    createdBy: 'System Admin',
    createdOn: '2025-06-05',
    estimatedTime: '16h',
    project: 'Security Audit',
    description: 'Comprehensive security assessment of all systems',
    dueDate: '2025-06-14',
    resolution: 'Security assessment completed, recommendations implemented',
    category: 'Security',
    slaBreached: false,
    firstResponseTime: '2h',
    resolutionTime: '14h',
    reopenCount: 0,
    escalated: false,
    csatScore: 5
  }
];

const projects = ['All Projects', 'ERP System Upgrade', 'Mobile App Development', 'Security Audit'];
const assignees = ['John Doe', 'Alice Johnson', 'Mike Brown', 'David Lee', 'Carol Davis', 'Jane Smith', 'Bob Wilson', 'Sarah Davis', 'Emma Wilson'];
const statuses = ['All Status', 'Open', 'In Progress', 'Resolved', 'Closed'];
const categories = ['All Categories', 'UI/UX', 'Analytics', 'User Management', 'Performance', 'Mobile', 'Security'];

const TicketProgressDashboard = () => {
  const navigate = useNavigate();
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [assigneePopoverOpen, setAssigneePopoverOpen] = useState(false);
  const [activeView, setActiveView] = useState('records');
  const [fields, setFields] = useState(TICKET_PROGRESS_DB);
  const companyId=useAppSelector(state=>state.projects.companyId);
  

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchProject = selectedProject === 'All Projects' || ticket.project === selectedProject;
      const matchAssignee = selectedAssignees.length === 0 || selectedAssignees.includes(ticket.assignedTo);
      const matchStatus = selectedStatus === 'All Status' || ticket.status === selectedStatus;
      const matchCategory = selectedCategory === 'All Categories' || ticket.category === selectedCategory;
      const matchSearch = searchTerm === '' ||
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase());

      let matchDate = true;
      if (startDate && endDate) {
        const ticketDate = new Date(ticket.createdOn);
        const start = new Date(startDate);
        const end = new Date(endDate);
        matchDate = ticketDate >= start && ticketDate <= end;
      }

      return matchProject && matchAssignee && matchStatus && matchCategory && matchSearch && matchDate;
    });
  }, [tickets, selectedProject, selectedAssignees, selectedStatus, selectedCategory, startDate, endDate, searchTerm]);

  const handleAssigneeToggle = (assignee: string) => {
    setSelectedAssignees(prev =>
      prev.includes(assignee)
        ? prev.filter(a => a !== assignee)
        : [...prev, assignee]
    );
  };

  const removeAssignee = (assignee: string) => {
    setSelectedAssignees(prev => prev.filter(a => a !== assignee));
  };

  const clearAllFilters = () => {
    setSelectedProject('All Projects');
    setSelectedAssignees([]);
    setSelectedStatus('All Status');
    setSelectedCategory('All Categories');
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
  };

  const handleDownload = () => {
    const csvContent = [
      ['Ticket ID', 'Title', 'Type', 'Priority', 'Status', 'Assigned To', 'Created By', 'Created On', 'Est. Time', 'Project', 'Category', 'Due Date'],
      ...filteredTickets.map(ticket => [
        ticket.id,
        ticket.title,
        ticket.type,
        ticket.priority,
        ticket.status,
        ticket.assignedTo,
        ticket.createdBy,
        ticket.createdOn,
        ticket.estimatedTime,
        ticket.project,
        ticket.category,
        ticket.dueDate || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ticket-progress-dashboard.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Dashboard stats
  const totalTickets = filteredTickets.length;
  const openTickets = filteredTickets.filter(t => t.status === 'Open').length;
  const inProgressTickets = filteredTickets.filter(t => t.status === 'In Progress').length;
  const resolvedTickets = filteredTickets.filter(t => t.status === 'Resolved').length;
  const closedTickets = filteredTickets.filter(t => t.status === 'Closed').length;

  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultValue ?? ''
      return acc;
    }, {} as GenericObject),

  });
  const { control, register, handleSubmit, trigger, watch, setValue, getValues, reset, formState: { errors } } = form;

  const renderField = (field: BaseField) => {
    const { name, label, fieldType, isRequired, show = true } = field;
    if (!name || !show) return null;
    const validationRules = {
      required: isRequired ? `${label} is required` : false,
    };
    switch (fieldType) {
      case 'text':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableInput
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'dropdown':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableDropdown
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'date':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableDatePicker
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'multiselect':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableMultiSelect
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      default:
        return null;
    }
  };
  // Helper function to get fields by names (similar to TicketView)
  const getFieldsByNames = (names: string[]) => fields.filter(f => names.includes(f.name!));

  //fetch lookup data

  // async function fetchLookups() {
  //   const [assigneesValues] = await Promise.allSettled([
  //     GetServiceRequestAssignToLookups(companyId, 'All').then(res => res.data),
  //   ]);

  //   setFields(prev =>
  //     prev.map(field => {
  //       if (field.name === "Assignees" && assigneesValues.status === "fulfilled") {
  //         console.log(assigneesValues.value.ServiceRequestAssignToUsersLookup,"415")
  //         return {
  //           ...field,
  //           options: assigneesValues.value.ServiceRequestAssignToUsersLookup.map(item => ({
  //             label: item.UserName,
  //             value: item.UserName,
  //           })),
  //           groupedOptions:assigneesValues.value.ServiceRequestAssignToUserGroupLookup.map(item => ({
  //             label: item.UserGroupName,
  //             value: item.UserGroupName,
  //           })),
  //         };
  //       }

  //       return field;
  //     })
  //   );
  //   // reset({
  //   //   Assignees:
  //   //     assigneesValues.status === "fulfilled" ? custResult.value[0].CustomerName : '',
  //   // });
  // }

  async function fetchLookups() {
  const [assigneesValues] = await Promise.allSettled([
    GetServiceRequestAssignToLookups(companyId, 'All').then(res => res.data),
  ]);

  setFields(prev =>
    prev.map(field => {
      if (field.name === "Assignees" && assigneesValues.status === "fulfilled") {
        const users = assigneesValues.value.ServiceRequestAssignToUsersLookup;
        const groups = assigneesValues.value.ServiceRequestAssignToUserGroupLookup;
        
        // Create grouped options by associating users with groups
        const groupedOptions = groups.map(group => ({
          label: group.UserGroupName,
          options: users
            .filter(user => user.UserGroupId === group.UserGroupId) // Assuming there's a group association
            .map(user => ({
              label: user.UserName,
              value: user.UserName,
            }))
        }));

        return {
          ...field,
          // Don't set both options and groupedOptions - choose one
          groupedOptions: groupedOptions,
          // Remove or comment out the options line if using groupedOptions
          // options: users.map(user => ({ label: user.UserName, value: user.UserName })),
        };
      }
      return field;
    })
  );
}
let payload={
    "FiltersPayloadDetails":[
        {
            "projectids":"",
            "statusids":"",
            "categoryids":"",
            "startdate":"",
            "enddate":"",
            "assigneeids":"",
            "usergroupids":""
        }

    ]
}
  const fetchAnalyticsData=async()=>{
    await getAnalyticsData(111,'All','statuspie',payload).then(res=>{
      console.log('res',res)

    })

  }

  useEffect(() => {
    fetchAnalyticsData()
    fetchLookups();
  }, [])



  

  return (
    <div className="h-full overflow-y-scroll bg-gray-50">
      <header className="bg-white border-b px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <SidebarTrigger />
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Ticket Progress Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleDownload} size="sm" className="text-xs sm:text-sm">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        {/* Enhanced Filters Section */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Dashboard Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            <Form {...form}>
              <form onSubmit={form.handleSubmit(() => { })} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getFieldsByNames(['Status', 'ServiceRequestType', 'Assignees','StartDate', 'EndDate']).map((field) => (
                    <div key={field.name}>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
                {/* Action Buttons */}
                <div className='flex justify-between items-center'>
                  <div className="flex gap-3">
                    <ReusableButton
                      htmlType="submit"
                      variant="default"
                      className="bg-orange-500 border-orange-500 text-white hover:bg-orange-600 hover:border-orange-600"
                      // icon={<Save className="h-4 w-4" />}
                      iconPosition="left"
                    >
                      Submit
                    </ReusableButton>
                    <ReusableButton
                      htmlType="button"
                      variant="default"
                      onClick={clearAllFilters}
                      className="border-orange-500 text-orange-500 hover:bg-orange-50"
                      icon={<X className="h-4 w-4" />}
                      iconPosition="left"
                    >
                      Clear Filters
                    </ReusableButton>
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-md">
                    Showing <span className="font-semibold">{filteredTickets.length}</span> of <span className="font-semibold">{tickets.length}</span> tickets
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Main Content with Tabs */}
        <Card>
          <CardHeader>
            <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-auto">
                
                <TabsTrigger value="graphs" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2">
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Analytics Dashboard</span>
                  <span className="sm:hidden">Analytics</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs value={activeView} className="w-full">
              <TabsContent value="graphs">
                <TicketGraphsView tickets={filteredTickets} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketProgressDashboard;
