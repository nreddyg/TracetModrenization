
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { CalendarIcon, Filter, Eye, Settings2, Download, RefreshCw, Search, Check, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SidebarTrigger } from '@/components/ui/sidebar';
import FilterCard from '@/components/common/FilterCard';
import { useAppDispatch } from '@/store';
import { setLoading } from '@/store/slices/projectsSlice';
import { ColumnDef, createColumnHelper, VisibilityState } from "@tanstack/react-table";
import { getAdditionaliFieldsConfigurationDetails, getCompanyHierarchy, getDepartment, getMainCategoryLookUp, getServiceRequestDetailsColumns, getServiceRequestDetailsHistoryReport, getServiceRequestDetailsReport, getServiceRequestPriority, getServiceRequestSeverity, getServiceRequestSLAMetViolatedColumns, getServiceRequestSLAMetViolatedReport, getSlaStatus, getSubCategoryLookUp, postServiceRequestDetailsColumns, postServiceRequestMetViolatedColumns } from '@/services/servicedeskReportsServices';
import { TracetTreeSelect, TreeNode } from '@/components/ui/reusable-treeSelect';
import { useDispatch } from 'react-redux';
import { useMessage } from '@/components/ui/reusable-message';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { SERVICE_DESK_DB } from '@/Local_DB/Form_JSON_Data/ServiceDeskDB';
import { Controller, useForm } from 'react-hook-form';
import { ReusableMultiSelect } from '@/components/ui/reusable-multi-select';
import ReusableRangePicker from '@/components/ui/reusable-range-picker';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import { ReusableInput } from '@/components/ui/reusable-input';
import { GetServiceRequestAssignToLookups, getSRBranchList, getSRCustomerLookupsList, getSRLinkToLookupsList, getSRRequestByLookupsList, getStatusLookups, postServiceRequest, ServiceRequestTypeLookups } from '@/services/ticketServices';
import ReusableTable from '@/components/ui/reusable-table';
import dayjs from 'dayjs';
import { ReusableButton } from '@/components/ui/reusable-button';
interface MultiSelectConfig {
  isHierarchy?: boolean;
  labelClassName?: string;
  className?: string;
  maxTagsCount?: number;
  maxTagTextLen?: number;
  treeCheckable?: boolean;
  multiple?: boolean;
  onSelect?: (selectedKeys: any, info: any, treeData: TreeNode[]) => void;
  placement?: 'top' | 'bottom';
  size?: 'small' | 'default' | 'large';
  icon?: React.ReactNode;
  errorMsgClass?: string;
  showSearch?: boolean; // New prop for inline search
}

interface OptionItem {
  [key: string]: any;
  label?: string;
  value?: any;
}
interface OptType {
  data: OptionItem[];
  label: string;
  value: string;
  defaultValues?: string | string[];
}
interface allResponsesType {
  ServiceRequestType: OptType
  // AssigneeSelectedUsers: OptType
  RequestedBy: OptType
  Customer: OptType
  ServiceRequest: OptType
  LevelFiveCompany: OptType
  Severity: OptType
  AssignTo: OptType
  MainCategory: OptType
  ServiceRequestDetailHistory: OptType
  slastatus: OptType
  assignedto: OptType
  serviceReqTypeSLA: OptType
  servicereqno: OptType
  Customersla: OptType
  statusinSLA: OptType
  severityinSLA: OptType
  maincategoryinSLA: OptType
  // AssetId: OptType
}

const ServiceDeskReports = () => {

  const [filters, setFilters] = useState({
    serviceRequestType: '',
    status: '',
    levelFiveCompany: '',
    requestedBy: '',
    customer: ''
  });

  const [dateRange, setDateRange] = useState({
    fromDate: null as Date | null,
    toDate: null as Date | null
  });

  const availableColumns = [
    { key: 'serviceRequestType', label: 'Service Request Type' },
    { key: 'status', label: 'Status' },
    { key: 'serviceRequestNo', label: 'Service Request No' },
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'requestedBy', label: 'Requested By' },
    { key: 'requestedDateTime', label: 'Requested Date Time' },
    { key: 'requestedByEmailId', label: 'Requested By Email ID' },
    { key: 'requestedByEmployeeId', label: 'Requested By Employee ID' },
    { key: 'assignedTo', label: 'Assigned To' },
    { key: 'severity', label: 'Severity' },
    { key: 'priority', label: 'Priority' },
    { key: 'createdBy', label: 'Created By' },
    { key: 'createdDateTime', label: 'Created Date Time' }
  ];

  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    availableColumns.map(col => col.key) // Default to all columns selected
  );
  const [columnDropdownOpen, setColumnDropdownOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [reportTabs] = useState([
    'Service Request Details',
    // 'Service Request Type',
    'Service Request SLA Met/SLA Violated',
    'Service Request Detail History',
    // 'Work Orders List',
    // 'Work Order Details',
    // 'Scheduled Work Order List',
    // 'Work Order Task Details',
    // 'Work Order Penalty'
  ]);

  const [activeTab, setActiveTab] = useState('Service Request Details');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const [showReport, setShowReport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fields, setFields] = useState<BaseField[]>(SERVICE_DESK_DB);
  const [slaDB, setSLADB] = useState<BaseField[]>()
  const [serviceHistoryDetail, setServiceHistoryDetail] = useState<BaseField[]>()
  const [columnVisibility, setColumnVisibility] = useState({});
  // const dispatch =useDispatch();
  const msg = useMessage()
  const [dataSource, setDataSourse] = useState([])
  const [cols, setCols] = useState([])
  let additionalFields = useRef([]);

  // let data = activeTab === "Service Request SLA Met/SLA Violated" ? slaDB : activeTab === "Service Request Detail History" ? serviceHistoryDetail : fields;
  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultValue ?? '';
      return acc;
    }, {} as GenericObject),
    mode: 'onChange'
  });
  const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;

  interface ColumnApiResponse {
    [section: string]: {
      [columnName: string]: "true" | "false";
    };
  }
  useEffect(()=>{
    console.log(columnVisibility,"Swathi")
  },[columnVisibility])
  useEffect(() => {
    fetchAdditionalFieldConfigurationDetails(111)
    fetchAllLookUps();
    getDepartmentTreedata(111);
    getCompanyHierarchyTreedata(111);
  }, [])
  function buildColumnsFromApi<T extends Record<string, any>>(
    apiResponse: ColumnApiResponse,
    editableColumns: string[] = [],
    typeMapper: Record<string, "text" | "number" | "date" | "select"> = {}
  ): { columns: ColumnDef<T>[]; initialVisibility: VisibilityState } {
    const columnHelper = createColumnHelper<T>();
    const [_, columnsMeta] = Object.entries(apiResponse)[0];

    const columns: ColumnDef<T>[] = Object.entries(columnsMeta).map(
      ([colName]) =>
        columnHelper.accessor(
          (row) => row[colName as keyof T], // accessor fn (safe for dynamic keys)
          {
            id: colName,
            header: colName,
            cell: (info) => info.getValue() ?? "",
            enableHiding: true, // allow ColumnVisibilityManager to toggle
            meta: {
              editable: editableColumns.includes(colName),
              editType: typeMapper[colName] || "text",
            },
          }
        )
    );

    // build VisibilityState (true/false per column)
    const initialVisibility: VisibilityState = {};
    Object.entries(columnsMeta).forEach(([colName, visible]) => {
      initialVisibility[colName] = visible === "true";
    });

    return { columns, initialVisibility };
  }

  const selectedMainCategory = watch("MainCategory");
  const selectedMainCategoryforSLA = watch("maincategoryinSLA");
  console.log("selectedMainCategory", selectedMainCategory, "SLA", selectedMainCategoryforSLA);
   useEffect(() => {
    if (selectedMainCategory) {
      getSubCategoryDetails(111, selectedMainCategory)
    } else {
      getSubCategoryDetails(111, null)
    }
  }, [selectedMainCategory])
 
  useEffect(() => {
    if (selectedMainCategoryforSLA) {
      getSubCategoryDetails(111, selectedMainCategoryforSLA)
    } else {
      getSubCategoryDetails(111, null)
    }
  }, [selectedMainCategoryforSLA])
 


  //method for generating columns based on data
  function generateColumnsFromData<T extends Record<string, any>>(
    data: T[],
    // includeActions: boolean = true
  ): ColumnDef<T>[] {
    if (!data || data.length === 0) return [];
    const sample = data[0];
    const columns: ColumnDef<T>[] = Object.keys(sample).map((key) => {
      const value = sample[key];

      let editType: 'text' | 'number' | 'date' | 'select' = 'text';
      if (typeof value === 'number') {
        editType = 'number';
      } else if (typeof value === 'string' && value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        editType = 'date';
      }

      return {
        accessorKey: key,
        header: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        meta: {
          editable: true,
          editType,
        },
      } as ColumnDef<T>;
    });

    // if (includeActions) {
    //   columns.push({
    //     id: 'actions',
    //     header: 'Actions',
    //     cell: ({ row }) => (
    //       <Button
    //         size="sm"
    //         onClick={() => handleHistoryClick(row.original)}
    //         className="flex items-center gap-1"
    //         style={{ backgroundColor: "#fb8420" }}
    //       >
    //         History
    //       </Button>
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    //   });
    // }

    return columns;
  }

  // async function postServiceRequestDetailsReportColumns(compId: number) {
  //   dispatch(setLoading(true))
  //   await getServiceRequestDetailsReport(compId, BranchID, srType, srNo, srStatus, requestedBy, fromDate, toDate, customer, AssigneeUsers, AssigneeGroups, severity, priority, SLAStatus, dept, mainCategory, subCategory, assetCode).then(res => {
  //     if (res.success && res.data.status === undefined) {
  //       const tabData = res.data.ServiceRequestDetailsReport
  //       setDataSourse(tabData)

  //     } else {

  //     }
  //   }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  // }


  async function fetchServiceRequestDetailsReport(compId: number, BranchID: string, srType: string, srNo: string, srStatus: string, requestedBy: string, fromDate: string, toDate: string, customer: string, AssigneeUsers: string, AssigneeGroups: string, severity: string, priority: string, SLAStatus: string, dept: string, mainCategory: string, subCategory: string, assetCode: string) {
    dispatch(setLoading(true))
    await getServiceRequestDetailsReport(compId, BranchID, srType, srNo, srStatus, requestedBy, fromDate, toDate, customer, AssigneeUsers, AssigneeGroups, severity, priority, SLAStatus, dept, mainCategory, subCategory, assetCode).then(res => {
      if (res.success && res.data.status === undefined) {
        const tabData = res.data.ServiceRequestDetailsReport
        setDataSourse(tabData)

      } else {

      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }

  async function fetchServiceRequestSLAmetViolatedReport(compId: number, BranchID: string, srType: string, srNo: string, srStatus: string, requestedBy: string, fromDate: string, toDate: string, customer: string, AssigneeUsers: string, AssigneeGroups: string, severity: string, priority: string, SLAStatus: string, dept: string, mainCategory: string, subCategory: string, assetCode: string) {
    dispatch(setLoading(true))
    await getServiceRequestSLAMetViolatedReport(compId, BranchID, srType, srNo, srStatus, requestedBy, fromDate, toDate, customer, AssigneeUsers, AssigneeGroups, severity, priority, SLAStatus, dept, mainCategory, subCategory, assetCode).then(res => {
      if (res.success && res.data.status === undefined) {
        const tabData = res.data.ServiceRequestDetails.ServiceRequestDetailsReport
        setDataSourse(tabData)

      } else {

      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }

  //   async function fetchServiceRequestDetailsHistoryReport(compId:number,BranchName:string,srID:string) {
  //   dispatch(setLoading(true))
  //   await getServiceRequestDetailsHistoryReport( compId,BranchName,srID).then(res => {
  //     if (res.success && res.data.status === undefined) {
  //       if (Array.isArray(res.data)) {
  //         // setTickets(res.data)
  //         generateColumnsFromData
  //       } else {
  //         // setTickets([])
  //       }

  //     } else {

  //     }
  //   }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  // }
    async function fetchAdditionalFieldConfigurationDetails(compId: number) {
    dispatch(setLoading(true))
    await getAdditionaliFieldsConfigurationDetails(compId).then(res => {
      if (res.success && res.data.status === undefined) {
          additionalFields.current = res.data.AdditionalFieldConfigurationDetails.filter(x=> x.TransactionTypeId === 105 || x.TransactionType === "Service request");
      

      } else {
          additionalFields.current = [];

      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }
  async function fetchServiceRequestDetailsColumns(compId: number) {
    dispatch(setLoading(true))
    await getServiceRequestDetailsColumns(compId).then(res => {
      if (res.success && res.data.status === undefined) {
        const tempCols = buildColumnsFromApi(res.data)
        // console.log(tempCols,"temp")
        setColumnVisibility(tempCols.initialVisibility)
        setCols(tempCols.columns)

      } else {

      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }
  async function fetchServiceRequestSLAViolatedColumns(compId: number) {
    dispatch(setLoading(true))
    await getServiceRequestSLAMetViolatedColumns(compId).then(res => {
      if (res.success && res.data.status === undefined) {
        const tempCols = buildColumnsFromApi(res.data)
        // console.log(tempCols,"temp")
        setColumnVisibility(tempCols.initialVisibility)
        setCols(tempCols.columns)

      } else {

      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns(prev => {
      if (prev.includes(columnKey)) {
        return prev.filter(key => key !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };

  const handleSelectAllColumns = () => {
    if (selectedColumns.length === availableColumns.length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(availableColumns.map(col => col.key));
    }
  };
  function formatToString(input: unknown): string {
    if (typeof input === "string") {
      return input;
    } else if (typeof input === "number" || typeof input === "boolean") {
      return input.toString();
    } else if (Array.isArray(input)) {
      return input.map(item => formatToString(item)).join(",");
    } else if (input === null || input === undefined) {
      return "";
    } else if (typeof input === "object") {
      return JSON.stringify(input);
    } else {
      return String(input);
    }
  }

  // useEffect(()=>{
  //       if(activeTab==="Service Request Details"){
  //   fetchServiceRequestDetailsColumns(111)
  // fetchServiceRequestDetailsReport(111,formatToString(watch("LevelFiveCompany")),formatToString(watch("ServiceRequestType")),formatToString(watch("ServiceRequest")),formatToString(watch("Status")),formatToString(watch("RequestedBy")),"","",formatToString(watch("Customer")),formatToString(watch("AssignTo")["User Group"]),formatToString(watch("AssignTo")["Users"]),formatToString(watch("Severity")),formatToString(watch("Priority")),formatToString(watch("slastatus")),formatToString(watch("LevelFiveDepartment")),formatToString(watch("MainCategory")),formatToString(watch("SubCategory")),formatToString(watch("AssetCode")))
  // }
  // else if(activeTab==="Service Request SLA Met/SLA Violated"){

  //   fetchServiceRequestSLAViolatedColumns(111)
  // fetchServiceRequestSLAmetViolatedReport(111, '',"","","","","","","","","","","","","","","","")

  // }

  // },[isGeneratingReport])
  const handleViewReport = async () => {
    setIsGeneratingReport(true);
      const historyReport = watch("ServiceRequestDetailHistory");
    // fetchServiceRequestDetailsReport(111,watch("LevelFiveCompany"),watch("ServiceRequestType"),watch("servicereqno"),watch("Status"),watch("requestedBy"),"","",watch("Customersla"),watch("AssignTo"),"",watch("severityinSLA"),watch("priorityinSLA"),watch("slastatus"),watch("levelfivedepartment"),watch("MainCategory"),watch("SubCategory"),watch("AssetCode"))

    const obj = {
      BranchId: watch("LevelFiveCompany"),
      serviceReqTypeId: watch("ServiceRequestType"),
      serviceReqNoId: watch("ServiceRequest"),
      SRStatusId: watch("Status"),
      RequestedById: watch("RequestedBy"),
      FromDate: "",
      ToDate: "",
      CustomerId: watch("Customer"),
      AssigneeUsersId: watch("AssignTo"),
      AssigneeGroupsId: "",
      SeverityId: watch("Severity"),
      PriorityId: watch("Priority"),
      SlaStatusId: "",
      DeptId: watch("LevelFiveDepartment"),
      MainCategoryId: watch("MainCategory"),
      SubCategoryId: watch("SubCategory"),
      Assetcode: watch("AssetCode")
    }
    const obj2 = {
      BranchId: watch("LevelFiveCompanyinSLA"),
      serviceReqTypeId: watch("serviceReqTypeSLA"),
      serviceReqNoId: watch("servicereqno"),
      SRStatusId: watch("statusinSLA"),
      RequestedById: watch("slarequestedby"),
      FromDate: "",
      ToDate: "",
      CustomerId: watch("Customersla"),
      AssigneeUsersId: watch("assignedto"),
      AssigneeGroupsId: "",
      SeverityId: watch("severityinSLA"),
      PriorityId: watch("priorityinSLA"),
      SlaStatusId: watch("slastatus"),
      DeptId: watch("levelfivedepartmentINsla"),
      MainCategoryId: watch("maincategoryinSLA"),
      SubCategoryId: watch("subcategoryinSLA"),
      Assetcode: watch("assetcode")
    }
    console.log(obj2, "Nag")

    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsGeneratingReport(false);
    if (activeTab !== "Service Request Detail History") {

      setShowReport(true);
      if (activeTab === "Service Request Details") {
        fetchServiceRequestDetailsColumns(111)
        fetchServiceRequestDetailsReport(111, formatToString(watch("LevelFiveCompany")), formatToString(watch("ServiceRequestType")), formatToString(watch("ServiceRequest")), formatToString(watch("Status")), formatToString(watch("RequestedBy")), "", "", formatToString(watch("Customer")), formatToString(watch("AssignTo")["Users"]), formatToString(watch("AssignTo")["User Group"]), formatToString(watch("Severity")), formatToString(watch("Priority")), formatToString(watch("slastatus")), formatToString(watch("LevelFiveDepartment")), formatToString(watch("MainCategory")), formatToString(watch("SubCategory")), formatToString(watch("AssetCode")))
      }
      else if (activeTab === "Service Request SLA Met/SLA Violated") {

        fetchServiceRequestSLAViolatedColumns(111)
        fetchServiceRequestSLAmetViolatedReport(111, formatToString(watch("LevelFiveCompanyinSLA")), formatToString(watch("serviceReqTypeSLA")), formatToString(watch("servicereqno")), formatToString(watch("statusinSLA")), formatToString(watch("slarequestedby")), "", "", formatToString(watch("Customersla")), formatToString(watch("AssignTo")["Users"]), formatToString(watch("AssignTo")["User Group"]), formatToString(watch("severityinSLA")), formatToString(watch("priorityinSLA")), formatToString(watch("slastatus")), formatToString(watch("levelfivedepartmentINsla")), formatToString(watch("maincategoryinSLA")), formatToString(watch("subcategoryinSLA")), formatToString(watch("assetcode")))

      }
      else if(activeTab==="Service Request Detail History"){
     
      }

    }
    else {
           if (historyReport === "") {
      msg.warning(`Please select Service Request`);
      setIsGeneratingReport(false);
    } else {
      msg.success("can open report or table");
      // setIsGeneratingReport(true);
       localStorage.setItem("srData", JSON.stringify({ id: watch("ServiceRequestDetailHistory") }));
      window.open(`/service-desk/srdetailshistoryview`, "ReportWindow",
        "width=900,height=800,left=200,top=100,resizable=yes")
    }
      console.log( watch("ServiceRequestDetailHistory") ,"Nag")
     
    }
  };

  const handleClearFilters = () => {
   form.reset()
  };

  const handleExportReport = () => {
    console.log('Exporting report...');
  };

  const filteredReportTabs = reportTabs.filter(tab =>
    tab.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const multiSelectConfig1: MultiSelectConfig = {
    isHierarchy: true,
    treeCheckable: true,
    multiple: true,
    maxTagsCount: 2,
    maxTagTextLen: 15,
    labelClassName: 'font-semibold',
    className: 'custom-tree-select',
    showSearch: true, // Enable inline search

    onSelect: (selectedKeys, info, treeData) => {
      console.log("✅ Selected Keys (IDs):", selectedKeys);
      console.log("ℹ️ Info Object:", info);
      console.log("🌳 Full Tree Data:", treeData);

      // If you want selected node's title(s)
      const getSelectedTitles = (nodes, selectedValues) => {
        let titles: string[] = [];
        nodes.forEach(node => {
          if (selectedValues.includes(node.value)) {
            titles.push(node.title);
          }
          if (node.children) {
            titles = titles.concat(getSelectedTitles(node.children, selectedValues));
          }
        });
        return titles;
      };

      const selectedTitles = getSelectedTitles(treeData, selectedKeys);
      console.log("📂 Selected Titles:", selectedTitles);
    }
  };
  //   TREEFUNWITHPARENT----------
  const treefunWithParent = (data: any[], id: string | number, idName?: string, assetLocationUnique?: string, uniqVal?: string): any[] => {
    const treeData: any[] = [];
    const uniqueId = idName ? idName : "id";
    data.forEach((item) => {
      if (item["parent"] || item["Parent"]) {
        let p = item["parent"] ? "parent" : "Parent";
        if (item[p] == id) {
          item.title = `${item.text || item.Name || item.LocationName}`;
          item.label = `${item.text || item.Name || item.LocationName}`;
          item.key = item[uniqueId];
          item.value = item["id"];
          const children = treefunWithParent(data, item[uniqueId], idName, assetLocationUnique, uniqVal);
          if (children.length > 0) {
            item.children = children;
          }
          treeData.push(item);
        }
      }
    });
    return treeData;
  };

  //   SETTING DATA IN LOOKUPS------------ this is related to treeData
  function SettingLookupsData(lookupdata, jsonName, keyName) {
    let jsonData = [];
    if (jsonName === "department") {
      jsonData = fields;
      const index = jsonData.findIndex((x) => x.name === keyName)
      jsonData[index].treeData = lookupdata;
    } else if (jsonName === "company") {
      jsonData = fields;
      const index = jsonData.findIndex((x) => x.name === keyName)
      jsonData[index].treeData = lookupdata;
    }
    setFields(jsonData);
  }

  async function getDepartmentTreedata(compId: number) {
    try {
      const res = await getDepartment(compId);
      if (res.success && res.data) {
        const treeData = treefunWithParent(res.data, "#", '', '', 'Code');
        console.log("treeDatadepatment", treeData);
        SettingLookupsData(treeData, 'department', 'LevelFiveDepartment');
        SettingLookupsData(treeData, 'department', 'levelfivedepartmentINsla');
      }
    } catch (err) {
      console.error('Error fetching department details:', err);
    }
  }

  async function getCompanyHierarchyTreedata(compId: number) {
    try {
      const res = await getCompanyHierarchy(compId);
      if (res.success && res.data) {
        console.log("data", res.data);
        const treeData = treefunWithParent(res.data, "#", '', '', 'Code');
        console.log("treeData", treeData);
        SettingLookupsData(treeData, 'company', 'LevelFiveCompanyinSLA');
      }
    } catch (err) {
      console.error('Error fetching department details:', err);
    }
  }

  // fetching SubCategories list based on main Asset selected
    async function getSubCategoryDetails(compId: number, id: number | null) {
    dispatch(setLoading(true));
    try {
      if (id == null) {
        // if no id, clear both SubCategory dropdowns
        const data = structuredClone(fields);
 
        const subCatIndex = data.findIndex(x => x.name === "SubCategory");
        if (subCatIndex >= 0) data[subCatIndex].options = [];
 
        const subCatSLAIndex = data.findIndex(x => x.name === "subcategoryinSLA");
        if (subCatSLAIndex >= 0) data[subCatSLAIndex].options = [];
 
        setFields(data);
        return;
      }
 
      const res = await getSubCategoryLookUp(compId, id);
 
      if (res?.data?.SubCategoriesLookup?.length > 0) {
        const subCategories = res.data.SubCategoriesLookup.map((obj: any) => ({
          ...obj,
          label: obj.CategoryName,
          value: obj.CategoryId,
        }));
 
        const data = structuredClone(fields);
 
        if (id === selectedMainCategory) {
          const idx = data.findIndex(x => x.name === "SubCategory");
          if (idx >= 0) data[idx].options = subCategories;
        }
 
        if (id === selectedMainCategoryforSLA) {
          const idx = data.findIndex(x => x.name === "subcategoryinSLA");
          if (idx >= 0) data[idx].options = subCategories;
        }
 
        setFields(data);
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    } finally {
      dispatch(setLoading(false));
    }
  }
  console.log("fields", fields);



  //store lookups data in json
  const setLookupsDataInJson = (lookupsData: allResponsesType): void => {
    console.log("date", lookupsData);
    const arr = Object.keys(lookupsData)
    const groupNames: string[] = []
    const opts: { [key: string]: any } = {}
    arr.forEach((obj) => {
      let ret = []
      if (lookupsData[obj].isGrouping) {
        groupNames.push(obj)
        let groupOpts = []
        ret = lookupsData[obj].groupData.map((element) => {
          groupOpts = element.data.map((ele) => {
            let opt = {}
            opt["label"] = ele[element.label]
            opt["value"] = ele[element.value]
            return opt
          });
          return {
            "label": element.groupLabel,
            "options": groupOpts
          }
        })
 
      } else if (lookupsData[obj].treedata) {
        ret = lookupsData[obj].data
      } else {
        ret = lookupsData[obj].data.map((element) => {
          let opt = {}
          opt["label"] = element[lookupsData[obj].label]
          opt["value"] = element[lookupsData[obj].value]
          return opt
        });
      }
      opts[obj] = ret
    })
    let jsonCopy = activeTab === "Service Request SLA Met/SLA Violated" ? slaDB : activeTab === "Service Request Detail History" ? serviceHistoryDetail : SERVICE_DESK_DB
    const data = structuredClone(jsonCopy);
    console.log('opts', opts)
    data.forEach((obj) => {
      if (arr.includes(obj.name)) {
        if (groupNames.includes(obj.name)) {
          obj.groupedOptions = opts[obj.name]
        }
        obj.options = opts[obj.name]
        if (obj.fieldType === 'treeselect') {
          obj['treeData'] = opts[obj.name]
        }
      }
    });
    console.log('dattatatatattata', data)
    setFields(data);
  }

// fetch all lookUps
  async function fetchAllLookUps() {
    dispatch(setLoading(true));
    try {
      const [SRTLookUp, SRTRequestedByLookup, SRTLinkToLookup, StatusLookup,
        CustomerLookUp, SRTBranchListLookup, SRSeverity, SRPriority, SRTAssignToLookup, SRMainCategoryLookUps, SRSLAStatus, getCompanyHierarchyTreeData, deptTreeData] =
        await Promise.allSettled([
          ServiceRequestTypeLookups(111),
          getSRRequestByLookupsList(111, 'All'),
          getSRLinkToLookupsList(111, 'All'),
          getStatusLookups(111),
          getSRCustomerLookupsList(111, 'All'),
          getSRBranchList(111),
          getServiceRequestSeverity(),
          getServiceRequestPriority(),
          GetServiceRequestAssignToLookups(111, 'All'),
          getMainCategoryLookUp(111),
          getSlaStatus(),
          getCompanyHierarchy(111),
          getDepartment(111)
        ]);
      const allResponses = {
        ServiceRequestType: { data: SRTLookUp.status === 'fulfilled' && SRTLookUp.value.success && SRTLookUp.value.data.ServiceRequestTypesLookup ? SRTLookUp.value.data.ServiceRequestTypesLookup : [], label: 'ServiceRequestTypeName', value: 'ServiceRequestTypeId' },
        RequestedBy: { data: SRTRequestedByLookup.status === 'fulfilled' && SRTRequestedByLookup.value.success && SRTRequestedByLookup.value.data.ServiceRequestRequestedByLookup ? SRTRequestedByLookup.value.data.ServiceRequestRequestedByLookup : [], label: 'UserName', value: 'UserId' },
        ServiceRequest: { data: SRTLinkToLookup.status === 'fulfilled' && SRTLinkToLookup.value.success && SRTLinkToLookup.value.data.ServiceRequestLinkToLookup ? SRTLinkToLookup.value.data.ServiceRequestLinkToLookup : [], label: 'ServiceRequestName', value: 'ServiceRequestId' },
        Status: { data: StatusLookup.status === 'fulfilled' && StatusLookup.value.success && StatusLookup.value.data.ServiceRequestStatusLookup ? StatusLookup.value.data.ServiceRequestStatusLookup : [], label: 'ServiceRequestStatusName', value: 'ServiceRequestStatusId' },
        Customer: { data: CustomerLookUp.status === 'fulfilled' && CustomerLookUp.value.success && CustomerLookUp.value.data.ServiceRequestCustomerLookup ? CustomerLookUp.value.data.ServiceRequestCustomerLookup : [], label: 'CustomerName', value: 'CustomerId' },
        LevelFiveCompany: { data: SRTBranchListLookup.status === 'fulfilled' && SRTBranchListLookup.value.success && SRTBranchListLookup.value.data ? SRTBranchListLookup.value.data.filter((ele: any) => ele.id !== 0 && ele.parent !== '#' && ele.type !== '99') : [], label: 'Name', value: 'id' },
        Severity: { data: SRSeverity.status === 'fulfilled' && SRSeverity.value.success && SRSeverity.value.data ? SRSeverity.value.data.ServiceRequestSeverityLookup : [], label: "ServiceRequestSeverityName", value: "ServiceRequestSeverityId" },
        Priority: { data: SRPriority.status === 'fulfilled' && SRPriority.value.success && SRPriority.value.data ? SRPriority.value.data.ServiceRequestSeverityLookup : [], label: "ServiceRequestPriorityName", value: "ServiceRequestPriorityId" },
        AssignTo: {
          data: [], label: 'UserName', value: 'UserId', isGrouping: true, groupData: [{ label: "UserGroupName", value: "UserGroupId", data: SRTAssignToLookup.status === 'fulfilled' && SRTAssignToLookup.value.success && SRTAssignToLookup.value.data.ServiceRequestAssignToUserGroupLookup ? SRTAssignToLookup.value.data.ServiceRequestAssignToUserGroupLookup : [], groupLabel: "User Group" },
          { label: "UserName", value: "UserId", data: SRTAssignToLookup.status === 'fulfilled' && SRTAssignToLookup.value.success && SRTAssignToLookup.value.data.ServiceRequestAssignToUsersLookup ? SRTAssignToLookup.value.data.ServiceRequestAssignToUsersLookup : [], groupLabel: "Users" },]
        },
        MainCategory: { data: SRMainCategoryLookUps.status === 'fulfilled' && SRMainCategoryLookUps.value.success && SRMainCategoryLookUps.value.data ? SRMainCategoryLookUps.value.data.CategoriesLookup : [], label: "CategoryName", value: "CategoryId" },
        ServiceRequestDetailHistory: { data: SRTLinkToLookup.status === 'fulfilled' && SRTLinkToLookup.value.success && SRTLinkToLookup.value.data.ServiceRequestLinkToLookup ? SRTLinkToLookup.value.data.ServiceRequestLinkToLookup : [], label: 'ServiceRequestName', value: 'ServiceRequestId' },
        slastatus: { data: SRSLAStatus.status === 'fulfilled' && SRSLAStatus.value.success && SRSLAStatus.value.data ? SRSLAStatus.value.data.ServiceRequestSeverityLookup : [], label: "tSLAStatusName", value: "tSLAStatusId" },
        assignedto: {
          data: [], label: 'UserName', value: 'UserId', isGrouping: true, groupData: [{ label: "UserGroupName", value: "UserGroupId", data: SRTAssignToLookup.status === 'fulfilled' && SRTAssignToLookup.value.success && SRTAssignToLookup.value.data.ServiceRequestAssignToUserGroupLookup ? SRTAssignToLookup.value.data.ServiceRequestAssignToUserGroupLookup : [], groupLabel: "User Group" },
          { label: "UserName", value: "UserId", data: SRTAssignToLookup.status === 'fulfilled' && SRTAssignToLookup.value.success && SRTAssignToLookup.value.data.ServiceRequestAssignToUsersLookup ? SRTAssignToLookup.value.data.ServiceRequestAssignToUsersLookup : [], groupLabel: "Users" },]
        },
        serviceReqTypeSLA: { data: SRTLookUp.status === 'fulfilled' && SRTLookUp.value.success && SRTLookUp.value.data.ServiceRequestTypesLookup ? SRTLookUp.value.data.ServiceRequestTypesLookup : [], label: 'ServiceRequestTypeName', value: 'ServiceRequestTypeId' },
        servicereqno: { data: SRTLinkToLookup.status === 'fulfilled' && SRTLinkToLookup.value.success && SRTLinkToLookup.value.data.ServiceRequestLinkToLookup ? SRTLinkToLookup.value.data.ServiceRequestLinkToLookup : [], label: 'ServiceRequestName', value: 'ServiceRequestId' },
        Customersla: { data: CustomerLookUp.status === 'fulfilled' && CustomerLookUp.value.success && CustomerLookUp.value.data.ServiceRequestCustomerLookup ? CustomerLookUp.value.data.ServiceRequestCustomerLookup : [], label: 'CustomerName', value: 'CustomerId' },
        slarequestedby: { data: SRTRequestedByLookup.status === 'fulfilled' && SRTRequestedByLookup.value.success && SRTRequestedByLookup.value.data.ServiceRequestRequestedByLookup ? SRTRequestedByLookup.value.data.ServiceRequestRequestedByLookup : [], label: 'UserName', value: 'UserId' },
        statusinSLA: { data: StatusLookup.status === 'fulfilled' && StatusLookup.value.success && StatusLookup.value.data.ServiceRequestStatusLookup ? StatusLookup.value.data.ServiceRequestStatusLookup : [], label: 'ServiceRequestStatusName', value: 'tSLAStatusId' },
        severityinSLA: { data: SRSeverity.status === 'fulfilled' && SRSeverity.value.success && SRSeverity.value.data ? SRSeverity.value.data.ServiceRequestSeverityLookup : [], label: "ServiceRequestSeverityName", value: "ServiceRequestSeverityId" },
        priorityinSLA: { data: SRPriority.status === 'fulfilled' && SRPriority.value.success && SRPriority.value.data ? SRPriority.value.data.ServiceRequestSeverityLookup : [], label: "ServiceRequestPriorityName", value: "ServiceRequestPriorityId" },
        maincategoryinSLA: { data: SRMainCategoryLookUps.status === 'fulfilled' && SRMainCategoryLookUps.value.success && SRMainCategoryLookUps.value.data ? SRMainCategoryLookUps.value.data.CategoriesLookup : [], label: "CategoryName", value: "CategoryId" },
        LevelFiveCompanyinSLA:
        {
          data: getCompanyHierarchyTreeData.status === 'fulfilled'
            && getCompanyHierarchyTreeData.value.success &&
            getCompanyHierarchyTreeData.value.data
            ? treefunWithParent(getCompanyHierarchyTreeData.value.data, "#", '', '', 'Code') : [],
          treedata: true,
        },
        LevelFiveDepartment: {
          data: deptTreeData.status === "fulfilled" && deptTreeData.value.success
            && deptTreeData.value.data ? treefunWithParent(deptTreeData.value.data, "#", '', '', 'Code') : [],
          treedata: true,
        },
        levelfivedepartmentINsla: {
          data: deptTreeData.status === "fulfilled" && deptTreeData.value.success
            && deptTreeData.value.data ? treefunWithParent(deptTreeData.value.data, "#", '', '', 'Code') : [],
          treedata: true,
        },
      };
      setLookupsDataInJson(allResponses);
    } catch (error) {
      msg.warning(`Error fetching lookups: ${error}`)
    } finally {
      dispatch(setLoading(false));
    }
  }

  // useEffect(() => {
  //   if (activeTab === "Service Request Details") {
  //     fetchServiceRequestDetailsColumns(111)
  //     fetchServiceRequestDetailsReport(111, formatToString(watch("LevelFiveCompany")), formatToString(watch("ServiceRequestType")), formatToString(watch("ServiceRequest")), formatToString(watch("Status")), formatToString(watch("RequestedBy")), "", "", formatToString(watch("Customer")), formatToString(watch("AssignTo")["User Group"]), formatToString(watch("AssignTo")["Users"]), formatToString(watch("Severity")), formatToString(watch("Priority")), formatToString(watch("slastatus")), formatToString(watch("LevelFiveDepartment")), formatToString(watch("MainCategory")), formatToString(watch("SubCategory")), formatToString(watch("AssetCode")))
  //   }
  //   else if (activeTab === "Service Request SLA Met/SLA Violated") {

  //     fetchServiceRequestSLAViolatedColumns(111)
  //     fetchServiceRequestSLAmetViolatedReport(111, '', "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "")

  //   }

  // }, [isGeneratingReport])
  const getFieldsByNames = (names: string[]) => {
    if (activeTab === "Service Request Details") {
      const allData = fields.filter(f => f.jsontype === "servicerequestDetails");
      return allData.filter(f => names.includes(f.name!));
    } else if (activeTab === "Service Request SLA Met/SLA Violated") {
      const allData = fields.filter(f => f.jsontype === "slaViolated");
      return allData.filter(f => names.includes(f.name!));
    } else if (activeTab === "Service Request Detail History") {
      const allData = fields.filter(f => f.jsontype === "serviceReqHistoryDetail");
      return allData.filter(f => names.includes(f.name!));
    }
    return [];
  };
  const renderField = (field: BaseField) => {
    const { name, label, fieldType, isRequired, show = true } = field;
    console.log("sachin")
    if (!name || !show) return null;
    const validationRules = {
      required: isRequired ? `${label} is Required` : false,
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
      case 'treeselect':
        return (
          <div>
            <Controller
              key={name}
              name={name}
              control={control}
              rules={validationRules}
              render={({ field: ctrl }) => (
                <TracetTreeSelect
                  label={label!}
                  {...field}
                  value={ctrl.value}
                  onChange={ctrl.onChange}
                  treeData={field.treeData}
                  errorMessage={errors[name]?.message as string}
                  multiSelectConfig={multiSelectConfig1}
                />
              )}
            />
          </div>
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
                value={{
                  from: ctrl.value?.from
                    ? dayjs(ctrl.value.from, "DD/MM/YYYY").toDate()
                    : undefined,
                  to: ctrl.value?.to
                    ? dayjs(ctrl.value.to, "DD/MM/YYYY").toDate()
                    : undefined,
                }}
                onChange={(range) =>
                  ctrl.onChange({
                    from: range?.from ? dayjs(range.from).format("DD/MM/YYYY") : "",
                    to: range?.to ? dayjs(range.to).format("DD/MM/YYYY") : "",
                  })
                }
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
                // {...(name === 'AssetIds' ? { suffixIcon: <FaSearch onClick={() => navigateToAssetTable()} style={{ fontSize: "16px", color: "#617ce7", cursor: 'pointer' }} color="white" /> } : {})}
                />
              )}
            />
          </div>
        );
      default:
        return null;
    }
  };
//   function buildColumnPayload(
//   allColumns: string[],
//   columnVisibility: VisibilityState
// ) {
//   const payload: Record<string, string> = {};

//   allColumns.forEach((colName) => {
//     // if not in visibility state, default to false
//     payload[colName] = columnVisibility[colName] ? "true" : "false";
//   });

//   return { DefaultColumnsDetails: [payload] };
// }
  const handlePostColumns=async()=>{
     const addFields = additionalFields.current.reduce((acc, x) => {
      acc[x.AdditionalFieldName.replaceAll(" ","")] = "false";
      return acc;
    }, {});
let payload=
      {
        "Title": columnVisibility["Title"]?.toString(),
        "ProblemSummary": columnVisibility["Description"]?.toString(),
        "RequestedByName": columnVisibility["Requested By"]?.toString(),
        "RequestedDate": columnVisibility["Requested Date & Time"]?.toString(),
        "AssignTo": columnVisibility["Assigned To"]?.toString(),
        "SeverityName": columnVisibility["Severity"]?.toString(),
        "PriorityName": columnVisibility["Priority"]?.toString(),
        "CreatedByName": columnVisibility["Created By"]?.toString(),
        "SRCreatedDate":columnVisibility["Created Date & Time"]?.toString(),
        "BranchName": "false",
        "SLADuration": columnVisibility["SLA Duration (In Hrs:Mins)"]?.toString(),
        "ReminderForSLA": columnVisibility["SLA Reminder before (In Hrs:Mins)"]?.toString(),
        "TotalResolutionHours":  columnVisibility["Resolution Time (In Hrs:Mins)"]?.toString(),
        "SRClosedDate":  columnVisibility["Closed Date & Time "]?.toString(),
        "SRClosedBy": columnVisibility["Closed By"]?.toString() ,
        "SLAStatus":  columnVisibility["SLA Status"]?.toString(),
        "CustomerName":  columnVisibility["Customer Name"]?.toString(),
        "SMTypeName":  columnVisibility["Maintenance Type"]?.toString(),
        "SRStatusName":  columnVisibility["Status"]?.toString(),
        "ServiceRequestNo":  columnVisibility["Service Request No"]?.toString(),
        "CcList":  columnVisibility["Cc List"]?.toString(),
        "LinkTo":  columnVisibility["Linked To"]?.toString(),
        "EsclationUserName":  columnVisibility["Escalated To"]?.toString(),
        "AssetCode":  columnVisibility["Asset Code"]?.toString(),
        "AssetName":  columnVisibility["Asset Name"]?.toString(),
        "Category":  columnVisibility["Category"]?.toString(),
        "BranchName_100": "false",
        "BranchCode_100": "false",
        "BranchName_101": "false",
        "BranchCode_101": "false",
        "BranchName_102": "false",
        "BranchCode_102": "false",
        "BranchName_103": "false",
        "BranchCode_103": "false",
        "BranchName_104": "false",
        "BranchCode_104": "false",
        "LocName_100": "false",
        "LocCode_100": "false",
        "LocName_101": "false",
        "LocCode_101": "false",
        "LocName_102": "false",
        "LocCode_102": "false",
        "LocName_103": "false",
        "LocCode_103": "false",
        "LocName_104": "false",
        "LocCode_104": "false",
        "CostName_100": "false",
        "CostCode_100": "false",
        "CostName_101": "false",
        "CostCode_101": "false",
        "CostName_102": "false",
        "CostCode_102": "false",
        "CostName_103": "false",
        "CostCode_103": "false",
        "CostName_104": "false",
        "CostCode_104": "false",
        "DepName_100": "false",
        "DepCode_100": "false",
        "DepName_101": "false",
        "DepCode_101": "false",
        "DepName_102": "false",
        "DepCode_102": "false",
        "DepName_103": "false",
        "DepCode_103": "false",
        "DepName_104": "false",
        "DepCode_104": "false",
        "MaintenanceType":  columnVisibility["Maintenance Type"]?.toString(),
        "MaintenanceFromDate":  columnVisibility["Maintenance Start Date"]?.toString(),
        "MaintenanceToDate":  columnVisibility["Maintenance End Date"]?.toString(),
        "MaintenanceVendorName":  columnVisibility["Vendor"]?.toString(),
        "MaintenanceAmount":  columnVisibility["Maintenance Amount"]?.toString(),
        "RequestedEMailId":  columnVisibility["Requested By E-Mail Id"]?.toString(),
        "RequestedEMPId" :  columnVisibility["Requested By Employee Id"]?.toString(),
      }
     

    let payForSRDetails = {
      "DefaultColumnsDetails" :  [{...payload,...addFields}]
    }
    //     delete payload["ServiceRequestNo"]
    // delete payload["AssetName"]
    // delete payload["SRStatusName"]
    // delete payload["TotalResolutionHours"]

      //  const slaPay={
      //   "Servicerequestno":columnVisibility["Service Request No"]?.toString(),
      //   // "TotalResolutionHours":columnVisibility[""].toString(), 
      //   "ResolutionDate":columnVisibility[""].toString(), 
      //   // "ResponseDate":columnVisibility[""].toString(), 
      //   // "SRStatusName":columnVisibility[""].toString(),
      //    "SMTypeName":"false",
      //    "TotalResolutionHours":columnVisibility["Resolution Time (In Hrs)"]?.toString(),
      //    "CreatedDate":columnVisibility["Created Date & Time"]?.toString(),
      //    "ResponseDate":columnVisibility["First Response Date & Time"]?.toString(),
      //    "SRStatusName":columnVisibility["Service Request Status"]?.toString(),
      //    "Assetname":columnVisibility["Asset Name"]?.toString()

      //   }
      let payForSRSLAMetViolated = {
        // "DefaultColumnsDetails" :  [{...payload,...slaPay}]
    }
    


    
    if(activeTab==="Service Request Details"){
      console.log("pen1","swathi")
    postServiceRequestDetailsColumns(111,payForSRDetails)
        // fetchServiceRequestDetailsColumns(111)

    }
    else if (activeTab==="Service Request SLA Met/SLA Violated"){
      console.log("pen","swathi")
   
    postServiceRequestMetViolatedColumns(111,payForSRSLAMetViolated)
    }

    
  }

  const getColumnDisplayText = () => {
    if (selectedColumns.length === 0) return 'No columns selected';
    if (selectedColumns.length === availableColumns.length) return 'All Columns';
    if (selectedColumns.length === 1) {
      const column = availableColumns.find(col => col.key === selectedColumns[0]);
      return column?.label || '';
    }
    return `${selectedColumns.length} columns selected`;
  };

  return (
    <div className="h-full overflow-y-scroll  bg-gray-50">
      {/* Compact Header */}
      <header className="bg-white border-b px-6 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Service Desk Reports</h1>
            <p className="text-sm text-gray-600">Generate comprehensive reports with advanced filtering and customization options</p>
          </div>
        </div>
      </header>

      <div className="px-6 pb-6 pt-6 space-y-6 ">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 ">
          {/* Enhanced Left Sidebar - Report Types */}
          <div className="xl:col-span-1">
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-blue-600" />
                  Report Types
                </CardTitle>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-1 max-h-96 overflow-y-auto">
                {filteredReportTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); form.reset() }}
                    className={cn(
                      "w-full text-left px-3 py-3 rounded-lg text-sm transition-all duration-200 flex items-center gap-2",
                      activeTab === tab
                        ? "bg-orange-100 text-orange-700 font-medium border border-orange-200 shadow-sm"
                        : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                    )}
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      activeTab === tab ? "bg-orange-500" : "bg-gray-300"
                    )} />
                    <span className="leading-tight">{tab}</span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Enhanced Filters Section */}
            <FilterCard
              actions={
                <>
                  <Button
                    onClick={handleViewReport}
                    disabled={isGeneratingReport}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isGeneratingReport ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleClearFilters}
                    variant="outline"
                  >
                    Clear All
                  </Button>
                </>
              }
            >
              <div className="space-y-2 h-full overflow-y-hidden">
                {/* Primary Filters */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Primary Filters</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeTab === "Service Request SLA Met/SLA Violated"
                      ? getFieldsByNames(["slastatus", "assignedto", "serviceReqTypeSLA"]).map(renderField)
                      : activeTab === "Service Request Detail History"
                        ? getFieldsByNames(["ServiceRequestDetailHistory"]).map(renderField)
                        : getFieldsByNames(["ServiceRequestType", "ServiceRequest", "Status"]).map(renderField)
                    }
                  </div>
                </div>
                {activeTab !== "Service Request Detail History" ?
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="additional-filters">
                      <AccordionTrigger className="text-sm font-semibold text-gray-900">
                        Additional Filters
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                          {activeTab === "Service Request SLA Met/SLA Violated"
                            ? getFieldsByNames(["servicereqno", "LevelFiveCompanyinSLA", "Customersla", "slarequestedby", "statusinSLA", "severityinSLA", "priorityinSLA", "assetcode", "levelfivedepartment", 'maincategoryinSLA', 'subcategoryinSLA']).map(renderField)
                            : getFieldsByNames(['RequestedBy', 'LevelFiveCompany', 'Customer', 'AssignTo', 'Severity', 'Priority', 'AssetCode', 'LevelFiveDepartment', 'MainCategory', 'SubCategory']).map(renderField)
                          }
                          {/* {getFieldsByNames(['RequestedBy', 'LevelFiveCompany', 'Customer', 'AssignTo', 'Severity', 'Priority', 'AssetCode', 'LevelFiveDepartment', 'MainCategory', 'SubCategory',]).map(renderField)} */}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  : ""
                }
                {activeTab !== "Service Request Detail History" ?
                  <div>
                    {/* <h4 className="text-sm font-semibold text-gray-900 mb-3">Date Range</h4> */}
                    {getFieldsByNames(['dateRange']).map(renderField)}
                  </div>
                  : ""
                }
              </div>
            </FilterCard>

            {/* Report Preview Section */}
            {isGeneratingReport && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto text-orange-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Report</h3>
                    <p className="text-gray-600">Please wait while we process your request...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Report Results Table */}
            {showReport && !isGeneratingReport && (activeTab !== "Service Request Detail History") && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Report Results - {activeTab}</CardTitle>
                  <div>
                    <ReusableButton
                     onClick={handlePostColumns}
              // icon={<Save className="h-4 w-4" />}
              className="bg-primary hover:bg-primary/90"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <ReusableTable
                    data={dataSource}
                    columns={cols}
                    enableSearch={true}
                    enableFiltering={true}
                    enableSorting={true}
                    enablePagination={true}
                    title={`${activeTab} Report`}
                    // enableRowReordering
                    // onRowReorder={(newData) => setDataSourse(newData)}
                    enableColumnVisibility
                    columnVisibility={columnVisibility} // 👈 pass down
                    onColumnVisibilityChange={setColumnVisibility}
                    permissions={{
                      canEdit: false,          // required
                      canDelete: false,        // required
                      canView: true,           // required
                      canExport: true,         // required
                      canManageColumns: true,  // optional
                    }}
                    enableColumnPinning
                    storageKey={activeTab === "Service Request Details" ? "SRdetails-Report" : activeTab === "Service Request SLA Met/SLA Violated" ? "SLA-Report" : "History-Report"}
                    pageSize={10}
                    enableSelection={false}
                    className="w-full"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );


};

export default ServiceDeskReports;
