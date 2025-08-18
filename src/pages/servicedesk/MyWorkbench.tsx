import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ReusableTable } from '@/components/ui/reusable-table';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableMultiSelect } from '@/components/ui/reusable-multi-select';
import { Input } from '@/components/ui/input';
import { ResponsiveTabs } from '@/components/ui/responsive-tabs';
import {
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Filter,
  Search,
  Calendar,
  Eye,
  Edit,
  Download
} from 'lucide-react';

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
  project: string;
  description: string;
  dueDate?: string;
  category: string;
  slaBreached?: boolean;
}

interface Task {
  id: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  assignedTo: string;
  dueDate: string;
  project: string;
  description: string;
  estimatedHours: number;
  completedHours: number;
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
    project: 'ERP System Upgrade',
    description: 'Login form has UI inconsistencies across different browsers',
    dueDate: '2025-06-20',
    category: 'UI/UX',
    slaBreached: false
  },
  {
    id: 'TCK-10246',
    title: 'Add Dashboard Analytics Feature',
    type: 'Feature',
    priority: 'Medium',
    status: 'Open',
    assignedTo: 'John Doe',
    createdBy: 'Bob Wilson',
    createdOn: '2025-06-11',
    estimatedTime: '8h',
    project: 'Mobile App Development',
    description: 'Implement comprehensive analytics dashboard for user insights',
    dueDate: '2025-06-25',
    category: 'Analytics',
    slaBreached: false
  }
];

const mockTasks: Task[] = [
  {
    id: 'TSK-001',
    title: 'Database Schema Design',
    priority: 'High',
    status: 'In Progress',
    assignedTo: 'John Doe',
    dueDate: '2025-06-20',
    project: 'ERP System Upgrade',
    description: 'Design the new database schema for user management',
    estimatedHours: 16,
    completedHours: 8
  },
  {
    id: 'TSK-002',
    title: 'API Documentation',
    priority: 'Medium',
    status: 'Not Started',
    assignedTo: 'John Doe',
    dueDate: '2025-06-30',
    project: 'Mobile App Development',
    description: 'Create comprehensive API documentation',
    estimatedHours: 12,
    completedHours: 0
  }
];

const MyWorkbench = () => {
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [tasks] = useState<Task[]>(mockTasks);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');
  const [projectFilters, setProjectFilters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('All Time');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  
  // Filter options
  const statusOptions = [
    { value: 'All Status', label: 'All Status' },
    { value: 'Open', label: 'Open' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' },
    { value: 'Closed', label: 'Closed' }
  ];

  const priorityOptions = [
    { value: 'All Priority', label: 'All Priority' },
    { value: 'Critical', label: 'Critical' },
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' }
  ];

  const projectOptions = [
    { value: 'ERP System Upgrade', label: 'ERP System Upgrade' },
    { value: 'Mobile App Development', label: 'Mobile App Development' },
    { value: 'Security Audit', label: 'Security Audit' }
  ];

  const dateRangeOptions = [
    { value: 'All Time', label: 'All Time' },
    { value: 'Today', label: 'Today' },
    { value: 'This Week', label: 'This Week' },
    { value: 'This Month', label: 'This Month' },
    { value: 'Last 30 Days', label: 'Last 30 Days' }
  ];

  const categoryOptions = [
    { value: 'All Categories', label: 'All Categories' },
    { value: 'UI/UX', label: 'UI/UX' },
    { value: 'Analytics', label: 'Analytics' },
    { value: 'Performance', label: 'Performance' },
    { value: 'Security', label: 'Security' }
  ];

  // Filtered data
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = searchTerm === '' || 
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All Status' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'All Priority' || ticket.priority === priorityFilter;
      const matchesProject = projectFilters.length === 0 || projectFilters.includes(ticket.project);
      const matchesCategory = categoryFilter === 'All Categories' || ticket.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesCategory;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter, projectFilters, categoryFilter]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = searchTerm === '' || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPriority = priorityFilter === 'All Priority' || task.priority === priorityFilter;
      const matchesProject = projectFilters.length === 0 || projectFilters.includes(task.project);
      
      return matchesSearch && matchesPriority && matchesProject;
    });
  }, [tasks, searchTerm, priorityFilter, projectFilters]);

  // Stats calculations
  const myTicketsCount = filteredTickets.length;
  const assignedTicketsCount = filteredTickets.filter(t => t.assignedTo === 'John Doe').length;
  const openTicketsCount = filteredTickets.filter(t => t.status === 'Open').length;
  const overdueSLACount = filteredTickets.filter(t => t.slaBreached).length;

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All Status');
    setPriorityFilter('All Priority');
    setProjectFilters([]);
    setDateRange('All Time');
    setCategoryFilter('All Categories');
  };

  // Table columns for tickets
  const ticketColumns = [
    { key: 'id', title: 'Ticket ID', dataIndex: 'id' },
    { key: 'title', title: 'Title', dataIndex: 'title' },
    { key: 'type', title: 'Type', dataIndex: 'type' },
    { key: 'priority', title: 'Priority', dataIndex: 'priority', render: (value: string) => (
      <Badge className={
        value === 'Critical' ? 'bg-red-600 text-white' :
        value === 'High' ? 'bg-red-100 text-red-800' :
        value === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
        'bg-green-100 text-green-800'
      }>
        {value}
      </Badge>
    )},
    { key: 'status', title: 'Status', dataIndex: 'status', render: (value: string) => (
      <Badge className={
        value === 'Open' ? 'bg-blue-100 text-blue-800' :
        value === 'In Progress' ? 'bg-orange-100 text-orange-800' :
        value === 'Resolved' ? 'bg-green-100 text-green-800' :
        'bg-gray-100 text-gray-800'
      }>
        {value}
      </Badge>
    )},
    { key: 'project', title: 'Project', dataIndex: 'project' },
    { key: 'dueDate', title: 'Due Date', dataIndex: 'dueDate' }
  ] as any;

  // Table columns for tasks  
  const taskColumns = [
    { key: 'id', title: 'Task ID', dataIndex: 'id' },
    { key: 'title', title: 'Title', dataIndex: 'title' },
    { key: 'priority', title: 'Priority', dataIndex: 'priority', render: (value: string) => (
      <Badge className={
        value === 'Critical' ? 'bg-red-600 text-white' :
        value === 'High' ? 'bg-red-100 text-red-800' :
        value === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
        'bg-green-100 text-green-800'
      }>
        {value}
      </Badge>
    )},
    { key: 'status', title: 'Status', dataIndex: 'status', render: (value: string) => (
      <Badge className={
        value === 'Not Started' ? 'bg-gray-100 text-gray-800' :
        value === 'In Progress' ? 'bg-orange-100 text-orange-800' :
        value === 'Completed' ? 'bg-green-100 text-green-800' :
        'bg-yellow-100 text-yellow-800'
      }>
        {value}
      </Badge>
    )},
    { key: 'project', title: 'Project', dataIndex: 'project' },
    { key: 'dueDate', title: 'Due Date', dataIndex: 'dueDate' }
  ] as any;

  const tabItems = [
    {
      value: 'my-tickets',
      label: 'My Tickets',
      content: (
        <ReusableTable
          data={filteredTickets}
          columns={ticketColumns}
        />
      )
    },
    {
      value: 'assigned',
      label: 'Assigned',
      content: (
        <ReusableTable
          data={filteredTickets.filter(t => t.assignedTo === 'John Doe')}
          columns={ticketColumns}
        />
      )
    },
    {
      value: 'tasks',
      label: 'Tasks',
      content: (
        <ReusableTable
          data={filteredTasks}
          columns={taskColumns}
        />
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <SidebarTrigger />
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">My Workbench</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Tickets</p>
                  <p className="text-2xl font-bold text-blue-600">{myTicketsCount}</p>
                </div>
                <ClipboardList className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Assigned</p>
                  <p className="text-2xl font-bold text-orange-600">{assignedTicketsCount}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Open</p>
                  <p className="text-2xl font-bold text-green-600">{openTicketsCount}</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">SLA Breached</p>
                  <p className="text-2xl font-bold text-red-600">{overdueSLACount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tickets/tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <ReusableDropdown
                label="Status"
                options={statusOptions}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value as string)}
                placeholder="Select status"
              />

              <ReusableDropdown
                label="Priority"
                options={priorityOptions}
                value={priorityFilter}
                onChange={(value) => setPriorityFilter(value as string)}
                placeholder="Select priority"
              />

              <ReusableDropdown
                label="Date Range"
                options={dateRangeOptions}
                value={dateRange}
                onChange={(value) => setDateRange(value as string)}
                placeholder="Select date range"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReusableMultiSelect
                label="Projects"
                options={projectOptions}
                value={projectFilters}
                onChange={setProjectFilters}
                placeholder="Select projects..."
                searchable={true}
                selectAll={true}
                maxTagCount={2}
              />

              <ReusableDropdown
                label="Category"
                options={categoryOptions}
                value={categoryFilter}
                onChange={(value) => setCategoryFilter(value as string)}
                placeholder="Select category"
              />
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content with Responsive Tabs */}
        <Card>
          <CardContent className="p-6">
            <ResponsiveTabs 
              items={tabItems}
              defaultValue="my-tickets"
              className="w-full"
              breakpoint="md"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyWorkbench;