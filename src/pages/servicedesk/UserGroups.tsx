
import React, { useState, useMemo, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Trash2, Plus, Save, X } from 'lucide-react';
import { Form, } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { useForm, Controller } from 'react-hook-form';
import { ColumnDef } from '@tanstack/react-table';
import { ReusableButton } from '../../components/ui/reusable-button';
import { ReusableInput } from '../../components/ui/reusable-input';
import { ReusableDropdown } from '../../components/ui/reusable-dropdown';
import { ReusableTable, TableAction, TablePermissions } from '../../components/ui//reusable-table';
import { MessageProvider, useMessage } from '../../components/ui/reusable-message';
import { ReusableMultiSelect } from '@/components/ui/reusable-multi-select';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { addUserGroup, deleteUserGroup, getUserGroupById, getUserGroupData, updateUserGroup } from '@/services/usergroupServices';
import { USER_GROUP_DB } from '@/Local_DB/Form_JSON_Data/UserGroupDB';
import { GetServiceRequestAssignToLookups } from '@/services/ticketServices';
import { useAppDispatch } from '@/store/reduxStore';
import { setLoading } from '@/store/slices/projectsSlice';
import { useAppSelector } from '@/store';


interface UserGroup {
  UserGroupId: number;
  UserGroup: string;
  Users: string;
  Description: string;
  Status: string;
  ActiveStatus?: boolean;
}

const UserGroups = () => {
  const message = useMessage();
  const [userGroups, setUserGroups] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState<UserGroup | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [fields, setFields] = useState<BaseField[]>(USER_GROUP_DB);
  const dispatch = useAppDispatch();
  const companyId=useAppSelector(state=>state.projects.companyId)
  
  useEffect(() => {
    if(companyId){
      getUserGroupTableData(companyId, 'All');
    }
  }, [companyId])

  useEffect(() => {
    if (selectedRecord !== null && companyId) {
      getUserGroupDataById(companyId, selectedRecord?.UserGroupId)
    }
  }, [selectedRecord,companyId])

  //table data api integration
  async function getUserGroupTableData(compId: number, BranchName: string) {
     dispatch(setLoading(true));
    await getUserGroupData(compId, BranchName).then(res => {
      if (res.success && res.data) {
        if (res.data.UserGroupDetails?.length > 0) {
          setUserGroups(res.data.UserGroupDetails?.reverse())
        }
      }
    })
      .catch(err => {
        console.error('Error fetching subscription by customer:', err);
      }).finally(()=>{
        dispatch(setLoading(false))
      })
  }

  //get usergroupby id api integration
  async function getUserGroupDataById(compId: number, usergroupid: number) {
     dispatch(setLoading(true))
    await getUserGroupById(compId, usergroupid).then(res => {
      if (res.success && res.data) {
        const details = res.data.UserGroupDetails;
        if (details) {
          reset({
            userGroupName: details.UserGroup,
            Users: details.Users?.split(",").map(u => u.trim()) || [],
            description: details.Description || "",
            status: details.Status ? "Active" : "InActive"
          });
        }
      }
    })
      .catch(err => {
        console.error('Error fetching subscription by customer:', err);
      }).finally(()=>{
        dispatch(setLoading(false))
      })
  }

  //delete usergroup api integration
  async function deleteUserGroupData(compId: number, usergroupid: number) {
     dispatch(setLoading(true));
    await deleteUserGroup(compId, usergroupid).then(res => {
      if (res.success && res.data) {
        if (res.data.status === true) {
          message.success(res.data.message)
          getUserGroupTableData(companyId, 'All')
        }
        else {
          message.error(res.data.message)
        }
      }
    })
      .catch(err => {
      }).finally(()=>{
        dispatch(setLoading(false))
      })
  }

  //users lookup integartion 

  async function SelectUsersLookup(compid: number, branchname: string) {
     dispatch(setLoading(true));
    await GetServiceRequestAssignToLookups(compid, branchname)
      .then((res) => {
        if (res.success && res.data) {
          const lookup = res.data.ServiceRequestAssignToUsersLookup || [];
          if (lookup.length > 0) {
            const options = lookup.map((user: any) => ({
              label: user.UserName,
              value: user.UserName,
            }));
            setFields((prevFields) =>
              prevFields.map((f) =>
                f.name === "Users" ? { ...f, options } : f
              )
            );
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching users lookup:", err);
      }).finally(()=>{
        dispatch(setLoading(false))
      })
  }


  useEffect(() => {
    if(companyId){
      SelectUsersLookup(companyId, 'All')
    }
  }, [companyId])



  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultValue ?? ''
      return acc;
    }, {} as GenericObject),

  });

  const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;


  const renderField = (field: BaseField) => {
    const { name, label, fieldType, isRequired, show = true } = field;
    if (!name || !show) return null;

    const validationRules = {
      required: isRequired ? `${label} is required` : false,
    };

    switch (fieldType) {
      case 'text':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableInput
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );

      case 'textarea':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableTextarea
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );

      case 'dropdown':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableDropdown
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );

      case 'multiselect':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableMultiSelect
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );

      default:
        return null;
    }
  };

  // Helper function to get fields by names (similar to TicketView)
  const getFieldsByNames = (names: string[]) => fields.filter(f => names.includes(f.name!));

  const handleSubmitForm = async (data: GenericObject): Promise<void> => {
    // Validate description length
    if (data.description && data.description.length > 500) {
      message.warning("Description maximum length 500 characters only");
      return;
    }
    dispatch(setLoading(true));
    try {
     const payload =(isEditMode)?[{
      UserGroupName: data.userGroupName,
      Users: data.Users?.join(','),
      Description: data.description,
      ActiveStatus:data.Status==='Active'?'true':'false',
    }]:
    [{
      UserGroupName: data.userGroupName,
      Users: data.Users?.join(','),
      Description: data.description,
    }];

 

    const pay={UserGroupDetails:payload};
    let res;

      if (!isEditMode) {
       res=await addUserGroup(companyId,'All',pay)
      } else if (selectedRecord) {
              res = await updateUserGroup(companyId,'All',selectedRecord?.UserGroupId,pay);
      }

    
    if (res?.success && res.data?.status) {
      message.success(res.data.message || (isEditMode ? 'User group updated' : 'User group created'));
      getUserGroupTableData(companyId, 'All');
      handleCancel();
    } else {
      message.error(res?.data?.message || 'Operation failed');
    }
  } catch (error) {
    message.error("Failed to save user group");
  } finally{
    dispatch(setLoading(false))
  }
  };

  const handleEdit = (group: UserGroup): void => {
    setSelectedRecord(group);
    setIsEditMode(true);
    setIsFormVisible(true);
  };

  const handleDelete = (group: UserGroup): void => {
    setSelectedRecord(group);
    setIsDelModalOpen(true);
  };



  const handleCancel = (): void => {
    setIsFormVisible(false);
    setIsEditMode(false);
    setSelectedRecord(null);
    reset({
      userGroupName: '',
      Users: [],
      description: '',
      status: '',
    });
  };

  const handleAddUserGroup = (): void => {
    setIsEditMode(false);
    setSelectedRecord(null);
    reset();
    setIsFormVisible(true);
  };

  // Filter data based on search
  const filteredData = useMemo(() => {
    return userGroups.filter(group =>
      Object.values(group).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [userGroups, searchTerm]);

  const getStatusColor = (status: boolean) => {
    switch (status) {
      case true: return 'bg-green-100 text-green-800 border-green-300';
      case false: return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Define table columns
  const columns: ColumnDef<UserGroup>[] = [
    {
      accessorKey: 'UserGroup',
      header: 'User Group',
      cell: ({ row }) => (
        <span className="font-medium text-gray-900 text-sm">{row.getValue('UserGroup')}</span>
      ),
    },
    {
      accessorKey: 'Users',
      header: 'Users',
      cell: ({ row }) => (
        <span className="text-gray-700 text-sm">{row.getValue('Users')}</span>
      ),
    },
    {
      accessorKey: 'Description',
      header: 'Description',
      cell: ({ row }) => (
        <span className="text-gray-700 text-sm">{row.getValue('Description')}</span>
      ),
    },
    {
      accessorKey: 'Status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge className={`${getStatusColor(row.getValue('Status'))} border font-medium text-xs px-2 py-0.5`}>
          {row.getValue('Status') === true ? `Active` : 'In Active'}
        </Badge>
      ),
    },
  ];

  // Define table actions
  const tableActions: TableAction<UserGroup>[] = [
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

  // Define table permissions
  const tablePermissions: TablePermissions = {
    canEdit: true,
    canDelete: true,
    canView: true,
    canExport: false,
    canAdd: true,
    canManageColumns: false,
  };

  // Handle refresh
  const handleRefresh = () => {
    message.info("Refreshing user groups...");
    // Add refresh logic here
  };

  return (
    <div className="h-full overflow-y-scroll bg-gray-50/30">
      <div className="p-4 space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">User Groups</h1>
            <p className="text-sm text-gray-600 mt-0.5">Manage user groups and permissions</p>
          </div>
          <ReusableButton
            size="small"
            variant="primary"
            icon={<Plus className="h-3 w-3" />}
            iconPosition="left"
            onClick={handleAddUserGroup}
          >
            Add User Group
          </ReusableButton>
        </div>

        {/* User Group Form */}
        {isFormVisible && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                {isEditMode ? 'Edit User Group' : 'User Group'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getFieldsByNames(['userGroupName', 'Users']).map((field) => (
                      <div key={field.name}>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>

                  {getFieldsByNames(['description']).map((field) => (
                    <div key={field.name}>
                      {renderField(field)}
                    </div>
                  ))}

                  {isEditMode && getFieldsByNames(['status']).map((field) => (
                    <div key={field.name}>
                      {renderField(field)}
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <ReusableButton
                      htmlType="submit"
                      variant="primary"
                      icon={<Save className="h-3 w-3" />}
                      iconPosition="left"
                      size="middle"
                    >
                      {isEditMode ? 'Update' : 'Save'}
                    </ReusableButton>
                    <ReusableButton
                      htmlType="button"
                      variant="default"
                      onClick={handleCancel}
                      icon={<X className="h-3 w-3" />}
                      iconPosition="left"
                      size="middle"
                    >
                      {isEditMode ? 'Cancel' : 'Clear'}
                    </ReusableButton>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* User Group List with ReusableTable */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">User Group List</CardTitle>
              <div>
                <ReusableInput
                  placeholder="Search user groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  prefixIcon={<Search className="h-3 w-3 text-gray-400" />}
                  allowClear={true}
                  onClear={() => setSearchTerm('')}
                  size="small"
                  className="w-50 pl-7"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ReusableTable
              data={filteredData}
              columns={columns}
              actions={tableActions}
              permissions={tablePermissions}
              title=""
              onRefresh={handleRefresh}
              enableSearch={false} // We have our own search
              enableSelection={false}
              enableExport={true}
              enableColumnVisibility={true}
              enablePagination={true}
              enableSorting={true}
              enableFiltering={true}
              pageSize={10}
              emptyMessage="No user groups found"
              rowHeight="normal"
              storageKey="usergroups-table"
            />
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDelModalOpen} onOpenChange={setIsDelModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm the action</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedRecord?.UserGroup || "this"} User Group?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <ReusableButton
              variant="default"
              onClick={() => setIsDelModalOpen(false)}
            >
              Cancel
            </ReusableButton>
            <ReusableButton
              variant="primary"
              danger={true}
              onClick={() => { deleteUserGroupData(companyId, selectedRecord?.UserGroupId); setIsDelModalOpen(false) }}
            >
              Delete
            </ReusableButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Main component wrapped with MessageProvider
// const UserGroups = () => {
//   return (
//     <MessageProvider position="top" maxCount={5} duration={3}>
//       <UserGroupsContent />
//     </MessageProvider>
//   );
// };

export default UserGroups;