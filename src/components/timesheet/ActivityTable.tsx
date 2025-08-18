
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReusableTable } from '@/components/ui/reusable-table';
import { Plus, CheckCircle, Clock } from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  date: string;
  duration: number;
  isAssociated: boolean;
  associationType?: 'Task' | 'Meeting' | 'Break' | 'Idle';
  ticketId?: string;
  isProductive?: boolean;
  comments?: string;
}

interface ActivityTableProps {
  activities: Activity[];
  onAssociate: (activity: Activity) => void;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({ activities, onAssociate }) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const columns: any[] = [
    {
      accessorKey: 'name',
      header: 'Activity Name',
      cell: ({ getValue }: any) => (
        <span className="font-medium text-slate-800">{getValue()}</span>
      )
    },
    {
      accessorKey: 'date',
      header: 'Date'
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
      cell: ({ getValue }: any) => formatDuration(getValue())
    },
    {
      accessorKey: 'isAssociated',
      header: 'Status',
      cell: ({ getValue }: any) => (
        getValue() ? (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Associated
          </Badge>
        ) : (
          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
            Not Associated
          </Badge>
        )
      )
    },
    {
      accessorKey: 'associationType',
      header: 'Type',
      cell: ({ getValue }: any) => (
        getValue() ? <Badge variant="outline">{getValue()}</Badge> : <span className="text-slate-400">-</span>
      )
    },
    {
      id: 'action',
      header: 'Action',
      cell: ({ row }: any) => (
        <Button
          size="sm"
          variant={row.original.isAssociated ? "outline" : "default"}
          onClick={() => onAssociate(row.original)}
          className="flex items-center gap-1"
        >
          <Plus className="h-3 w-3" />
          {row.original.isAssociated ? 'Edit' : 'Associate'}
        </Button>
      )
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-blue-600" />
        Auto-Captured Activities
      </h2>
      
      <ReusableTable
        data={activities}
        columns={columns}
      />
    </div>
  );
};
