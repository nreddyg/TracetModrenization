import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { TicketDetailView } from '@/components/tickets/TicketDetailView';
import { Plus, Calendar, Users, Clock, BarChart3, User, GripVertical, Eye, FileText } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppDispatch, useAppSelector } from '@/store/reduxStore';
import { updateTask } from '@/store/slices/tasksSlice';

interface Ticket {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed';
  projectId: string;
  createdDate: string;
  dueDate: string;
  tags: string[];
}

interface Project {
  id: string;
  name: string;
  manager: string;
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  team: string[];
  description: string;
  tickets: Ticket[];
}

const mockTickets: Ticket[] = [
  {
    id: 'TCK-001',
    title: 'Database Migration Setup',
    description: 'Prepare database migration scripts and test environment',
    assignee: 'John Doe',
    priority: 'High',
    status: 'Planning',
    projectId: 'PRJ-001',
    createdDate: '2025-01-15',
    dueDate: '2025-02-15',
    tags: ['Backend', 'Database']
  },
  {
    id: 'TCK-002',
    title: 'API Integration Testing',
    description: 'Test all API endpoints and error handling',
    assignee: 'Jane Smith',
    priority: 'Medium',
    status: 'Active',
    projectId: 'PRJ-001',
    createdDate: '2025-01-16',
    dueDate: '2025-02-20',
    tags: ['API', 'Testing']
  },
  {
    id: 'TCK-003',
    title: 'User Interface Design',
    description: 'Create wireframes and mockups for mobile app',
    assignee: 'Bob Smith',
    priority: 'High',
    status: 'Planning',
    projectId: 'PRJ-002',
    createdDate: '2025-01-17',
    dueDate: '2025-03-10',
    tags: ['UI/UX', 'Design']
  },
  {
    id: 'TCK-004',
    title: 'Security Review Complete',
    description: 'Final security audit report and recommendations',
    assignee: 'David Lee',
    priority: 'Critical',
    status: 'Completed',
    projectId: 'PRJ-003',
    createdDate: '2025-01-10',
    dueDate: '2025-02-28',
    tags: ['Security', 'Audit']
  }
];

const mockProjects: Project[] = [
  {
    id: 'PRJ-001',
    name: 'ERP System Upgrade',
    manager: 'John Doe',
    status: 'Active',
    priority: 'High',
    progress: 65,
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    budget: 250000,
    team: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'],
    description: 'Comprehensive upgrade of the enterprise resource planning system to improve efficiency and user experience.',
    tickets: mockTickets.filter(t => t.projectId === 'PRJ-001'),
  },
  {
    id: 'PRJ-002',
    name: 'Mobile App Development',
    manager: 'Alice Johnson',
    status: 'Planning',
    priority: 'Medium',
    progress: 25,
    startDate: '2025-03-01',
    endDate: '2025-09-30',
    budget: 180000,
    team: ['Alice Johnson', 'Bob Smith', 'Carol Davis'],
    description: 'Development of a cross-platform mobile application for customer engagement.',
    tickets: mockTickets.filter(t => t.projectId === 'PRJ-002'),
  },
  {
    id: 'PRJ-003',
    name: 'Security Audit',
    manager: 'David Lee',
    status: 'Completed',
    priority: 'Critical',
    progress: 100,
    startDate: '2024-12-01',
    endDate: '2025-02-28',
    budget: 75000,
    team: ['David Lee', 'Emma Wilson'],
    description: 'Comprehensive security audit and implementation of recommended improvements.',
    tickets: mockTickets.filter(t => t.projectId === 'PRJ-003'),
  },
];

interface SortableTaskCardProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

const SortableTaskCard = ({ ticket, onClick }: SortableTaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'border-red-500 bg-red-50';
      case 'High': return 'border-orange-500 bg-orange-50';
      case 'Medium': return 'border-yellow-500 bg-yellow-50';
      case 'Low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-2 rounded-md border-l-4 hover:shadow-sm transition-all cursor-pointer ${getPriorityColor(ticket.priority)} shadow-sm mb-2`}
      onClick={() => onClick(ticket)}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <FileText className="h-3 w-3 text-gray-500" />
          <div>
            <h6 className="font-medium text-xs text-gray-800">{ticket.title}</h6>
            <p className="text-xs text-gray-500">{ticket.id}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs py-0 px-1 h-4">
          {ticket.priority}
        </Badge>
      </div>
      
      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
        {ticket.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <User className="h-3 w-3" />
          <span>{ticket.assignee}</span>
        </div>
        <div className="text-xs text-gray-500">
          Due: {ticket.dueDate}
        </div>
      </div>
      
      {ticket.tags.length > 0 && (
        <div className="flex gap-1 mt-1">
          {ticket.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs py-0 px-1 h-4">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'border-red-500 bg-red-50';
      case 'High': return 'border-orange-500 bg-orange-50';
      case 'Medium': return 'border-yellow-500 bg-yellow-50';
      case 'Low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className={`p-3 rounded-md border-l-4 hover:shadow-md transition-all cursor-move ${getPriorityColor(project.priority)} shadow-sm mb-3`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-3 w-3 text-gray-400" />
          <div>
            <h5 className="font-medium text-sm text-gray-800">{project.name}</h5>
            <p className="text-xs text-gray-600">{project.manager}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            <Button
              onClick={() => navigate(`/tasks/create?projectId=${project.id}`)}
              size="sm"
              variant="outline"
              className="h-6 px-2 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Task
            </Button>
          </div>
          <Badge variant="outline" className="text-xs py-0 px-1 h-4">
            {project.priority}
          </Badge>
          <Badge className={`text-xs py-0 px-1 h-4 ${
            project.status === 'Completed' ? 'bg-green-100 text-green-800' :
            project.status === 'Active' ? 'bg-blue-100 text-blue-800' :
            project.status === 'On Hold' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {project.status}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-700">Progress</span>
          <span className="text-xs font-semibold text-gray-800">{project.progress}%</span>
        </div>
        <div className="bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Users className="h-3 w-3" />
            <span>{project.team.length}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <FileText className="h-3 w-3" />
            <span>{project.tickets.length} tickets</span>
          </div>
          <div className="text-xs font-medium text-gray-700">
            ${project.budget.toLocaleString()}
          </div>
        </div>
        
        <p className="text-xs text-gray-600 line-clamp-2 mt-1">
          {project.description}
        </p>
      </div>
    </div>
  );
};

const Projects = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [projects] = useState<Project[]>(mockProjects);
  const [selectedView, setSelectedView] = useState('kanban');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const projectOptions = [
    { value: 'all', label: 'All Projects' },
    ...projects.map(project => ({
      value: project.id,
      label: project.name
    }))
  ];

  const filteredTickets = selectedProject === 'all' 
    ? tickets 
    : tickets.filter(ticket => ticket.projectId === selectedProject);

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropping on a column (status)
    const columns = ['Planning', 'Active', 'On Hold', 'Completed'];
    const targetStatus = columns.find(status => overId.includes(status));

    if (targetStatus) {
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.id === activeId 
            ? { ...ticket, status: targetStatus as any }
            : ticket
        )
      );

      // Update Redux store if connected
      dispatch(updateTask({
        id: activeId,
        status: targetStatus as any
      }));
    }
  };

  const renderKanbanView = () => {
    const columns = ['Planning', 'Active', 'On Hold', 'Completed'] as const;
    
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="p-4">
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h3 className="font-semibold text-sm text-gray-800">Project Kanban Board</h3>
                <ReusableDropdown
                  options={projectOptions}
                  value={selectedProject}
                  onChange={(value) => setSelectedProject(value as string)}
                  placeholder="Select Project"
                  className="w-64"
                />
              </div>
              <Button
                onClick={() => navigate('/tasks/create')}
                size="sm"
                className="h-7 px-3 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Create Task
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {columns.map(status => {
                const statusProjects = selectedProject === 'all' 
                  ? projects.filter(p => p.status === status)
                  : projects.filter(p => p.status === status && p.id === selectedProject);
                
                const statusTickets = filteredTickets.filter(t => t.status === status);
                
                return (
                  <div
                    key={status}
                    id={`column-${status}`}
                    className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-white/50 min-h-[400px]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-center py-2 px-3 bg-gradient-to-r from-gray-100 to-gray-150 rounded-md text-gray-700 text-sm">
                        {status}
                      </h4>
                      <Badge variant="secondary" className="text-xs py-0 px-1 h-4">
                        {statusProjects.length + statusTickets.length}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {statusProjects.map(project => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                        />
                      ))}
                      
                      <SortableContext items={statusTickets.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        {statusTickets.map(ticket => (
                          <SortableTaskCard
                            key={ticket.id}
                            ticket={ticket}
                            onClick={handleTicketClick}
                          />
                        ))}
                      </SortableContext>
                    </div>
                    
                    {statusProjects.length === 0 && statusTickets.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <div className="text-xs">No items in {status.toLowerCase()}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DndContext>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold text-gray-900">Project Management</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate('/tasks/create')} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
            <Button onClick={() => navigate('/projects/create')} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Projects Overview</CardTitle>
              <Tabs value={selectedView} onValueChange={setSelectedView}>
                <TabsList className="h-8">
                  <TabsTrigger value="kanban" className="text-xs px-3 py-1">Kanban Board</TabsTrigger>
                  <TabsTrigger value="list" className="text-xs px-3 py-1">List View</TabsTrigger>
                  <TabsTrigger value="timeline" className="text-xs px-3 py-1">Timeline</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs value={selectedView}>
              <TabsContent value="kanban">
                {renderKanbanView()}
              </TabsContent>
              
              <TabsContent value="list">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="font-semibold text-sm text-gray-800">Projects List</h3>
                    <ReusableDropdown
                      options={projectOptions}
                      value={selectedProject}
                    onChange={(value) => setSelectedProject(value as string)}
                      placeholder="Select Project"
                      className="w-64"
                    />
                  </div>
                  
                  {(selectedProject === 'all' ? projects : projects.filter(p => p.id === selectedProject)).map((project) => (
                    <div key={project.id} className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium">{project.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs py-0 px-2 h-5 ${
                            project.priority === 'Critical' ? 'bg-red-600 text-white' :
                            project.priority === 'High' ? 'bg-red-100 text-red-800' :
                            project.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>{project.priority}</Badge>
                          <Badge className={`text-xs py-0 px-2 h-5 ${
                            project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            project.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'On Hold' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>{project.status}</Badge>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{project.description}</p>
                      <div className="grid grid-cols-4 gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-gray-500" />
                          <span>{project.manager}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          <span>{project.startDate} - {project.endDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-gray-500" />
                          <span>{project.team.length} members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-3 w-3 text-gray-500" />
                          <span>${project.budget.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{project.progress}%</span>
                      </div>
                      
                      {/* Tasks for this project */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <h4 className="text-xs font-medium text-gray-700 mb-2">Tasks ({filteredTickets.filter(t => t.projectId === project.id).length})</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {filteredTickets.filter(t => t.projectId === project.id).slice(0, 3).map(ticket => (
                            <div key={ticket.id} className="text-xs p-2 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100" onClick={() => handleTicketClick(ticket)}>
                              <div className="font-medium">{ticket.title}</div>
                              <div className="text-gray-500">{ticket.status} • {ticket.priority}</div>
                            </div>
                          ))}
                          {filteredTickets.filter(t => t.projectId === project.id).length > 3 && (
                            <div className="text-xs p-2 bg-gray-50 rounded border text-center text-gray-500">
                              +{filteredTickets.filter(t => t.projectId === project.id).length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="timeline">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="font-semibold text-sm text-gray-800">Timeline View</h3>
                    <ReusableDropdown
                      options={projectOptions}
                      value={selectedProject}
                      onChange={(value) => setSelectedProject(value as string)}
                      placeholder="Select Project"
                      className="w-64"
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="space-y-3">
                      {(selectedProject === 'all' ? projects : projects.filter(p => p.id === selectedProject)).map(project => (
                        <div key={project.id} className="flex items-center gap-4 p-3 bg-white rounded border">
                          <div className="w-2 h-12 bg-blue-500 rounded"></div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{project.name}</h4>
                            <p className="text-xs text-gray-600">{project.startDate} - {project.endDate}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{project.status}</Badge>
                              <Badge variant="outline" className="text-xs">{project.priority}</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{project.progress}%</div>
                            <div className="text-xs text-gray-500">{project.team.length} members</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
          {selectedTicket && (
            <TicketDetailView
              ticketId={selectedTicket.id}
              title={selectedTicket.title}
              type="Task"
              status={selectedTicket.status}
              priority={selectedTicket.priority}
              assignee={selectedTicket.assignee}
              reporter="System"
              created={selectedTicket.createdDate}
              sprint="Sprint-14"
              description={selectedTicket.description}
              onSave={(data) => {
                setSelectedTicket(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;