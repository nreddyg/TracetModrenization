
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

interface ManualEntry {
  id: string;
  activityName: string;
  activityType: 'Meeting' | 'Break' | 'Idle' | 'Task';
  ticketId?: string;
  timeSpent: number;
  justification: string;
}

interface ManualTimeEntryProps {
  onAddEntry: (entry: Omit<ManualEntry, 'id'>) => void;
  entries: ManualEntry[];
  pendingHours: number;
}

const mockTickets = [
  { id: 'TASK-001', title: 'Implement user authentication' },
  { id: 'TASK-002', title: 'Fix login bug' },
  { id: 'BUG-001', title: 'Calendar display issue' },
];

export const ManualTimeEntry: React.FC<ManualTimeEntryProps> = ({
  onAddEntry,
  entries,
  pendingHours
}) => {
  const [formData, setFormData] = useState({
    activityName: '',
    activityType: '',
    ticketId: '',
    timeSpent: '',
    justification: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.activityName || !formData.activityType || !formData.timeSpent) return;

    const [hours, minutes] = formData.timeSpent.split(':').map(Number);
    const totalMinutes = (hours * 60) + minutes;

    onAddEntry({
      activityName: formData.activityName,
      activityType: formData.activityType as any,
      ticketId: formData.ticketId || undefined,
      timeSpent: totalMinutes,
      justification: formData.justification
    });

    setFormData({
      activityName: '',
      activityType: '',
      ticketId: '',
      timeSpent: '',
      justification: ''
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const totalManualMinutes = entries.reduce((sum, entry) => sum + entry.timeSpent, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="h-5 w-5 text-amber-600" />
        <h2 className="text-xl font-semibold text-slate-800">Manual Time Entry</h2>
        <Badge variant="outline" className="ml-auto">
          Pending: {pendingHours.toFixed(2)}h
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="activityName">Activity Name</Label>
            <Input
              id="activityName"
              value={formData.activityName}
              onChange={(e) => setFormData(prev => ({ ...prev, activityName: e.target.value }))}
              placeholder="e.g., Internal Discussion"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activityType">Activity Type</Label>
            <ReusableDropdown
              value={formData.activityType}
              onChange={(value) => setFormData(prev => ({ ...prev, activityType: value }))}
              placeholder="Select type"
              allowClear
              options={[
                { value: 'Task', label: 'Task' },
                { value: 'Meeting', label: 'Meeting' },
                { value: 'Break', label: 'Break' },
                { value: 'Idle', label: 'Idle' }
              ]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticketId">Ticket ID (Optional)</Label>
            <ReusableDropdown
              value={formData.ticketId}
              onChange={(value) => setFormData(prev => ({ ...prev, ticketId: value }))}
              placeholder="Select ticket"
              allowClear
              search
              options={mockTickets.map(ticket => ({
                value: ticket.id,
                label: `${ticket.id} - ${ticket.title}`
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeSpent">Time Spent (HH:MM)</Label>
            <Input
              id="timeSpent"
              value={formData.timeSpent}
              onChange={(e) => setFormData(prev => ({ ...prev, timeSpent: e.target.value }))}
              placeholder="1:30"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="justification">Justification</Label>
          <Textarea
            id="justification"
            value={formData.justification}
            onChange={(e) => setFormData(prev => ({ ...prev, justification: e.target.value }))}
            placeholder="Provide justification for this time entry..."
            rows={2}
          />
        </div>

        <Button type="submit" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Entry
        </Button>
      </form>

      {/* Manual Entries List */}
      {entries.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-slate-800">Manual Entries</h3>
            <Badge className="bg-blue-100 text-blue-800">
              Total: {formatDuration(totalManualMinutes)}
            </Badge>
          </div>
          
          <div className="space-y-2">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">{entry.activityName}</span>
                    <Badge variant="outline">{entry.activityType}</Badge>
                    {entry.ticketId && (
                      <Badge variant="secondary">{entry.ticketId}</Badge>
                    )}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    {formatDuration(entry.timeSpent)} - {entry.justification}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
