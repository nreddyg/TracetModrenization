import React, { useEffect, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { Controller, useForm } from 'react-hook-form';
import { CHANGE_DB } from '@/Local_DB/Form_JSON_Data/ChangeAssetCategoryDB';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { TracetTreeSelect, TreeNode } from '@/components/ui/reusable-treeSelect';
import { ReusableButton } from '@/components/ui/reusable-button';
import ReusableTable from '@/components/ui/reusable-table';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/store/slices/projectsSlice';
import { useMessage } from '@/components/ui/reusable-message';
import { GetChangeAssetCategories, GetGetColumnsForChangeAssetCategories } from '@/services/changeInAssetCategoryServices';
import { ColumnDef, FilterFn, VisibilityState } from '@tanstack/react-table';
import { useAppSelector } from '@/store';
import { getItemCategoryData } from '@/services/itemCategoryServices';
import { getAssetCategoryData } from '@/services/assetCategoryServices';
import { getMainCategoryLookUp, getSubCategoryLookUp } from '@/services/servicedeskReportsServices';

const ChangeAssetCategory = () => {

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
    }
  };
  const [searchTab, setSearchTab] = useState<'asset' | 'barcode'>('asset');
  const [fields, setFields] = useState<BaseField[]>(CHANGE_DB);
    const [dataSource, setDataSource] = useState([])
      const [columnVisibility, setColumnVisibility] = useState({});
      const [cols, setCols] = useState([])
        const companyId = useAppSelector(state => state.projects.companyId);
    const branch = useAppSelector(state => state.projects.branch) || '';


      
    

  const dispatch = useDispatch()
      const msg = useMessage()
  useEffect(()=>{
  fetchColumns(branch,companyId)
  getMainCategoryForDropdown(companyId)
  },[companyId,branch])
  
 

  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultChecked ?? '';
      return acc;
    }, {} as GenericObject),
    mode: 'onChange',
  });
  const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;
  const selectedSourceMainCategory = watch("SourceMainCategory") || null;
  const selectedTargetMainCategory = watch("TargetMainCategory") || null;

useEffect(() => {
    if (selectedSourceMainCategory) {
      getSubCategoryDetails(companyId, selectedSourceMainCategory)
    } else {
      getSubCategoryDetails(companyId, null)
    }
  }, [selectedSourceMainCategory, companyId])

  useEffect(() => {
    if (selectedTargetMainCategory) {
      getSubCategoryDetails(companyId, selectedTargetMainCategory)
    } else {
      getSubCategoryDetails(companyId, null)
    }
  }, [selectedTargetMainCategory, companyId])
    useEffect(()=>{
  fetchChangeAssetCategoryGetData(branch,watch("SourceMainCategory"),watch("SourceSubCategory"),companyId)
  },[watch("SourceMainCategory"),watch("SourceSubCategory")])
    interface ColumnApiResponse {
    [section: string]: {
      [columnName: string]: "true" | "false";
    };
  }
 const getMainCategoryForDropdown = async (id) => {
    dispatch(setLoading(true))
    await getMainCategoryLookUp(id)
      .then((res) => {
        if (res.data !== undefined) {
          res.data.CategoriesLookup.forEach((element) => {
            element["label"] = element.CategoryName
            element["value"] = element.CategoryId
          })
          const tempData = fields;
          const itemIndex = tempData.findIndex((x) => x.name === "SourceMainCategory");
          const itemIndex1 = tempData.findIndex((x) => x.name === "TargetMainCategory");
          tempData[itemIndex].options = res.data.CategoriesLookup;
          tempData[itemIndex1].options = res.data.CategoriesLookup;
          setFields(structuredClone(tempData))
        }
      }).catch((err) => { })
      .finally(() => { dispatch(setLoading(false)) })
  }
    // fetching SubCategories list based on main Asset selected
    async function getSubCategoryDetails(compId: string, id: number | null) {
      dispatch(setLoading(true));
      try {
        if (id == null) {
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
          if (id === selectedSourceMainCategory) {
            const idx = data.findIndex(x => x.name === "SourceSubCategory");
            if (idx >= 0) data[idx].options = subCategories;
          }
          if (id === selectedTargetMainCategory) {
            const idx = data.findIndex(x => x.name === "SourceSubCategory");
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
   
  const getFieldsByNames = (names: string[]) => fields.filter(f => names.includes(f.name!));

  const renderField = (field: BaseField) => {
    const { name, label, fieldType, isRequired, validationPattern, patternErrorMessage, dependsOn, show = true } = field;
    if (!show && dependsOn && !watch(dependsOn)) {
      return null;
    }
    const validationRules = {
      required: isRequired ? `${label} is Required` : false,
    };
    switch (fieldType) {
      case 'text':
        return (
          <Controller
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl, fieldState }) => (
              <ReusableInput
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={fieldState.error?.message}
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

      default:
        return null;
    }
  }
  const multiSelectFilter: FilterFn<any> = (row, columnId, filterValue) => {
      const selected = Array.isArray(filterValue) ? filterValue : [];
      if (selected.length === 0) return true;
      const cell = row.getValue(columnId);
      if (cell == null) return false;
      if (Array.isArray(cell)) return cell.some(v => selected.includes(String(v)));
      return selected.includes(String(cell));
    };
    let keyMatchingObject={
      "Asset code": "AssetCode",
        "Asset Name": "AssetName",
        "Customer Asset No": "CustomerAssetNo",
        "Barcode No": "BarcodeNo",
        "Acquisition Type": "AcquisitionType",
        "Dependency Type": "DependencyType",
        "Main Category": "MainCategory",
        "Sub Category": "SubCategory",
        "Parent Asset Code": "ParentAssetCode",
        "Working Status": "WorkingStatus",
        "Barcode Option": "BarcodeOptions",
        "Description": "Description",
        "Purchased Price (₹)": "PurchasedPrice",
        "Purchased Date": "PurchasedDate",
        "Placed In Service Date": "PlacedInServiceDate",
        "Capitalization Date": "CapitalizationDate",
        "Received Date": "ReceivedDate",
        "Warranty Upto": "WarrantyUpto",
        "Bill No": "BillNo",
        "Bill Date": "BillDate",
        "PO Number": "PONumber",
        "PO Date": "PODate",
        "Seller": "Seller",
        "Manufacturer": "Manufacturer",
        "Model Number": "ModelNumber",
        "Year Of Manufacturer": "YearOfManufacturer",
        "Capacity": "Capacity",
        "Serial Number": "SerialNumber",
        "GL Account": "GLAccount",
        "HSN Code": "HSNCode",
        "level five company": "true",
        "level one location": "true",
        "level two location": "true",
        "level three location": "true",
        "level four location": "true",
        "level five location": "true",
        "level one department": "true",
        "level two department": "true",
        "level three department": "true",
        "level four department": "true",
        "level five department": "true",
        "level one cost center": "true",
        "level two cost center": "true",
        "level three cost center": "true",
        "level four cost center": "true",
        "level five cost center": "true",
        "Assigned To": "AssignedTo",
        "Depreciation Applicable": "DepreciationApplicable",
        "Asset Useful Life ": "AssetUsefulLife",
        "Salvage Value (₹)": "SalvageValue",
        "Forex Applicable": "ForexApplicable",
        "Expected Life EndDate": "ExpectedLifeEndDate",
        "Leased Vendor Name": "LeasedVendorName",
        "Lease Expiry Date": "LeaseExpiryDate",
        "Party Name": "PartyName",
        "Proposal Number": "ProposalNumber",
        "Created Date": "CreatedDate",
        "Asset Owner": "AssetOwner",
        "Is Asset Tagable": "IsAssetTagable"
    }
 function buildColumnsFromApi<T extends Record<string, any>>(
    apiResponse: ColumnApiResponse,
    editableColumns: string[] = [],
    typeMapper: Record<string, "text" | "number" | "date" | "select"> = {}
  ): { columns: ColumnDef<T>[]; initialVisibility: VisibilityState } {
    const [_, columnsMeta] = Object.entries(apiResponse)[0];

    const columns: ColumnDef<T>[] = Object.entries(columnsMeta).map(
      ([colName], index) => {
        // Ensure we have a valid column name
        if (!colName || !colName.trim()) {
          console.warn(`Column at index ${index} has empty name, skipping`);
          return null;
        }
        return {
          accessorKey: Object.keys(keyMatchingObject).includes(colName)?keyMatchingObject[colName]:colName,
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
    ).filter(Boolean) as ColumnDef<T>[]; // Remove null entries

    // build VisibilityState (true/false per column)
    const initialVisibility: VisibilityState = {};
    Object.entries(columnsMeta).forEach(([colName, visible]) => {
      if (colName && colName.trim()) {
        initialVisibility[colName] = visible === "true";
      }
    });

    return { columns, initialVisibility };
  }

   async function fetchChangeAssetCategoryGetData(branch,main,sub,companyId) {
          dispatch(setLoading(true))
          await GetChangeAssetCategories(branch,main,sub,companyId).then(res => {
              if (res.data && res.data.status == undefined) {
                  setDataSource(res.data.AssetTransferListDetails)
              } else {
                  setDataSource([])
                  msg.warning(res.data.message || "No Data Found")
              }
          }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
      }

       async function fetchColumns(branch:any,compId: string) {
          dispatch(setLoading(true))
          await GetGetColumnsForChangeAssetCategories(branch,compId).then(res => {
            if (res.success && res.data.status === undefined) {
              const tempCols = buildColumnsFromApi(res.data)
              setColumnVisibility(tempCols.initialVisibility)
              setCols(tempCols.columns)
      
            } else {
              setCols([])
            }
          }).catch(err => { }).finally(() => {
            dispatch(setLoading(false)) 
            // fetchServiceRequestSLAmetViolatedReport(companyId, formatToString(watch("LevelFiveCompanyinSLA")), formatToString(watch("serviceReqTypeSLA")), formatToString(watch("servicereqno")), formatToString(watch("statusinSLA")), formatToString(watch("slarequestedby")), "", "", formatToString(watch("Customersla")), formatToString(watch("AssignTo")["Users"]), formatToString(watch("AssignTo")["User Group"]), formatToString(watch("severityinSLA")), formatToString(watch("priorityinSLA")), formatToString(watch("slastatus")), formatToString(watch("levelfivedepartmentINsla")), formatToString(watch("maincategoryinSLA")), formatToString(watch("subcategoryinSLA")), formatToString(watch("assetcode")))
          })
        }

  return (
    <div className="min-h-screen bg-background transition-all duration-300 ease-in-out">
      <header className="bg-card border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Fixed Assets</span>
            <span>/</span>
            <span className="text-foreground font-medium">Change Asset Category</span>
          </div>
        </div>
      </header>
<ScrollArea>
      <div className="p-6  space-y-6 h-[70vh]  ">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Change Asset Category</h1>
          <Button className="bg-[hsl(var(--chart-1))] hover:bg-[hsl(var(--chart-1))]/90">Submit</Button>
        </div>

        {/* Category Selection */}

        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4'>
          {getFieldsByNames(['SourceMainCategory', 'TargetMainCategory']).map((field) => {
            return <div className="flex items-center space-x-2">
              {renderField(field)}
            </div>;
          })}
        </div>
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4'>
          {getFieldsByNames(["SourceSubCategory", "TargetSubCategory"]).map((field) => {
            return <div className=" space-x-2">
              {renderField(field)}
            </div>;
          })}
        </div>

        <div className='grid grid-cols-6 md:grid-cols-6 lg:grid-cols-6 gap-4'>
          {getFieldsByNames(["AssetCode", "BarCode", "LevelFiveLocation", "LevelFiveDepartment"]).map((field) => {
            return <div className=" space-x-2">
              {renderField(field)}
            </div>;
          })}
          <div className='space-x-2 flex items-center justify-between'>

          
          <ReusableButton
            variant="primary"
          
            onClick={() => { }}
          >
            Apply Filters
          </ReusableButton>
          
          </div>
          <div className='space-x-2 flex items-center justify-between'>

         
           <ReusableButton
            variant="text"
          
            onClick={() => { }}
          >
            Reset
          </ReusableButton>
           </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg bg-card p-3">
           <ReusableTable
                              // key={activeTab}
                              data={dataSource}
                              columns={cols}
                              enableSearch={true}
                              enableFiltering={true}
                              enableSorting={true}
                              enablePagination={true}
                                enableColumnVisibility
                    columnVisibility={columnVisibility} // 👈 pass down
                    onColumnVisibilityChange={setColumnVisibility}
                    exportOptions={["csv", "excel"]}
                    permissions={{
                      canEdit: false,          // required
                      canDelete: false,        // required
                      canView: true,           // required
                      canExport: false,         // required
                      canManageColumns: true,  // optional
                    }}
                    enableSelection={true}

                          
                              // enableRowReordering
                              // onRowReorder={(newData) => setDataSourse(newData)}
                             
                            />
        </div>
      </div>
      </ScrollArea>

    </div>
  );
};

export default ChangeAssetCategory;
