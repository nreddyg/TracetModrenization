import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/store/reduxStore';
import { addTask } from '@/store/slices/tasksSlice';
import { TicketDetailView } from '@/components/tickets/TicketDetailView';
import { toast } from 'sonner';

const TaskCreate = () => {
  const navigate = useNavigate();
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

  return (
    <TicketDetailView
      ticketId="NEW-TASK"
      title=""
      type="Project Task"
      status="Planning"
      priority="Medium"
      assignee=""
      reporter="Current User"
      created={new Date().toLocaleDateString()}
      sprint="Current Sprint"
      description=""
      onSave={handleSave}
      isEditing={true}
    />
  );
};

export default TaskCreate;