
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReusableTable } from '@/components/ui/reusable-table';
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

  const columns: any[] = [
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
        <span className="font-medium max-w-xs truncate">{getValue()}</span>
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
        <div className="flex items-center gap-2">
          {getStatusIcon(getValue())}
          <Badge className={getStatusColor(getValue())}>{getValue()}</Badge>
        </div>
      )
    },
    {
      accessorKey: 'project',
      header: 'Project'
    },
    {
      accessorKey: 'category',
      header: 'Category'
    },
    {
      accessorKey: 'assignedTo',
      header: 'Assigned To'
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By'
    },
    {
      accessorKey: 'createdOn',
      header: 'Created On'
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      cell: ({ getValue }: any) => getValue() || 'N/A'
    },
    {
      accessorKey: 'estimatedTime',
      header: 'Est. Time'
    },
    {
      accessorKey: 'sprintNo',
      header: 'Sprint',
      cell: ({ getValue }: any) => (
        getValue() ? <Badge variant="outline">{getValue()}</Badge> : <span className="text-gray-400">Backlog</span>
      )
    },
    {
      accessorKey: 'slaBreached',
      header: 'SLA',
      cell: ({ getValue }: any) => (
        getValue() ? 
          <Badge className="bg-red-100 text-red-800">Breached</Badge> : 
          <Badge className="bg-green-100 text-green-800">On Track</Badge>
      )
    },
    {
      accessorKey: 'reopenCount',
      header: 'Reopen Count',
      cell: ({ getValue }: any) => (
        getValue() && getValue() > 0 ? 
          <Badge className="bg-orange-100 text-orange-800">{getValue()}</Badge> : 
          <span className="text-gray-400">0</span>
      )
    },
    {
      accessorKey: 'csatScore',
      header: 'CSAT',
      cell: ({ getValue }: any) => (
        getValue() ? (
          <div className="flex items-center gap-1">
            <span className="text-sm">{getValue()}</span>
            <span className="text-yellow-500">★</span>
          </div>
        ) : <span className="text-gray-400">N/A</span>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
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
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/tickets/${row.original.id}?edit=true`);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <ReusableTable
        data={tickets}
        columns={columns}
      />
    </div>
  );
};

export default TicketRecordsView;
