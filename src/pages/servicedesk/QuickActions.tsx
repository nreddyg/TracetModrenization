
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Clock, 
  Users, 
  FileText, 
  Settings,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  const quickActions = [
    {
      title: 'Create New Ticket',
      description: 'Submit a new service request or report an issue',
      icon: Plus,
      color: 'blue',
      href: '/service-desk/new-request'
    },
    {
      title: 'Search Tickets',
      description: 'Find existing tickets and track their status',
      icon: Search,
      color: 'green',
      href: '/service-desk/all-requests'
    },
    {
      title: 'My Workspace',
      description: 'View your tickets and assigned work items',
      icon: Clock,
      color: 'orange',
      href: '/service-desk/my-workspace'
    },
    {
      title: 'Team Dashboard',
      description: 'Monitor team performance and workload',
      icon: Users,
      color: 'purple',
      href: '/service-desk/reports'
    }
  ];

  const commonRequests = [
    { title: 'Password Reset', count: 15 },
    { title: 'Software Installation', count: 8 },
    { title: 'Hardware Request', count: 5 },
    { title: 'Access Request', count: 12 }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'orange':
        return 'bg-orange-100 text-orange-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 pb-4 pt-4 space-y-4 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <Link to={action.href}>
                <CardHeader className="pb-3">
                  <div className={`flex items-center gap-2 ${getColorClasses(action.color)} p-1.5 rounded-lg w-fit`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-600">{action.description}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Common Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {commonRequests.map((request, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-xs">{request.title}</span>
                  <span className="px-1.5 py-0.5 text-xs bg-gray-200 rounded-full">{request.count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuickActions;
