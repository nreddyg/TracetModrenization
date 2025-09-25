import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, Users, PieChart as PieChartIcon, RotateCcw } from 'lucide-react';
interface TicketGraphsViewProps {
  data: any;
  groupsPie:any;
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

const TicketGraphsView: React.FC<TicketGraphsViewProps> = ({ data,groupsPie }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Tickets by Status
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center overflow-hidden">
            <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="60%" height="60%">
                <PieChart>
                  <Pie data={data.TicketsByStatusData} cx="50%" cy="50%" outerRadius="70%" dataKey="value"
                    label={({ name, value }) => window.innerWidth > 640 ? `${name}: ${value}` : value.toString()}
                    labelLine
                  >
                    {data.TicketsByStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>

        </Card>
        {groupsPie?.length!==0 &&
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Tickets by Status (User Groups)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center overflow-hidden">
              <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
                <ResponsiveContainer width="60%" height="60%">
                  <PieChart>
                    <Pie data={data.StatusByGroups} cx="50%" cy="50%" outerRadius="70%" dataKey="value"
                      label={({ name, value }) => window.innerWidth > 640 ? `${name}: ${value}` : value.toString()}
                      labelLine
                    >
                      {data.StatusByGroups.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>

          </Card>
        }

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tickets Created vs Closed
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center overflow-auto">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.CreatedVsClosed}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="created" fill="#3b82f6" name="Created" />
                  <Bar dataKey="closed" fill="#22c55e" name="Closed" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Tickets Handled per Agent
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center overflow-auto">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.TicketsHandledPerAgent} layout="horizontal">
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
              <PieChartIcon className="h-5 w-5" />
              Tickets by Issue Type
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center overflow-auto">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.TicketsByIssueType}>
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
              <AlertTriangle className="h-5 w-5" />
              Tickets by Priority
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center overflow-auto">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.TicketsByPriority}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value">
                    {data.TicketsByPriority.map((entry, index) => (
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
          <CardContent className="flex justify-center items-center overflow-auto">
            <div className="space-y-2">
              {data.OpenHighPriorityTickets.slice(0, 5).map(ticket => (
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Reopen Rate Trend
            </CardTitle>
          </CardHeader>
          <CardContent className='overflow-auto'>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.ReOpenTrend}>
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
      </div>
    </div>
  );
};

export default TicketGraphsView;
