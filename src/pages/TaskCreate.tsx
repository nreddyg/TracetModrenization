
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { useAppDispatch } from '@/store';
import { addTask } from '@/store/slices/tasksSlice';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import { ReusableMultiSelect } from '@/components/ui/reusable-multi-select';
import { ReusableButton } from '@/components/ui/reusable-button';

// Validation schema
const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  assignee: z.string().min(1, 'Assignee is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  status: z.enum(['Planning', 'Active', 'On Hold', 'Completed']),
  dueDate: z.date().optional(),
  estimatedHours: z.number().min(0, 'Hours must be positive').optional(),
  tags: z.array(z.string()).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

const assigneeOptions = [
  { value: 'john.doe', label: 'John Doe' },
  { value: 'jane.smith', label: 'Jane Smith' },
  { value: 'mike.johnson', label: 'Mike Johnson' },
  { value: 'sarah.wilson', label: 'Sarah Wilson' },
  { value: 'alice.johnson', label: 'Alice Johnson' },
  { value: 'bob.smith', label: 'Bob Smith' },
  { value: 'carol.davis', label: 'Carol Davis' },
  { value: 'david.lee', label: 'David Lee' },
  { value: 'emma.wilson', label: 'Emma Wilson' }
];

const priorityOptions = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Critical', label: 'Critical' }
];

const statusOptions = [
  { value: 'Planning', label: 'Planning' },
  { value: 'Active', label: 'Active' },
  { value: 'On Hold', label: 'On Hold' },
  { value: 'Completed', label: 'Completed' }
];

const tagOptions = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'testing', label: 'Testing' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'bug-fix', label: 'Bug Fix' },
  { value: 'enhancement', label: 'Enhancement' }
];

const TaskCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      assignee: '',
      priority: 'Medium',
      status: 'Planning',
      estimatedHours: 0,
      tags: []
    }
  });

  const handleSubmit = (data: TaskFormData) => {
    const taskData = {
      id: `TSK-${Date.now()}`,
      title: data.title,
      description: data.description || '',
      projectId: projectId || 'PRJ-001',
      assignee: data.assignee,
      priority: data.priority,
      status: data.status,
      dueDate: data.dueDate?.toISOString().split('T')[0],
      estimatedHours: data.estimatedHours,
      tags: data.tags || [],
      createdDate: new Date().toISOString().split('T')[0],
      type: 'Project Task' as const,
    };
    
    dispatch(addTask(taskData));
    
    toast({
      title: "Task Created",
      description: `Task "${data.title}" has been created and assigned to ${data.assignee}`,
    });
    
    navigate('/projects');
  };

  return (
    <div className="min-h-screen bg-app-bg">
      <header className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <ReusableButton 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/projects')}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Projects
          </ReusableButton>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Projects</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Create Task</span>
          </div>
        </div>
      </header>

      <div className="p-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Task
            </CardTitle>
            {projectId && (
              <p className="text-sm text-gray-600">Project: {projectId}</p>
            )}
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <ReusableInput
                    label="Task Title"
                    tooltip="Enter the task title"
                    placeholder="Enter task title"
                    value={form.watch('title')}
                    onChange={(e) => form.setValue('title', e.target.value)}
                    error={form.formState.errors.title?.message}
                    className="h-8 text-sm"
                  />
                  
                  <ReusableDropdown
                    label="Assign To"
                    tooltip="Select task assignee"
                    placeholder="Select assignee"
                    options={assigneeOptions}
                    value={form.watch('assignee')}
                    onChange={(value) => form.setValue('assignee', value)}
                    error={form.formState.errors.assignee?.message}
                    size="sm"
                  />
                </div>
                
                <ReusableTextarea
                  label="Task Description"
                  tooltip="Describe the task requirements and objectives"
                  placeholder="Describe the task requirements and objectives..."
                  value={form.watch('description')}
                  onChange={(e) => form.setValue('description', e.target.value)}
                  error={form.formState.errors.description?.message}
                  numberOfRows={3}
                  className="text-sm"
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <ReusableDropdown
                    label="Priority"
                    tooltip="Select task priority"
                    placeholder="Select priority"
                    options={priorityOptions}
                    value={form.watch('priority')}
                    onChange={(value) => form.setValue('priority', value as any)}
                    error={form.formState.errors.priority?.message}
                    size="sm"
                  />

                  <ReusableDropdown
                    label="Initial Status"
                    tooltip="Select initial task status"
                    placeholder="Select status"
                    options={statusOptions}
                    value={form.watch('status')}
                    onChange={(value) => form.setValue('status', value as any)}
                    error={form.formState.errors.status?.message}
                    size="sm"
                  />

                  <ReusableDatePicker
                    label="Due Date"
                    tooltip="Select task due date"
                    placeholder="Select due date"
                    value={form.watch('dueDate')}
                    onChange={(date) => form.setValue('dueDate', date)}
                    error={form.formState.errors.dueDate?.message}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <ReusableInput
                    label="Estimated Hours"
                    tooltip="Enter estimated hours for this task"
                    type="number"
                    placeholder="0"
                    value={form.watch('estimatedHours')?.toString()}
                    onChange={(e) => form.setValue('estimatedHours', Number(e.target.value))}
                    error={form.formState.errors.estimatedHours?.message}
                    className="h-8 text-sm"
                  />

                  <ReusableMultiSelect
                    label="Tags"
                    tooltip="Select relevant tags for this task"
                    placeholder="Select tags"
                    options={tagOptions}
                    value={form.watch('tags') || []}
                    onChange={(values) => form.setValue('tags', values)}
                    error={form.formState.errors.tags?.message}
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <ReusableButton 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/projects')}
                    size="sm"
                  >
                    Cancel
                  </ReusableButton>
                  <ReusableButton 
                    type="submit" 
                    size="sm" 
                    className="bg-accent hover:bg-accent/90"
                  >
                    Create Task
                  </ReusableButton>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskCreate;
