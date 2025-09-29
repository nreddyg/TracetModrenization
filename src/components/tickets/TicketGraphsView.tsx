import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, Users, PieChart as PieChartIcon, RotateCcw } from 'lucide-react';
interface TicketGraphsViewProps {
  data: any;
  groupsPie: any;
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

const TicketGraphsView: React.FC<TicketGraphsViewProps> = ({ data, groupsPie }) => {
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
          <CardContent>
            <ChartContainer config={chartConfig} className='h-[300px] sm:h[250px]'>
              <ResponsiveContainer width="60%" height="60%">
                {data?.TicketsByStatusData?.length===0?
                <div className='text-sm font-semibold'>
                  No Data Found !!
                </div>:
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
                </PieChart>}
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>

        </Card>
        {groupsPie?.length !== 0 &&
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Tickets by Status (User Groups)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] sm:h[250px]">
                <ResponsiveContainer width="60%" height="60%">
                  {data?.StatusByGroups?.length===0
                    ?<div className='text-sm font-semibold'>
                  No Data Found !!
                </div>:
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
                  </PieChart>}
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
          <CardContent className={`${data?.CreatedVsClosed?.length === 0 ? 'mt-0' : 'mt-4'}`}>
            <ChartContainer config={chartConfig} className="h-[350px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {data?.CreatedVsClosed?.length===0?<div className='text-sm font-semibold'>
                  No Data Found !!
                </div>:
                <BarChart data={data.CreatedVsClosed}
                  // margin={{ top: 20, right: 10, bottom: 20, left: 15 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" interval={0} tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60}
                    dx={-5}
                    dy={5}
                    {...(data.CreatedVsClosed.length === 0 && { label: { value: 'Date', position: 'insideBottom', offset: -10 } })}

                  />
                  <YAxis
                    allowDecimals={false}

                    {...(data.CreatedVsClosed.length === 0 && { label: { value: 'No. of Tickets', position: 'insideLeft', angle: -90 } })}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="created" fill="#3b82f6" name="Created" />
                  <Bar dataKey="closed" fill="#22c55e" name="Closed" />
                </BarChart>}
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
          <CardContent className="p-6">
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                {
                  data?.TicketsHandledPerAgent?.length===0?
                  <div className='text-sm font-semibold'>
                  No Data Found !!
                </div>:
                <BarChart
                  data={data.TicketsHandledPerAgent}
                  margin={{ top: 10, right: 0, left: 0, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    tick={{ fontSize: data.TicketsHandledPerAgent.length > 15 ? 8 : 10, fill: '#6b7280' }}
                    angle={-60}
                    textAnchor="end"
                    height={70}
                    dx={-5}
                    dy={5}
                    {...(data.TicketsHandledPerAgent.length === 0 && { label: { value: 'Employee Name', position: 'insideBottom', offset: -45 } })}

                  />
                  <YAxis
                    allowDecimals={false}

                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    {...(data.TicketsHandledPerAgent.length === 0 && { label: { value: 'No. of Tickets', position: 'insideBottom', angle: -90 } })}

                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="tickets"
                    fill="#22c55e"
                    name="Tickets"
                    barSize={30}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
}
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
          <CardContent className="p-6">
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {data?.TicketsByIssueType?.length===0?
                <div className='text-sm font-semibold'>
                  No Data Found !!
                </div>:
                <BarChart
                  data={data.TicketsByIssueType}
                  margin={{ top: 10, right: 0, left: -30, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    tick={{ fontSize: data.TicketsByIssueType.length > 15 ? 8 : 10, fill: '#6b7280' }}
                    angle={-60}
                    textAnchor="end"
                    height={70}
                    dx={-5}
                    dy={5}
                    {...(data.TicketsByIssueType.length === 0 && { label: { value: 'Issue Type', position: 'insideBottom', offset: -10 } })}
                  />
                  <YAxis
                    allowDecimals={false}

                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    {...(data.TicketsByIssueType.length === 0 && { label: { value: 'No. of Tickets', position: 'insideLeft', angle: -90 } })}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="count"
                    fill="#8884d8"
                    name="Tickets"
                    barSize={30}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
}
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
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px] sm:h-[300px]">
              <ResponsiveContainer width="50%" height="60%">
                {data?.TicketsByPriority?.length===0?
                <div className='text-sm font-semibold'>
                  No Data Found !!
                </div>:
                <BarChart data={data.TicketsByPriority} margin={{ top: 10, right: 0, left: -10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name"
                    {...(data.TicketsByPriority.length === 0 && { label: { value: 'Priority', position: 'insideBottom', offset: -10 } })}
                  />
                  <YAxis
                    allowDecimals={false}

                    {...(data.TicketsByPriority.length === 0 && { label: { value: 'No. of Tickets', position: 'insideLeft', angle: -90 } })}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count">
                    {data.TicketsByPriority.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>}
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
<CardContent
  className={`flex  ${data?.OpenHighPriorityTickets?.length === 0 ? 'flex-start' : 'items-center justify-center'}`}
>

            {data?.OpenHighPriorityTickets?.length===0?<div className='text-sm font-semibold flex-start'>
                  No Data Found !!
                </div>:
            <div className="space-y-2 w-full overflow-auto h-[300px] ">
              {data.OpenHighPriorityTickets.slice(0, 5).map(ticket =>
              {
             
              return(
                <div key={ticket.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                   
                    <span className="font-medium">{ticket.ticket_no}</span>
                    <p className="text-sm text-gray-600">{ticket.title}</p>
                  </div>
                  <Badge className={ticket.priority === 'Critical' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'}>
                    {ticket.priority}
                  </Badge>
                </div>
              )
            }
              )}
            </div>}
          </CardContent>
        </Card>
 

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Reopen Rate Trend
            </CardTitle>
          </CardHeader>
          <CardContent   className={`flex  ${data?.ReOpenTrend?.length === 0 ? 'p-0 ps-6' : 'p-6'}`}>
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {data?.ReOpenTrend?.length===0? <div className='text-sm font-semibold'>
                  No Data Found !!
                </div>:
                <LineChart
                  data={data.ReOpenTrend}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="Month"
                    interval={0}
                    tick={{ fontSize: data.ReOpenTrend.length > 15 ? 8 : 10, fill: '#6b7280' }}
                    angle={-60}
                    textAnchor="end"
                    height={70}
                    dx={-5}
                    dy={5}
                    {...((data.ReOpenTrend.length === 0 || data.ReOpenTrend.every(item => item.ReopenRate === 0)) && {
                      label: {
                        value: 'Months',
                        offset: -10,
                        position: 'insideBottom',
                        style: {
                          fontSize: '13px',
                          fill: '#374151',
                          fontWeight: '600',
                          textAnchor: 'middle',
                        },
                      },
                    })}

                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    label={{
                      value: 'Re-Open Rate ',
                      angle: -90,
                      position: 'insideLeft',
                      style: {
                        fontSize: '13px',
                        fill: '#374151',
                        fontWeight: '600',
                        textAnchor: 'middle'
                      }
                    }}

                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="ReopenRate"
                    stroke="#f97316"
                    strokeWidth={2}
                    name="Reopen Rate"
                    dot={{ fill: '#f97316', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
}
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketGraphsView;
