
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Edit, ClipboardList, Clock, CheckCircle } from 'lucide-react';

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

interface TicketRecordsViewProps {
  tickets: Ticket[];
}

const TicketRecordsView: React.FC<TicketRecordsViewProps> = ({ tickets }) => {
  const navigate = useNavigate();

  const handleRowClick = (ticketId: string) => {
    navigate(`/tickets/${ticketId}`);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <ClipboardList className="h-4 w-4" />;
      case 'In Progress': return <Clock className="h-4 w-4" />;
      case 'Resolved': return <CheckCircle className="h-4 w-4" />;
      case 'Closed': return <CheckCircle className="h-4 w-4" />;
      default: return <ClipboardList className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created On</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Est. Time</TableHead>
              <TableHead>Sprint</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead>Reopen Count</TableHead>
              <TableHead>CSAT</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow
                key={ticket.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(ticket.id)}
              >
                <TableCell className="font-medium text-blue-600">
                  {ticket.id}
                </TableCell>
                <TableCell className="font-medium max-w-xs truncate">
                  {ticket.title}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{ticket.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(ticket.status)}
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{ticket.project}</TableCell>
                <TableCell className="text-sm">{ticket.category}</TableCell>
                <TableCell>{ticket.assignedTo}</TableCell>
                <TableCell>{ticket.createdBy}</TableCell>
                <TableCell>{ticket.createdOn}</TableCell>
                <TableCell>{ticket.dueDate || 'N/A'}</TableCell>
                <TableCell>{ticket.estimatedTime}</TableCell>
                <TableCell>
                  {ticket.sprintNo ? (
                    <Badge variant="outline">{ticket.sprintNo}</Badge>
                  ) : (
                    <span className="text-gray-400">Backlog</span>
                  )}
                </TableCell>
                <TableCell>
                  {ticket.slaBreached ? (
                    <Badge className="bg-red-100 text-red-800">Breached</Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800">On Track</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {ticket.reopenCount && ticket.reopenCount > 0 ? (
                    <Badge className="bg-orange-100 text-orange-800">{ticket.reopenCount}</Badge>
                  ) : (
                    <span className="text-gray-400">0</span>
                  )}
                </TableCell>
                <TableCell>
                  {ticket.csatScore ? (
                    <div className="flex items-center gap-1">
                      <span className="text-sm">{ticket.csatScore}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tickets/${ticket.id}`);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tickets/${ticket.id}?edit=true`);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TicketRecordsView;
