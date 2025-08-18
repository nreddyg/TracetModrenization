
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { useAppDispatch } from '@/store/reduxStore';
import { addProject } from '@/store/slices/projectsSlice';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import { ReusableButton } from '@/components/ui/reusable-button';

// Validation schema
const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name too long'),
  manager: z.string().min(1, 'Project manager is required'),
  description: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  budget: z.number().min(0, 'Budget must be positive').optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  status: z.enum(['Planning', 'Active', 'On Hold', 'Completed']),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const managerOptions = [
  { value: 'john', label: 'John Doe' },
  { value: 'jane', label: 'Jane Smith' },
  { value: 'mike', label: 'Mike Johnson' },
  { value: 'alice', label: 'Alice Johnson' },
  { value: 'david', label: 'David Lee' }
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
  { value: 'On Hold', label: 'On Hold' }
];

const ProjectCreate = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      manager: '',
      description: '',
      budget: 0,
      priority: 'Medium',
      status: 'Planning'
    }
  });

  const handleSubmit = (data: ProjectFormData) => {
    const projectData = {
      id: `PRJ-${Date.now()}`,
      name: data.name,
      description: data.description || '',
      manager: data.manager,
      status: data.status,
      priority: data.priority || 'Medium',
      startDate: data.startDate?.toISOString().split('T')[0] || '',
      endDate: data.endDate?.toISOString().split('T')[0] || '',
      budget: data.budget || 0,
      createdDate: new Date().toISOString().split('T')[0],
    };
    
    dispatch(addProject(projectData));
    console.log('Creating project:', data);
    navigate('/projects');
  };

  return (
    <div className="min-h-screen bg-app-bg">
      <header className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <ReusableButton 
            variant="text" 
            size="small"
            onClick={() => navigate('/projects')}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Projects
          </ReusableButton>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Projects</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Create New Project</span>
          </div>
        </div>
      </header>

      <div className="p-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Create New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <ReusableInput
                    label="Project Name"
                    tooltip="Enter the project name"
                    placeholder="Enter project name"
                    value={form.watch('name')}
                    onChange={(e) => form.setValue('name', e.target.value)}
                    error={form.formState.errors.name?.message}
                    className="h-8 text-sm"
                  />
                  
                  <ReusableDropdown
                    label="Project Manager"
                    tooltip="Select project manager"
                    placeholder="Select manager"
                    options={managerOptions}
                    value={form.watch('manager')}
                    onChange={(value) => form.setValue('manager', value as string)}
                    error={form.formState.errors.manager?.message}
                    size="small"
                  />
                </div>
                
                <ReusableTextarea
                  label="Project Description"
                  tooltip="Describe the project objectives and scope"
                  placeholder="Describe the project objectives and scope..."
                  value={form.watch('description')}
                  onChange={(e) => form.setValue('description', e.target.value)}
                  error={form.formState.errors.description?.message}
                  numberOfRows={3}
                  className="text-sm"
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <ReusableDatePicker
                    label="Start Date"
                    tooltip="Select project start date"
                    placeholder="Select start date"
                    value={form.watch('startDate')}
                    onChange={(date) => form.setValue('startDate', date || undefined)}
                    // error={!!form.formState.errors.startDate}
                    errorMessage={form.formState.errors.startDate?.message}
                  />

                  <ReusableDatePicker
                    label="End Date"
                    tooltip="Select project end date"
                    placeholder="Select end date"
                    value={form.watch('endDate')}
                    onChange={(date) => form.setValue('endDate', date || undefined)}
                    // error={!!form.formState.errors.endDate}
                    errorMessage={form.formState.errors.endDate?.message}
                  />

                  <ReusableInput
                    label="Budget ($)"
                    tooltip="Enter project budget"
                    type="number"
                    placeholder="0"
                    value={form.watch('budget')?.toString()}
                    onChange={(e) => form.setValue('budget', Number(e.target.value))}
                    error={form.formState.errors.budget?.message}
                    className="h-8 text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <ReusableDropdown
                    label="Priority"
                    tooltip="Select project priority"
                    placeholder="Select priority"
                    options={priorityOptions}
                    value={form.watch('priority')}
                    onChange={(value) => form.setValue('priority', value as any)}
                    error={form.formState.errors.priority?.message}
                    size="small"
                  />

                  <ReusableDropdown
                    label="Initial Status"
                    tooltip="Select initial project status"
                    placeholder="Select status"
                    options={statusOptions}
                    value={form.watch('status')}
                    onChange={(value) => form.setValue('status', value as any)}
                    error={form.formState.errors.status?.message}
                    size="small"
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <ReusableButton 
                    htmlType="button" 
                    variant="default" 
                    onClick={() => navigate('/projects')}
                    size="small"
                  >
                    Cancel
                  </ReusableButton>
                  <ReusableButton 
                    htmlType="submit" 
                    size="small" 
                    className="bg-accent hover:bg-accent/90"
                  >
                    Create Project
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

export default ProjectCreate;
