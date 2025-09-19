
import { useCallback, useEffect, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReusableTable, TableAction, TablePermissions } from '@/components/ui/reusable-table';
import { Trash2, Plus, Edit } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';
import { ReusableButton } from '@/components/ui/reusable-button';
import { GetUsersList } from '@/services/userServices';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLoading } from '@/store/slices/projectsSlice';
interface UserData {
  UserId: number,
  FirstName: string,
  LastName: string,
  Email: string,
  EmployeeId: string,
  MobileNumber: string,
  PhoneNumber: string,
  UserName: string,
  DeviceName: string,
  RoleTypeId: number,
  RoleName: string,
  DepartmentIds: string,
  Department: string,
  AssetCategoryIds: string,
  Categories: string,
  BranchIds: string,
  Branch: string,
  Deactive: boolean,
  DeactiveDate: string,
  IsServiceDesk: boolean,
  JoinDate: string,
  Password: string,
  ConfirmPassword: string
}

const User = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const companyId = useAppSelector(state => state.projects.companyId)
  const [dataSource, setDataSource] = useState<UserData[]>([]);
  const [columns, setColumns] = useState<ColumnDef<UserData>[]>([
    { id: 'FirstName', accessorKey: "FirstName", header: "First Name" },
    { id: 'LastName', accessorKey: "LastName", header: "Last Name" },
    { id: 'UserName', accessorKey: "UserName", header: "User Name" },
    { id: 'RoleName', accessorKey: "RoleName", header: "Role Name" },
    { id: 'EmployeeId', accessorKey: "EmployeeId", header: "Employee ID" },
    { id: 'Email', accessorKey: "Email", header: "Email" },
    { id: 'PhoneNumber', accessorKey: "PhoneNumber", header: "Mobile Number" },
    { id: 'Status', accessorKey: "Status", header: "Status", cell: ({ row }) => (
      row.original.Deactive ? <Badge variant="destructive" className="h-6">Deactive</Badge> : <Badge variant="default" className="h-6">Active</Badge>
    ) },
    { id: 'IsServiceDesk', accessorKey: "IsServiceDesk", header: "Is Service Desk User",
      cell: ({ row }) => (
        row.original.IsServiceDesk ? <Badge variant="default" className="h-6">Yes</Badge> : <Badge variant="destructive" className="h-6">No</Badge>
      )
     },
  ])

  useEffect(() => {
    if (companyId) fetchAllUsersList();
  }, [companyId]);
  //fetch all users list
  const fetchAllUsersList = async () => {
    dispatch(setLoading(true));
    await GetUsersList(companyId).then(res => {
      if (res.success && res.data && Array.isArray(res.data)) {
        setDataSource(res.data);
      }else{
        setDataSource([]);
      }
    }).catch(err => console.log(err)).finally(() => {
      dispatch(setLoading(false));
    });
  }
  const handleDelete = (data: UserData): void => {
  }
  const handleEdit = (data: UserData): void => {
  }
  const tableActions: TableAction<UserData>[] = [
    {
      label: 'Edit',
      icon: Edit,
      onClick: handleEdit,
      variant: 'default',
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: handleDelete,
      variant: 'destructive',
    },
  ];
  // handle refresh
  const handleRefresh = useCallback(() => {
      toast({ title: "Data Refreshed", description: "All users data has been updated", });
      fetchAllUsersList();
  }, [toast]);
  // Define table permissions
  const tablePermissions: TablePermissions = {
    canEdit: true,
    canDelete: true,
    canView: true,
    canExport: false,
    canAdd: true,
    canManageColumns: true,
  };
  return (
    <div className="h-full overflow-y-scroll bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Masters</span><span>/</span><span>Company</span><span>/</span><span className="text-gray-900 font-medium">User</span>
          </div>
        </div>
      </header>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <ReusableButton
            htmlType="button"
            variant="default"
            onClick={null}
            iconPosition="left"
            size="middle"
            className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
          >
            <div className='flex items-center'><Plus className="h-4 w-4 mr-2" />Add User</div>
          </ReusableButton>
        </div>
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
          </CardHeader>
          <CardContent>
            <ReusableTable
              data={dataSource} columns={columns}
              permissions={tablePermissions}
              title="Users List"
              onRefresh={handleRefresh} enableSearch={true}
              enableSelection={false} enableExport={true}
              enableColumnVisibility={true} enablePagination={true}
              enableSorting={true} enableFiltering={true}
              pageSize={10} emptyMessage="No Data found"
              rowHeight="normal" storageKey="service-request-type-list-table"
              actions={tableActions}
              enableColumnPinning
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default User;
