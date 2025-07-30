import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResponsiveTabs } from '@/components/ui/responsive-tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  User, 
  Calendar,
  Filter,
  Plus,
  Eye,
  Edit,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyWorkspace = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const myTickets = [
    {
      id: 'TKT-001',
      title: 'Email Configuration Issue',
      status: 'Open',
      priority: 'High',
      created: '2024-01-15',
      lastUpdate: '2024-01-16'
    },
    {
      id: 'TKT-002',
      title: 'Software Installation Request',
      status: 'In Progress',
      priority: 'Medium',
      created: '2024-01-14',
      lastUpdate: '2024-01-15'
    }
  ];

  const assignedTickets = [
    {
      id: 'TKT-003',
      title: 'Network Connectivity Problem',
      requester: 'John Smith',
      status: 'Open',
      priority: 'High',
      assigned: '2024-01-16'
    }
  ];

  const recentActivity = [
    {
      action: 'Ticket Updated',
      ticket: 'TKT-001',
      description: 'Status changed to In Progress',
      time: '2 hours ago'
    },
    {
      action: 'New Comment',
      ticket: 'TKT-002',
      description: 'Added technical details',
      time: '4 hours ago'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-700';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'closed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const tabItems = [
    {
      value: 'my-tickets',
      label: 'My Tickets',
      icon: <User className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold">My Open Tickets</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Link to="/service-desk/new-request">
                <Button size="sm" className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Ticket
                </Button>
              </Link>
            </div>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-900">Ticket ID</TableHead>
                      <TableHead className="font-semibold text-gray-900">Title</TableHead>
                      <TableHead className="font-semibold text-gray-900">Priority</TableHead>
                      <TableHead className="font-semibold text-gray-900">Status</TableHead>
                      <TableHead className="font-semibold text-gray-900 hidden sm:table-cell">Created</TableHead>
                      <TableHead className="font-semibold text-gray-900 hidden md:table-cell">Last Update</TableHead>
                      <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell className="max-w-48 truncate">{ticket.title}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {new Date(ticket.created).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(ticket.lastUpdate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      value: 'assigned-tickets',
      label: 'Assigned',
      icon: <Clock className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Assigned Tickets</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-900">Ticket ID</TableHead>
                      <TableHead className="font-semibold text-gray-900">Title</TableHead>
                      <TableHead className="font-semibold text-gray-900 hidden sm:table-cell">Requester</TableHead>
                      <TableHead className="font-semibold text-gray-900">Priority</TableHead>
                      <TableHead className="font-semibold text-gray-900">Status</TableHead>
                      <TableHead className="font-semibold text-gray-900 hidden md:table-cell">Assigned Date</TableHead>
                      <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell className="max-w-48 truncate">{ticket.title}</TableCell>
                        <TableCell className="hidden sm:table-cell">{ticket.requester}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(ticket.assigned).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      value: 'activity',
      label: 'Activity',
      icon: <MessageSquare className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-gray-200">
                {recentActivity.map((activity, index) => (
                  <li key={index} className="py-4 px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{activity.action} - {activity.ticket}</p>
                          <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 flex-shrink-0">{activity.time}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 pb-6 pt-6 space-y-6 animate-fade-in">
        <ResponsiveTabs
          items={tabItems}
          defaultValue="my-tickets"
          breakpoint="md"
          className="space-y-4"
        />
      </div>
    </div>
  );
};

export default MyWorkspace;
