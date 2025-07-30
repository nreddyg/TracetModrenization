import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResponsiveBreadcrumb } from '@/components/common/ResponsiveBreadcrumb';
import PageHeader from '@/components/common/PageHeader';
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Users, 
  FileText,
  ArrowRight,
  Globe,
  MapPin
} from 'lucide-react';

const PayrollDashboard = () => {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Payroll', href: '/payroll' }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <ResponsiveBreadcrumb items={breadcrumbItems} />
          <h1 className="text-2xl font-bold mt-2">Payroll Management</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Reports
          </Button>
          <Button size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Process Monthly Payroll
          </Button>
        </div>
      </div>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">Across all locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Billable Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32,450</div>
            <p className="text-xs text-muted-foreground">From timesheet data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-xs text-muted-foreground">Combined US & India</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">This month complete</p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                <CardTitle>Indian Payroll</CardTitle>
              </div>
              <Badge variant="secondary">156 Employees</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Salary</p>
                  <p className="text-2xl font-bold">₹1.2Cr</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Billable Hours</p>
                  <p className="text-2xl font-bold">18,750</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Badge variant="default">PF Compliant</Badge>
                <Badge variant="default">ESI Compliant</Badge>
                <Badge variant="default">TDS Ready</Badge>
              </div>
              <Link to="/payroll/indian">
                <Button className="w-full">
                  Manage Indian Payroll
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <CardTitle>US Payroll</CardTitle>
              </div>
              <Badge variant="secondary">78 Employees</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Salary</p>
                  <p className="text-2xl font-bold">$1.2M</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Billable Hours</p>
                  <p className="text-2xl font-bold">13,700</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Badge variant="default">401k Ready</Badge>
                <Badge variant="default">W-2 Compliant</Badge>
                <Badge variant="default">ACA Ready</Badge>
              </div>
              <Link to="/payroll/us">
                <Button className="w-full">
                  Manage US Payroll
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payroll Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Indian Payroll - March 2024</p>
                  <p className="text-sm text-muted-foreground">Processed 156 employees</p>
                </div>
              </div>
              <Badge variant="default">Completed</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium">US Payroll - March 2024</p>
                  <p className="text-sm text-muted-foreground">Processing 78 employees</p>
                </div>
              </div>
              <Badge variant="secondary">In Progress</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Timesheet Integration</p>
                  <p className="text-sm text-muted-foreground">Synced 32,450 billable hours</p>
                </div>
              </div>
              <Badge variant="default">Synced</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollDashboard;