import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, X, BarChart3, Search } from 'lucide-react';
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
import { formatDate } from '@/_Helper_Functions/HelperFunctions';
import { FaAngleRight } from 'react-icons/fa';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const TicketProgressDashboard = () => {
  const dispatch = useAppDispatch();
  const roleName = JSON.parse(localStorage.getItem('LoggedInUser'))?.RoleName;
  const [fields, setFields] = useState(TICKET_PROGRESS_DB);
  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultValue ?? ''
      return acc;
    }, {} as GenericObject),
    mode: 'onChange',
    reValidateMode: "onChange"
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
        return '#ffa000'
      case 'High':
        return '#f70000'
      default:
        return '#eaf916ff'
    }

  }
  function generateHSLColor(index: number, total: number): string {
    const hue = Math.floor((360 / total) * index); // Spread hues evenly
    return `hsl(${hue}, 70%, 60%)`; // Keep saturation and lightness constant
  }
  //helper function
  function generateData(data: any, type: string) {
    switch (type) {
      case 'pie':
        return data.length !== 0 ? Object.keys(data[0]).map((key, index) => ({ name: key, value: data[0][key], color: generateHSLColor(index, Object.keys(data[0]).length) })) : []
      case 'createdvsclosed':
        return data.length !== 0 ? data.map(obj => ({ ...obj, created: parseInt(obj.created), closed: parseInt(obj.closed) })) : []
      case 'issuetype':
        return data.length !== 0 ? Object.keys(data[0]).map(key => ({ name: key, count: data[0][key] })) : []
      case 'priority':
        return data.length !== 0 ? Object.keys(data[0]).map(key => ({ name: key, count: data[0][key], color: getColor(key) })) : []
      default:
        return data
    }
  }
  const clearAllFilters = () => {
    form.reset();
  };
  const fetchAnalyticsData = async (payload: any) => {
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
      const [TicketsByStatusData, CreatedVsClosed, TicketsHandledPerAgent, TicketsByIssueType, TicketsByPriority,
        OpenHighPriorityTickets, ReOpenTrend] = results;
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
    if (userGroups && userGroups?.length !== 0 && companyId && branchId) {
      handleSearch('UserGroups')
    }
  }, [userGroups, companyId, branchId]);
  useEffect(() => {
    if (companyId && branchId && branchName) fetchAllLookupsAndChartsData();
  }, [companyId, branchId, branchName])
  const fetchStatusDataByUserGroups = async (payload: any) => {
    dispatch(setLoading(true));
    await getAnalyticsData(companyId, branchId, "statusgrouppie", payload).then(res => {
      if (res.success && res.data && res.data.data) {
        setAnalyticsData(prev => ({ ...prev, StatusByGroups: generateData(res.data.data, 'pie') }))
      } else {
        setAnalyticsData(prev => ({ ...prev, StatusByGroups: [] }))
      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  };
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
        { projectids: "", statusids: "", categoryids: "", startdate: "", enddate: "", assigneeids: "", usergroupids: "" }
      ]
    };
    try {
      const [statusValues, assigneesValues, serviceRequestTypeValues, TicketsByStatusData, CreatedVsClosed,
        TicketsHandledPerAgent, TicketsByIssueType, TicketsByPriority, OpenHighPriorityTickets, ReOpenTrend
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
        Status: { data: getSettledValue(statusValues, "data.ServiceRequestStatusLookup"), label: "ServiceRequestStatusName", value: "ServiceRequestStatusId" },
        Assignees: { data: getSettledValue(assigneesValues, "data.ServiceRequestAssignToUsersLookup"), label: "UserName", value: "UserId" },
        ServiceRequestType: { data: getSettledValue(serviceRequestTypeValues, "data.ServiceRequestTypesLookup"), label: "ServiceRequestTypeName", value: "ServiceRequestTypeId" },
        UserGroups: { data: getSettledValue(assigneesValues, "data.ServiceRequestAssignToUserGroupLookup"), label: "UserGroupName", value: "UserGroupId" }
      };

      setLookupsDataInJson(allLookupsData);
      let allChartsData = {
        TicketsByStatusData: generateData(getSettledValue(TicketsByStatusData, "data.data"), "pie"),
        CreatedVsClosed: generateData(getSettledValue(CreatedVsClosed, "data.data"), "createdvsclosed"),
        TicketsHandledPerAgent: getSettledValue(TicketsHandledPerAgent, "data.data"),
        TicketsByIssueType: generateData(getSettledValue(TicketsByIssueType, "data.data"), "issuetype"),
        TicketsByPriority: generateData(getSettledValue(TicketsByPriority, "data.data"), "priority"),
        OpenHighPriorityTickets: getSettledValue(OpenHighPriorityTickets, "data.data"),
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
  const handleSearch = (type: string) => {
    let payload = {
      FiltersPayloadDetails: [
        {
          projectids: "",
          statusids: watch("Status"),
          categoryids: watch("ServiceRequestType"),
          startdate: watch("StartDate") ? formatDate(watch('StartDate'), 'DD/MM/YYYY') : "",
          enddate: watch("EndDate") ? formatDate(watch("EndDate"), 'DD/MM/YYYY') : "",
          assigneeids: watch("Assignees") ? watch("Assignees").join() : '',
          usergroupids: watch("UserGroups") ? watch("UserGroups").join() : '',
        },
      ],
    }
    if (!watch('Assignees') || (watch('Assignees') && watch('Assignees')?.length <= 10)) {
      if (type === 'UserGroups') {
        fetchStatusDataByUserGroups(payload)
      } else if (type === 'FetchAll') {
        fetchAnalyticsData(payload);
      }
    }
  }
  //render fields based on field type
  const renderField = (field: BaseField) => {
    const { name, label, fieldType, isRequired, show = true } = field;
    if (!name || !show || (roleName !== 'Root Admin' && name === 'Assignees')) return null;
    const validationRules = {
      required: isRequired ? `${label} is required` : false,
      ...(name === 'Assignees' && {
        validate: {
          maxAllowedTen: (value: any) => {
            const count = Array.isArray(value) ? value.length : 0;
            return count <= 10 || 'You can select up to 10 users only';
          },
        },
      }),
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
                maxTagTextLength={12}
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
    <ScrollArea>
      <div className="h-full">
        <header className="px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <h1 className="text-2xl font-bold">
                Ticket Progress Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Service Desk</span>
              <FaAngleRight />
              <span className="text-gray-900 font-medium">Ticket Progress Dashboard</span>
            </div>
          </div>
        </header>
        <div className="p-4 pt-0">
          {/* Enhanced Filters Section */}

          <Accordion
            type="single"
            collapsible
            className="w-full shadow-sm rounded-lg bg-white mb-3"
          >
            <AccordionItem value="Dashboard Filters" className="rounded-lg border border-gray-200 shadow-sm">
              <AccordionTrigger
                className="text-lg font-semibold text-gray-900 px-3 py-3 flex items-center justify-between rounded-lg hover:no-underline"
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-700" />
                  <span>Dashboard Filters</span>
                </div>
              </AccordionTrigger>

              <AccordionContent
                className="mt-2 bg-white p-5 rounded-lg"
              >
                <Form {...form}>
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.preventDefault();
                    }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {getFieldsByNames([
                        "Status",
                        "ServiceRequestType",
                        "Assignees",
                        "StartDate",
                        "EndDate",
                      ]).map(renderField)}
                    </div>

                    <div className="flex justify-end">
                      <div className="flex gap-3">
                      
                          <ReusableButton size={"small"} htmlType='submit'  onClick={() => handleSearch("FetchAll")} className='h-9  bg-button-save hover:bg-button-save hover:border-bg-button-save   group' >
                                                {/* <Search size={18} color='#000'/> */}
                                                <Search
                                                  size={18}
                                                  className="text-white transition-colors duration-200 cursor-pointer group-hover:text-blue-500"
                                                />
                        
                        
                                              </ReusableButton>

                        <ReusableButton
                          htmlType="button"
                             variant="text"
                          onClick={clearAllFilters}
                          className="btn-reset-clear-style h-9"
                          icon={<X className="h-4 w-4" />}
                          iconPosition="left"
                        >
                          Clear Filters
                        </ReusableButton>
                      </div>
                    </div>
                  </form>
                </Form>
              </AccordionContent>
            </AccordionItem>
          </Accordion>



          {/* Main Content with Tabs */}
          <Card>
           
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
    </ScrollArea>
  );
};

export default TicketProgressDashboard;
