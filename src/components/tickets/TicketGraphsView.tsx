import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Treemap,
  ScatterChart,
  Scatter,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  BarChart3, 
  PieChart as PieChartIcon,
  Activity,
  Star,
  RotateCcw
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

interface TicketGraphsViewProps {
  tickets: Ticket[];
}

const chartConfig = {
  open: { label: 'Open', color: '#3b82f6' },
  inProgress: { label: 'In Progress', color: '#f97316' },
  resolved: { label: 'Resolved', color: '#22c55e' },
  closed: { label: 'Closed', color: '#6b7280' },
  critical: { label: 'Critical', color: '#dc2626' },
  high: { label: 'High', color: '#ea580c' },
  medium: { label: 'Medium', color: '#ca8a04' },
  low: { label: 'Low', color: '#16a34a' },
};

const TicketGraphsView: React.FC<TicketGraphsViewProps> = ({ tickets }) => {
  // 1. Ticket Volume & Status Overview
  const statusData = [
    { name: 'Open', value: tickets.filter(t => t.status === 'Open').length, color: '#3b82f6' },
    { name: 'In Progress', value: tickets.filter(t => t.status === 'In Progress').length, color: '#f97316' },
    { name: 'Resolved', value: tickets.filter(t => t.status === 'Resolved').length, color: '#22c55e' },
    { name: 'Closed', value: tickets.filter(t => t.status === 'Closed').length, color: '#6b7280' },
  ];

  const trendData = [
    { date: '2025-06-08', created: 2, resolved: 1 },
    { date: '2025-06-09', created: 3, resolved: 2 },
    { date: '2025-06-10', created: 1, resolved: 3 },
    { date: '2025-06-11', created: 2, resolved: 1 },
    { date: '2025-06-12', created: 4, resolved: 2 },
    { date: '2025-06-13', created: 1, resolved: 4 },
  ];

  // 2. SLA Compliance Monitoring
  const slaData = [
    { name: 'Within SLA', value: tickets.filter(t => !t.slaBreached).length, color: '#22c55e' },
    { name: 'SLA Breached', value: tickets.filter(t => t.slaBreached).length, color: '#dc2626' },
  ];

  const slaBreachTrend = [
    { week: 'Week 1', breached: 2 },
    { week: 'Week 2', breached: 1 },
    { week: 'Week 3', breached: 3 },
    { week: 'Week 4', breached: 1 },
  ];

  // 3. Team / Agent Performance
  const agentPerformance = tickets.reduce((acc, ticket) => {
    if (!acc[ticket.assignedTo]) {
      acc[ticket.assignedTo] = { 
        name: ticket.assignedTo, 
        tickets: 0, 
        avgResolution: 0, 
        slaBreaches: 0,
        firstResponse: 0,
        resolved: 0
      };
    }
    acc[ticket.assignedTo].tickets++;
    if (ticket.slaBreached) acc[ticket.assignedTo].slaBreaches++;
    if (ticket.status === 'Resolved' || ticket.status === 'Closed') {
      acc[ticket.assignedTo].resolved++;
      acc[ticket.assignedTo].avgResolution += parseFloat(ticket.resolutionTime?.replace('h', '') || '0');
    }
    if (ticket.firstResponseTime) {
      acc[ticket.assignedTo].firstResponse += parseFloat(ticket.firstResponseTime.replace('h', '').replace('m', ''));
    }
    return acc;
  }, {} as Record<string, any>);

  const agentData = Object.values(agentPerformance).map((agent: any) => ({
    ...agent,
    avgResolution: agent.resolved > 0 ? (agent.avgResolution / agent.resolved).toFixed(1) : 0,
    firstResponse: (agent.firstResponse / agent.tickets).toFixed(1),
  }));

  // 4. Category / Issue Type Insights
  const categoryData = tickets.reduce((acc, ticket) => {
    if (!acc[ticket.category]) {
      acc[ticket.category] = { name: ticket.category, count: 0, totalResolution: 0, resolved: 0 };
    }
    acc[ticket.category].count++;
    if (ticket.resolutionTime) {
      acc[ticket.category].totalResolution += parseFloat(ticket.resolutionTime.replace('h', ''));
      acc[ticket.category].resolved++;
    }
    return acc;
  }, {} as Record<string, any>);

  const categoryChartData = Object.values(categoryData).map((cat: any) => ({
    name: cat.name,
    count: cat.count,
    avgResolution: cat.resolved > 0 ? (cat.totalResolution / cat.resolved).toFixed(1) : 0,
  }));

  const typeData = tickets.reduce((acc, ticket) => {
    if (!acc[ticket.type]) {
      acc[ticket.type] = 0;
    }
    acc[ticket.type]++;
    return acc;
  }, {} as Record<string, number>);

  const typeChartData = Object.entries(typeData).map(([type, count]) => ({
    name: type,
    count,
  }));

  // 5. Priority & Urgency Monitoring
  const priorityData = [
    { name: 'Critical', value: tickets.filter(t => t.priority === 'Critical').length, color: '#dc2626' },
    { name: 'High', value: tickets.filter(t => t.priority === 'High').length, color: '#ea580c' },
    { name: 'Medium', value: tickets.filter(t => t.priority === 'Medium').length, color: '#ca8a04' },
    { name: 'Low', value: tickets.filter(t => t.priority === 'Low').length, color: '#16a34a' },
  ];

  const highPriorityTickets = tickets.filter(t => t.status === 'Open' && (t.priority === 'Critical' || t.priority === 'High'));

  // 6. CSAT & Feedback
  const csatData = tickets.filter(t => t.csatScore).reduce((acc, ticket) => {
    const score = ticket.csatScore!;
    if (!acc[score]) {
      acc[score] = 0;
    }
    acc[score]++;
    return acc;
  }, {} as Record<number, number>);

  const csatChartData = Object.entries(csatData).map(([score, count]) => ({
    rating: `${score} Stars`,
    count,
  }));

  const agentCSAT = agentData.map(agent => {
    const agentTickets = tickets.filter(t => t.assignedTo === agent.name && t.csatScore);
    const avgCSAT = agentTickets.length > 0 
      ? (agentTickets.reduce((sum, t) => sum + t.csatScore!, 0) / agentTickets.length).toFixed(1)
      : 'N/A';
    return {
      ...agent,
      avgCSAT,
    };
  });

  // 7. Reopen & Escalation Tracking
  const reopenData = [
    { month: 'Jan', reopenRate: 5.2 },
    { month: 'Feb', reopenRate: 3.8 },
    { month: 'Mar', reopenRate: 4.1 },
    { month: 'Apr', reopenRate: 2.9 },
    { month: 'May', reopenRate: 3.5 },
    { month: 'Jun', reopenRate: 4.3 },
  ];

  const escalationData = agentData.map(agent => ({
    name: agent.name,
    escalations: tickets.filter(t => t.assignedTo === agent.name && t.escalated).length,
  }));

  const multiReopenTickets = tickets.filter(t => t.reopenCount && t.reopenCount > 1);

  return (
    <div className="space-y-6">
      {/* 1. Ticket Volume & Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Tickets by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    dataKey="value"
                    label={({ name, value }) => window.innerWidth > 640 ? `${name}: ${value}` : value.toString()}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tickets Created vs Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="created" fill="#3b82f6" name="Created" />
                  <Bar dataKey="resolved" fill="#22c55e" name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* 2. SLA Compliance Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              SLA Compliance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={slaData}
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    dataKey="value"
                    label={({ name, value }) => window.innerWidth > 640 ? `${name}: ${value}` : value.toString()}
                  >
                    {slaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              SLA Breach Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={slaBreachTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="breached" stroke="#dc2626" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* 3. Team / Agent Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Tickets Handled per Agent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="tickets" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Average Resolution Time by Agent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avgResolution" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* 4. Category / Issue Type Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Tickets by Issue Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Resolution Time by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avgResolution" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* 5. Priority & Urgency Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Tickets by Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value">
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Open High-Priority Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {highPriorityTickets.slice(0, 5).map(ticket => (
                <div key={ticket.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">{ticket.id}</span>
                    <p className="text-sm text-gray-600">{ticket.title}</p>
                  </div>
                  <Badge className={ticket.priority === 'Critical' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'}>
                    {ticket.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 6. CSAT & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              CSAT Ratings Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={csatChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#fbbf24" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              CSAT by Agent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {agentCSAT.slice(0, 5).map(agent => (
                <div key={agent.name} className="flex items-center justify-between p-2 border rounded">
                  <span className="font-medium">{agent.name}</span>
                  <div className="flex items-center gap-2">
                    <span>{agent.avgCSAT}</span>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 7. Reopen & Escalation Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Reopen Rate Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reopenData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="reopenRate" stroke="#f97316" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Escalations by Agent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={escalationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="escalations" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Multiple Reopen Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Tickets with Multiple Reopens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {multiReopenTickets.map(ticket => (
              <div key={ticket.id} className="flex items-center justify-between p-2 border rounded bg-red-50">
                <div>
                  <span className="font-medium text-red-800">{ticket.id}</span>
                  <p className="text-sm text-gray-600">{ticket.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800">
                    {ticket.reopenCount} reopens
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {ticket.assignedTo}
                  </Badge>
                </div>
              </div>
            ))}
            {multiReopenTickets.length === 0 && (
              <p className="text-gray-500 text-center py-4">No tickets with multiple reopens</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketGraphsView;
