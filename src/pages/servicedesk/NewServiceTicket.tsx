import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/reduxStore';
import { addTicket } from '@/store/slices/ticketsSlice';
import { TicketDetailView } from '@/components/tickets/TicketDetailView';
import { toast } from 'sonner';

const NewServiceTicket = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSave = (data: any) => {
    const ticketData = {
      id: `TKT-${Date.now()}`,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: 'Open' as const,
      assignee: data.assignee || 'Unassigned',
      category: data.type,
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 7 days
      tags: [],
    };
    
    dispatch(addTicket(ticketData));
    toast.success('Service ticket created successfully!');
    navigate('/service-desk/my-workspace');
  };

  return (
    <TicketDetailView
      ticketId="NEW-SERVICE-REQUEST"
      title=""
      type="Service Request"
      status="Open"
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

export default NewServiceTicket;