
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-blue-600" />
        Auto-Captured Activities
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium text-slate-700">Activity Name</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">Duration</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">Type</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr 
                key={activity.id} 
                className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                  !activity.isAssociated ? 'bg-red-50' : 'bg-green-50'
                }`}
              >
                <td className="py-3 px-4 font-medium text-slate-800">{activity.name}</td>
                <td className="py-3 px-4 text-slate-600">{activity.date}</td>
                <td className="py-3 px-4 text-slate-600">{formatDuration(activity.duration)}</td>
                <td className="py-3 px-4">
                  {activity.isAssociated ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Associated
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
                      Not Associated
                    </Badge>
                  )}
                </td>
                <td className="py-3 px-4">
                  {activity.associationType ? (
                    <Badge variant="outline">{activity.associationType}</Badge>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <Button
                    size="sm"
                    variant={activity.isAssociated ? "outline" : "default"}
                    onClick={() => onAssociate(activity)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    {activity.isAssociated ? 'Edit' : 'Associate'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
