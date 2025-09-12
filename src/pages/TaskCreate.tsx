import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/store/reduxStore';
import { addTask } from '@/store/slices/tasksSlice';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ResponsiveBreadcrumb } from '@/components/common/ResponsiveBreadcrumb';
import { Controller, useForm } from 'react-hook-form';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import { ReusableMultiSelect } from '@/components/ui/reusable-multi-select';
import { ReusableUpload } from '@/components/ui/reusable-upload';
import { TASK_CREATE_DB } from '@/Local_DB/Form_JSON_Data/TaskCreateDB';

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
}

const TaskCreate: React.FC<TicketDetailViewProps> = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ticketId: "NEW-TASK",
    title:'hi helooeo',
    type: "Project Task",
    status: "Planning",
    priority: "Medium",
    assignee: "",
    reporter: "Current User",
    created: new Date().toLocaleDateString(),
    sprint: "Current Sprint",
    description: "",
  });

  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const handleSave = (data: any) => {
    const taskData = {
      id: `TSK-${Date.now()}`,
      title: data.title,

      description: data.description,
      projectId: projectId || 'PRJ-001',
      assignee: data.assignee || 'Unassigned',
      priority: data.priority,
      status: 'Planning' as const,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 14 days
      estimatedHours: 8,
      tags: [],
      createdDate: new Date().toISOString().split('T')[0],
      type: 'Project Task' as const,
    };
    
    dispatch(addTask(taskData));
    toast.success('Task created successfully!');
    navigate('/projects');
  };
  const [fields, setFields] = useState<BaseField[]>(TASK_CREATE_DB);
  const form = useForm<GenericObject>({
      defaultValues: fields.reduce((acc, f) => {
        acc[f.name!] = f.defaultValue ?? '';
        return acc;
      }, {} as GenericObject),
      mode: 'onChange'
    });
    const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;

  const [attachments, setAttachments] = useState<File[]>([]);
const [isCreateMode] = useState(true); // Assuming always in create mode for this example
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

  // const handleSave = () => {
  //   onSave?.(formData);
  // };

  const breadcrumbItems = [
    { label: 'All Tickets', href: '/tickets' },
    { label: formData.ticketId, href: '#' },
  ];

  //to render re usable components based on the json data from db
  const renderField = (field: BaseField) => {
    let fieldsToShowInEdit: string[] = ['Priority', 'Status', 'Notify']
    const { name, label, fieldType, isRequired, show = true } = field;
    if (!name) {
      return null;
    }
    const validationRules = {
      required: isRequired ? `${label} is Required` : false,
    };
    switch (fieldType) {
      case 'text':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableInput
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'textarea':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableTextarea
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'dropdown':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableDropdown
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
                dropdownClassName={true ? 'z-[10001]' : ''}
              />
            )}
          />
        );
      case 'date':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableDatePicker
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'multiselect':
        return (
          <div>
            <Controller
              key={name}
              name={name}
              control={control}
              rules={validationRules}
              render={({ field: ctrl }) => (
                <ReusableMultiSelect
                  label={label!}
                  {...field}
                  value={ctrl.value}
                  onChange={ctrl.onChange}
                  error={errors[name]?.message as string}
                />
              )}
            />
          </div>
        );

      case 'upload':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableUpload
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'numeric':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableInput
                {...field}
                type="number"
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      default:
        return null;
    }
  };
  // Grouping logic: You may customize based on field.name or custom metadata
  const getFieldsByNames = (names: string[]) => fields.filter(f => names.includes(f.name!));

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b  shadow-sm px-4 lg:px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
          <div className="flex items-center gap-2">
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
              <Badge variant={getPriorityColor(watch('Priority'))} title='Priority'>{watch('Priority')}</Badge>
              <Badge variant={getStatusColor(watch('Status'))} title='Status'>{watch('Status')}</Badge>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">{watch('Title')}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ReusableButton
            size="small"
            variant="primary"
            onClick={handleSubmit(handleSave)}
            icon={<Save className="h-4 w-4" />}
          >
            Save
          </ReusableButton>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-hidden min-h-0">
        <div className="container mx-auto px-6 py-6 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Main Content */}
            <div className="lg:col-span-2 flex flex-col min-h-0">
              <ScrollArea className="flex-1">
                <div className="space-y-6 pr-3">
                  {/* Summary */}
                  <Card className="p-6">
                      {getFieldsByNames(['Title']).map(field => renderField(field))}
                  </Card>

                  {/* Description */}
                  <Card className="p-6">
                      {getFieldsByNames(['Description']).map(field => renderField(field))}
                  </Card>

                  {/* Attachments */}
                  <Card className="p-6">
                    {getFieldsByNames(['Attachments']).map(field => renderField(field))}
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
                  {!isCreateMode && 
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
    }
                </div>
              </ScrollArea>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col min-h-0">
              <ScrollArea className="flex-1">
                <Card className="p-6">
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      {!isCreateMode &&
                      <>
                        <TabsTrigger value="time">Time</TabsTrigger>
                        <TabsTrigger value="links">Links</TabsTrigger>
                      </>
                      }
                    </TabsList>
                    
                    <TabsContent value="details" className="mt-4 space-y-4">
                      {getFieldsByNames(['Type','Status','Priority','AssigneeSelectedUsers']).map(field => renderField(field))}
                
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">REPORTER</Label>
                        <p className="mt-1 text-sm">{formData.reporter}</p>
                      </div>

                      <div>
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">CREATED</Label>
                        <p className="mt-1 text-sm">{formData.created}</p>
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
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCreate;