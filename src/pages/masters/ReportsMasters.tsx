import React, { useEffect, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, RefreshCw, Save, Search, Settings2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
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
import { getCustomerLocations } from '@/services/masterReportsServices';
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

const ReportsMasters = () => {
  const dispatch=useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [fields, setFields] = useState<BaseField[]>(MASTER_REPORTS_DB);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [showReport, setShowReport] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const [reportTabs] = useState([
    'Company Hierarchy', 'Department', 'Asset Location', 'Cost Center', 'Asset Category',
    'User', 'Vendor', 'Customer', 'Service Locations', 'Customer Locations', 'User Log'
  ]);
  const companyId=useAppSelector(state=>state.projects.companyId);
  const branchId=useAppSelector(state=>state.projects.branchId);
  const branchName=useAppSelector(state=>state.projects.branch);
  const filteredReportTabs = reportTabs.filter(tab =>
    tab.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleViewReport = async () => {
    setIsGeneratingReport(true);
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
    if(companyId && branchName) fetchAllLookups()
  },[companyId,branchName])
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
        CompanyHierarchy:{data:CompanyHierarchy.status==='fulfilled' && CompanyHierarchy.value.data && Array.isArray(CompanyHierarchy.value.data) ? CompanyHierarchy.value.data:[],label:'Name',value:'id'},
        Department:{data:Dept.status==='fulfilled' && Dept.value.data && Array.isArray(Dept.value.data)? Dept.value.data:[],label:'Name',value:'id'},
        CostCenter:{data:CostCenter.status==='fulfilled' && CostCenter.value.data && Array.isArray(CostCenter.value.data)?CostCenter.value.data:[],label:'Name',value:'id'},
        AssetLocation:{data:AssetLoc.status==='fulfilled' && AssetLoc.value.data && Array.isArray(AssetLoc.value.data) ? AssetLoc.value.data :[],label:'Name',value:'orginalId'},
        AssetCategory:{data:AssetCat.status==='fulfilled' && AssetCat.value.data && Array.isArray(AssetCat.value.data)?AssetCat.value.data:[],label:'Name',value:'AssetCategoryId'},
        User:{data:User.status==='fulfilled' && User.value.data && Array.isArray(User.value.data) ? User.value.data:[],label:'UserName',value:'UserId'},
        VendorType:{data:Vendor.status==='fulfilled' && Vendor.value.data && Vendor.value.data.Vendors && Array.isArray(Vendor.value.data.Vendors) ? Vendor.value.data.Vendors:[],label:'VendorType',value:'VendorTypeID'},
        Customer:{data:Customer.status==='fulfilled' && Customer.value.data && Customer.value.data.Customers && Array.isArray(Customer.value.data.Customers) ?Customer.value.data.Customers:[],label:'CustomerName',value:'CustomerID'},
        ServiceLocations:{data:SL.status==='fulfilled' && SL.value.data && Array.isArray(SL.value.data) ? SL.value.data : [],label:'LocationName',value:'id'},
        CustomerLocations:{data:CL.status==='fulfilled' && CL.value.data && CL.value.data.CustomerLocation && Array.isArray(CL.value.data.CustomerLocation) ? CL.value.data.CustomerLocation : [],label:'LocationName',value:'LocationId'}
      }
      console.log('responses',responses)
    }catch{}finally{ dispatch(setLoading(false)) }

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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <ReusableButton onClick={null} icon={<Save className="h-4 w-4" />}
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
