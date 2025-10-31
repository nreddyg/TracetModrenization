import React, { useEffect, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, RefreshCw, Save, Search, Settings2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { BaseField, GenericObject, Options } from '@/Local_DB/types/types';
import { Controller, useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import FilterCard from '@/components/common/FilterCard';
import { Button } from '@/components/ui/button';
import { TracetTreeSelect, TreeNode } from '@/components/ui/reusable-treeSelect';
import ReusableRangePicker from '@/components/ui/reusable-range-picker';
import dayjs from 'dayjs';
import ReusableMultiSelect from '@/components/ui/reusable-multi-select';
import { ReusableButton } from '@/components/ui/reusable-button';
import ReusableTable from '@/components/ui/reusable-table';
import { MASTER_REPORTS_DB } from '@/Local_DB/Form_JSON_Data/MasterReportsDB';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLoading } from '@/store/slices/projectsSlice';
import { getCompanyHierarchy } from '@/services/servicedeskReportsServices';
import { getDepartmentData } from '@/services/departmentServices';
import { getAssetLocationDetals } from '@/services/assetLocationServices';
import { getCostCenterData } from '@/services/costCenterServices';
import { getAssetCategoryData } from '@/services/assetCategoryServices';
import { GetUsersList } from '@/services/userServices';
import { getVendorDetails } from '@/services/configurationServices';
import { GetCustomersList } from '@/services/customerServices';
import { getServiceLocationData } from '@/services/serviceLocationServices';
import { getAssetCategoryReport, getAssetLocationReport, getColumns, getCompanyHierarchyReport, getCostCenterReport, getCustomerLocations, getCustomerLocationsReport, getCustomerReport, getDepartmentReport, getServiceLocationsReport, getUserLogReport, getUserReport, getVendorReport, postColumns } from '@/services/masterReportsServices';
import { useMessage } from '@/components/ui/reusable-message';
import { ColumnDef, FilterFn, VisibilityState } from '@tanstack/react-table';
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
  showSearch?: boolean;
}
interface ColumnApiResponse {
  [section: string]: {
    [columnName: string]: true | false;
  };
}
const treefunWithParent = (data, id, idName, assetLocationUnique) => {
  const treeData = [];
  const uniqueId = idName ? idName : "id";
  data.forEach((item) => {
    if (item["parent"] || item["Parent"]) {
      let p = item["parent"] ? "parent" : "Parent";
      if (item[p] == id) {
        item.title = `${item.text || item.Name || item.LocationName}`;
        item.key = item[uniqueId];
        item.value = item[assetLocationUnique] || item[uniqueId] || item[item.Name] || item.Name || item.text || item.LocationName;
        const children = treefunWithParent(data, item[uniqueId], idName, assetLocationUnique);
        if (children.length > 0) {
          item.children = children;
        }
        treeData.push(item);
      }
    }
  });
  return treeData;
};

const ReportsMasters = () => {
  const dispatch=useAppDispatch();
  const msg=useMessage()
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Company Hierarchy');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [fields, setFields] = useState<BaseField[]>(MASTER_REPORTS_DB);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [showReport, setShowReport] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const hierarchyLevels=useAppSelector(state=>state.projects.allLevelsData);
  const lastLevels=useAppSelector(state=>state.projects.lastLevelsData);
  const [reportTabs] = useState([
    'Company Hierarchy', 'Department', 'Asset Location', 'Cost Center', 'Asset Category',
    'User', 'Vendor', 'Customer', 'Service Locations', 'Customer Locations', 'User Log'
  ]);
  const reportIds={'Company Hierarchy':100,'Department':102, 'Asset Location':101, 'Cost Center':104, 'Asset Category':103,
    'User':105, 'Vendor':106, 'Customer':107, 'Service Locations':109, 'Customer Locations':108, 'User Log':110};
  const [vendors,setVendors]=useState([]);
  const companyId=useAppSelector(state=>state.projects.companyId);
  const branchId=useAppSelector(state=>state.projects.branchId);
  const branchName=useAppSelector(state=>state.projects.branch);
  const filteredReportTabs = reportTabs.filter(tab =>
    tab.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleViewReport = async () => {
    fetchMasterReportData();
    setShowReport(true);
  }
  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultValue ?? '';
      return acc;
    }, {} as GenericObject),
    mode: 'onChange'
  });
  const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;
  
  useEffect(()=>{
    form.reset();
    if(companyId && branchName) fetchAllLookups()
  },[companyId,branchName])
  useEffect(()=>{
    let vendorsTypes=watch('VendorType')
    if(vendorsTypes && Array.isArray(vendorsTypes)){
    const filteredVendors = vendors.filter(v =>vendorsTypes.includes(v.VendorTypeID))
    setLookupsDataInJson({VendorName:{data:filteredVendors,label:'VendorName',value:'VendorID'}})
    }
  },[watch('VendorType')])
  useEffect(()=>{
    if(activeTab && companyId && branchName){
      setShowReport(false);
      setDataSource([]);
      setColumnVisibility({});
      setColumns([]);
      (async function(){
        try{
          dispatch(setLoading(true));
          const res=await getColumns(companyId,branchName,reportIds[activeTab]);
          if(res.success){
            if(res.data && res.data.GridColumnsList){
              if(activeTab==='User'){
                delete res.data.GridColumnsList["Mobile no"];
              }
              const tempCols = buildColumnsFromApi(res.data);
              setColumnVisibility(tempCols.initialVisibility)
              setColumns(tempCols.columns)
            }else{
              setColumnVisibility({})
              setColumns([])
            }
          }else{
            setColumnVisibility({})
            setColumns([])
          }
        }catch{}finally{dispatch(setLoading(false))}
      })()
    }
  },[companyId,branchName,activeTab])
  const setLookupsDataInJson = async (dataset: any) => {
    let keys = Object.keys(dataset);
    const updatedFields = fields.map(field => {
      if (keys.includes(field.name)) {
        let { data, isTree, id, idName, assetLocationUnique } = dataset[field.name];
        if (isTree) {
          let treeData = treefunWithParent(data, id, idName, assetLocationUnique);
          return { ...field, treeData };
        } else {
          let options = Array.from(
            new Map(
              dataset[field.name].data.map((item: any) => [
                item[dataset[field.name].value],
                {
                  label: item[dataset[field.name].label],
                  value: item[dataset[field.name].value],
                },
              ])
            ).values()
          ) as Options[];
          return { ...field, options };
        }
      }
      return field;
    });
    setFields(updatedFields);
  }
  const fetchAllLookups=async()=>{
    try{
      dispatch(setLoading(true));
      const [CompanyHierarchy, Dept, CostCenter, AssetLoc, AssetCat, User, Vendor, Customer, SL, CL] = await Promise.allSettled([
        getCompanyHierarchy(companyId),getDepartmentData(companyId),getCostCenterData(companyId),
        getAssetLocationDetals(companyId, branchName),getAssetCategoryData(companyId),GetUsersList(companyId),
        getVendorDetails(companyId),GetCustomersList(companyId, branchName),getServiceLocationData(companyId),
        getCustomerLocations(companyId)
      ])
      let responses={
        CompanyHierarchy:{data:CompanyHierarchy.status==='fulfilled' && CompanyHierarchy.value.data && Array.isArray(CompanyHierarchy.value.data) ? CompanyHierarchy.value.data:[],isTree:true,id:'#'},
        Department:{data:Dept.status==='fulfilled' && Dept.value.data && Array.isArray(Dept.value.data)? Dept.value.data:[],isTree:true,id:'#'},
        CostCenter:{data:CostCenter.status==='fulfilled' && CostCenter.value.data && Array.isArray(CostCenter.value.data)?CostCenter.value.data:[],id:'#',isTree:true},
        AssetLocation:{data:AssetLoc.status==='fulfilled' && AssetLoc.value.data && Array.isArray(AssetLoc.value.data) ? AssetLoc.value.data :[],isTree:true,id:"#",idName:'',assetLocationUnique:'orginalId'},
        AssetCategory:{data:AssetCat.status==='fulfilled' && AssetCat.value.data && Array.isArray(AssetCat.value.data)?AssetCat.value.data:[],isTree:true,id:"#",idName:"AssetCategoryId"},
        User:{data:User.status==='fulfilled' && User.value.data && Array.isArray(User.value.data) ? User.value.data:[],label:'UserName',value:'UserId',isTree:false},
        VendorType:{data:Vendor.status==='fulfilled' && Vendor.value.data && Vendor.value.data.Vendors && Array.isArray(Vendor.value.data.Vendors) ? Vendor.value.data.Vendors:[],label:'VendorType',value:'VendorTypeID',isTree:false},
        Customer:{data:Customer.status==='fulfilled' && Customer.value.data && Customer.value.data.Customers && Array.isArray(Customer.value.data.Customers) ?Customer.value.data.Customers:[],label:'CustomerName',value:'CustomerID',isTree:false},
        ServiceLocations:{data:SL.status==='fulfilled' && SL.value.data && Array.isArray(SL.value.data) ? SL.value.data : [],isTree:true,id:'#',idName:''},
        CustomerLocations:{data:CL.status==='fulfilled' && CL.value.data && CL.value.data.CustomerLocation && Array.isArray(CL.value.data.CustomerLocation) ? CL.value.data.CustomerLocation : [],isTree:true,id:"#",idName:"LocationId"}
      }
      setLookupsDataInJson(responses);
      setVendors(responses.VendorType.data);
    }catch{}finally{ dispatch(setLoading(false)) }
  }
  //fetch reports
  const fetchMasterReportData = async () => {
    const getIds = (field) => (watch(field)?.filter((e) => e != 0) || []).join();
    const branchIds = getIds('CompanyHierarchy');
    const depIds = getIds('Department');
    const assetLocIds = getIds('AssetLocation');
    const costCentIds = getIds('CostCenter');
    const assetCatIds = getIds('AssetCategory');
    const userIds = getIds('User');
    const vendorTypeIds = getIds('VendorType');
    const vendorNameIds = getIds('VendorName');
    const customerIds = getIds('Customer');
    const serviceLocIds = getIds('ServiceLocations');
    const customerLocIds = getIds('CustomerLocations');
    const dateRange = watch('RangePicker') || { from: '', to: '' };
    const reportMap = {
      'Company Hierarchy': {
        fn: () => getCompanyHierarchyReport(companyId, branchIds, dateRange.from, dateRange.to),
        key: 'CompanyHierarchyMasterReportDetails',
      },
      Department: {
        fn: () => getDepartmentReport(companyId, depIds, dateRange.from, dateRange.to),
        key: 'DepartmentMasterReportDetails',
      },
      'Asset Location': {
        fn: () => getAssetLocationReport(companyId, assetLocIds, dateRange.from, dateRange.to),
        key: 'AssetLocationMasterReportDetails',
      },
      'Cost Center': {
        fn: () => getCostCenterReport(companyId, costCentIds, dateRange.from, dateRange.to),
        key: 'CostCenterMasterReportDetails',
      },
      'Asset Category': {
        fn: () => getAssetCategoryReport(companyId, assetCatIds, dateRange.from, dateRange.to),
        key: 'AssetCategoryMasterReportDetails',
      },
      User: {
        fn: () => getUserReport(companyId, userIds, dateRange.from, dateRange.to),
        key: 'UserMasterReportDetails',
      },
      Vendor: {
        fn: () => getVendorReport(companyId, vendorTypeIds, vendorNameIds, dateRange.from, dateRange.to),
        key: 'VendorMasterReportDetails',
      },
      Customer: {
        fn: () => getCustomerReport(companyId, customerIds, dateRange.from, dateRange.to),
        key: 'CustomerMasterReportDetails',
      },
      'Service Locations': {
        fn: () => getServiceLocationsReport(companyId, serviceLocIds, dateRange.from, dateRange.to),
        key: 'ServiceLocationMasterReportDetails',
      },
      'Customer Locations': {
        fn: () => getCustomerLocationsReport(companyId, customerLocIds, dateRange.from, dateRange.to),
        key: 'CustomerLocationMasterReportDetails',
      },
      'User Log': {
        fn: () => getUserLogReport(companyId, dateRange.from, dateRange.to),
        key: 'UserLogMasterReportDetails',
      },
    };
    const report = reportMap[activeTab];
    if (!report) {
      msg.warning('Please select report type !!');
      return;
    }
    try {
      setIsGeneratingReport(true);
      dispatch(setLoading(true));
      const res = await report.fn();
      const data = res?.data?.[report.key] || [];
      setDataSource(data);
    } catch (error) {
      console.error(error);
      setDataSource([]);
    } finally {
      setIsGeneratingReport(false);
      dispatch(setLoading(false));
    }
  };
  //stringifying the values of objects
  const safeStringCols = (data:GenericObject) => Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value ?? false)]));
  //Save columns 
  const handleSaveColumns = () => {
    const getLevelValue = (index, keySuffix, sectionIndex) => {
      if (hierarchyLevels.length === 0) return '';
      const level = hierarchyLevels[sectionIndex]?.LevelName?.[index];
      return level ? columnVisibility[`${level.LevelName} ${keySuffix}`] : false;
    };
    const buildHierarchyCols = (prefix, sectionIndex) => {
      const cols = {};
      for (let i = 0; i <= 4; i++) {
        const suffix = `_${100 + i}`;
        cols[`${prefix}Name${suffix}`] = getLevelValue(i, 'Name', sectionIndex);
        cols[`${prefix}Code${suffix}`] = getLevelValue(i, 'Code', sectionIndex);
        cols[`CreatedBy${suffix}`] = getLevelValue(i, 'Created by', sectionIndex);
        cols[`CreatedDate1${suffix}`] = getLevelValue(i, 'Created date', sectionIndex);
      }
      return cols;
    };
    const cHCols = {
      ...buildHierarchyCols('Branch', 0),
      PANNo_104: columnVisibility['Reg / PAN'],
      TINNo_104: columnVisibility['GSTIN/UIN'],
      Address_104: columnVisibility['Address'],
      City_104: columnVisibility['City'],
      State_104: columnVisibility['State'],
      ZipCode_104: columnVisibility['Zip Code'],
      EmailAddress_104: columnVisibility['Email Address'],
      Mobile_104: columnVisibility['Mobile No']
    };
    const depCols = buildHierarchyCols('Dep', 3);
    const cCCols = buildHierarchyCols('Cost', 2);
    const aLCols = {
      BranchName: lastLevels?.Branch ? columnVisibility[`${lastLevels.Branch} Name`] : false,
      BranchCode: lastLevels?.Branch ? columnVisibility[`${lastLevels.Branch} Code`] : false,
      ...buildHierarchyCols('Loc', 1)
    };
    const aCCols = {
      MainCategory: columnVisibility['Main category name'],
      MainCategoryCode: columnVisibility['Main category code'],
      AssetAcquisitionAccount: columnVisibility['Asset acquisition account'],
      AssetDepreciationAccount: columnVisibility['Asset depreciation account'],
      DepreciationAccount: columnVisibility['Depreciation account'],
      MainCatCreatedBy: columnVisibility['Main category created by'],
      MainCategoryDate: columnVisibility['Main category created date'],
      MainCategoryDescription: columnVisibility['Main category description'],
      SubCategory: columnVisibility['Sub category name'],
      SubCategoryCode: columnVisibility['Sub category code'],
      Prefix: columnVisibility['Prefix'],
      LifeSpan: columnVisibility['Life Span'],
      SalvageValue: columnVisibility['Salvage Value'],
      SubCatCreatedBy: columnVisibility['Sub category created by'],
      SubCategoryDate: columnVisibility['Sub category created date'],
      SubCategoryDescription: columnVisibility['Sub category description']
    };
    const userCols = {
      FirstName: columnVisibility['First name'],
      LastName: columnVisibility['Last name'],
      EmailId: columnVisibility['Email id'],
      Empid: columnVisibility['Employee id'],
      Mobile: columnVisibility['Mobile no'],
      Phone: columnVisibility['Phone no'],
      UserName: columnVisibility['User name'],
      RoleName: columnVisibility['Role'],
      UserCreatedBy: columnVisibility['Created by'],
      UserDate: columnVisibility['Created date'],
      Status: columnVisibility['Status'],
      IsServiceDeskUser: columnVisibility['IsServiceDeskUser']
    };
    const vendorCols = {
      Vendorname: columnVisibility['Vendor Name'],
      VendorType: columnVisibility['Vendor Type'],
      VendorCode: columnVisibility['Vendor Code'],
      PanNo: columnVisibility['Reg / PAN'],
      GSTIN: columnVisibility['GSTIN/UIN'],
      AddressLine1: columnVisibility['Address'],
      City: columnVisibility['City'],
      StateName: columnVisibility['State'],
      CountryName: columnVisibility['Country'],
      ZipCode: columnVisibility['Zip Code'],
      Phone: columnVisibility['Phone No'],
      Mobile: columnVisibility['Mobile No'],
      EmailId: columnVisibility['Email id'],
      VendorCreatedBy: columnVisibility['Created by'],
      VendorDate: columnVisibility['Created date'],
      VendorDescription: columnVisibility['Description']
    };
    const customerCols = {
      Vendorname: columnVisibility['Customer Name'],
      PanNo: columnVisibility['Reg / PAN'],
      GSTIN: columnVisibility['GSTIN/UIN'],
      AddressLine1: columnVisibility['Address'],
      City: columnVisibility['City'],
      StateName: columnVisibility['State'],
      CountryName: columnVisibility['Country'],
      ZipCode: columnVisibility['Zip Code'],
      Phone: columnVisibility['Phone No'],
      Mobile: columnVisibility['Mobile No'],
      EmailId: columnVisibility['Email id'],
      MainLocationName: columnVisibility['Main location'],
      SubLocationName: columnVisibility['Sub location'],
      VendorCreatedBy: columnVisibility['Created by'],
      VendorDate: columnVisibility['Created date'],
      VendorDescription: columnVisibility['Description']
    };
    const customerLocCols = {
      CustomerName: columnVisibility['Customer name'],
      MainLocation: columnVisibility['Main location'],
      MainLocCreatedBy: columnVisibility['Main location Created by'],
      MainLocationDate: columnVisibility['Main location created date'],
      SubLocation: columnVisibility['Sub location'],
      SubLocCreatedBy: columnVisibility['Sub location Created by'],
      SubLocationDate: columnVisibility['Sub location created date'],
      AddressLine: columnVisibility['Address'],
      City: columnVisibility['City'],
      StateName: columnVisibility['State'],
      Country: columnVisibility['Country'],
      ZipCode: columnVisibility['Zip Code'],
      Mobile: columnVisibility['Mobile No'],
      UIN: columnVisibility['TIN / GSTIN / UIN']
    };
    const serviceLocCols = {
      MainLocation: columnVisibility['Main location'],
      MainLocCreatedBy: columnVisibility['Main location Created by'],
      MainLocationDate: columnVisibility['Main location Created date'],
      SubLocation: columnVisibility['Sub location'],
      SubLocCreatedBy: columnVisibility['Sub location Created by'],
      SubLocationDate: columnVisibility['Sub location Created date']
    };
    const userLogCols = {
      Name: columnVisibility['Name'],
      UserName: columnVisibility['User name'],
      Phone: columnVisibility['Phone no'],
      EmailId: columnVisibility['Email id'],
      Empid: columnVisibility['Employee id'],
      Login: columnVisibility['Login'],
      DeviceId: columnVisibility['Device']
    };
    const colsData = {
      'Company Hierarchy': cHCols,
      Department: depCols,
      'Asset Location': aLCols,
      'Cost Center': cCCols,
      'Asset Category': aCCols,
      User: userCols,
      Vendor: vendorCols,
      Customer: customerCols,
      'Service Locations': serviceLocCols,
      'Customer Locations': customerLocCols,
      'User Log': userLogCols
    };
    const payload = { GridColumnsDetails: [safeStringCols(colsData[activeTab])] };
    dispatch(setLoading(true));
    postColumns(companyId, branchName, reportIds[activeTab], payload)
      .then(res => {
        if (res.data.status) msg.success(res.data.message);
        else msg.warning(res.data.message || 'Failed to save grid columns data !!');
      }).catch(() => { }).finally(() => dispatch(setLoading(false)));
  };
  const multiSelectFilter: FilterFn<any> = (row, columnId, filterValue) => {
    const selected = Array.isArray(filterValue) ? filterValue : [];
    if (selected.length === 0) return true;
    const cell = row.getValue(columnId);
    if (cell == null) return false;
    if (Array.isArray(cell)) return cell.some(v => selected.includes(String(v)));
    return selected.includes(String(cell));
  };
  function buildColumnsFromApi<T extends Record<string, any>>(
    apiResponse: ColumnApiResponse,
    editableColumns: string[] = [],
    typeMapper: Record<string, "text" | "number" | "date" | "select"> = {}
  ): { columns: ColumnDef<T>[]; initialVisibility: VisibilityState } {
    const [_, columnsMeta] = Object.entries(apiResponse)[0];
    const columns: ColumnDef<T>[] = Object.entries(columnsMeta).map(
      ([colName], index) => {
        if (!colName || !colName.trim()) {
          return null;
        }
        return {
          accessorKey: colName,
          id: colName,
          header: colName,
          cell: (info) => info.getValue() ?? "",
          enableHiding: true,
          enableColumnFilter: true,
          filterFn: multiSelectFilter,
          meta: {
            editable: editableColumns.includes(colName),
            editType: typeMapper[colName] || "text",
          },
        } as ColumnDef<T>;
      }
    ).filter(Boolean) as ColumnDef<T>[];
    const initialVisibility: VisibilityState = {};
    Object.entries(columnsMeta).forEach(([colName, visible]) => {
      if (colName && colName.trim()) {
        initialVisibility[colName] = visible;
      }
    });

    return { columns, initialVisibility };
  }
  const multiSelectConfig: MultiSelectConfig = {
    isHierarchy: true,
    treeCheckable: true,
    multiple: true,
    maxTagsCount: 2,
    maxTagTextLen: 15,
    labelClassName: 'font-semibold',
    className: 'custom-tree-select',
    showSearch: true,
    onSelect: (selectedKeys, info, treeData) => {
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
    }
  };
  const renderField = (field: BaseField) => {
    const { name, label, fieldType, isRequired,jsontype = true } = field;
    if(!name || (jsontype!==activeTab && jsontype!=='common')) return null;
    const validationRules = {
      required: isRequired ? `${label} is Required` : false,
    };

    switch (fieldType) {
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
                  multiSelectConfig={multiSelectConfig}
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
                placeholder={["From date", "To date"]}
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
                  selectAll={true}
                  error={errors[name]?.message as string}
                />
              )}
            />
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="h-full overflow-y-scroll bg-gray-50">
      <header className="bg-white border-b px-6 py-2 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Master Reports</h1>
            <p className="text-sm text-gray-600">Generate comprehensive reports with advanced filtering and customization options</p>
          </div>
        </div>
      </header>
      <div className="px-3 pb-3 pt-3 space-y-3 ">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 ">
          <div className="xl:col-span-1">
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-blue-600" />
                  Report Types
                </CardTitle>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search reports..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 max-h-80 overflow-y-auto">
                {filteredReportTabs.map((tab) => (
                  <button key={tab} onClick={() => { setActiveTab(tab); form.reset() }}
                    className={cn(
                      "w-full text-left px-3 py-3 rounded-lg text-sm transition-all duration-200 flex items-center gap-2",
                      activeTab === tab
                        ? "bg-orange-100 text-orange-700 font-medium border border-orange-200 shadow-sm"
                        : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                    )}
                  >
                    <div className={cn("w-2 h-2 rounded-full",activeTab === tab ? "bg-orange-500" : "bg-gray-300")} />
                    <span className="leading-tight">{tab}</span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="xl:col-span-3 space-y-6">
            <FilterCard
              actions={
                <div className='flex items-center gap-3 xxs:flex-col xxs:justify-center xs2:flex-row md:flex-row lg:flex-row '>
                  <Button onClick={handleViewReport} disabled={isGeneratingReport} className="bg-blue-600 hover:bg-blue-700">
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
                  <Button onClick={null} variant="outline"> Clear All </Button>
                </div>
              }
            >
              <div className="space-y-2 h-full overflow-y-hidden">
                <div className='px-1'>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Primary Filters</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
                    {fields.map(renderField)}
                  </div>
                </div>
              </div>
            </FilterCard>
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
            {showReport && !isGeneratingReport && (activeTab !== "Service Request Detail History") && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Report Results - {activeTab}</CardTitle>
                  <div>
                    <ReusableButton onClick={handleSaveColumns} icon={<Save className="h-4 w-4" />}
                      className="bg-primary text-white hover:bg-primary/90 hover:text-white"
                      variant="default"
                    >
                      Apply As Default Grid Columns
                    </ReusableButton>
                  </div>
                </CardHeader>
                <CardContent>
                  <ReusableTable
                    data={dataSource}
                    columns={columns}
                    enableSearch={true}
                    enableFiltering={true}
                    enableSorting={true}
                    enablePagination={true}
                    title={`${activeTab} Report`}
                    enableColumnVisibility
                    columnVisibility={columnVisibility}
                    onColumnVisibilityChange={setColumnVisibility}
                    permissions={{
                      canEdit: false,          
                      canDelete: false,        
                      canView: true,           
                      canExport: true,         
                      canManageColumns: true, 
                    }}
                    enableColumnPinning
                    storageKey={`${activeTab} Master Report`}
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
export default ReportsMasters;
