import React, { useState } from 'react';
import { ArrowLeft, Upload, Plus, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ResponsiveBreadcrumb } from '@/components/common/ResponsiveBreadcrumb';

interface TicketDetailViewProps {
  ticketId?: string;
  title?: string;
  type?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  reporter?: string;
  created?: string;
  sprint?: string;
  description?: string;
  onSave?: (data: any) => void;
  isEditing?: boolean;
}

export const TicketDetailView: React.FC<TicketDetailViewProps> = ({
  ticketId = 'TCK-10245',
  title = 'Fix UI in Login Form',
  type = 'Bug',
  status = 'In Progress',
  priority = 'High',
  assignee = 'John Doe',
  reporter = 'Jane Smith',
  created = '06/10/2025',
  sprint = 'Sprint-14',
  description = 'The login form has alignment issues on mobile devices. The submit button is not properly aligned and the input fields overlap on smaller screens.',
  onSave,
  isEditing = true,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title,
    description,
    type,
    status,
    priority,
    assignee,
    reporter,
    sprint,
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  const statusOptions = [
    { value: 'Open', label: 'Open' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' },
    { value: 'Closed', label: 'Closed' },
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' },
  ];

  const typeOptions = [
    { value: 'Bug', label: 'Bug' },
    { value: 'Feature', label: 'Feature' },
    { value: 'Task', label: 'Task' },
    { value: 'Story', label: 'Story' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'destructive';
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'outline';
      case 'In Progress': return 'default';
      case 'Resolved': return 'secondary';
      case 'Closed': return 'outline';
      default: return 'outline';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave?.(formData);
  };

  const breadcrumbItems = [
    { label: 'All Tickets', href: '/tickets' },
    { label: ticketId, href: '#' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <ResponsiveBreadcrumb items={breadcrumbItems} />
              <Badge variant={getPriorityColor(formData.priority)}>{formData.priority}</Badge>
              <Badge variant={getStatusColor(formData.status)}>{formData.status}</Badge>
            </div>
            <ReusableButton
              onClick={handleSave}
              icon={<Save className="h-4 w-4" />}
              className="bg-primary hover:bg-primary/90"
            >
              Save
            </ReusableButton>
          </div>
          <div className="mt-2">
            <h1 className="text-xl font-semibold">{formData.title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <Card className="p-6">
              <Label className="text-sm font-medium mb-2 block">Summary</Label>
              {isEditing ? (
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full"
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded">{formData.title}</p>
              )}
            </Card>

            {/* Description */}
            <Card className="p-6">
              <Label className="text-sm font-medium mb-2 block">Description</Label>
              {isEditing ? (
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full min-h-[120px]"
                  placeholder="Enter description..."
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded whitespace-pre-wrap">
                  {formData.description}
                </p>
              )}
            </Card>

            {/* Attachments */}
            <Card className="p-6">
              <Label className="text-sm font-medium mb-4 block">Attachments</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop files here, or{' '}
                  <label className="text-primary cursor-pointer hover:underline">
                    browse
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    />
                  </label>
                </p>
                <p className="text-xs text-muted-foreground">Max 10MB per file, up to 5 files</p>
              </div>
              
              {/* Attachment List */}
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Activity */}
            <Card className="p-6">
              <Label className="text-sm font-medium mb-4 block">Activity</Label>
              <Tabs defaultValue="comments" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                  <TabsTrigger value="worklog">Work Log</TabsTrigger>
                </TabsList>
                <TabsContent value="comments" className="mt-4">
                  <div className="space-y-4">
                    <Textarea placeholder="Add a comment..." className="min-h-[80px]" />
                    <Button size="sm">Add Comment</Button>
                  </div>
                </TabsContent>
                <TabsContent value="history" className="mt-4">
                  <p className="text-sm text-muted-foreground">No history available</p>
                </TabsContent>
                <TabsContent value="worklog" className="mt-4">
                  <p className="text-sm text-muted-foreground">No work log entries</p>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="time">Time</TabsTrigger>
                  <TabsTrigger value="links">Links</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="mt-4 space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">TYPE</Label>
                    {isEditing ? (
                      <ReusableDropdown
                        options={typeOptions}
                        value={formData.type}
                        onChange={(value) => setFormData(prev => ({ ...prev, type: value as string }))}
                        className="mt-1"
                      />
                    ) : (
                      <Badge variant="outline" className="mt-1">{formData.type}</Badge>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">STATUS</Label>
                    {isEditing ? (
                      <ReusableDropdown
                        options={statusOptions}
                        value={formData.status}
                        onChange={(value) => setFormData(prev => ({ ...prev, status: value as string }))}
                        className="mt-1"
                      />
                    ) : (
                      <Badge variant={getStatusColor(formData.status)} className="mt-1">{formData.status}</Badge>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">PRIORITY</Label>
                    {isEditing ? (
                      <ReusableDropdown
                        options={priorityOptions}
                        value={formData.priority}
                        onChange={(value) => setFormData(prev => ({ ...prev, priority: value as string }))}
                        className="mt-1"
                      />
                    ) : (
                      <Badge variant={getPriorityColor(formData.priority)} className="mt-1">{formData.priority}</Badge>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ASSIGNEE</Label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <span>{formData.assignee}</span>
                        {isEditing && <X className="h-3 w-3 cursor-pointer" />}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">REPORTER</Label>
                    <p className="mt-1 text-sm">{formData.reporter}</p>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">CREATED</Label>
                    <p className="mt-1 text-sm">{created}</p>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">SPRINT</Label>
                    <p className="mt-1 text-sm">{formData.sprint}</p>
                  </div>
                </TabsContent>

                <TabsContent value="time" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">TIME SPENT</Label>
                      <p className="mt-1 text-sm">0h</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">REMAINING ESTIMATE</Label>
                      <p className="mt-1 text-sm">Not set</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="links" className="mt-4">
                  <div className="space-y-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Link Issue
                    </Button>
                    <p className="text-sm text-muted-foreground">No links available</p>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};