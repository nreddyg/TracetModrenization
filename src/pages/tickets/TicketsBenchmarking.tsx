import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReusableTable } from '@/components/ui/reusable-table';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableButton } from '@/components/ui/reusable-button';
import PageLayout from '@/components/common/PageLayout';
import FilterCard from '@/components/common/FilterCard';
import { toast } from '@/hooks/use-toast';
import { 
  Settings, 
  Plus, 
  Edit, 
  Save, 
  X, 
  Target, 
  BarChart3, 
  Users, 
  Building2, 
  Clock, 
  Layers,
  TrendingUp,
  Filter,
  Download,
  Upload
} from 'lucide-react';

// Sample data
const businessUnits = [
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'support', label: 'Support' },
  { value: 'finance', label: 'Finance' },
  { value: 'hr', label: 'Human Resources' }
];

const employeeLevels = [
  { value: 'l1', label: 'L1 - Junior' },
  { value: 'l2', label: 'L2 - Associate' },
  { value: 'l3', label: 'L3 - Senior' },
  { value: 'l4', label: 'L4 - Lead' },
  { value: 'l5', label: 'L5 - Principal' },
  { value: 'l6', label: 'L6 - Manager' }
];

const taskLevels = [
  { value: 'level1', label: 'Level 1 - Basic' },
  { value: 'level2', label: 'Level 2 - Intermediate' },
  { value: 'level3', label: 'Level 3 - Advanced' },
  { value: 'level4', label: 'Level 4 - Expert' }
];

const complexityTypes = [
  { value: 'low', label: 'Low Complexity' },
  { value: 'medium', label: 'Medium Complexity' },
  { value: 'high', label: 'High Complexity' },
  { value: 'critical', label: 'Critical Complexity' }
];

interface BenchmarkConfig {
  id: string;
  businessUnit: string;
  employeeLevel: string;
  taskLevel: string;
  complexity: string;
  targetDays: number;
  isActive: boolean;
  lastUpdated: string;
}

interface WeightageParameter {
  id: string;
  parameter: string;
  weightage: number;
  description: string;
  isActive: boolean;
}

const TicketsBenchmarking = () => {
  const [activeTab, setActiveTab] = useState('configuration');
  const [isEditing, setIsEditing] = useState(false);
  const [editingConfig, setEditingConfig] = useState<BenchmarkConfig | null>(null);
  const [filters, setFilters] = useState({
    businessUnit: '',
    employeeLevel: '',
    taskLevel: '',
    complexity: ''
  });

  // Sample benchmark configurations
  const [benchmarkConfigs, setBenchmarkConfigs] = useState<BenchmarkConfig[]>([
    {
      id: '1',
      businessUnit: 'sales',
      employeeLevel: 'l1',
      taskLevel: 'level1',
      complexity: 'low',
      targetDays: 2,
      isActive: true,
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      businessUnit: 'sales',
      employeeLevel: 'l2',
      taskLevel: 'level2',
      complexity: 'medium',
      targetDays: 4,
      isActive: true,
      lastUpdated: '2024-01-15'
    },
    {
      id: '3',
      businessUnit: 'engineering',
      employeeLevel: 'l3',
      taskLevel: 'level3',
      complexity: 'high',
      targetDays: 7,
      isActive: true,
      lastUpdated: '2024-01-14'
    }
  ]);

  // Sample weightage parameters
  const [weightageParams, setWeightageParams] = useState<WeightageParameter[]>([
    { id: '1', parameter: 'Task Complexity', weightage: 25, description: 'Impact of task complexity on completion time', isActive: true },
    { id: '2', parameter: 'Employee Experience', weightage: 20, description: 'Employee skill level and experience factor', isActive: true },
    { id: '3', parameter: 'Business Priority', weightage: 15, description: 'Business unit priority and urgency', isActive: true },
    { id: '4', parameter: 'Resource Availability', weightage: 15, description: 'Available resources and dependencies', isActive: true },
    { id: '5', parameter: 'Technical Dependencies', weightage: 15, description: 'External system and technical dependencies', isActive: true },
    { id: '6', parameter: 'Process Maturity', weightage: 10, description: 'Process standardization and maturity level', isActive: true }
  ]);

  const handleSaveConfig = () => {
    if (editingConfig) {
      setBenchmarkConfigs(prev => 
        prev.map(config => 
          config.id === editingConfig.id 
            ? { ...editingConfig, lastUpdated: new Date().toISOString().split('T')[0] }
            : config
        )
      );
      toast({
        title: "Configuration Updated",
        description: "Benchmark configuration has been successfully updated.",
      });
    }
    setIsEditing(false);
    setEditingConfig(null);
  };

  const handleAddNew = () => {
    const newConfig: BenchmarkConfig = {
      id: Date.now().toString(),
      businessUnit: '',
      employeeLevel: '',
      taskLevel: '',
      complexity: '',
      targetDays: 1,
      isActive: true,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setEditingConfig(newConfig);
    setIsEditing(true);
  };

  const configColumns = [
    {
      id: 'businessUnit',
      header: 'Business Unit',
      accessorKey: 'businessUnit',
      cell: ({ row }: { row: { original: BenchmarkConfig } }) => {
        const unit = businessUnits.find(bu => bu.value === row.original.businessUnit);
        return (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{unit?.label || row.original.businessUnit}</span>
          </div>
        );
      }
    },
    {
      id: 'employeeLevel',
      header: 'Employee Level',
      accessorKey: 'employeeLevel',
      cell: ({ row }: { row: { original: BenchmarkConfig } }) => {
        const level = employeeLevels.find(el => el.value === row.original.employeeLevel);
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary">{level?.label || row.original.employeeLevel}</Badge>
          </div>
        );
      }
    },
    {
      id: 'taskLevel',
      header: 'Task Level',
      accessorKey: 'taskLevel',
      cell: ({ row }: { row: { original: BenchmarkConfig } }) => {
        const level = taskLevels.find(tl => tl.value === row.original.taskLevel);
        return (
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <span>{level?.label || row.original.taskLevel}</span>
          </div>
        );
      }
    },
    {
      id: 'complexity',
      header: 'Complexity',
      accessorKey: 'complexity',
      cell: ({ row }: { row: { original: BenchmarkConfig } }) => {
        const complexity = complexityTypes.find(ct => ct.value === row.original.complexity);
        const getVariant = () => {
          switch (row.original.complexity) {
            case 'low': return 'default';
            case 'medium': return 'secondary';
            case 'high': return 'destructive';
            case 'critical': return 'destructive';
            default: return 'default';
          }
        };
        return (
          <Badge variant={getVariant() as any}>
            {complexity?.label || row.original.complexity}
          </Badge>
        );
      }
    },
    {
      id: 'targetDays',
      header: 'Target Days',
      accessorKey: 'targetDays',
      cell: ({ row }: { row: { original: BenchmarkConfig } }) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-primary">{row.original.targetDays} days</span>
        </div>
      )
    },
    {
      id: 'isActive',
      header: 'Status',
      accessorKey: 'isActive',
      cell: ({ row }: { row: { original: BenchmarkConfig } }) => (
        <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      id: 'lastUpdated',
      header: 'Last Updated',
      accessorKey: 'lastUpdated',
      cell: ({ row }: { row: { original: BenchmarkConfig } }) => (
        <span className="text-sm text-muted-foreground">{row.original.lastUpdated}</span>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: BenchmarkConfig } }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingConfig(row.original);
              setIsEditing(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const weightageColumns = [
    {
      id: 'parameter',
      header: 'Parameter',
      accessorKey: 'parameter',
      cell: ({ row }: { row: { original: WeightageParameter } }) => (
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.parameter}</span>
        </div>
      )
    },
    {
      id: 'weightage',
      header: 'Weightage (%)',
      accessorKey: 'weightage',
      cell: ({ row }: { row: { original: WeightageParameter } }) => (
        <div className="flex items-center gap-2">
          <div className="w-20 bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${row.original.weightage}%` }}
            />
          </div>
          <span className="font-semibold text-primary">{row.original.weightage}%</span>
        </div>
      )
    },
    {
      id: 'description',
      header: 'Description',
      accessorKey: 'description',
      cell: ({ row }: { row: { original: WeightageParameter } }) => (
        <span className="text-sm text-muted-foreground">{row.original.description}</span>
      )
    },
    {
      id: 'isActive',
      header: 'Status',
      accessorKey: 'isActive',
      cell: ({ row }: { row: { original: WeightageParameter } }) => (
        <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  const totalWeightage = weightageParams.reduce((sum, param) => sum + param.weightage, 0);

  const filteredConfigs = benchmarkConfigs.filter(config => {
    return (!filters.businessUnit || config.businessUnit === filters.businessUnit) &&
           (!filters.employeeLevel || config.employeeLevel === filters.employeeLevel) &&
           (!filters.taskLevel || config.taskLevel === filters.taskLevel) &&
           (!filters.complexity || config.complexity === filters.complexity);
  });

  return (
    <PageLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Benchmarking Management</h1>
          <p className="text-muted-foreground">Configure task completion benchmarks and parameter weightages</p>
        </div>

        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Configurations</p>
                    <p className="text-2xl font-bold">{benchmarkConfigs.length}</p>
                  </div>
                  <Settings className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Configs</p>
                    <p className="text-2xl font-bold">{benchmarkConfigs.filter(c => c.isActive).length}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Parameters</p>
                    <p className="text-2xl font-bold">{weightageParams.length}</p>
                  </div>
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Weightage</p>
                    <p className={`text-2xl font-bold ${totalWeightage === 100 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalWeightage}%
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="configuration" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configuration Management
              </TabsTrigger>
              <TabsTrigger value="weightage" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Parameters & Weightage
              </TabsTrigger>
            </TabsList>

            {/* Configuration Tab */}
            <TabsContent value="configuration" className="space-y-6">
              {/* Filters */}
              <FilterCard>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <ReusableDropdown
                    options={businessUnits}
                    value={filters.businessUnit}
                    onChange={(value) => setFilters(prev => ({ ...prev, businessUnit: value as string }))}
                    placeholder="Filter by Business Unit"
                    allowClear
                  />
                  <ReusableDropdown
                    options={employeeLevels}
                    value={filters.employeeLevel}
                    onChange={(value) => setFilters(prev => ({ ...prev, employeeLevel: value as string }))}
                    placeholder="Filter by Employee Level"
                    allowClear
                  />
                  <ReusableDropdown
                    options={taskLevels}
                    value={filters.taskLevel}
                    onChange={(value) => setFilters(prev => ({ ...prev, taskLevel: value as string }))}
                    placeholder="Filter by Task Level"
                    allowClear
                  />
                  <ReusableDropdown
                    options={complexityTypes}
                    value={filters.complexity}
                    onChange={(value) => setFilters(prev => ({ ...prev, complexity: value as string }))}
                    placeholder="Filter by Complexity"
                    allowClear
                  />
                </div>
              </FilterCard>

              {/* Configuration Form */}
              {isEditing && editingConfig && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      {editingConfig.id ? 'Edit Configuration' : 'Add New Configuration'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <ReusableDropdown
                        options={businessUnits}
                        value={editingConfig.businessUnit}
                        onChange={(value) => setEditingConfig(prev => prev ? { ...prev, businessUnit: value as string } : null)}
                        placeholder="Select Business Unit"
                      />
                      <ReusableDropdown
                        options={employeeLevels}
                        value={editingConfig.employeeLevel}
                        onChange={(value) => setEditingConfig(prev => prev ? { ...prev, employeeLevel: value as string } : null)}
                        placeholder="Select Employee Level"
                      />
                      <ReusableDropdown
                        options={taskLevels}
                        value={editingConfig.taskLevel}
                        onChange={(value) => setEditingConfig(prev => prev ? { ...prev, taskLevel: value as string } : null)}
                        placeholder="Select Task Level"
                      />
                      <ReusableDropdown
                        options={complexityTypes}
                        value={editingConfig.complexity}
                        onChange={(value) => setEditingConfig(prev => prev ? { ...prev, complexity: value as string } : null)}
                        placeholder="Select Complexity"
                      />
                      <ReusableInput
                        type="number"
                        value={editingConfig.targetDays.toString()}
                        onChange={(e) => setEditingConfig(prev => prev ? { ...prev, targetDays: parseInt(e.target.value) || 1 } : null)}
                        placeholder="Target Days"
                        min={1}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <ReusableButton onClick={handleSaveConfig} variant="default">
                        <Save className="h-4 w-4 mr-2" />
                        Save Configuration
                      </ReusableButton>
                      <ReusableButton 
                        onClick={() => {
                          setIsEditing(false);
                          setEditingConfig(null);
                        }} 
                        variant="default"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </ReusableButton>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Configuration Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Benchmark Configurations</CardTitle>
                      <CardDescription>
                        Manage task completion time benchmarks for different combinations
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Import
                      </Button>
                      <Button onClick={handleAddNew}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Configuration
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ReusableTable
                    data={filteredConfigs}
                    columns={configColumns}
                    enableSearch
                    enablePagination
                    pageSize={10}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Weightage Tab */}
            <TabsContent value="weightage" className="space-y-6">
              {/* Weightage Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Weightage Summary
                  </CardTitle>
                  <CardDescription>
                    Total weightage distribution across all parameters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium">Total Weightage:</span>
                    <Badge 
                      variant={totalWeightage === 100 ? 'default' : 'destructive'}
                      className="text-lg px-3 py-1"
                    >
                      {totalWeightage}%
                    </Badge>
                  </div>
                  {totalWeightage !== 100 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        ⚠️ Warning: Total weightage should equal 100%. Current total is {totalWeightage}%.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Parameters Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Parameter Weightages</CardTitle>
                      <CardDescription>
                        Configure the weightage for each benchmarking parameter
                      </CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Parameter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ReusableTable
                    data={weightageParams}
                    columns={weightageColumns}
                    enableSearch
                    enablePagination
                    pageSize={10}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default TicketsBenchmarking;