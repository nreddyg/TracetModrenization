
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ReusableTable, TableAction, TablePermissions } from '@/components/ui/reusable-table';
import { Edit2, Trash2, Plus, Edit } from 'lucide-react';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLoading } from '@/store/slices/projectsSlice';
import { GetCustomersList } from '@/services/customerServices';
import { useToast } from '@/hooks/use-toast';

interface CustomerData {
  CustomerID: Number,
  CustomerName: string,
  CustomerTypeID: number,
  CustomerType: string,
  PAN: string,
  GSTIN: string,
  AddOnAddressID: 12350,
  AddOnAddress: string,
  City: string,
  State: string,
  Country: string,
  ZipCode: string,
  PhoneNo: string,
  MobileNo: string,
  EmailId: string,
  MainLocationId: 0,
  MainLocation: string,
  SubLocationId: 0,
  SubLocation: string,
  Description: string,
  ContactPerson: string,
  BillingAddress: string,
  BranchName: string,
  Attachment1: string,
  Attachment2: string,
  Attachment3: string
}
interface OrganizationData {
  id: string;
  assetCode: string;
  assetName: string;
  customerAssetNo: string;
  barcodeNo: string;
  acquisition: 'Purchased' | 'Leased';
}

const mockData: OrganizationData[] = [
  {
    id: '1',
    assetCode: 'AI/904/924/000128',
    assetName: 'Test Mob2',
    customerAssetNo: 'wer23r32r_1',
    barcodeNo: 'AI/904/924/000128',
    acquisition: 'Purchased'
  },
  {
    id: '2',
    assetCode: 'AI/904/111/000002',
    assetName: 'Test Mob',
    customerAssetNo: 'gsdrg_2',
    barcodeNo: 'AI/904/111/000002',
    acquisition: 'Purchased'
  },
  {
    id: '3',
    assetCode: 'AI/904/111/000001',
    assetName: 'Test Mob',
    customerAssetNo: 'gsdrg_1',
    barcodeNo: 'AI/904/111/000001',
    acquisition: 'Purchased'
  },
  {
    id: '4',
    assetCode: 'AI/IT/LP/000002',
    assetName: 'Printer',
    customerAssetNo: '123456',
    barcodeNo: '123456',
    acquisition: 'Leased'
  },
  {
    id: '5',
    assetCode: 'ITC/IT/TB/000001',
    assetName: 'Tablet',
    customerAssetNo: 'ITC/IT/TB/000001',
    barcodeNo: '3600001586',
    acquisition: 'Purchased'
  },
  {
    id: '6',
    assetCode: 'ITC/IT/COM/000003',
    assetName: 'COMPUTER',
    customerAssetNo: 'ITC/IT/COM/000003',
    barcodeNo: '3800001751',
    acquisition: 'Purchased'
  },
  {
    id: '7',
    assetCode: 'ITC/IT/COM/000002',
    assetName: 'COMPUTER',
    customerAssetNo: 'ITC/IT/COM/000002',
    barcodeNo: '3800008370',
    acquisition: 'Purchased'
  },
];

  const CustomerColumns = [
    { id: 'CustomerName', accessorKey: "CustomerName", header: "Customer Name" },
    { id: 'EmailId', accessorKey: "EmailId", header: "Email Id" },
    { id: 'MobileNo', accessorKey: "MobileNo", header: "MobileNo" },
    { id: 'FirstName', accessorKey: "FirstName", header: "First Name" },
  ]
const Customer = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const companyId = useAppSelector(state => state.projects.companyId)
  const branchName = useAppSelector(state => state.projects.branch);
  const { toast } = useToast();
  const itemsPerPage = 7;
  const [dataSource, setDataSource] = useState<CustomerData[]>([]);
  const [columns, setColumns] = useState<ColumnDef<CustomerData>[]>(CustomerColumns);
  const dispatch = useAppDispatch();

  const toggleSelectAll = () => {
    if (selectedItems.length === mockData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(mockData.map(item => item.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    if (companyId && branchName) {
      fetchAllCustomerList();
    }
  }, [companyId, branchName])

  const fetchAllCustomerList = async () => {
    dispatch(setLoading(true));
    await GetCustomersList(companyId, branchName).then(res => {
      if (res.data && res.data.Customers.length > 0) {
        setDataSource(res.data.Customers);
      } else {
        setDataSource([]);
      }
    }).catch(err => console.log(err)).finally(() => {
      dispatch(setLoading(false));
    });
  }
  console.log("dataSource", dataSource);

  const handleDelete = (data: CustomerData): void => {
  }
  const handleEdit = (data: CustomerData): void => {
  }
  const tableActions: TableAction<CustomerData>[] = [
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
    fetchAllCustomerList();
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
            <span>Masters</span>
            <span>/</span>
            <span>Company</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Customer</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <ReusableButton
            htmlType="button"
            variant="default"
            onClick={null}
            iconPosition="left"
            size="middle"
            className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
          >
            <div className='flex items-center'><Plus className="h-4 w-4 mr-2" />Add Customer</div>
          </ReusableButton>
        </div>
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
          </CardHeader>
          <CardContent>
            <ReusableTable
              data={dataSource} columns={columns}
              // permissions={""}
              permissions={tablePermissions}
              title="Customers List"
              onRefresh={handleRefresh}
              enableSearch={true}
              enableSelection={false}
              enableExport={true}
              enableColumnVisibility={true}
              enablePagination={true}
              enableSorting={true}
              enableFiltering={true}
              pageSize={10}
              emptyMessage="No Data found"
              rowHeight="normal"
              storageKey="service-request-type-list-table"
              actions={tableActions}
              enableColumnPinning
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Customer;
