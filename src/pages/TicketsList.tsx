
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Briefcase
} from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed' | 'Planning' | 'Active' | 'On Hold' | 'Completed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee: string;
  reporter: string;
  createdDate: string;
  updatedDate: string;
  dueDate?: string;
  type: 'Bug' | 'Feature' | 'Support' | 'Task' | 'Project Task';
  projectId?: string;
  estimatedHours?: number;
  tags: string[];
}

// Extended mock data including project tasks
const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    title: 'Login page not responsive on mobile',
    description: 'The login page layout breaks on mobile devices below 480px width',
    status: 'Open',
    priority: 'High',
    assignee: 'john.doe',
    reporter: 'jane.smith',
    createdDate: '2025-01-15',
    updatedDate: '2025-01-15',
    dueDate: '2025-01-25',
    type: 'Bug',
    tags: ['frontend', 'mobile', 'responsive']
  },
  {
    id: 'TSK-001',
    title: 'Database Migration Setup',
    description: 'Prepare database migration scripts and test environment',
    status: 'In Progress',
    priority: 'High',
    assignee: 'john.doe',
    reporter: 'project.manager',
    createdDate: '2025-01-15',
    updatedDate: '2025-01-16',
    dueDate: '2025-02-15',
    type: 'Project Task',
    projectId: 'PRJ-001',
    estimatedHours: 16,
    tags: ['backend', 'database', 'migration']
  },
  {
    id: 'TKT-002',
    title: 'Add dark mode toggle',
    description: 'Implement dark mode functionality with user preference persistence',
    status: 'Planning',
    priority: 'Medium',
    assignee: 'jane.smith',
    reporter: 'user.test',
    createdDate: '2025-01-14',
    updatedDate: '2025-01-16',
    type: 'Feature',
    tags: ['frontend', 'ui', 'theme']
  },
  {
    id: 'TSK-002',
    title: 'API Integration Testing',
    description: 'Test all API endpoints and error handling',
    status: 'Active',
    priority: 'Medium',
    assignee: 'jane.smith',
    reporter: 'project.manager',
    createdDate: '2025-01-16',
    updatedDate: '2025-01-17',
    dueDate: '2025-02-20',
    type: 'Project Task',
    projectId: 'PRJ-001',
    estimatedHours: 12,
    tags: ['api', 'testing', 'backend']
  },
  {
    id: 'TKT-003',
    title: 'Password reset email not working',
    description: 'Users report not receiving password reset emails',
    status: 'Resolved',
    priority: 'Critical',
    assignee: 'mike.johnson',
    reporter: 'support.team',
    createdDate: '2025-01-13',
    updatedDate: '2025-01-17',
    type: 'Bug',
    tags: ['email', 'authentication', 'backend']
  },
  {
    id: 'TSK-003',
    title: 'Security Audit Implementation',
    description: 'Implement security recommendations from audit report',
    status: 'Completed',
    priority: 'Critical',
    assignee: 'david.lee',
    reporter: 'security.team',
    createdDate: '2025-01-10',
    updatedDate: '2025-01-17',
    dueDate: '2025-02-28',
    type: 'Project Task',
    projectId: 'PRJ-003',
    estimatedHours: 24,
    tags: ['security', 'audit', 'compliance']
  }
];

const TicketsList = () => {
  const navigate = useNavigate();
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
      case 'Planning':
        return <AlertTriangle className="h-3 w-3" />;
      case 'In Progress':
      case 'Active':
        return <Clock className="h-3 w-3" />;
      case 'Resolved':
      case 'Completed':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
      case 'Planning':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
      case 'Active':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
      case 'On Hold':
        return 'bg-orange-100 text-orange-800';
      case 'Resolved':
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Project Task':
        return <Briefcase className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || ticket.type === typeFilter;
    const matchesAssignee = assigneeFilter === 'all' || ticket.assignee === assigneeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesAssignee;
  });

  const groupedTickets = filteredTickets.reduce((acc, ticket) => {
    const key = ticket.type === 'Project Task' ? 'Project Tasks' : 'Service Tickets';
    if (!acc[key]) acc[key] = [];
    acc[key].push(ticket);
    return acc;
  }, {} as Record<string, Ticket[]>);

  const renderTicketCard = (ticket: Ticket) => (
    <div
      key={ticket.id}
      className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/tickets/${ticket.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getTypeIcon(ticket.type)}
          <div>
            <h3 className="font-medium text-sm text-gray-900">{ticket.title}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              {ticket.id}
              {ticket.projectId && (
                <>
                  <span>•</span>
                  <span className="text-blue-600">{ticket.projectId}</span>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`text-xs ${getPriorityColor(ticket.priority)}`}>
            {ticket.priority}
          </Badge>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
        {ticket.description}
      </p>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon(ticket.status)}
          <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
            {ticket.status}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <User className="h-3 w-3" />
          <span>{ticket.assignee}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Created: {ticket.createdDate}</span>
        </div>
        {ticket.dueDate && (
          <div className="flex items-center gap-1">
            <span>Due: {ticket.dueDate}</span>
          </div>
        )}
        {ticket.estimatedHours && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{ticket.estimatedHours}h</span>
          </div>
        )}
      </div>

      {ticket.tags.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {ticket.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs py-0 px-1 h-4">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold text-gray-900">Tickets & Tasks</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate('/tasks/create')} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
            <Button onClick={() => navigate('/tickets/create')} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">All Tickets & Tasks</CardTitle>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mt-4">
              <div className="relative">
                <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
              
              <ReusableDropdown
                value={typeFilter}
                onChange={(value) => setTypeFilter(value as string)}
                placeholder="Type"
                size="small"
                allowClear
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'Bug', label: 'Bug' },
                  { value: 'Feature', label: 'Feature' },
                  { value: 'Support', label: 'Support' },
                  { value: 'Task', label: 'Task' },
                  { value: 'Project Task', label: 'Project Task' }
                ]}
                className="h-8 text-sm"
              />
              
              <ReusableDropdown
                value={statusFilter}
                onChange={(value) => setStatusFilter(value as string)}
                placeholder="Status"
                size="small"
                allowClear
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'Open', label: 'Open' },
                  { value: 'Planning', label: 'Planning' },
                  { value: 'In Progress', label: 'In Progress' },
                  { value: 'Active', label: 'Active' },
                  { value: 'Pending', label: 'Pending' },
                  { value: 'On Hold', label: 'On Hold' },
                  { value: 'Resolved', label: 'Resolved' },
                  { value: 'Completed', label: 'Completed' },
                  { value: 'Closed', label: 'Closed' }
                ]}
                className="h-8 text-sm"
              />
              
              <ReusableDropdown
                value={priorityFilter}
                onChange={(value) => setPriorityFilter(value as string)}
                placeholder="Priority"
                size="small"
                allowClear
                options={[
                  { value: 'all', label: 'All Priority' },
                  { value: 'Low', label: 'Low' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'High', label: 'High' },
                  { value: 'Critical', label: 'Critical' }
                ]}
                className="h-8 text-sm"
              />
              
              <ReusableDropdown
                value={assigneeFilter}
                onChange={(value) => setAssigneeFilter(value as string)}
                placeholder="Assignee"
                size="small"
                allowClear
                showSearch
                options={[
                  { value: 'all', label: 'All Assignees' },
                  { value: 'john.doe', label: 'John Doe' },
                  { value: 'jane.smith', label: 'Jane Smith' },
                  { value: 'mike.johnson', label: 'Mike Johnson' },
                  { value: 'david.lee', label: 'David Lee' }
                ]}
                className="h-8 text-sm"
              />
              
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="h-3 w-3 mr-1" />
                More Filters
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {Object.entries(groupedTickets).map(([groupName, groupTickets]) => (
                <div key={groupName}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-medium text-sm text-gray-900">{groupName}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {groupTickets.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupTickets.map(renderTicketCard)}
                  </div>
                </div>
              ))}
              
              {filteredTickets.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No tickets found matching your criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketsList;
