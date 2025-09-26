import { useState, useMemo, useCallback, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReusableTable } from '@/components/ui/reusable-table';
import { RefreshCw, Plus} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ReusableRangePicker from '@/components/ui/reusable-range-picker';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { getAllSRDetailsList } from '@/services/ticketServices';
import { useAppDispatch } from '@/store/reduxStore';
import { setLoading } from '@/store/slices/projectsSlice';
import { Ticket as Request } from '../TicketView';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableButton } from '@/components/ui/reusable-button';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { Controller, useForm } from 'react-hook-form';
import { MyRequest_Filter_DB, workbench_Filter_DB } from '@/Local_DB/Form_JSON_Data/MyWorkbenchandRequestsDB';
import { getRequestTypeById } from '@/_Helper_Functions/HelperFunctions';
import { useAppSelector } from '@/store';
import { useMessage } from '@/components/ui/reusable-message';
interface Filters {
  TicketCategory: string;
  CreatedDate: any[]; // Assuming these are ISO date strings
}
const MyWorkbench = () => {
  const navigate = useNavigate();
  const companyId=useAppSelector(state=>state.projects.companyId);
  const branch=useAppSelector(state=>state.projects.branch) || '';
  const dispatch = useAppDispatch();
  const location=useLocation()
  const { toast } = useToast();
  const msg=useMessage()
  const [dataSource, setDataSource] = useState<Request[]>([]);
  const [dataSourceToShow, setDataSourceToShow] = useState<Request[]>([]);
  const [isMyRequest,setMyRequest]=useState(location.pathname==="/service-desk/my-requests")
  const [fields, setFields] = useState<BaseField[]>(isMyRequest? MyRequest_Filter_DB: workbench_Filter_DB);
  const [filters, setFilters] = useState<Filters>({
    TicketCategory: isMyRequest ? "104" : "101",
    CreatedDate: ["", ""], // Empty strings initially
  });
  const columns = useMemo<ColumnDef<Request>[]>(() => [
    {
      accessorKey: "ServiceRequestNo", header: "Service Request No",
      cell: ({ row }) => (
              <span onClick={()=>{localStorage.setItem("editBranchFromParent", branch)}}> 
              <Link
          to={(isMyRequest) ? `/service-desk/my-requests/tickets/${filters.TicketCategory}/${row.original.ServiceRequestId}` : `/service-desk/my-workbench/tickets/${filters.TicketCategory}/${row.original.ServiceRequestId}`}
          className="text-blue-500"

        >
          {row.getValue('ServiceRequestNo')}
        </Link>
        </span>
      )
    },
    { accessorKey: "Title", header: "Title" },
    {
      accessorKey: "CreatedDate", header: "Created Date",
      cell: ({ row }) => (
        <span>
          {new Date(row.getValue('CreatedDate')).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </span>
      )
    },
    {
      accessorKey: "Severity", header: "Severity",
      cell: ({ row }) => (
        <Badge className={`${getColorForStatus(row.getValue('Severity'))} border font-medium text-xs px-2 py-0.5 transition-colors`}>
          {row.getValue('Severity')}
        </Badge>
      ),
    },
    { accessorKey: "AssignedTo", header: "Assigned To" },
    { accessorKey: "ServiceRequestType", header: "Service Request Type" },
    { accessorKey: "RequestedBy", header: "Requested By" },
    {
      accessorKey: "Priority", header: "Priority",
      cell: ({ row }) => (
        <Badge className={`${getColorForStatus(row.getValue('Priority'))} border font-medium text-xs px-2 py-0.5 transition-colors`}>
          {row.getValue('Priority')}
        </Badge>
      ),
    },
    {
      accessorKey: "Status", header: "Status",
      cell: ({ row }) => (
        <Badge className={`${getColorForStatus(row.getValue('Status'))} border font-medium text-xs px-2 py-0.5 transition-colors`}>
          {row.getValue('Status')}
        </Badge>
      ),
    },
    { accessorKey: "Customer", header: "Customer" },
  ], [filters.TicketCategory,branch]);

  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultValue ?? '';
      return acc;
    }, {} as GenericObject),
  })
  const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;

  const renderField = (field: BaseField) => {
    const { name, label, fieldType, isRequired, show = true } = field;
    if (!name) {
      return null;
    }
    const validationRules = {
      required: isRequired ? `${label} is Required` : false,
    };

    switch (fieldType) {
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
      case 'rangepicker':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableRangePicker
                {...field}
                placeholder={['Start Date', 'End Date']}
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

  useEffect(() => {
    if(companyId && branch){
      fetchAllServiceRequests(getRequestTypeById(filters.TicketCategory), false);
    }
  }, [companyId,branch])
  async function fetchAllServiceRequests(requestType: string, isDateSelected: boolean, filtersCopy?: Filters) {
    dispatch(setLoading(true))
    await getAllSRDetailsList(branch,companyId, requestType).then(res => {
      if (res.success && res.data.status === undefined) {
        if (Array.isArray(res.data)) {
          let getData = res.data.map(item => ({ ...item, AssignedTo: item.AssigneeSelectedUsers || '' + '' + item.AssigneeSelectedUserGroups || '' }))
          setDataSource(getData)
          setDataSourceToShow(getData)
          if (isDateSelected) {
            filterDataSource(getData, filtersCopy)
          }

        } else {
          setDataSource([])
          setDataSourceToShow([])
        }
      } else {
        msg.warning(res.data.message || "No Data Found")
        setDataSource([])
        setDataSourceToShow([])
      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }
  const getColorForStatus = (status: string): string => {
    switch (status) {
      // === Priorities ===
      case 'Low':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-600 hover:text-white';
      case 'Medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-500 hover:text-white';
      case 'High':
        return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-600 hover:text-white';

      // === Service Request Statuses ===
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white';
      case 'Resolved':
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-600 hover:text-white';
      case 'Re-Open':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white';
      case 'Hold':
        return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-500 hover:text-white';
      case 'Open':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-600 hover:text-white';
      case 'Closed':
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-600 hover:text-white';

      // === Default ===
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-600 hover:text-white';
    }
  };
  // Enhanced action handlers with audit trail
  const handleRefresh = useCallback(() => {
    setFilters({
      TicketCategory:isMyRequest?"104": "101",
      CreatedDate: ["", ""], // Empty strings initially
    })
    form.reset({
      defaultValues: {
        TicketCategory:isMyRequest?"104": "101",
        CreatedDate: "", // Empty strings initially
      }
    })
    fetchAllServiceRequests(getRequestTypeById( isMyRequest?"104": "101"), false);
    toast({
      title: "Data Refreshed",
      description: "Service Requests data has been updated",
    });
  }, [toast, filters]);
  //handle change
  const onSubmit = (value: any) => {
    let filtersCopy = structuredClone(filters);
    if (value.CreatedDate) {
      let datearr = []
      const startDate = value.CreatedDate.from
      const endDate = value.CreatedDate.to
      datearr.push(startDate)
      datearr.push(endDate)
      filtersCopy["CreatedDate"] = datearr
    } else {
      filtersCopy["CreatedDate"] = []
    }
    if (value.TicketCategory) {
      filtersCopy["TicketCategory"] = value.TicketCategory
    }
    if (value.TicketCategory !== filters.TicketCategory) {
      fetchAllServiceRequests(getRequestTypeById(filtersCopy.TicketCategory), true, filtersCopy);
    } else {
      filterDataSource(dataSource, filtersCopy)
    }
    setFilters(filtersCopy)
  };
  const normalizeDate = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };
  const filterDataSource = (dataSource: any[], filters: Filters): void => {
    const filteredDataSource = dataSource.filter((obj) => {
      return Object.keys(filters).every((key) => {
        if (key === "CreatedDate") {
          const [startStr, endStr] = filters[key];
          if (!startStr && !endStr) return true; // No filter applied
          const startDate = normalizeDate(new Date(startStr));
          const endDate = normalizeDate(new Date(endStr));
          const objDate = normalizeDate(new Date(obj["CreatedDate"].substring(0, 10)));
          return startStr && endStr
            ? startDate! <= objDate && objDate <= endDate!
            : startStr ? objDate >= startDate! : objDate <= endDate!;
        } else {
          return true
        }
      });
    });
    setDataSourceToShow(filteredDataSource);
  };

  return (
    <div className="h-full overflow-y-scroll bg-gray-50/30">
      <div className="p-4 sm:p-4 space-y-4 sm:space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{isMyRequest ? "My Requests" : "My Workbench"}</h1>
            {/* <p className="text-gray-600 mt-1 text-sm sm:text-base">View and manage all your service requests in one place</p> */}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={handleRefresh} className="flex-1 sm:flex-none">
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden">Refresh</span>
            </Button>
            <Button size="sm" onClick={() => navigate('/service-desk/create-ticket')} className="flex-1 sm:flex-none">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="hidden sm:inline">New Service Request</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>
        <div>
          <Card>
            <CardTitle className="text-lg flex px-6 py-1 pt-2 items-center gap-2">
              {"Filters"}
            </CardTitle>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {
                    fields.map((field) => (
                      <div key={field.name}>
                        {renderField(field)}
                      </div>))
                  }
                  <div className="flex items-center xxs:mt-1 xs2:mt-2 sm:mt-6 md:mt-6" >
                    <ReusableButton size={"middle"} htmlType='submit' variant="primary" className='h-9 mt-1'>Search</ReusableButton>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="bg-white p-6 rounded-lg">
          <ScrollArea className=" w-full ">
            <ReusableTable data={dataSourceToShow} columns={columns} enableExport={false} />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default MyWorkbench;