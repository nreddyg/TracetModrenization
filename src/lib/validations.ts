
import { z } from 'zod';

export const ticketSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description must be less than 2000 characters'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical'], {
    required_error: 'Priority is required',
  }),
  category: z.string().min(1, 'Category is required'),
  assignee: z.string().min(1, 'Assignee is required'),
  dueDate: z.string().optional(),
  tags: z.string().optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  businessImpact: z.string().optional(),
  urgency: z.string().optional(),
  environment: z.string().optional(),
  browser: z.string().optional(),
  operatingSystem: z.string().optional(),
  expectedResolution: z.string().optional(),
  customerImpact: z.string().optional(),
  serviceCategory: z.string().optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  manager: z.string().min(1, 'Project manager is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  budget: z.string().min(1, 'Budget is required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Budget must be a positive number',
  }),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical'], {
    required_error: 'Priority is required',
  }),
  status: z.enum(['Planning', 'Active', 'On Hold'], {
    required_error: 'Status is required',
  }),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description must be less than 2000 characters'),
  assignee: z.string().min(1, 'Assignee is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical'], {
    required_error: 'Priority is required',
  }),
  status: z.enum(['Planning', 'Active', 'On Hold', 'Completed'], {
    required_error: 'Status is required',
  }),
  dueDate: z.string().optional(),
  estimatedHours: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
    message: 'Estimated hours must be a non-negative number',
  }),
  tags: z.string().optional(),
});

export type TicketFormData = z.infer<typeof ticketSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
