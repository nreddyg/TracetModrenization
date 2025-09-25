import { useState, useEffect, useMemo } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, X, BarChart3 } from 'lucide-react';
import TicketGraphsView from '@/components/tickets/TicketGraphsView';
import { Form } from '@/components/ui/form';
import { Controller, useForm } from 'react-hook-form';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { TICKET_PROGRESS_DB } from '@/Local_DB/Form_JSON_Data/TicketProgressDashBoardDB';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import { ReusableMultiSelect } from '@/components/ui/reusable-multi-select';
import { ReusableButton } from '@/components/ui/reusable-button';
import { GetServiceRequestAssignToLookups, getStatusLookups, ServiceRequestTypeLookups } from '@/services/ticketServices';
import { useAppDispatch, useAppSelector } from '@/store';
import { getAnalyticsData } from '@/services/ticketProgressDashboardServices';
import { setLoading } from '@/store/slices/projectsSlice';


const TicketProgressDashboard = () => {
  const dispatch = useAppDispatch();
  const roleName = JSON.parse(localStorage.getItem('LoggedInUser'))?.RoleName;
  const [fields, setFields] = useState(TICKET_PROGRESS_DB);
  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultValue ?? ''
      return acc;
    }, {} as GenericObject),
  });
  const { control, register, handleSubmit, trigger, watch, setValue, getValues, reset, formState: { errors } } = form;
  const [activeView, setActiveView] = useState('graphs');
  const companyId = useAppSelector(state => state.projects.companyId);
  const branchName = useAppSelector(state => state.projects.branch);
  const branchId = useAppSelector(state => state.projects.branchId);
  const [analyticsData, setAnalyticsData] = useState({
    TicketsByStatusData: [], StatusByGroups: [], CreatedVsClosed: [], TicketsHandledPerAgent: [],
    TicketsByIssueType: [], TicketsByPriority: [], OpenHighPriorityTickets: [], ReOpenTrend: []
  })
  function getColor(type: string) {
    switch (type) {
      case 'Open':
        return '#3b82f6'
      case 'In Progress':
        return '#f97316'
      case 'Resolved':
        return '#22c55e'
      case 'Closed':
        return '#6b7280'
      case 'Low':
        return '#16a34a'
      case 'Medium':
        return '#ca8a04'
      case 'High':
        return '#ea580c'
      default:
        return '#eaf916ff'
    }

  }
  //helper function
  function generateData(data: any, type: string) {
    switch (type) {
      case 'pie':
        return data.length !== 0 ? Object.keys(data[0]).map(key => ({ name: key, value: data[0][key], color: getColor(key) })) : []
      case 'createdvsclosed':
        return data.length !== 0 ? data.map(obj => ({ ...obj, created: parseInt(obj.created), closed: parseInt(obj.closed) })) : []
      case 'issuetype':
        return data.length !== 0 ? Object.keys(key => ({ name: key, count: data[0][key] })) : []
      case 'priority':
        return data.length !== 0 ? Object.keys(key => ({ name: key, vaalue: data[0][key], color: getColor(key) })) : []
      default:
        return data
    }
  }
  const clearAllFilters = () => {
    form.reset();
  };
  const payload = useMemo(() => ({
    FiltersPayloadDetails: [
      {
        projectids: "",
        statusids: watch("Status"),
        categoryids: watch("ServiceRequestType"),
        startdate: watch("StartDate"),
        enddate: watch("EndDate"),
        assigneeids: watch("Assignees").join(),
        usergroupids: watch("UserGroups").join(),
      },
    ],
  }), [watch, form]);
  const fetchAnalyticsData = async () => {
    try {
      dispatch(setLoading(true));

      const results = await Promise.allSettled([
        getAnalyticsData(companyId, branchId, 'statuspie', payload),
        getAnalyticsData(companyId, branchId, 'createdvsclosedbar', payload),
        getAnalyticsData(companyId, branchId, 'handledperagentbar', payload),
        getAnalyticsData(companyId, branchId, 'issuetypebar', payload),
        getAnalyticsData(companyId, branchId, 'prioritybar', payload),
        getAnalyticsData(companyId, branchId, 'openhighprioritybar', payload),
        getAnalyticsData(companyId, branchId, 'reopenratetrendbar', payload),
      ]);

      const [
        TicketsByStatusData,
        CreatedVsClosed,
        TicketsHandledPerAgent,
        TicketsByIssueType,
        TicketsByPriority,
        OpenHighPriorityTickets,
        ReOpenTrend
      ] = results;

      let allChartsData = {
        TicketsByStatusData:
          TicketsByStatusData.status === "fulfilled"
            ? generateData(TicketsByStatusData.value?.data?.data ?? [], "pie")
            : [],

        CreatedVsClosed:
          CreatedVsClosed.status === "fulfilled"
            ? generateData(CreatedVsClosed.value?.data?.data ?? [], "createdvsclosed")
            : [],

        TicketsHandledPerAgent:
          TicketsHandledPerAgent.status === "fulfilled"
            ? TicketsHandledPerAgent.value?.data?.data ?? []
            : [],

        TicketsByIssueType:
          TicketsByIssueType.status === "fulfilled"
            ? generateData(TicketsByIssueType.value?.data?.data ?? [], "issuetype")
            : [],

        TicketsByPriority:
          TicketsByPriority.status === "fulfilled"
            ? generateData(TicketsByPriority.value?.data?.data ?? [], "priority")
            : [],

        OpenHighPriorityTickets:
          OpenHighPriorityTickets.status === "fulfilled"
            ? OpenHighPriorityTickets.value?.data?.data ?? []
            : [],

        ReOpenTrend:
          ReOpenTrend.status === "fulfilled"
            ? ReOpenTrend.value?.data?.data ?? []
            : []
      };

      setAnalyticsData({ ...allChartsData, StatusByGroups: [] });
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };
  const userGroups = watch("UserGroups");
  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      await getAnalyticsData(companyId, branchId, "statusgrouppie", payload).then(res => {
        if (res.success && res.data && res.data.data) {
          setAnalyticsData(prev => ({ ...prev, StatusByGroups: generateData(res.data.data, 'pie') }))
        } else {
          setAnalyticsData(prev => ({ ...prev, StatusByGroups: [] }))
        }
      }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
    };
    if (userGroups) {
      fetchData();
    }
  }, [userGroups]);
  useEffect(() => {
    if (companyId && branchId && branchName) fetchAllLookupsAndChartsData();
  }, [companyId, branchId, branchName])
  //store lookups data in json
  const setLookupsDataInJson = (lookupsData: any): void => {
    const arr = Object.keys(lookupsData)
    const opts: { [key: string]: any } = {}
    arr.forEach((obj) => {
      let ret = []
      ret = lookupsData[obj].data.map(element => {
        return { label: element[lookupsData[obj].label], value: element[lookupsData[obj].value] }
      });
      opts[obj] = ret
    })
    const data = structuredClone(fields);
    data.forEach(obj => {
      if (arr.includes(obj.name)) {
        obj.options = opts[obj.name]
      }
    })
    setFields(data);
  }
  const getSettledValue = (result, path, fallback = []) => {
    if (result.status !== "fulfilled") return fallback;
    return path?.split(".").reduce((acc, key) => acc?.[key], result.value) ?? fallback;
  };
  //all lookups data api calls
  const fetchAllLookupsAndChartsData = async () => {
    dispatch(setLoading(true));
    let payload = {
      FiltersPayloadDetails: [
        {projectids: "",statusids: "",categoryids: "",startdate: "",enddate: "",assigneeids: "",usergroupids: ""}
      ]
    };
    try {
      const [statusValues,assigneesValues,serviceRequestTypeValues,TicketsByStatusData,CreatedVsClosed,
        TicketsHandledPerAgent,TicketsByIssueType,TicketsByPriority,OpenHighPriorityTickets,ReOpenTrend
      ] = await Promise.allSettled([
        getStatusLookups(companyId),
        GetServiceRequestAssignToLookups(companyId, branchName),
        ServiceRequestTypeLookups(companyId, branchId),
        getAnalyticsData(companyId, branchId, "statuspie", payload),
        getAnalyticsData(companyId, branchId, "createdvsclosedbar", payload),
        getAnalyticsData(companyId, branchId, "handledperagentbar", payload),
        getAnalyticsData(companyId, branchId, "issuetypebar", payload),
        getAnalyticsData(companyId, branchId, "prioritybar", payload),
        getAnalyticsData(companyId, branchId, "openhighprioritybar", payload),
        getAnalyticsData(companyId, branchId, "reopenratetrendbar", payload)
      ]);
      let allLookupsData = {
        Status: {data: getSettledValue(statusValues, "data.ServiceRequestStatusLookup"),label: "ServiceRequestStatusName",value: "ServiceRequestStatusId"},
        Assignees: {data: getSettledValue(assigneesValues, "data.ServiceRequestAssignToUsersLookup"),label: "UserName",value: "UserId"},
        ServiceRequestType: {data: getSettledValue(serviceRequestTypeValues, "data.ServiceRequestTypesLookup"),label: "ServiceRequestTypeName",value: "ServiceRequestTypeId"},
        UserGroups: {data: getSettledValue(assigneesValues, "data.ServiceRequestAssignToUserGroupLookup"),label: "UserGroupName",value: "UserGroupId"}
      };
      setLookupsDataInJson(allLookupsData);
      let allChartsData = {
        TicketsByStatusData: generateData(getSettledValue(TicketsByStatusData, "data.data"),"pie"),
        CreatedVsClosed: generateData(getSettledValue(CreatedVsClosed,"data.data"),"createdvsclosed"),
        TicketsHandledPerAgent: getSettledValue(TicketsHandledPerAgent,"data.data"),
        TicketsByIssueType: generateData(getSettledValue(TicketsByIssueType, "data.data"),"issuetype"),
        TicketsByPriority: generateData(getSettledValue(TicketsByPriority, "data.data"),"priority"),
        OpenHighPriorityTickets: getSettledValue(OpenHighPriorityTickets,"data.data"),
        ReOpenTrend: getSettledValue(ReOpenTrend, "data.data")
      };

      setAnalyticsData({ ...allChartsData, StatusByGroups: [] });
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  //search data by using filters
  const handleSearch = () => {
    fetchAnalyticsData();
  }
  //render fields based on field type
  const renderField = (field: BaseField) => {
    const { name, label, fieldType, isRequired, show = true } = field;
    if (!name || !show || (roleName !== 'Root Admin' && name === 'Assignees')) return null;
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

  return (
    <div className="h-full overflow-y-scroll bg-gray-50">
      <header className="bg-white border-b px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <SidebarTrigger />
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Ticket Progress Dashboard</h1>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        {/* Enhanced Filters Section */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Dashboard Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            <Form {...form}>
              <form onSubmit={form.handleSubmit(() => { })} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getFieldsByNames(['Status', 'ServiceRequestType', 'Assignees', 'StartDate', 'EndDate']).map(renderField)}
                </div>
                {/* Action Buttons */}
                <div className='flex justify-between items-center'>
                  <div className="flex gap-3">
                    <ReusableButton
                      htmlType="submit"
                      variant="default"
                      className="bg-orange-500 border-orange-500 text-white hover:bg-orange-600 hover:border-orange-600 hover:text-white"
                      // icon={<Save className="h-4 w-4" />}
                      iconPosition="left"
                      onClick={handleSearch}
                    >
                      Search
                    </ReusableButton>
                    <ReusableButton
                      htmlType="button"
                      variant="default"
                      onClick={clearAllFilters}
                      className="border-orange-500 text-orange-500 hover:bg-orange-50"
                      icon={<X className="h-4 w-4" />}
                      iconPosition="left"
                    >
                      Clear Filters
                    </ReusableButton>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Main Content with Tabs */}
        <Card>
          <CardHeader>
            <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-auto">

                <TabsTrigger value="graphs" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2">
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Analytics Dashboard</span>
                  <span className="sm:hidden">Analytics</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs value={activeView} className="w-full">
              <TabsContent value="graphs">
                <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-6 mb-4">
                  {getFieldsByNames(['UserGroups']).map(renderField)}
                </div>
                <TicketGraphsView data={analyticsData} groupsPie={watch('UserGroups')} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketProgressDashboard;
