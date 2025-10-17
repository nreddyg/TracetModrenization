import {useEffect, useState } from 'react';
import { Card, CardContent} from '@/components/ui/card';
import { ChevronRight, ChevronLeft, Search, X, Save, Trash2 } from 'lucide-react';
import { ReusableButton } from '@/components/ui/reusable-button';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLoading } from '@/store/slices/projectsSlice';
import { AddOrganization, GetCountryList, GetCurrency, GetOrganizationsList, UpdateOrganization } from '@/services/organizationServices';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Controller, useForm } from 'react-hook-form';
import { BaseField, GenericObject, UploadFileInput } from '@/Local_DB/types/types';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import ReusableMultiSelect from '@/components/ui/reusable-multi-select';
import { ReusableCheckbox } from '@/components/ui/reusable-checkbox';
import { ReusableRadio } from '@/components/ui/reusable-radio';
import { useMessage } from '@/components/ui/reusable-message';
import { convertOrgLogoFromApi, fileToByteArray } from '@/_Helper_Functions/HelperFunctions';
import axios from 'axios';
interface User {
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
  const dispatch = useAppDispatch();
  const msg = useMessage();
  let LoggedInUser=JSON.parse(localStorage.getItem('LoggedInUser')) || {};
  const companyId = useAppSelector(state => state.projects.companyId)
  const [dataSource, setDataSource] = useState<User[]>([]);
  const [fields, setFields] = useState<BaseField[]>(USER_DETAILS);
  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultValue ?? '';
      return acc;
    }, {} as GenericObject),
    mode: 'onChange'
  });
  const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserData, setSelectedUserData] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInboxCollapsed, setIsInboxCollapsed] = useState(false);

  const filteredUsers = dataSource.filter(user => {
    const matchesSearch = user.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.LastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.EmployeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.MobileNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.PhoneNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  useEffect(() => {
    if (companyId) {
      fetchAllUsersList();
      fetchAllLookupsData();
    }
  }, [companyId]);
  //fetch all lookups data
  const fetchAllLookupsData = async () => {
    try{
      dispatch(setLoading(true));
      const [roleNames, branches,departments,categories] = await Promise.allSettled([
        getRoleNamesList(companyId),
        GetBranchListBasedonCompanyId(companyId),
        getDepartmentList(companyId),
        getCategoryList(companyId)
      ]);
      let allResponses = {
        RoleName:{data:roleNames.status === 'fulfilled' && roleNames.value.success && roleNames.value.data && roleNames.value.data.Roles ? roleNames.value.data.Roles.slice(1) : [],label:'RoleName',value:'RoleName'},
        Branch: {data:branches.status === 'fulfilled' && branches.value.success && branches.value.data && branches.value.data ? branches.value.data : [],label:'Name',value:'Name'},
        Department:{data:departments.status === 'fulfilled' && departments.value.success && departments.value.data && departments.value.data.DepartmentsLookup ? departments.value.data.DepartmentsLookup : [],label:'DepartmentName',value:'DepartmentName'},
        Categories: {data:categories.status === 'fulfilled' && categories.value.success && categories.value.data && categories.value.data.CategoriesLookup ? categories.value.data.CategoriesLookup : [],label:'CategoryName',value:'CategoryName'},
      };
      setLookupsDataInJson(allResponses);
    }catch{

    }finally{
      dispatch(setLoading(false));
    }
  }
  //fetch all users list
  const fetchAllUsersList = async (UserId?: number) => {
    dispatch(setLoading(true));
    await GetUsersList(companyId, UserId).then(res => {
      if (res.success && res.data) {
        if (UserId) {
          form.reset({
            ...res.data[0],
            Branch: res.data[0]?.Branch ? res.data[0].Branch.split(',') : [],
            Department: res.data[0]?.Department ? res.data[0].Department.split(',') : [],
            Categories: res.data[0]?.Categories ? res.data[0].Categories.split(',') : [],
          });
          setSelectedUserData(res.data[0]);
        } else {
          setDataSource(res.data);
        }
      } else {
        if (UserId) {
          form.reset();
          setSelectedUserData(null);
        } else {
          setDataSource([]);
        }
      }
    }).catch(err => console.log(err)).finally(() => {
      dispatch(setLoading(false));
    });
  }
  function setLookupsDataInJson(data: any) {
    let keys=Object.keys(data);
    const updatedFields = fields.map(field => {
      if (keys.includes(field.name)) {
        let options= data[field.name].data.map((item: any) => ({label: item[data[field.name].label], value: item[data[field.name].value]}));
        return { ...field, options };
      }
      return field;
    });
    setFields(updatedFields);
  }
  const handleSelect = (data: User) => {
    // handleReset();
    setSelectedUser(data);
    fetchAllUsersList(data.UserId);
  }
  const handleSave = async (formData: GenericObject) => {
    const isValid = await trigger();
    if (!isValid) {
      msg.error("Please fix the validation errors before submitting.");
      return;
    }
    let payload = {
      "UserDetails": [
        {
          "FirstName": watch("FirstName"),
          "LastName": watch("LastName"),
          "Email": watch("Email"),
          "OrganizationDomain": watch("OrganizationDomain"),
          "PanNumber": watch("PanNumber"),
          "AddressLine1": watch("AddressLine1"),
          "AddressLine2": watch("AddressLine2"),
          "City": watch("City"),
          "State": watch("State"),
          "CountryName": watch("CountryName"),
          "ZipCode": watch("ZipCode"),
          "OrganizationEmail": watch("OrganizationEmail"),
          "OrganizationPhone": watch("OrganizationPhone"),
          "Website": watch("Website"),
        }
      ]
    }
    if (selectedUserData) {
      dispatch(setLoading(true));
      await updateUser(companyId,selectedUserData.UserId, payload).then(res => {
        if (res.success) {
          if (res.data.status) {
            msg.success(res.data.message || "User Updated Successfully !!");
            fetchAllUsersList();
            handleReset();
          } else if (res.data.ErrorDetails && Array.isArray(res.data.ErrorDetails) && res.data.ErrorDetails.length > 0) {
            msg.warning(res.data.ErrorDetails[0]['Error Message'] || 'Failed to update organization !!');
          } else {
            msg.warning('Failed to update organization !!')
          }
        }
      }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
    } else {
      dispatch(setLoading(true));
      await createUser(companyId, payload).then(res => {
        if (res.success) {
          if (res.data.status) {
            msg.success(res.data.message || "User Added Successfully !!");
            fetchAllUsersList();
            handleReset();
          } else if (res.data.ErrorDetails && Array.isArray(res.data.ErrorDetails) && res.data.ErrorDetails.length > 0) {
            msg.warning(res.data.ErrorDetails[0]['Error Message'] || 'Failed to add organization !!');
          } else {
            msg.warning('Failed to add organization !!')
          }
        }
      }).catch(err => console.log(err)).finally(() => { dispatch(setLoading(false)) })
    }
  }
  const handleReset = () => {
    setSelectedUser(null);
    setSelectedUserData(null);
    form.reset({
      FirstName: '', LastName: '', Email: '', OrganizationDomain: '', PanNumber: '',
      AddressLine1: '', AddressLine2: '', City: '', State: '', CountryName: '',
      ZipCode: '', OrganizationEmail: '', OrganizationPhone: '', Website: ''
    });
  };

  const renderField = (field: BaseField) => {
    const { name, label, fieldType, isRequired, show = true } = field;
    if (!name) {
      return null;
    }
    const validationRules = {
      required: isRequired ? `${label} is Required` : false,
    };

    switch (fieldType) {
      case 'text':
      case 'password':
      case 'email':
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
                dropdownClassName={true ? 'z-[10001]' : ''}
              />
            )}
          />
        );
      case 'date':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableDatePicker
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
          <div>
            <Controller
              key={name}
              name={name}
              control={control}
              rules={validationRules}
              render={({ field: ctrl }) => (
                <ReusableMultiSelect
                  label={label!}
                  {...field}
                  value={ctrl.value}
                  onChange={ctrl.onChange}
                  error={errors[name]?.message as string}
                />
              )}
            />
          </div>
        );
      case 'numeric':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableInput
                {...field}
                type="number"
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );

      case 'checkbox':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableCheckbox
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'radiobutton': return (
        <Controller
          key={name}
          name={name}
          control={control}
          rules={validationRules}
          render={({ field: ctrl }) => (
            <ReusableRadio
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
  return (
    <div className="h-full   bg-gray-50 flex flex-col ">
      <div className="flex flex-1 overflow-hidden   ">
        {/* Left Sidebar - Ticket Inbox */}
        {dataSource.length!==0 && <div className={`${isInboxCollapsed ? 'w-6 p-1' : 'w-34 p-2 mb-2 rounded-b-[5px]'} bg-white border-r    border-0 shadow-lg flex pb-3 flex-col transition-all duration-300 shrink-0 hidden lg:flex`}>
          <div className="pt-1 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-semibold text-gray-900 ${isInboxCollapsed ? 'hidden' : ''}`}>
                Users ({dataSource.length})
              </h3>
              <div onClick={() => setIsInboxCollapsed(!isInboxCollapsed)} className={`cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground  ${isInboxCollapsed ? 'me-2  py-1 ' : 'p-1'}`}>
                {isInboxCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </div>
            </div>
            {!isInboxCollapsed && (
              <div className="space-y-2 pb-1">

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search Organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}
          </div>

          {!isInboxCollapsed && (
            <ScrollArea hideScrollbar={true} className="flex-1 min-h-0 mb-2 truncate max-w-[250px] block">
              <div className="py-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user.UserId}
                    className={`p-2.5 py-2 rounded-lg mb-2 cursor-pointer transition-all hover:bg-gray-50 ${selectedUser?.UserId === user.UserId
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : 'border border-gray-200'
                      }`}
                    onClick={LoggedInUser?.RoleName !== 'Root Admin' && user.RoleName==='Root Admin' ? undefined : () => handleSelect(user) }
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-blue-600 me-2">{user.UserName}</span>
                      <Badge
                        title={`User Known As : ${user.RoleName}`}
                        variant="secondary"
                        className="bg-purple-100 text-purple-800 text-center truncate inline-block w-[90px] text-[11px] px-2 py-0.5"
                      >
                        {user.RoleName}
                      </Badge>
                    </div>

                    <h3
                      className="text-xs font-medium text-gray-900 mb-1 truncate"
                      title={user?.Email}
                    >
                      {user?.Email}
                    </h3>

                    <div className="flex items-center justify-between gap-1.5 text-[11px] text-gray-500">
                      <Badge
                        title="Organization Type"
                        variant="outline"
                        className="bg-green-100 text-green-800 text-[11px] px-2 py-0.5"
                      >
                        {user?.EmployeeId}
                      </Badge>
                      {
                        user?.RoleName!=='Root Admin' && 
                        <div>
                        <span
                        title={user.MobileNumber}
                        className="block max-w-[90px] truncate text-[11px] text-gray-500"
                      >
                        <Trash2 height={18} className='text-red-400'></Trash2>
                      </span>
                      </div>
                      }
                      

                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

          )}
        </div>}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 ">
          {/* Navigation and Action Bar */}
          <div className="bg-white border-b shadow-sm px-4 lg:px-6 py-3 flex flex-row xxs:flex-col xs2:flex-row lg:flex-row lg:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Masters</span>
                  <span>/</span>
                  <span>Company</span>
                  <span>/</span>
                  <span className="text-gray-900 font-medium">User</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ReusableButton
                variant="text"
                size="small"
                onClick={handleReset}
                icon={<X className="h-4 w-4" />}
              >
                {selectedUserData ? "Cancel" : "Reset"}
              </ReusableButton>
              <ReusableButton
                size="small"
                variant="primary"
                onClick={(data) => handleSubmit(handleSave)(data)}
                icon={<Save className="h-4 w-4" />}
              >
                {selectedUserData ? "Update" : "Save"}
              </ReusableButton>
            </div>
          </div>

          {/* Content Grid with Individual Scroll Areas */}
          <div className="flex-1 p-3 overflow-hidden min-h-0  ">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 h-full">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-12 flex flex-col  min-h-0 ">
                <ScrollArea className="flex-1  ">
                  <div className="space-y-6 pr-1">
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="pt-6">
                        <div className="space-y-6">
                          <div className='grid md:grid-cols-2 sm:grid-cols-1 gap-x-3 gap-y-3 '>
                            {
                              fields.map(obj => {
                                if (obj.fieldType === "heading") {
                                  return <h3 key={obj.text} className='text-lg font-semibold text-gray-900 border-b col-span-full pb-2'>{obj.text}</h3>
                                }
                                return (
                                  <div key={obj.name}>
                                    {renderField(obj)}
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;









import { useCallback } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { CardHeader } from '@/components/ui/card';
import { ReusableTable, TableAction, TablePermissions } from '@/components/ui/reusable-table';
import {  Plus, Edit } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';
import { createUser, getCategoryList, getDepartmentList, getRoleNamesList, GetUsersList, updateUser } from '@/services/userServices';
import { USER_DETAILS } from '@/Local_DB/Form_JSON_Data/UserDB';
import { GetBranchListBasedonCompanyId } from '@/services/headerServices';

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
const Positive='border font-medium text-xs px-2 py-0.5 bg-green-50 text-green-700 border-green-200 hover:bg-green-600 hover:text-white transition-colors';
const Negative='border font-medium text-xs px-2 py-0.5 bg-red-50 text-red-700 border-red-200 hover:bg-red-600 hover:text-white transition-colors'
export const User1 = () => {
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
    { id: 'Email', accessorKey: "Email", header: "Email ID" },
    { id: 'PhoneNumber', accessorKey: "PhoneNumber", header: "Mobile Number" },
    { id: 'Status', accessorKey: "Status", header: "Status", cell: ({ row }) => (
      row.original.Deactive ? <Badge title='Status' className={Negative}>Deactive</Badge> : <Badge title='Status' className={Positive}>Active</Badge>
    ) },
    { id: 'IsServiceDesk', accessorKey: "IsServiceDesk", header: "Is Service Desk User",
      cell: ({ row }) => (
        row.original.IsServiceDesk ? <Badge title='Is Service Desk User' className={Positive}>Yes</Badge> : <Badge title='Is Service Desk User' variant="destructive" className={Negative}>No</Badge>
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
              rowHeight="normal" storageKey="user-master-list-table"
              actions={tableActions}
              enableColumnPinning
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// export default User;
