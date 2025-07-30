
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Calendar, Users, Clock, BarChart3, User, GripVertical, Eye, FileText } from 'lucide-react';

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

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

const TicketCard = ({ ticket, onClick }: TicketCardProps) => {
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
  const [projects] = useState<Project[]>(mockProjects);
  const [selectedView, setSelectedView] = useState('kanban');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const renderKanbanView = () => {
    const columns = ['Planning', 'Active', 'On Hold', 'Completed'] as const;
    
    return (
      <div className="p-4">
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-gray-800">Project Kanban Board</h3>
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
              const statusProjects = projects.filter(p => p.status === status);
              const statusTickets = mockTickets.filter(t => t.status === status);
              
              return (
                <div
                  key={status}
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
                    
                    {statusTickets.map(ticket => (
                      <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        onClick={handleTicketClick}
                      />
                    ))}
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
                <div className="space-y-3">
                  {projects.map((project) => (
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
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="timeline">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h3 className="font-medium mb-3 text-sm">Timeline View</h3>
                    <div className="space-y-3">
                      {projects.map(project => (
                        <div key={project.id} className="bg-white p-3 rounded-md border-l-4 border-blue-500">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-sm">{project.name}</h4>
                            <Badge className={`text-xs py-0 px-2 h-5 ${
                              project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              project.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                              project.status === 'On Hold' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>{project.status}</Badge>
                          </div>
                          <div className="text-xs text-gray-600 mb-2">
                            {project.startDate} - {project.endDate}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full transition-all"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium">{project.progress}%</span>
                          </div>
                          <div className="mt-1 text-xs text-gray-600">
                            Manager: {project.manager} | Budget: ${project.budget.toLocaleString()} | Tasks: {project.tickets.length}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" />
              {selectedTicket?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-xs">{selectedTicket.id}</Badge>
                <Badge className={`text-xs ${
                  selectedTicket.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                  selectedTicket.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                  selectedTicket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>{selectedTicket.priority}</Badge>
                <Badge className={`text-xs ${
                  selectedTicket.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  selectedTicket.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                  selectedTicket.status === 'On Hold' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>{selectedTicket.status}</Badge>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 text-sm">Description</h4>
                <p className="text-sm text-gray-600">{selectedTicket.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1 text-sm">Assignee</h4>
                  <p className="text-sm text-gray-600">{selectedTicket.assignee}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-sm">Due Date</h4>
                  <p className="text-sm text-gray-600">{selectedTicket.dueDate}</p>
                </div>
              </div>
              
              {selectedTicket.tags.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-sm">Tags</h4>
                  <div className="flex gap-2">
                    {selectedTicket.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedTicket(null)} size="sm">
                  Close
                </Button>
                <Button size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
