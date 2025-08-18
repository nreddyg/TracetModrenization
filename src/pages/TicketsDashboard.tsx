
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReusableTable } from '@/components/ui/reusable-table';
import { 
  Ticket,
  Plus,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Users,
  Calendar,
  Filter,
  BarChart3,
  ArrowRight,
  Eye
} from 'lucide-react';

interface TicketMetrics {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  highPriority: number;
  slaViolated: number;
  avgResolutionTime: string;
  todayCreated: number;
  todayResolved: number;
}

interface TicketTypeBreakdown {
  type: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  avgResolutionTime: string;
}

const TicketsDashboard = () => {
  const navigate = useNavigate();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Mock data - in real implementation, this would come from API
  const ticketMetrics: TicketMetrics = {
    total: 247,
    open: 82,
    inProgress: 45,
    resolved: 89,
    closed: 31,
    highPriority: 23,
    slaViolated: 7,
    avgResolutionTime: '2.3 days',
    todayCreated: 12,
    todayResolved: 18
  };

  const ticketTypeBreakdown: TicketTypeBreakdown[] = [
    {
      type: 'Bug',
      count: 98,
      percentage: 39.7,
      trend: 'up',
      avgResolutionTime: '1.8 days'
    },
    {
      type: 'Feature Request',
      count: 67,
      percentage: 27.1,
      trend: 'stable',
      avgResolutionTime: '4.2 days'
    },
    {
      type: 'Support Request',
      count: 52,
      percentage: 21.1,
      trend: 'down',
      avgResolutionTime: '1.2 days'
    },
    {
      type: 'Incident',
      count: 30,
      percentage: 12.1,
      trend: 'up',
      avgResolutionTime: '0.8 days'
    }
  ];

  const recentTickets = [
    {
      id: 'TCK-10245',
      title: 'Fix UI inconsistencies in Login Form',
      type: 'Bug',
      priority: 'High',
      status: 'In Progress',
      assignedTo: 'John Doe',
      createdOn: '2025-01-15',
      project: 'ERP System'
    },
    {
      id: 'TCK-10246',
      title: 'Add Dashboard Analytics Feature',
      type: 'Feature Request',
      priority: 'Medium',
      status: 'Open',
      assignedTo: 'Alice Johnson',
      createdOn: '2025-01-14',
      project: 'Mobile App'
    },
    {
      id: 'TCK-10247',
      title: 'Network Connectivity Issue',
      type: 'Incident',
      priority: 'Critical',
      status: 'Open',
      assignedTo: 'David Lee',
      createdOn: '2025-01-15',
      project: 'Infrastructure'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <Ticket className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tickets Dashboard</h1>
                <p className="text-sm text-gray-500">Comprehensive ticket metrics and management</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => navigate('/tickets/create')}>
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/tickets')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                    <p className="text-3xl font-bold text-gray-900">{ticketMetrics.total}</p>
                    <p className="text-sm text-blue-600">+{ticketMetrics.todayCreated} today</p>
                  </div>
                  <Ticket className="h-12 w-12 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/tickets?status=open')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                    <p className="text-3xl font-bold text-blue-600">{ticketMetrics.open}</p>
                    <p className="text-sm text-gray-500">Awaiting assignment</p>
                  </div>
                  <Clock className="h-12 w-12 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/service-desk/sla-violated')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">SLA Violations</p>
                    <p className="text-3xl font-bold text-red-600">{ticketMetrics.slaViolated}</p>
                    <p className="text-sm text-red-600">Requires attention</p>
                  </div>
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Resolution</p>
                    <p className="text-3xl font-bold text-green-600">{ticketMetrics.avgResolutionTime}</p>
                    <p className="text-sm text-green-600">-0.2 days from last week</p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Ticket Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => navigate('/tickets?status=open')}>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Open</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-600">{ticketMetrics.open}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => navigate('/tickets?status=in-progress')}>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium">In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-yellow-600">{ticketMetrics.inProgress}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors" onClick={() => navigate('/tickets?status=resolved')}>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Resolved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600">{ticketMetrics.resolved}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => navigate('/service-desk/closed-tickets')}>
                    <div className="flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">Closed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-600">{ticketMetrics.closed}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Type Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Ticket Type Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ticketTypeBreakdown.map((type, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/tickets?type=${type.type.toLowerCase().replace(' ', '-')}`)}>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{type.type}</span>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(type.trend)}
                            <span className="text-sm font-semibold">{type.count}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{type.percentage}% of total</span>
                          <span>Avg: {type.avgResolutionTime}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{width: `${type.percentage}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tickets */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Tickets
              </CardTitle>
              <Button variant="outline" onClick={() => navigate('/tickets')}>
                View All Tickets
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardHeader>
            <CardContent>
              <ReusableTable
                data={recentTickets}
                columns={[
                  {
                    accessorKey: 'id',
                    header: 'Ticket ID',
                    cell: ({ getValue }: any) => (
                      <span className="font-medium text-blue-600">{getValue()}</span>
                    )
                  },
                  {
                    accessorKey: 'title',
                    header: 'Title',
                    cell: ({ getValue }: any) => (
                      <span className="max-w-xs truncate">{getValue()}</span>
                    )
                  },
                  {
                    accessorKey: 'type',
                    header: 'Type',
                    cell: ({ getValue }: any) => (
                      <Badge variant="outline">{getValue()}</Badge>
                    )
                  },
                  {
                    accessorKey: 'priority',
                    header: 'Priority',
                    cell: ({ getValue }: any) => (
                      <Badge className={getPriorityColor(getValue())}>{getValue()}</Badge>
                    )
                  },
                  {
                    accessorKey: 'status',
                    header: 'Status',
                    cell: ({ getValue }: any) => (
                      <Badge className={getStatusColor(getValue())}>{getValue()}</Badge>
                    )
                  },
                  {
                    accessorKey: 'assignedTo',
                    header: 'Assigned To'
                  },
                  {
                    accessorKey: 'createdOn',
                    header: 'Created',
                    cell: ({ getValue }: any) => (
                      new Date(getValue()).toLocaleDateString()
                    )
                  },
                  {
                    accessorKey: 'project',
                    header: 'Project'
                  },
                  {
                    id: 'actions',
                    header: 'Actions',
                    cell: ({ row }: any) => (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tickets/${row.original.id}`);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )
                  }
                ] as any}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketsDashboard;
