import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Save, Plus, Search } from 'lucide-react';

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

interface ActivityAssociationPanelProps {
  activity: Activity;
  onSave: (activityId: string, data: any) => void;
  onClose: () => void;
}

interface SelectedTicket {
  id: string;
  title: string;
  timeSpent: number;
}

const mockTickets = [
  { id: 'TASK-001', title: 'Implement user authentication', status: 'In Progress' },
  { id: 'TASK-002', title: 'Fix login bug', status: 'Open' },
  { id: 'BUG-001', title: 'Calendar display issue', status: 'In Progress' },
  { id: 'FEAT-001', title: 'Add notification system', status: 'Open' },
];

export const ActivityAssociationPanel: React.FC<ActivityAssociationPanelProps> = ({
  activity,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    activityType: activity.associationType || '',
    ticketType: '',
    isProductive: activity.isProductive ?? true,
    comments: activity.comments || ''
  });

  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTicketSearch, setShowTicketSearch] = useState(false);

  const filteredTickets = mockTickets.filter(ticket =>
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTicketSelect = (ticket: typeof mockTickets[0]) => {
    if (!selectedTickets.find(t => t.id === ticket.id)) {
      setSelectedTickets(prev => [...prev, {
        id: ticket.id,
        title: ticket.title,
        timeSpent: 0
      }]);
    }
    setSearchTerm('');
    setShowTicketSearch(false);
  };

  const updateTicketTime = (ticketId: string, time: number) => {
    setSelectedTickets(prev => prev.map(t => 
      t.id === ticketId ? { ...t, timeSpent: time } : t
    ));
  };

  const removeTicket = (ticketId: string) => {
    setSelectedTickets(prev => prev.filter(t => t.id !== ticketId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalTimeSpent = selectedTickets.reduce((sum, ticket) => sum + ticket.timeSpent, 0);
    
    onSave(activity.id, {
      associationType: formData.activityType,
      selectedTickets: selectedTickets,
      isProductive: formData.isProductive,
      comments: formData.comments,
      duration: totalTimeSpent
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-slate-800">Associate Multiple Tickets</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="software">Software Used</Label>
              <Input
                id="software"
                value={activity.name}
                disabled
                className="bg-slate-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activityType">Activity Type</Label>
              <ReusableDropdown
                value={formData.activityType}
                onChange={(value) => setFormData(prev => ({ ...prev, activityType: value }))}
                placeholder="Select activity type"
                allowClear
                options={[
                  { value: 'Task', label: 'Task' },
                  { value: 'Meeting', label: 'Meeting' },
                  { value: 'Break', label: 'Break' },
                  { value: 'Idle', label: 'Idle' }
                ]}
              />
            </div>
          </div>

          {/* Ticket Association Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium">Associated Tickets</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowTicketSearch(!showTicketSearch)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Ticket
              </Button>
            </div>

            {showTicketSearch && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="relative mb-4">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => handleTicketSelect(ticket)}
                      className="flex items-center justify-between p-3 bg-white rounded cursor-pointer hover:bg-blue-50 border"
                    >
                      <div>
                        <div className="font-medium text-blue-600">{ticket.id}</div>
                        <div className="text-sm text-gray-600">{ticket.title}</div>
                      </div>
                      <Badge variant="outline">{ticket.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Tickets */}
            <div className="space-y-3">
              {selectedTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex-1">
                    <div className="font-medium text-blue-600">{ticket.id}</div>
                    <div className="text-sm text-gray-600">{ticket.title}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Time (minutes):</Label>
                    <Input
                      type="number"
                      value={ticket.timeSpent}
                      onChange={(e) => updateTicketTime(ticket.id, parseInt(e.target.value) || 0)}
                      className="w-20"
                      min="0"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTicket(ticket.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {selectedTickets.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No tickets associated yet. Click "Add Ticket" to start.
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Is Productive</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  checked={formData.isProductive}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isProductive: checked }))
                  }
                />
                <span className="text-sm text-slate-600">
                  {formData.isProductive ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Total Time</Label>
              <div className="text-lg font-semibold text-blue-600">
                {selectedTickets.reduce((sum, ticket) => sum + ticket.timeSpent, 0)} minutes
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments / Notes</Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
              placeholder="Add any additional notes or justification..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Associations
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
