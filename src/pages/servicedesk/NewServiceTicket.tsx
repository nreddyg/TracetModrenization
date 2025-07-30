import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Send, 
  Paperclip, 
  Clock, 
  User, 
  Building, 
  Tag,
  AlertCircle,
  FileText,
  Calendar,
  Plus,
  X
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import PageLayout from '@/components/common/PageLayout';
import { useAppDispatch } from '@/store';
import { addTicket } from '@/store/slices/ticketsSlice';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import { ReusableMultiSelect } from '@/components/ui/reusable-multi-select';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ReusableRichTextEditor } from '@/components/ui/reusable-rich-text-editor';

// Validation schema
const ticketSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  urgency: z.enum(['Low', 'Medium', 'High', 'Critical']),
  department: z.string().optional(),
  assignedTo: z.string().optional(),
  dueDate: z.date().optional(),
  project: z.string().optional(),
});

type TicketFormData = z.infer<typeof ticketSchema>;

const categoryOptions = [
  { value: 'hardware-issue', label: 'Hardware Issue' },
  { value: 'software-issue', label: 'Software Issue' },
  { value: 'network-problem', label: 'Network Problem' },
  { value: 'access-request', label: 'Access Request' },
  { value: 'general-inquiry', label: 'General Inquiry' },
  { value: 'bug-report', label: 'Bug Report' },
  { value: 'feature-request', label: 'Feature Request' }
];

const departmentOptions = [
  { value: 'it', label: 'IT' },
  { value: 'hr', label: 'HR' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' }
];

const assigneeOptions = [
  { value: 'john-doe', label: 'John Doe' },
  { value: 'jane-smith', label: 'Jane Smith' },
  { value: 'mike-johnson', label: 'Mike Johnson' },
  { value: 'sarah-wilson', label: 'Sarah Wilson' },
  { value: 'david-brown', label: 'David Brown' }
];

const projectOptions = [
  { value: 'erp-upgrade', label: 'ERP System Upgrade' },
  { value: 'mobile-app', label: 'Mobile App Development' },
  { value: 'security-audit', label: 'Security Audit' },
  { value: 'website-redesign', label: 'Website Redesign' }
];

const priorityOptions = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Critical', label: 'Critical' }
];

const NewServiceTicket = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [attachments, setAttachments] = useState<File[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      priority: 'Medium',
      urgency: 'Medium',
      department: '',
      assignedTo: '',
      project: '',
    }
  });

  const handleAttachmentAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const handleSaveDraft = (data: TicketFormData) => {
    console.log('Saving draft:', { ...data, tags: selectedTags, attachments });
  };

  const handleSubmitTicket = (data: TicketFormData) => {
    const ticketData = {
      id: `TKT-${Date.now()}`,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: 'Open' as const,
      assignee: data.assignedTo || 'Unassigned',
      category: data.category,
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: data.dueDate?.toISOString().split('T')[0],
      tags: selectedTags,
    };
    
    dispatch(addTicket(ticketData));
    console.log('Submitting ticket:', { ...data, tags: selectedTags, attachments });
    navigate('/service-desk/my-workspace');
  };

  return (
    <PageLayout>
      <div className="px-4 pb-4 animate-fade-in">
        <div className="flex gap-4">
          <div className="flex-1 space-y-4">
            <Form {...form}>
              <form className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ReusableInput
                      label="Title"
                      tooltip="Enter a brief description of the issue or request"
                      placeholder="Brief description of the issue or request"
                      value={form.watch('title')}
                      onChange={(e) => form.setValue('title', e.target.value)}
                      error={form.formState.errors.title?.message}
                      className="h-7 text-xs"
                    />

                    <ReusableRichTextEditor
                      label="Description"
                      tooltip="Provide detailed information about your request or issue"
                      placeholder="Provide detailed information about your request or issue..."
                      value={form.watch('description')}
                      onChange={(value) => form.setValue('description', value)}
                      error={form.formState.errors.description?.message}
                      minHeight={100}
                      maxHeight={300}
                      showToolbar={true}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <ReusableDropdown
                        label="Category"
                        tooltip="Select the appropriate category for your request"
                        placeholder="Select category"
                        options={categoryOptions}
                        value={form.watch('category')}
                        onChange={(value) => form.setValue('category', value)}
                        error={form.formState.errors.category?.message}
                        size="sm"
                      />

                      <ReusableDropdown
                        label="Department"
                        tooltip="Select your department"
                        placeholder="Select department"
                        options={departmentOptions}
                        value={form.watch('department')}
                        onChange={(value) => form.setValue('department', value)}
                        error={form.formState.errors.department?.message}
                        size="sm"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      Priority & Assignment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <ReusableDropdown
                        label="Priority"
                        tooltip="Select the priority level"
                        options={priorityOptions}
                        value={form.watch('priority')}
                        onChange={(value) => form.setValue('priority', value as any)}
                        size="sm"
                      />

                      <ReusableDropdown
                        label="Urgency"
                        tooltip="Select the urgency level"
                        options={priorityOptions}
                        value={form.watch('urgency')}
                        onChange={(value) => form.setValue('urgency', value as any)}
                        size="sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <ReusableDropdown
                        label="Assign To"
                        tooltip="Select assignee for this ticket"
                        placeholder="Select assignee"
                        options={assigneeOptions}
                        value={form.watch('assignedTo')}
                        onChange={(value) => form.setValue('assignedTo', value)}
                        error={form.formState.errors.assignedTo?.message}
                        size="sm"
                      />

                      <ReusableDatePicker
                        label="Due Date"
                        tooltip="Select the due date for this ticket"
                        placeholder="Select due date"
                        value={form.watch('dueDate')}
                        onChange={(date) => form.setValue('dueDate', date)}
                        error={form.formState.errors.dueDate?.message}
                      />
                    </div>

                    <ReusableDropdown
                      label="Related Project"
                      tooltip="Select related project (optional)"
                      placeholder="Select project (optional)"
                      options={projectOptions}
                      value={form.watch('project')}
                      onChange={(value) => form.setValue('project', value)}
                      error={form.formState.errors.project?.message}
                      size="sm"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Tag className="h-4 w-4" />
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <ReusableInput
                          placeholder="Add tags..."
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          className="h-7 text-xs"
                        />
                        <ReusableButton onClick={addTag} size="sm" className="h-7 bg-accent hover:bg-accent/90">
                          <Plus className="h-3 w-3" />
                        </ReusableButton>
                      </div>
                      {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {selectedTags.map(tag => (
                            <Badge key={tag} variant="secondary" className="flex items-center gap-1 text-xs">
                              {tag}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 hover:bg-transparent"
                                onClick={() => removeTag(tag)}
                              >
                                <X className="h-2 w-2" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </div>

          <div className="w-64 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ReusableButton 
                  onClick={form.handleSubmit(handleSubmitTicket)}
                  className="w-full h-7 text-xs bg-accent hover:bg-accent/90"
                  size="sm"
                  icon={<Send className="h-3 w-3" />}
                >
                  Submit Ticket
                </ReusableButton>
                <ReusableButton 
                  variant="outline" 
                  onClick={form.handleSubmit(handleSaveDraft)}
                  className="w-full h-7 text-xs"
                  size="sm"
                  icon={<Save className="h-3 w-3" />}
                >
                  Save as Draft
                </ReusableButton>
                <Separator />
                <ReusableButton 
                  variant="ghost" 
                  onClick={() => navigate('/service-desk/my-workspace')}
                  className="w-full h-7 text-xs"
                  size="sm"
                >
                  Cancel
                </ReusableButton>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Paperclip className="h-4 w-4" />
                  Attachments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <input
                    type="file"
                    multiple
                    onChange={handleAttachmentAdd}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button 
                    variant="outline" 
                    className="w-full h-7 text-xs"
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Files
                  </Button>
                </div>
                
                {attachments.length > 0 && (
                  <div className="space-y-1">
                    <Separator />
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-1.5 bg-gray-50 rounded">
                        <span className="text-xs truncate">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <User className="h-3 w-3" />
                  <span>Created by: Current User</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>Created: {new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span>Status: Draft</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NewServiceTicket;
