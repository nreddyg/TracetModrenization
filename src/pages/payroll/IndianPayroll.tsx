import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReusableTable } from '@/components/ui/reusable-table';
import { ResponsiveBreadcrumb } from '@/components/common/ResponsiveBreadcrumb';
import PageHeader from '@/components/common/PageHeader';
import { Calendar, Download, DollarSign, FileText, Clock, TrendingUp } from 'lucide-react';

const IndianPayroll = () => {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Payroll', href: '/payroll' },
    { label: 'Indian Payroll', href: '/payroll/indian' }
  ];

  // Sample payroll data based on timesheets and projects
  const payrollData = [
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'Rajesh Kumar',
      department: 'Development',
      projectHours: 160,
      billableHours: 140,
      overtime: 8,
      basicSalary: 75000,
      hra: 22500,
      grossSalary: 97500,
      pf: 9000,
      tax: 12000,
      netSalary: 76500,
      status: 'Processed'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Priya Sharma',
      department: 'Design',
      projectHours: 155,
      billableHours: 150,
      overtime: 5,
      basicSalary: 65000,
      hra: 19500,
      grossSalary: 84500,
      pf: 7800,
      tax: 8500,
      netSalary: 68200,
      status: 'Pending'
    }
  ];

  const payrollColumns = [
    { key: 'employeeId', header: 'Employee ID' },
    { key: 'employeeName', header: 'Employee Name' },
    { key: 'department', header: 'Department' },
    { key: 'projectHours', header: 'Project Hours' },
    { key: 'billableHours', header: 'Billable Hours' },
    { key: 'overtime', header: 'Overtime' },
    { key: 'basicSalary', header: 'Basic Salary (₹)', render: (value: number) => `₹${value.toLocaleString()}` },
    { key: 'hra', header: 'HRA (₹)', render: (value: number) => `₹${value.toLocaleString()}` },
    { key: 'grossSalary', header: 'Gross Salary (₹)', render: (value: number) => `₹${value.toLocaleString()}` },
    { key: 'pf', header: 'PF (₹)', render: (value: number) => `₹${value.toLocaleString()}` },
    { key: 'tax', header: 'Tax (₹)', render: (value: number) => `₹${value.toLocaleString()}` },
    { key: 'netSalary', header: 'Net Salary (₹)', render: (value: number) => `₹${value.toLocaleString()}` },
    { 
      key: 'status', 
      header: 'Status', 
      render: (value: string) => (
        <Badge variant={value === 'Processed' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    }
  ];

  const totalEmployees = payrollData.length;
  const totalGrossSalary = payrollData.reduce((sum, emp) => sum + emp.grossSalary, 0);
  const totalNetSalary = payrollData.reduce((sum, emp) => sum + emp.netSalary, 0);
  const totalBillableHours = payrollData.reduce((sum, emp) => sum + emp.billableHours, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <ResponsiveBreadcrumb items={breadcrumbItems} />
          <h1 className="text-2xl font-bold mt-2">Indian Payroll</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Process Payroll
          </Button>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Billable Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBillableHours}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalGrossSalary.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total gross amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Salary</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalNetSalary.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total net amount</p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Payroll Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ReusableTable
            data={payrollData}
            columns={payrollColumns}
            enableSearch
            enablePagination
            pageSize={10}
            emptyMessage="No payroll data available"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default IndianPayroll;