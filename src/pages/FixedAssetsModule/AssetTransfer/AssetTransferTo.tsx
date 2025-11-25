import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ReusableDatePicker } from "@/components/ui/reusable-datepicker";
import { ReusableDropdown } from "@/components/ui/reusable-dropdown";
import { ReusableInput } from "@/components/ui/reusable-input";
import { useMessage } from "@/components/ui/reusable-message";
import ReusableMultiSelect from "@/components/ui/reusable-multi-select";
import ReusableTable from "@/components/ui/reusable-table";
import { TracetTreeSelect } from "@/components/ui/reusable-treeSelect";
import { ScrollArea } from "@/components/ui/scroll-area"
import { ASSET_TRANSFER_TO_DB } from "@/Local_DB/Form_JSON_Data/AssetsTransferToDB";
import { BaseField, GenericObject } from "@/Local_DB/types/types";
import { getAssetsTrnsfToList, getBranchDetails, getDepartmentDetails, getLocationDetails, getPlaceOfSupply } from "@/services/assetTransferToServices";
import { useAppDispatch, useAppSelector } from "@/store/reduxStore";
import { setLoading } from "@/store/slices/projectsSlice";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";


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
  levelfivecompany: OptType
  levelfivelocation: OptType
}

const AssetTransferTo = () => {
  const location = useLocation();
  const [fields, setFields] = useState<BaseField[]>(ASSET_TRANSFER_TO_DB);
  const [supplyStatus, setSupplyStatus] = useState(null);
  const companyId = useAppSelector(state => state.projects.companyId);
  const branch = useAppSelector(state => state.projects.branch) || '';
  const [dataSource, setDataSource] = useState([]);
  const dispatch = useAppDispatch();
  const msg = useMessage()
  const { selectedRecord, BranchName } = location.state || {};
  const assetIds = selectedRecord.map((asset) => asset.AssetID).join(",");

  useEffect(() => {
    if (companyId && branch && assetIds) getAssetsList(branch, assetIds, companyId)
  }, [branch, assetIds, companyId])


  useEffect(() => {
    if (companyId) fetchAllLookUps(companyId)
  }, [branch, companyId])

  useEffect(() => {
    if (branch) {
      // getPOSupply(branch, "Level Aidhu  Companyyy", companyId);
      getPOSupply(branch, "Vizag", companyId);
    }
  }, [branch])

  const columns = [
    { id: 'Id', accessorKey: "Id", header: "S.NO" },
    { id: 'AssetName', accessorKey: "AssetName", header: "Asset Name" },
    {
      id: 'HSNCode', accessorKey: "HSNCode", header: "HSN Code",
      cell: ({ row }) => (

        <span className='flex'>
          <ReusableInput
            value={row.original.HSNCode}
            onChange={(e) => handleChange(e.target.value, row.id, "HSNCode")}
            name='HSNCode'
            // isRequired={true}
            className='m-2 mt-0 me-0 bg-white border-2'
            size='small'
          ></ReusableInput>
        </span>
      )
    },
    {
      id: 'PurchasedPrice', accessorKey: "PurchasedPrice", header: "Taxable Value",
      cell: ({ row }) => (

        <span className='flex'>
          <ReusableInput
            value={row.original.PurchasedPrice}
            onChange={(e) => handleChange(e.target.value, row.id, "PurchasedPrice")}
            name='PurchasedPrice'
            // isRequired={true}
            className='m-2 mt-0 me-0 bg-white border-2'
            size='small'
          ></ReusableInput>
        </span>
      )
    },
    ...(supplyStatus === 1 ? [
      {
        id: "CGST/Rate", accessorKey: "CGSTRate", header: "CGSTRate",
        cell: ({ row }) => (

          <span className='flex'>
            <ReusableInput
              value={row.original.CGSTRate}
              onChange={(e) => handleChange(e.target.value, row.id, "CGSTRate")}
              name='CGSTRate'
              // isRequired={true}
              className='m-2 mt-0 me-0 bg-white border-2'
              size='small'
            ></ReusableInput>
          </span>
        )
      },
      { id: "CGST/Amt", accessorKey: "CGSTAmount", header: "CGSTAmount" },
      {
        id: "SGST/UTGST/RatE", accessorKey: "SGSTRate", header: "SGSTRate",
        cell: ({ row }) => (

          <span className='flex'>
            <ReusableInput
              value={row.original.SGSTRate}
              onChange={(e) => handleChange(e.target.value, row.id, "SGSTRate")}
              name='SGSTRate'
              // isRequired={true}
              className='m-2 mt-0 me-0 bg-white border-2'
              size='small'
            ></ReusableInput>
          </span>
        )
      },
      { id: "SGST/UTGST/Amt", accessorKey: "SGSTAmount", header: "SGSTAmount" }
    ] : [
      {
        id: "IGST/Rate", accessorKey: "IGSTRate", header: "IGSTRate",
        cell: ({ row }) => (

          <span className='flex'>
            <ReusableInput
              value={row.original.IGSTRate}
              onChange={(e) => handleChange(e.target.value, row.id, "IGSTRate")}
              name='IGSTRate'
              // isRequired={true}
              className='m-2 mt-0 me-0 bg-white border-2'
              size='small'
            ></ReusableInput>
          </span>
        )
      },
      { id: "IGST/Amt", accessorKey: "IGSTAmount", header: "IGSTAmount" }
    ]),
    {
      id: 'CessRate', accessorKey: "CessRate", header: "Cess Rate",
      cell: ({ row }) => (
        <span className='flex'>
          <ReusableInput
            value={row.original.CessRate}
            onChange={(e) => handleChange(e.target.value, row.id, "CessRate")}
            name='CessRate'
            // isRequired={true}
            className='m-2 mt-0 me-0 bg-white border-2'
            size='small'
          ></ReusableInput>
        </span>
      )
    },
    { id: 'CessAmount', accessorKey: "CessAmount", header: "Cess Amount" },
  ]

  function handleChange(val, id, accessorKey) {
    let data = dataSource
    data[parseInt(id)][accessorKey] = val
    setDataSource(data)
  }

  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultChecked ?? '';
      return acc;
    }, {} as GenericObject),
  });

  const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;
  const getFieldsByNames = (names: string[]) => fields.filter(f => names.includes(f.name!));

  const renderField = (field: BaseField) => {
    const { name, label, fieldType, isRequired, show = true } = field;
    if (!name || !show) return null;
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
                // multiSelectConfig={multiSelectConfig1}
                />
              )}
            />
          </div>
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
                />
              )}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const getAssetsList = async (branch, assetIds, companyId) => {
    dispatch(setLoading(true));
    await getAssetsTrnsfToList(branch, assetIds, companyId).then((res) => {
      if (res?.data?.AssetDetailsListForAssetTransfer) {
        setDataSource(res.data.AssetDetailsListForAssetTransfer)
      } else {
        setDataSource([])
      }
    }).catch((err) => { }).finally(() => { dispatch(setLoading(false)) })
  }

  const getPOSupply = async (fromBranch, toBranch, companyId) => {
    dispatch(setLoading(true));
    await getPlaceOfSupply(fromBranch, toBranch, companyId).then((res) => {
      if (res.data !== undefined) {
        setSupplyStatus(res.data.Status)
      } else {

      }
    })
  }

  //store lookups data in json
  const setLookupsDataInJson = (lookupsData: allResponsesType): void => {
    const arr = Object.keys(lookupsData)
    const groupNames: string[] = []
    const opts: { [key: string]: any } = {}
    arr.forEach((obj) => {
      let ret = []
      if (lookupsData[obj].treedata) {
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
    const data = structuredClone(fields);
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
    setFields(data);
    // setFieldsCopy(data);
  }


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

  async function fetchAllLookUps(companyId) {
    dispatch(setLoading(true));
    try {
      const [SRTBranchListLookup, locationDetails, deptTreeData] =
        await Promise.allSettled([
          getBranchDetails(companyId),
          getLocationDetails(companyId, branch),
          getDepartmentDetails(companyId)
        ]);
      const allResponses = {
        levelfivecompany: { data: SRTBranchListLookup.status === 'fulfilled' && SRTBranchListLookup.value.success && SRTBranchListLookup.value.data ? SRTBranchListLookup.value.data.filter((ele: any) => ele.id !== 0 && ele.parent !== '#' && ele.type !== '99') : [], label: 'Name', value: 'id' },
        levelfivelocation: { data: locationDetails.status === "fulfilled" && locationDetails.value.success && locationDetails.value.data ? locationDetails.value.data.filter((ele: any) => ele.orginalId !== 0 && ele.parent !== '#' && ele.type !== '99') : [], label: 'Name', value: 'orginalId' },
        levelfivedepartment: {
          data: deptTreeData.status === "fulfilled" && deptTreeData.value.success
            && deptTreeData.value.data ? treefunWithParent(deptTreeData.value.data, "#", '', '', 'Code') : [],
          treedata: true,
        },
      };
      console.log("responses", allResponses);
      setLookupsDataInJson(allResponses);
    } catch (error) {
      msg.warning(`Error fetching lookups: ${error}`)
    } finally {
      dispatch(setLoading(false));
    }
  }

  //   const getBranchList = async (companyId) => {
  //   dispatch(setLoading(true))
  //   await getBranchDetails(companyId).then((res) => {
  //     if (res.data !== undefined) {
  //       const store = fields
  //       res.data?.forEach((x) => {
  //         x["label"] = x.Name;
  //         x["value"] = x.Name;
  //       });
  //       const branchIndex = store.findIndex((x) => x.name === "BranchName");
  //       const locIndex = store.findIndex((x) => x.name === "LocationId");
  //       store[branchIndex].options = res.data.filter(x => x.parent !== "#");
  //       // store[branchIndex].label = allLastLevelsDetailsFromStore["Branch"];
  //       // store[branchIndex].placeholder = allLastLevelsDetailsFromStore["Branch"]
  //       // store[locIndex].label = allLastLevelsDetailsFromStore["AssetLocation"];
  //       // store[locIndex].placeholder = allLastLevelsDetailsFromStore["AssetLocation"]
  //       setFields(structuredClone(store));
  //     }
  //   }).catch(()=>{}).finally(() => { dispatch(setLoading(false)) })
  // }

  const commonFields = ['levelfivecompany', 'levelfivedepartment', 'levelfivecostcenter', 'placeofsupply', 'levelfivelocation', 'transferdate']

  return (
    <ScrollArea className='h-full'>
      <div className="p-4 sm:p-4 space-y-4 sm:space-y-4">
        <div className="pt-0">
          <Card className="border-0 shadow-sm">
            <CardContent className='mt-1 py-2 flex flex-col gap-5'>
              <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFieldsByNames(supplyStatus === 1 ? commonFields : [...commonFields, 'remarks']).map((field) => {
                  return (<div> {renderField(field)} </div>)
                })}
              </div>
              <div>
                <h1>Asset Transfer Details</h1>
                <ReusableTable
                  data={dataSource}
                  columns={columns}
                  // actions={tableActions2}
                  // permissions={tablePermissions}
                  title=""
                  //    onRefresh={handleRefresh}
                  enableSearch={false}
                  enableSelection={false}
                  enableExport={false}
                  enableColumnVisibility={false}
                  enablePagination={true}
                  enableSorting={true}
                  enableFiltering={true}
                  pageSize={10}
                  emptyMessage="No user groups found"
                  rowHeight="normal"
                  storageKey="usergroups-table"
                />
              </div>
              <div>
                <h6 className='mb-2 px-1' style={{ fontSize: "15px" }}>Delivery Challan Details</h6>
                <div className='p-4 flex flex-wrap gap-5 justify-content-between' style={{ width: "60%", backgroundColor: "#f1f5fa" }}>
                  <div><p style={{ fontSize: "13px", color: "#67708c" }}>Total Taxable Value</p><h6 style={{ fontSize: "9px" }}>{"totalTaxable"}</h6></div >
                  <div> <p style={{ fontSize: "13px", color: "#67708c" }}>GST</p><h6>{"gst"}</h6></div>
                  <div><p style={{ fontSize: "13px", color: "#67708c" }}>Cess</p><h6>{"cess"}</h6>  </div>
                  <div><p style={{ fontSize: "13px", color: "#67708c" }}>Total invoice Value</p><h6>{"totalInvoiceValue"}</h6></div>
                  <div><p style={{ fontSize: "13px", color: "#67708c" }}>Total invoice(In words)</p>
                    {/* <h6>{`${inWords.charAt(0).toUpperCase() + inWords.slice(1)}`}</h6> */}
                    <h6>inWordsinWords</h6>

                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  )
}

export default AssetTransferTo