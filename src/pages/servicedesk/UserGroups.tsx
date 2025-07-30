
import React, { useState, useMemo } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Edit, 
  Trash2,
  Plus,
  Save,
  X
} from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface UserGroup {
  id: string;
  userGroupName: string;
  users: string[];
  description: string;
  status: 'Active' | 'InActive';
}

interface UserGroupFormData {
  userGroupName: string;
  selectedUsers: string[];
  description: string;
}

const mockUserGroups: UserGroup[] = [
  { 
    id: '1', 
    userGroupName: 'Cyber Team', 
    users: ['Ashok', 'Ganesh', 'Prajwal', 'Pall'], 
    description: 'Cyber Team', 
    status: 'InActive' 
  },
  { 
    id: '2', 
    userGroupName: 'Devops Team', 
    users: ['Nagendra', 'Prajwal', 'Ganesh'], 
    description: 'Devops Team', 
    status: 'Active' 
  },
  { 
    id: '3', 
    userGroupName: 'Maintenance Team', 
    users: ['Ganesh', 'Ravi'], 
    description: 'Maintenance Team', 
    status: 'Active' 
  },
  { 
    id: '4', 
    userGroupName: 'Mech Team', 
    users: ['Ashok', 'Nagendra', 'Ganesh'], 
    description: 'Mech Team', 
    status: 'Active' 
  },
];

const availableUsers = ['Ashok', 'Ganesh', 'Prajwal', 'Pall', 'Nagendra', 'Ravi'];

const UserGroups = () => {
  const [userGroups] = useState<UserGroup[]>(mockUserGroups);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  const form = useForm<UserGroupFormData>({
    defaultValues: {
      userGroupName: '',
      selectedUsers: [],
      description: '',
    },
  });

  // Filter data based on search
  const filteredData = useMemo(() => {
    return userGroups.filter(group => 
      Object.values(group).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [userGroups, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-300';
      case 'InActive': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const onSubmit = (data: UserGroupFormData) => {
    console.log('Form submitted:', data);
    setIsFormVisible(false);
    form.reset();
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <header className="bg-white border-b px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <Button 
            size="sm" 
            className="bg-orange-500 hover:bg-orange-600 text-sm px-3 py-1.5"
          >
            New Service Request
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">User Groups</h1>
            <p className="text-sm text-gray-600 mt-0.5">Manage user groups and permissions</p>
          </div>
          <Button 
            size="sm" 
            className="bg-orange-500 hover:bg-orange-600 text-sm px-3 py-1.5"
            onClick={() => setIsFormVisible(true)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add User Group
          </Button>
        </div>

        {/* User Group Form */}
        {isFormVisible && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">User Group</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="userGroupName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            User Group Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="border-gray-200 text-sm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="selectedUsers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Select Users <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select>
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Select Users" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableUsers.map(user => (
                                <SelectItem key={user} value={user} className="text-sm">
                                  {user}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            className="border-gray-200 min-h-[80px] text-sm" 
                            placeholder="Enter description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      className="bg-orange-500 hover:bg-orange-600 text-sm px-4 py-1.5"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancel}
                      className="text-sm px-4 py-1.5"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* User Group List */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">User Group List</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                  <Input
                    placeholder="Search user groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 border-gray-200 w-48 text-sm h-8"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-medium text-gray-900 py-3 text-sm">Actions</TableHead>
                    <TableHead className="font-medium text-gray-900 py-3 text-sm">User Group</TableHead>
                    <TableHead className="font-medium text-gray-900 py-3 text-sm">Users</TableHead>
                    <TableHead className="font-medium text-gray-900 py-3 text-sm">Description</TableHead>
                    <TableHead className="font-medium text-gray-900 py-3 text-sm">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((group) => (
                    <TableRow key={group.id} className="hover:bg-gray-50/50 transition-colors border-gray-100">
                      <TableCell className="py-3">
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            className="bg-orange-500 hover:bg-orange-600 text-white h-7 px-2 text-xs"
                          >
                            <Edit className="h-3 w-3 mr-0.5" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            className="h-7 px-2 text-xs"
                          >
                            <Trash2 className="h-3 w-3 mr-0.5" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="font-medium text-gray-900 text-sm">{group.userGroupName}</span>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="text-gray-700 text-sm">{group.users.join(', ')}</span>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="text-gray-700 text-sm">{group.description}</span>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge className={`${getStatusColor(group.status)} border font-medium text-xs px-2 py-0.5`}>
                          {group.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserGroups;
