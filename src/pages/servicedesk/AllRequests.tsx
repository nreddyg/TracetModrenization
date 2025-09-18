import { useState, useMemo, useCallback, useEffect } from 'react';
import {ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardTitle} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReusableTable} from '@/components/ui/reusable-table';
import { Users,Package,RefreshCw,Plus,AlertTriangle,CheckCircle} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import  ReusableRangePicker  from '@/components/ui/reusable-range-picker';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { getAllSRDetailsList } from '@/services/ticketServices';
import { useAppDispatch } from '@/store/reduxStore';
import { setLoading } from '@/store/slices/projectsSlice';
import { Ticket as Request } from '../TicketView';
import { ReusableButton } from '@/components/ui/reusable-button';
import { useAppSelector } from '@/store';
import { useMessage } from '@/components/ui/reusable-message';

const AllRequests = () => {
  const navigate=useNavigate();
  const companyId=useAppSelector(state=>state.projects.companyId);
  const branch=useAppSelector(state=>state.projects.branch);
  const dispatch=useAppDispatch();
  const { toast } = useToast();
  const msg=useMessage();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [columns,setColumns]=useState<ColumnDef<Request>[]>([
    {accessorKey: "ServiceRequestNo", header: "Service Request No",
      cell:({row})=>(
        <Link to={`/service-desk/all-requests/tickets/106/${row.original.ServiceRequestId}`} className='text-blue-500 '>
          {row.getValue('ServiceRequestNo')}
        </Link>
      )
    },
    {accessorKey: "Title", header: "Title"},
    {accessorKey: "CreatedDate", header: "Created Date",
      cell: ({ row }) => (
        <span>
         {new Date(row.getValue('CreatedDate')).toLocaleDateString('en-GB', {day: '2-digit',month: '2-digit',year: 'numeric'})}
        </span>
      )
    },
    {accessorKey: "Severity", header: "Severity",
      cell: ({ row }) => (
        <Badge className={`${getColorForStatus(row.getValue('Severity'))} border font-medium text-xs px-2 py-0.5 transition-colors`}>
          {row.getValue('Severity')}
        </Badge>
        ),
    },
    {accessorKey: "AssignedTo", header: "Assigned To"},
    {accessorKey: "ServiceRequestType", header: "Service Request Type"},
    {accessorKey: "RequestedBy", header: "Requested By"},
    {accessorKey: "Priority", header: "Priority",
      cell: ({ row }) => (
        <Badge className={`${getColorForStatus(row.getValue('Priority'))} border font-medium text-xs px-2 py-0.5 transition-colors`}>
          {row.getValue('Priority')}
        </Badge>
        ),
    },
    {accessorKey: "Status", header: "Status",
      cell: ({ row }) => (
        <Badge className={`${getColorForStatus(row.getValue('Status'))} border font-medium text-xs px-2 py-0.5 transition-colors`}>
          {row.getValue('Status')}
        </Badge>
      ),
    },
    {accessorKey: "Customer", header: "Customer"},
  ]);
  // Stats calculations
  const stats = useMemo(() => {
    const InProgressTicketsCount = requests.filter(req => req.Status === 'In Progress').length;
    const ResolvedTicketsCount = requests.filter(req => req.Status === 'Resolved').length;
    const ClosedTicketsCount = requests.filter(req => req.Status === 'Closed').length;
    const PendingTicketsCount = requests.filter(req => req.Status === 'Pending').length;
    const OpenTicketsCount = requests.filter(req => req.Status === 'Open').length;
    return {
      InProgressTicketsCount,ResolvedTicketsCount,ClosedTicketsCount,PendingTicketsCount,
      OpenTicketsCount,totalRequests: requests.length
    };
  }, [requests]);
  useEffect(()=>{
    if(companyId && branch){
      fetchAllServiceRequests();
      setDateRange({ from: undefined, to: undefined });
    }
  },[companyId,branch])
  // Enhanced action handlers with audit trail
  const handleRefresh = useCallback(() => {
    setDateRange({ from: undefined, to: undefined });
    if(companyId){
      fetchAllServiceRequests()
      toast({title: "Data Refreshed",description: "All Service Requests data has been updated",});
    }
  },[toast]);
  //fetch all tickets
  async function fetchAllServiceRequests() {
      dispatch(setLoading(true))
      await getAllSRDetailsList(branch, companyId, 'All').then(res => {
        if (res.success && res.data.status === undefined) {
          if (Array.isArray(res.data)) {
            let data = res.data.map(item => ({
              ...item,
              AssignedTo: (item.AssigneeSelectedUsers ?? '') + (item.AssigneeSelectedUserGroups ?? '')
            }));
            setRequests([...data].reverse());
            setFilteredRequests([...data].reverse());
          } else {
            setRequests([]);
            setFilteredRequests([]);
          }
        } else {
            msg.warning(res.data.message || "No Data Found");
            setRequests([]);
            setFilteredRequests([]);
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
  //handle change
  const handleChange = (value: any) => {
    if(value){
      setDateRange(value);
    }else{
      setDateRange({from:undefined,to:undefined});
    }
  };
  const normalizeDate = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };
  //handle search
  const handleSearch = (): void => {
    const filteredDataSource = requests.filter((obj) => {
      const { from, to } = dateRange;
      if (!from && !to) return true;
      const objDate = normalizeDate(new Date(obj["CreatedDate"].substring(0, 10)));
      const startDate = from ? normalizeDate(new Date(from)) : null;
      const endDate = to ? normalizeDate(new Date(to)) : null;
      return from && to
        ? startDate! <= objDate && objDate <= endDate!
        : from ? objDate >= startDate! : objDate <= endDate!;
    });
    setFilteredRequests(filteredDataSource);
  };

  return (
    <div className="h-full overflow-y-scroll bg-gray-50/30">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">All Service Requests</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">View and manage all your service requests in one place</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={handleRefresh} className="flex-1 sm:flex-none">
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden">Refresh</span>
            </Button>
            <Button size="sm" onClick={()=>navigate('/service-desk/create-ticket')} className="flex-1 sm:flex-none">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="hidden sm:inline">New Service Request</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">

          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-blue-600 mb-1">Total Tickets</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">{stats.totalRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100/50">
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-red-600 mb-1">Open</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900">{stats.OpenTicketsCount}</p>
                </div>
                <div className="p-2 sm:p-3 bg-red-500 rounded-lg">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/50">
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-amber-600 mb-1">In Progress</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-900">{stats.InProgressTicketsCount}</p>
                </div>
                <div className="p-2 sm:p-3 bg-amber-500 rounded-lg">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-purple-600 mb-1">Resolved</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900">{stats.ResolvedTicketsCount}</p>
                </div>
                <div className="p-2 sm:p-3 bg-purple-500 rounded-lg">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50">
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-emerald-600 mb-1">Closed</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-900">{stats.ClosedTicketsCount}</p>
                </div>
                <div className="p-2 sm:p-3 bg-emerald-500 rounded-lg">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardTitle className="text-lg flex px-6 py-1 pt-2 items-center gap-2">{"Filters"}</CardTitle>
            <CardContent>
              <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <ReusableRangePicker
                        label='Date Range'
                        tooltip='Select a date range'
                        value={dateRange}
                        onChange={(value) => handleChange(value)}
                        className=''
                        placeholder={['From Date', 'To Date']}
                        allowClear={true}
                        format='DD/MM/YYYY'
                      />
                  <div className="flex items-end mt-4  ">
                  <ReusableButton  size={"middle"} onClick={handleSearch} variant="primary" className='h-10'>Search</ReusableButton>
                  </div>
              </div>     
            </CardContent>
          </Card>
        </div>
        <div className="bg-white p-6 rounded-lg">
          <ScrollArea className=" w-full ">
            <ReusableTable data={filteredRequests} columns={columns} enableExport={false}/>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default AllRequests;