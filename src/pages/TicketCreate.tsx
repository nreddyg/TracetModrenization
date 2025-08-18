import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, User, Calendar, AlertCircle, Tag, Upload, Plus, Save, Send, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAppDispatch } from '@/store/reduxStore';
import { addTicket } from '@/store/slices/ticketsSlice';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import { ReusableButton } from '@/components/ui/reusable-button';

// Validation schema
const ticketSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  category: z.string().min(1, 'Category is required'),
  assignee: z.string().optional(),
  dueDate: z.date().optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  businessImpact: z.enum(['Low', 'Medium', 'High']).optional(),
  urgency: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  environment: z.string().optional(),
  browser: z.string().optional(),
  operatingSystem: z.string().optional(),
  expectedResolution: z.string().optional(),
  customerImpact: z.enum(['None', 'Low', 'Medium', 'High']).optional(),
  serviceCategory: z.enum(['Incident', 'Service Request', 'Change Request', 'Problem']).optional(),
});

type TicketFormData = z.infer<typeof ticketSchema>;

const categoryOptions = [
  { value: 'technical', label: 'Technical Issue' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'support', label: 'General Support' }
];

const assigneeOptions = [
  { value: 'john', label: 'John Doe' },
  { value: 'jane', label: 'Jane Smith' },
  { value: 'mike', label: 'Mike Johnson' },
  { value: 'auto', label: 'Auto-assign' }
];

const departmentOptions = [
  { value: 'it', label: 'IT' },
  { value: 'hr', label: 'HR' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' }
];

const priorityOptions = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Critical', label: 'Critical' }
];

const TicketCreate = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'Medium',
      category: '',
      assignee: '',
      department: '',
      location: '',
      urgency: 'Medium',
      businessImpact: 'Low',
      serviceCategory: 'Incident',
      customerImpact: 'None',
      operatingSystem: '',
      browser: '',
      expectedResolution: '',
    }
  });

  const handleSubmit = (data: TicketFormData) => {
    const ticketData = {
      id: `TKT-${Date.now()}`,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: 'Open' as const,
      assignee: data.assignee || 'Auto-assign',
      category: data.category,
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: data.dueDate?.toISOString().split('T')[0],
      tags: [],
    };
    
    dispatch(addTicket(ticketData));
    console.log('Creating ticket:', data);
    navigate('/tickets');
  };

  const saveDraft = (data: TicketFormData) => {
    console.log('Saving draft:', data);
  };

  return (
    <div className="min-h-screen bg-app-bg">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="flex items-center gap-1 hover:text-accent transition-colors">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <span>/</span>
            <Link to="/tickets" className="hover:text-accent transition-colors">Tickets</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Create New Ticket</span>
          </nav>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        <div className="w-full max-w-none xl:max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Create New Ticket</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Fill in the details to create a new support ticket</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
            <div className="xl:col-span-3 space-y-4 sm:space-y-6">
              <Form {...form}>
                <form className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ReusableInput
                        label="Ticket Title"
                        tooltip="Enter a descriptive title for your ticket"
                        placeholder="Enter a descriptive title for your ticket"
                        value={form.watch('title')}
                        onChange={(e) => form.setValue('title', e.target.value)}
                        error={form.formState.errors.title?.message}
                      />

                      <ReusableTextarea
                        label="Description"
                        tooltip="Describe your issue in detail"
                        placeholder="Describe your issue in detail..."
                        value={form.watch('description')}
                        onChange={(e) => form.setValue('description', e.target.value)}
                        error={form.formState.errors.description?.message}
                        numberOfRows={4}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ReusableDropdown
                          label="Priority"
                          tooltip="Select priority level"
                          placeholder="Select priority level"
                          options={priorityOptions}
                          value={form.watch('priority')}
                          onChange={(value) => form.setValue('priority', value as any)}
                          error={form.formState.errors.priority?.message}
                        />

                        <ReusableDropdown
                          label="Category"
                          tooltip="Select category"
                          placeholder="Select category"
                          options={categoryOptions}
                          value={form.watch('category')}
                          onChange={(value) => form.setValue('category', value as string)}
                          error={form.formState.errors.category?.message}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Assignment & Timing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ReusableDropdown
                          label="Assign To"
                          tooltip="Select assignee"
                          placeholder="Select assignee"
                          options={assigneeOptions}
                          value={form.watch('assignee')}
                          onChange={(value) => form.setValue('assignee', value as string)}
                          error={form.formState.errors.assignee?.message}
                        />

                        <ReusableDatePicker
                          label="Due Date"
                          tooltip="Select due date"
                          placeholder="Select due date"
                          value={form.watch('dueDate')}
                          onChange={(date) => form.setValue('dueDate', date || undefined)}
                          error={!!form.formState.errors.dueDate}
                          errorMessage={form.formState.errors.dueDate?.message}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ReusableDropdown
                          label="Department"
                          tooltip="Select department"
                          placeholder="Select department"
                          options={departmentOptions}
                          value={form.watch('department')}
                          onChange={(value) => form.setValue('department', value as string)}
                          error={form.formState.errors.department?.message}
                        />

                        <ReusableInput
                          label="Location"
                          tooltip="Office location or floor"
                          placeholder="Office location or floor"
                          value={form.watch('location')}
                          onChange={(e) => form.setValue('location', e.target.value)}
                          error={form.formState.errors.location?.message}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-0">
                      <Accordion type="single" collapsible>
                        <AccordionItem value="additional-fields" className="border-none">
                          <AccordionTrigger className="px-6 py-4 hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Tag className="h-5 w-5" />
                              <span className="font-semibold">Additional Fields</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ReusableDropdown
                                  label="Urgency Level"
                                  tooltip="Select urgency"
                                  placeholder="Select urgency"
                                  options={[
                                    { value: 'Low', label: 'Low' },
                                    { value: 'Medium', label: 'Medium' },
                                    { value: 'High', label: 'High' },
                                    { value: 'Critical', label: 'Critical' }
                                  ]}
                                  value={form.watch('urgency')}
                                  onChange={(value) => form.setValue('urgency', value as any)}
                                  error={form.formState.errors.urgency?.message}
                                />

                                <ReusableDropdown
                                  label="Business Impact"
                                  tooltip="Select impact level"
                                  placeholder="Select impact level"
                                  options={[
                                    { value: 'Low', label: 'Low Impact' },
                                    { value: 'Medium', label: 'Medium Impact' },
                                    { value: 'High', label: 'High Impact' }
                                  ]}
                                  value={form.watch('businessImpact')}
                                  onChange={(value) => form.setValue('businessImpact', value as any)}
                                  error={form.formState.errors.businessImpact?.message}
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ReusableDropdown
                                  label="Service Category"
                                  tooltip="Select service category"
                                  placeholder="Select service category"
                                  options={[
                                    { value: 'Incident', label: 'Incident' },
                                    { value: 'Service Request', label: 'Service Request' },
                                    { value: 'Change Request', label: 'Change Request' },
                                    { value: 'Problem', label: 'Problem' }
                                  ]}
                                  value={form.watch('serviceCategory')}
                                  onChange={(value) => form.setValue('serviceCategory', value as any)}
                                  error={form.formState.errors.serviceCategory?.message}
                                />

                                <ReusableDropdown
                                  label="Customer Impact"
                                  tooltip="Select customer impact"
                                  placeholder="Select customer impact"
                                  options={[
                                    { value: 'None', label: 'No Impact' },
                                    { value: 'Low', label: 'Low Impact' },
                                    { value: 'Medium', label: 'Medium Impact' },
                                    { value: 'High', label: 'High Impact' }
                                  ]}
                                  value={form.watch('customerImpact')}
                                  onChange={(value) => form.setValue('customerImpact', value as any)}
                                  error={form.formState.errors.customerImpact?.message}
                                />
                              </div>

                              <Separator />

                              <div className="space-y-4">
                                <h4 className="font-medium">Environment Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <ReusableDropdown
                                    label="Operating System"
                                    tooltip="Select OS"
                                    placeholder="Select OS"
                                    options={[
                                      { value: 'windows', label: 'Windows' },
                                      { value: 'macos', label: 'macOS' },
                                      { value: 'linux', label: 'Linux' },
                                      { value: 'other', label: 'Other' }
                                    ]}
                                    value={form.watch('operatingSystem')}
                                    onChange={(value) => form.setValue('operatingSystem', value as string)}
                                    error={form.formState.errors.operatingSystem?.message}
                                  />

                                  <ReusableDropdown
                                    label="Browser"
                                    tooltip="Select browser"
                                    placeholder="Select browser"
                                    options={[
                                      { value: 'chrome', label: 'Chrome' },
                                      { value: 'firefox', label: 'Firefox' },
                                      { value: 'safari', label: 'Safari' },
                                      { value: 'edge', label: 'Edge' }
                                    ]}
                                    value={form.watch('browser')}
                                    onChange={(value) => form.setValue('browser', value as string)}
                                    error={form.formState.errors.browser?.message}
                                  />
                                </div>
                              </div>

                              <ReusableTextarea
                                label="Expected Resolution"
                                tooltip="Describe the expected outcome or resolution"
                                placeholder="Describe the expected outcome or resolution"
                                value={form.watch('expectedResolution')}
                                onChange={(e) => form.setValue('expectedResolution', e.target.value)}
                                error={form.formState.errors.expectedResolution?.message}
                                numberOfRows={3}
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </form>
              </Form>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ReusableButton 
                    onClick={form.handleSubmit(handleSubmit)} 
                    className="w-full bg-accent hover:bg-accent/90"
                    icon={<Send className="h-4 w-4" />}
                  >
                    Create Ticket
                  </ReusableButton>
                  <ReusableButton 
                    onClick={form.handleSubmit(saveDraft)} 
                    variant="default"
                    className="w-full"
                    icon={<Save className="h-4 w-4" />}
                  >
                    Save as Draft
                  </ReusableButton>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-accent/50 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Drag files here or click to browse</p>
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Files
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium text-gray-600">Title</div>
                    <div className="truncate">{form.watch('title') || 'Not specified'}</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-600">Priority</div>
                    <Badge variant={form.watch('priority') === 'Critical' ? 'destructive' : 'default'}>
                      {form.watch('priority') || 'Not set'}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-600">Category</div>
                    <div>{form.watch('category') || 'Not specified'}</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-600">Assignee</div>
                    <div>{form.watch('assignee') || 'Auto-assign'}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCreate;
