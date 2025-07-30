import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReusableTable } from '@/components/ui/reusable-table';
import { ResponsiveBreadcrumb } from '@/components/common/ResponsiveBreadcrumb';
import PageHeader from '@/components/common/PageHeader';
import { Calendar, Download, DollarSign, FileText, Clock, TrendingUp } from 'lucide-react';

const USPayroll = () => {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Payroll', href: '/payroll' },
    { label: 'US Payroll', href: '/payroll/us' }
  ];

  // Sample US payroll data based on timesheets and projects
  const payrollData = [
    {
      id: 1,
      employeeId: 'US001',
      employeeName: 'John Smith',
      department: 'Engineering',
      projectHours: 160,
      billableHours: 155,
      overtime: 10,
      hourlyRate: 75,
      regularPay: 12000,
      overtimePay: 1125,
      grossPay: 13125,
      federalTax: 2625,
      stateTax: 656,
      socialSecurity: 813,
      medicare: 190,
      netPay: 8841,
      status: 'Processed'
    },
    {
      id: 2,
      employeeId: 'US002',
      employeeName: 'Sarah Johnson',
      department: 'Design',
      projectHours: 155,
      billableHours: 150,
      overtime: 5,
      hourlyRate: 65,
      regularPay: 10075,
      overtimePay: 488,
      grossPay: 10563,
      federalTax: 2113,
      stateTax: 528,
      socialSecurity: 655,
      medicare: 153,
      netPay: 7114,
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
    { key: 'hourlyRate', header: 'Hourly Rate ($)', render: (value: number) => `$${value}` },
    { key: 'regularPay', header: 'Regular Pay ($)', render: (value: number) => `$${value.toLocaleString()}` },
    { key: 'overtimePay', header: 'Overtime Pay ($)', render: (value: number) => `$${value.toLocaleString()}` },
    { key: 'grossPay', header: 'Gross Pay ($)', render: (value: number) => `$${value.toLocaleString()}` },
    { key: 'federalTax', header: 'Federal Tax ($)', render: (value: number) => `$${value.toLocaleString()}` },
    { key: 'stateTax', header: 'State Tax ($)', render: (value: number) => `$${value.toLocaleString()}` },
    { key: 'socialSecurity', header: 'Social Security ($)', render: (value: number) => `$${value.toLocaleString()}` },
    { key: 'medicare', header: 'Medicare ($)', render: (value: number) => `$${value.toLocaleString()}` },
    { key: 'netPay', header: 'Net Pay ($)', render: (value: number) => `$${value.toLocaleString()}` },
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
  const totalGrossPay = payrollData.reduce((sum, emp) => sum + emp.grossPay, 0);
  const totalNetPay = payrollData.reduce((sum, emp) => sum + emp.netPay, 0);
  const totalBillableHours = payrollData.reduce((sum, emp) => sum + emp.billableHours, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <ResponsiveBreadcrumb items={breadcrumbItems} />
          <h1 className="text-2xl font-bold mt-2">US Payroll</h1>
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
            <CardTitle className="text-sm font-medium">Gross Pay</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalGrossPay.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total gross amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Pay</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalNetPay.toLocaleString()}</div>
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

export default USPayroll;