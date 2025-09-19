
import { useCallback, useEffect, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ReusableTable, TableAction, TablePermissions } from '@/components/ui/reusable-table';
import { Trash2, Plus, Edit } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';
import { ReusableButton } from '@/components/ui/reusable-button';
import { GetUsersList } from '@/services/userServices';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLoading } from '@/store/slices/projectsSlice';
import { GetOrganizationsList } from '@/services/organizationServices';
interface OrganizationData {
  OrganizationId: number,
  OrganizationName: string,
  ParentId: number | null,
  OrganizationKnownAs:string,
  CompanyCode: string,
  OrganizationTypeId: number,
  OrganizationType: string,
  OrganizationDomain: string | null,
  PanNumber: string,
  AddressLine1: string,
  AddressLine2: string | null,
  City: string,
  State: string,
  CountryID: number,
  CountryName: string,
  ZipCode: string,
  OrganizationEmail: string,
  OrganizationPhone: string,
  Website: string | null,
  CurrencyId: number,
  Currency: string,
  CurrencySymbol:string,
  OrganizationLogo: string | null,
  OrganizationLogoName:  string | null,
  OrganizationLogoType:  string | null,
  OrganizationLogoConversionType: string | null
}

const Organization = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const companyId = useAppSelector(state => state.projects.companyId)
  const [dataSource, setDataSource] = useState<OrganizationData[]>([]);
  const [columns, setColumns] = useState<ColumnDef<OrganizationData>[]>([
    { id: 'OrganizationName', accessorKey: "OrganizationName", header: "Organization Name" },
    { id: 'CompanyCode', accessorKey: "CompanyCode", header: "Company Code" },
    { id: 'OrganizationKnownAs', accessorKey: "OrganizationKnownAs", header: "Known As" },
    { id:'City', accessorKey:"City", header:"City" },
    { id:'State', accessorKey:"State", header:"State" },   
  ])

  useEffect(() => {
    if (companyId) fetchAllOrganizationsList();
  }, [companyId]);
  //fetch all users list
  const fetchAllOrganizationsList = async () => {
    dispatch(setLoading(true));
    await GetOrganizationsList(companyId).then(res => {
      if (res.success && res.data && res.data.organizations && Array.isArray(res.data.organizations)) {
        setDataSource(res.data.organizations);
      }else{
        setDataSource([]);
      }
    }).catch(err => console.log(err)).finally(() => {
      dispatch(setLoading(false));
    });
  }
  const handleDelete = (data: OrganizationData): void => {
  }
  const handleEdit = (data: OrganizationData): void => {
  }
  const tableActions: TableAction<OrganizationData>[] = [
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
      toast({ title: "Data Refreshed", description: "All organizations data has been updated", });
      fetchAllOrganizationsList();
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
            <span>Masters</span><span>/</span><span>Company</span><span>/</span><span className="text-gray-900 font-medium">Organization</span>
          </div>
        </div>
      </header>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <ReusableButton
            htmlType="button"
            variant="default"
            onClick={null}
            iconPosition="left"
            size="middle"
            className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
          >
            <div className='flex items-center'><Plus className="h-4 w-4 mr-2" />Add Organization</div>
          </ReusableButton>
        </div>
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
          </CardHeader>
          <CardContent>
            <ReusableTable
              data={dataSource} columns={columns}
              permissions={tablePermissions}
              title="Organization List"
              onRefresh={handleRefresh} enableSearch={true}
              enableSelection={false} enableExport={true}
              enableColumnVisibility={true} enablePagination={true}
              enableSorting={true} enableFiltering={true}
              pageSize={10} emptyMessage="No Data found"
              rowHeight="normal" storageKey="organization-master-list-table"
              actions={tableActions}
              enableColumnPinning
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Organization;
