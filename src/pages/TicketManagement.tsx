
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Ticket, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  User,
  Users,
  Archive
} from 'lucide-react';

interface TicketSection {
  id: string;
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  tickets: any[];
}

const mockTicketSections: TicketSection[] = [
  {
    id: 'sla-violated',
    title: 'SLA Violated',
    count: 0,
    icon: <AlertTriangle className="h-5 w-5" />,
    color: 'bg-red-500 text-white',
    tickets: []
  },
  {
    id: 'open',
    title: 'Open',
    count: 13,
    icon: <Ticket className="h-5 w-5" />,
    color: 'bg-blue-500 text-white',
    tickets: [
      { id: 'TCK-10246', title: 'Add Dashboard Analytics', priority: 'Medium', assignee: 'Alice Johnson' },
      { id: 'TCK-10248', title: 'Database Optimization', priority: 'High', assignee: 'Mike Brown' }
    ]
  },
  {
    id: 'tickets-in-groups',
    title: 'Tickets In My Groups',
    count: 0,
    icon: <Users className="h-5 w-5" />,
    color: 'bg-purple-500 text-white',
    tickets: []
  },
  {
    id: 'closed',
    title: 'Closed',
    count: 1,
    icon: <CheckCircle className="h-5 w-5" />,
    color: 'bg-green-500 text-white',
    tickets: [
      { id: 'TCK-10247', title: 'Update User Profile', priority: 'Low', assignee: 'Mike Brown' }
    ]
  },
  {
    id: 'my-open',
    title: 'My Open Requests',
    count: 25,
    icon: <User className="h-5 w-5" />,
    color: 'bg-orange-500 text-white',
    tickets: [
      { id: 'TCK-10245', title: 'Fix UI in Login Form', priority: 'High', assignee: 'John Doe' }
    ]
  },
  {
    id: 'draft',
    title: 'Draft',
    count: 0,
    icon: <FileText className="h-5 w-5" />,
    color: 'bg-gray-500 text-white',
    tickets: []
  },
  {
    id: 'my-closed',
    title: 'My Closed Requests',
    count: 1,
    icon: <Archive className="h-5 w-5" />,
    color: 'bg-indigo-500 text-white',
    tickets: []
  },
  {
    id: 'all-requests',
    title: 'All Service Requests',
    count: 27,
    icon: <Ticket className="h-5 w-5" />,
    color: 'bg-teal-500 text-white',
    tickets: []
  }
];

const TicketManagement = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(selectedSection === sectionId ? null : sectionId);
  };

  const filteredSections = mockTicketSections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.tickets.some(ticket => 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-gray-900">Ticket Management</h1>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Service Desk Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Service Desk</h2>
          
          {/* My Workbench */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <User className="h-5 w-5" />
              My Workbench
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredSections.slice(0, 4).map((section) => (
                <Card 
                  key={section.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500"
                  onClick={() => handleSectionClick(section.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${section.color}`}>
                          {section.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{section.title}</p>
                          <p className="text-2xl font-bold text-gray-700">{section.count}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* My Requests */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              My Requests
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSections.slice(4, 7).map((section) => (
                <Card 
                  key={section.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500"
                  onClick={() => handleSectionClick(section.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${section.color}`}>
                          {section.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{section.title}</p>
                          <p className="text-2xl font-bold text-gray-700">{section.count}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Service Requests */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-4">
              {filteredSections.slice(7).map((section) => (
                <Card 
                  key={section.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500"
                  onClick={() => handleSectionClick(section.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${section.color}`}>
                          {section.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{section.title}</p>
                          <p className="text-2xl font-bold text-gray-700">{section.count}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/tickets');
                        }}
                      >
                        View All
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Section Details */}
        {selectedSection && (
          <Card>
            <CardHeader>
              <CardTitle>
                {filteredSections.find(s => s.id === selectedSection)?.title} ({filteredSections.find(s => s.id === selectedSection)?.count})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSections.find(s => s.id === selectedSection)?.tickets.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-600">{ticket.id}</h4>
                        <p className="text-gray-900">{ticket.title}</p>
                        <p className="text-sm text-gray-600">Assigned to: {ticket.assignee}</p>
                      </div>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
                {filteredSections.find(s => s.id === selectedSection)?.tickets.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No tickets in this category
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TicketManagement;
