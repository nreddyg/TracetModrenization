
import { useCallback, useEffect, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ReusableTable, TableAction, TablePermissions } from '@/components/ui/reusable-table';
import { Trash2, Plus, Edit } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';
import { ReusableButton } from '@/components/ui/reusable-button';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLoading } from '@/store/slices/projectsSlice';
import { GetVendorList } from '@/services/vendorServices';
interface VendorData {
   VendorID: number,
   VendorName: string,
   VendorTypeID: number,
   VendorType: string,
   VendorCode: string,
   PanNo: string | null,
   GSTIN: string | null,
   AddressID: number,
   Address: string | null,
   City: string | null,
   State: string | null,
   Country:string | null,
   ZipCode: string | null,
   Phone: string | null,
   Mobile: string | null,
   VendorEmailId: string | null,
   Description: string | null,
   ContactPerson: string | null,
}

const Vendor = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const companyId = useAppSelector(state => state.projects.companyId)
  const [dataSource, setDataSource] = useState<VendorData[]>([]);
  const [columns, setColumns] = useState<ColumnDef<VendorData>[]>([
    { id: 'VendorName', accessorKey: "VendorName", header: "Vendor Name" },
    { id: 'VendorType', accessorKey: "VendorType", header: "Vendor Type" },
    { id: 'VendorCode', accessorKey: "VendorCode", header: "Vendor Code" },
    { id: 'PanNo', accessorKey: "PanNo", header: "Reg / PAN" },
    { id: 'GSTIN', accessorKey: "GSTIN", header: "GSTIN / UIN" },
    { id: 'Address', accessorKey: "Address", header: "Address" },
    { id: 'City', accessorKey: "City", header: "City" },
    { id: 'State', accessorKey: "State", header: "State" },
    { id: 'Country', accessorKey: "Country", header: "Country" },
    { id: 'ZipCode', accessorKey: "ZipCode", header: "ZipCode" },
    { id: 'VendorEmailId', accessorKey: "VendorEmailId", header: "Email ID" },
    { id: 'ContactPerson', accessorKey: "ContactPerson", header: "Contact Person" },
    { id: 'Phone', accessorKey: "Phone", header: "Phone Number" },
    { id: 'Description', accessorKey: "Description", header: "Description" },
  ])

  useEffect(() => {
    if (companyId) fetchAllVendorsList();
  }, [companyId]);
  //fetch all vendors list
  const fetchAllVendorsList = async () => {
    dispatch(setLoading(true));
    await GetVendorList(companyId).then(res => {
      if (res.success && res.data && res.data.Vendors && Array.isArray(res.data.Vendors)) {
        setDataSource(res.data.Vendors);
      }else{
        setDataSource([]);
      }
    }).catch(err => console.log(err)).finally(() => {
      dispatch(setLoading(false));
    });
  }
  const handleDelete = (data: VendorData): void => {
  }
  const handleEdit = (data: VendorData): void => {
  }
  const tableActions: TableAction<VendorData>[] = [
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
      toast({ title: "Data Refreshed", description: "All vendors data has been updated", });
      fetchAllVendorsList();
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
          <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
          <ReusableButton
            htmlType="button"
            variant="default"
            onClick={null}
            iconPosition="left"
            size="middle"
            className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
          >
            <div className='flex items-center'><Plus className="h-4 w-4 mr-2" />Add Vendor</div>
          </ReusableButton>
        </div>
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
          </CardHeader>
          <CardContent>
            <ReusableTable
              data={dataSource} columns={columns}
              permissions={tablePermissions}
              title="Vendors List"
              onRefresh={handleRefresh} enableSearch={true}
              enableSelection={false} enableExport={true}
              enableColumnVisibility={true} enablePagination={true}
              enableSorting={true} enableFiltering={true}
              pageSize={10} emptyMessage="No Data found"
              rowHeight="normal" storageKey="vendor-master-list-table"
              actions={tableActions}
              enableColumnPinning
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Vendor;
