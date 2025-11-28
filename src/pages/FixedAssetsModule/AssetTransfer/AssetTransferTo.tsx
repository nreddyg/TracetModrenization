import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ReusableButton } from "@/components/ui/reusable-button";
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
import { getAssetsTrnsfToList, getBranchDetails, getCostCenterDetails, getDepartmentDetails, getLocationDetails, getPlaceOfSupply, postInterTransferDetails, postIntraTransferDetails } from "@/services/assetTransferToServices";
import { useAppDispatch, useAppSelector } from "@/store/reduxStore";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { setLoading } from "@/store/slices/projectsSlice";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaAngleRight } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { MultiSelectConfig } from "@/pages/masters/ReportsMasters";
import numWords from 'num-words';
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
}

const AssetTransferTo = () => {
  const location = useLocation();
  const [fields, setFields] = useState<BaseField[]>(ASSET_TRANSFER_TO_DB);
  const [supplyStatus, setSupplyStatus] = useState(1);
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
  const companyId = useAppSelector(state => state.projects.companyId);
  const branch = useAppSelector(state => state.projects.branch) || '';
  const branchId = useAppSelector(state => state.projects.branchId) || '';
  const [dataSource, setDataSource] = useState([]);
  const [totalTaxable, setTotalTaxable] = useState(0);
  const [cess, setCess] = useState(0);
  const [gst, setGst] = useState(0);
  const [totalInvoiceValue, setTotalInvoiceValue] = useState(0);
  const [inWords, setInWords] = useState("");
  const dispatch = useAppDispatch();
  const [toBranch, setToBranch] = useState("");
  console.log("tobranch", toBranch);
  const lastLevelData = useAppSelector(state => state.projects.lastLevelsData);

  const msg = useMessage()
  const { selectedRecord, BranchName } = location.state || {};
  const assetIds = selectedRecord.map((asset) => asset.AssetID).join(",");

  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultChecked ?? '';
      return acc;
    }, {} as GenericObject),
  });

  function calculateTotalTaxableValue() {
    const totalTaxableValue = dataSource.reduce((acc, x) => acc + parseFloat(x.PurchasedPrice), 0);
    const totalCess = dataSource.reduce((acc, x) => acc + parseFloat(x.CessAmount), 0);
    const totalCGst = dataSource.reduce((acc, x) => acc + parseFloat(x.CGSTAmount), 0);
    const totalsgst = dataSource.reduce((acc, x) => acc + parseFloat(x.SGSTAmount), 0);
    const totalIgst = dataSource.reduce((acc, x) => acc + parseFloat(x.IGSTAmount), 0);
    const GstValue = supplyStatus === 1 ? (parseFloat(parseFloat(totalCGst + totalsgst).toFixed(2))) : parseFloat(totalIgst.toFixed(2))
    setTotalTaxable(totalTaxableValue);
    setCess(totalCess);
    setGst(GstValue);
  }
  function calculateTotalInvoice() {
    setTotalInvoiceValue(parseFloat((totalTaxable + cess + gst).toFixed(2)))
  }
  useEffect(() => {
    calculateTotalTaxableValue();
  }, [dataSource])
  useEffect(() => {
    calculateTotalInvoice();
  }, [dataSource, totalTaxable, cess, gst])

  const { control, register, handleSubmit, trigger, watch, getValues, setValue, reset, formState: { errors } } = form;

  useEffect(() => {
    if (companyId && branch && assetIds) getAssetsList(branch, assetIds, companyId)
  }, [branch, assetIds, companyId])

  const companyValue = watch('levelfivecompany');

  useEffect(() => {
    if (companyId) fetchAllLookUps(companyId)
  }, [branch, companyId])

  function ConvertNumToWord() {
    if (!isNaN(totalInvoiceValue) && totalInvoiceValue !== 0) {
      if (totalInvoiceValue?.toString()?.includes(".")) {
        const splitValue = totalInvoiceValue?.toString()?.split(".");
        if (splitValue[0].length <= 9) {
          const wholeNum = numWords(parseInt(splitValue[0]))
          let decimalNum;
          if (splitValue[1].length === 1) {
            const zeroAdd = `${splitValue[1]}0`
            decimalNum = numWords(parseInt(zeroAdd))
          }
          else {
            decimalNum = numWords(parseInt(splitValue[1]))
          }
          setInWords(`${wholeNum} Rupees And ${decimalNum} Paisa Only`)
        }
        else {
          setInWords('');
        }
      }
      else {
        const intoWords = numWords(totalInvoiceValue)
        setInWords(`${intoWords} Rupees Only`);
      }

    } else {
      setInWords('');
    }
  }

  useEffect(() => {
    ConvertNumToWord()
  }, [totalInvoiceValue])

  useEffect(() => {
    if (companyValue) {
      const jsonCopy = structuredClone(fields);
      const obj = jsonCopy.find((obj) => obj.name === "levelfivecompany");
      if (obj && obj.options) {
        const findOpt = obj.options.find((opt) => opt.value === companyValue);
        setToBranch(findOpt?.label)
      }
    }
  }, [companyValue, companyId])

  useEffect(() => {
    if (toBranch) {
      getPOSupply(branch, toBranch, companyId);
      assetLocationList(companyId, toBranch);
    }
  }, [toBranch, companyId])

  const placeSupplyValue = watch("placeofsupply");

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
              defaultValue={row.original.CGSTRate}
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
              defaultValue={row.original.SGSTRate}
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
              defaultValue={row.original.IGSTRate}
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
            defaultValue={row.original.CessRate}
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

  // const handleTabSave = (row) => {
  //   console.log(row,"row")
  //   const newData = [...dataSource];
  //   const index = row.id ?? newData.findIndex((item) => item.AssetID === row.AssetID);
  //   const item = newData[index];

  //   newData.splice(index, 1, {
  //     ...item,
  //     ...row,
  //     CessAmount: (row.CessRate && row.CessRate >= 0) ? Math.round(((row.CessRate / 100) * row.PurchasedPrice) * 100) / 100 : 0,
  //     CGSTAmount: (row.CGSTRate && row.CGSTRate >= 0) ? Math.round(((row.CGSTRate / 100) * row.PurchasedPrice) * 100) / 100 : 0,
  //     SGSTAmount: (row.SGSTRate && row.SGSTRate >= 0) ? Math.round(((row.SGSTRate / 100) * row.PurchasedPrice) * 100) / 100 : 0,
  //     IGSTAmount: (row.IGSTRate && row.IGSTRate >= 0) ? Math.round(((row.IGSTRate / 100) * row.PurchasedPrice) * 100) / 100 : 0,
  //   });

  //   if (parseFloat(row.CessRate) + parseFloat(row.CGSTRate) + parseFloat(row.SGSTRate) + parseFloat(row.IGSTRate) > 100) {
  //     return msg.warning("Rate Cannot be More than 100");
  //   }

  //   if ([row.CessRate, row.CGSTRate, row.SGSTRate, row.IGSTRate, row.PurchasedPrice].some(v => parseFloat(v) < 0)) {
  //     return msg.warning("Does not exist negative values");
  //   }

  //   if ([row.CessRate, row.CGSTRate, row.SGSTRate, row.IGSTRate, row.PurchasedPrice].some(v => isNaN(v) || v === "")) {
  //     return msg.warning("Only Allows Numeric Values");
  //   }
  //   setDataSource(newData);
  // };

  // function handleChange(val, id, accessorKey) {
  //   let data = dataSource
  //   data[parseInt(id)][accessorKey] = val
  //   setDataSource(data)
  // }

  const handleTabSave = (row) => {
    console.log(row, "483")
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.AssetID === item.AssetID);
    const item = newData[index];
    console.log(item,"303")
    newData.splice(index, 1, {
      ...item,
      ...row,
      CessAmount: (row.CessRate.length === 0 || parseFloat(row.CessRate) < 0) ? 0 : Math.round(((parseFloat(row.CessRate) / 100) * row.PurchasedPrice) * 100) / 100,
      CGSTAmount: (row.CGSTRate.length === 0 || parseFloat(row.CGSTRate) < 0) ? 2 : Math.round(((parseFloat(row.CGSTRate) / 100) * row.PurchasedPrice) * 100) / 100,
      SGSTAmount: (row.SGSTRate.length === 0 || parseFloat(row.SGSTRate) < 0) ? 0 : Math.round(((parseFloat(row.SGSTRate) / 100) * row.PurchasedPrice) * 100) / 100,
      IGSTAmount: (row.IGSTRate.length === 0 || parseFloat(row.IGSTRate) < 0) ? 0 : Math.round(((parseFloat(row.IGSTRate) / 100) * row.PurchasedPrice) * 100) / 100,
    });
    // if (parseFloat(parseFloat(row.CessRate) + parseFloat(row.CGSTRate) + parseFloat(row.SGSTRate) + parseFloat(row.IGSTRate)) > 100) {
    //   msg.warning("Rate Cannot be More than 100")
    // }
    // else if (parseFloat(row.CessRate) < 0 || parseFloat(row.CGSTRate) < 0 || parseFloat(row.SGSTRate) < 0 || parseFloat(row.IGSTRate) < 0 || parseFloat(row.PurchasedPrice)<0) {
    //   msg.warning("Does not exist negative values")
    // }
    // else if (isNaN(row.CessRate) || isNaN(row.CGSTRate) || isNaN(row.SGSTRate) || isNaN(row.IGSTRate) || (isNaN(row.PurchasedPrice) || row?.PurchasedPrice==="")) {
    //   msg.warning("Only Allows Numeric Values")
    // }
    const cess = Number(row.CessRate) || 0;
    const cgst = Number(row.CGSTRate) || 0;
    const sgst = Number(row.SGSTRate) || 0;
    const igst = Number(row.IGSTRate) || 0;

    if (cess + cgst + sgst + igst > 100) {
      msg.warning("Rate Cannot be More than 100");
      return;
    }

    if ([cess, cgst, sgst, igst, Number(row.PurchasedPrice)].some(v => v < 0)) {
      msg.warning("Does not exist negative values");
      return;
    }

    if ([cess, cgst, sgst, igst, Number(row.PurchasedPrice)].some(v => isNaN(v))) {
      msg.warning("Only Allows Numeric Values")
      return;
    }

    else {
      setDataSource(newData);
    }
  };

  function handleChange(val, id, accessorKey) {
    console.log(val, id, accessorKey, "298")
    const updated = dataSource;
    updated[id] = { ...updated[id], [accessorKey]: val };
    handleTabSave(updated[id]);
    // setDataSource(updated);
  }

  console.log(dataSource, "123")


  const multiSelectConfig: MultiSelectConfig = {
    isHierarchy: true,
    treeCheckable: false,
    multiple: false,
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
                usePortal={false}
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
                  multiSelectConfig={multiSelectConfig}
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
    })
      .catch((err) => { }).finally(() => { dispatch(setLoading(false)) })
  }

  const getPOSupply = async (fromBranch, toBranch, companyId) => {
    dispatch(setLoading(true));
    await getPlaceOfSupply(fromBranch, toBranch, companyId).then((res) => {
      if (res.data !== undefined) {
        setSupplyStatus(res.data.Status)
        setValue("placeofsupply", res.data?.StateName);
        // reset({ placeofsupply: res.data?.StateName });
      } else {
        setValue("placeofsupply", "");
      }
    }).catch((err) => { }).finally(() => { dispatch(setLoading(false)) })

  }

  //store lookups data in json
  const setLookupsDataInJson = (lookupsData: any): void => {
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
        if (obj.fieldType === 'dropdown') {
          if (obj.name === "levelfivecompany") {
            // obj['treeData'] = opts[obj.name]
            obj['label'] = lastLevelData['Branch']
            obj['placeholder'] = lastLevelData['Branch']
          }
        }
        if (obj.fieldType === 'treeselect') {
          const mapping: any = {
            levelfivecompany: 'Branch',
            levelfivedepartment: 'Department',
            levelfivecostcenter: 'CostCenter',
            levelfivelocation: 'AssetLocation'
          };

          const key = mapping[obj.name];

          if (key) {
            obj.treeData = opts[obj.name];
            obj.label = lastLevelData[key];
            obj.placeholder = lastLevelData[key];
          }
        }

      }
    })
    setFields(data);
    // setFieldsCopy(data);
  }

  //   TREEFUNWITHPARENT---------
  const treefunWithParent = (data: any[], id: string | number, idName?: string, assetLocationUnique?: string, uniqVal?: string): any[] => {
    console.log("treedata", data, assetLocationUnique);
    const treeData: any[] = [];
    const uniqueId = idName ? idName : "id";
    data.forEach((item) => {
      if (item["parent"] || item["Parent"]) {
        let p = item["parent"] ? "parent" : "Parent";
        if (item[p] == id) {
          item.title = `${item.text || item.Name || item.LocationName}`;
          item.label = `${item.text || item.Name || item.LocationName}`;
          item.key = item[uniqueId];
          // item.value = item["id"];
          item.value = item[uniqVal] || item[assetLocationUnique] || item[uniqueId] || item[item.Name] || item.Name || item.text || item.LocationName;
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
      const [SRTBranchListLookup, astLocation, deptTreeData, costCenter] =
        await Promise.allSettled([
          getBranchDetails(companyId),
          getLocationDetails(companyId, branch),
          getDepartmentDetails(companyId),
          getCostCenterDetails(companyId)
        ]);
      const allResponses = {
        levelfivecompany: { data: SRTBranchListLookup.status === 'fulfilled' && SRTBranchListLookup.value.success && SRTBranchListLookup.value.data ? SRTBranchListLookup.value.data.filter((ele: any) => ele.id !== 0 && ele.parent !== '#' && ele.type !== '99') : [], label: 'Name', value: 'id' },
        levelfivelocation: { data: [], treedata: true },
        levelfivedepartment: {
          data: deptTreeData.status === "fulfilled" && deptTreeData.value.success
            && deptTreeData.value.data ? treefunWithParent(deptTreeData.value.data, "#", '', 'orginalId') : [],
          treedata: true,
        },
        levelfivecostcenter: {
          data: costCenter.status === "fulfilled" && costCenter.value.success
            && costCenter.value.data ? treefunWithParent(costCenter.value.data, "#", '', 'orginalId') : [], treedata: true,
        },
      };
      setLookupsDataInJson(allResponses);
    } catch (error) {
      msg.warning(`Error fetching lookups: ${error}`)
    } finally {
      dispatch(setLoading(false));
    }
  }

  const assetLocationList = async (companyId, toBranch) => {
    dispatch(setLoading(true));
    await getLocationDetails(companyId, toBranch).then((res) => {
      if (res.data !== undefined) {
        const allResponses = {
          levelfivelocation: {
            data: res.success && res.data ? treefunWithParent(res.data, "#", "", "orginalId") : [],
            treedata: true,
          },
        }
        console.log("iugvbkuyg", allResponses.levelfivelocation.data);
        setLookupsDataInJson(allResponses);
      }
    }).catch((err) => { }).finally(() => { dispatch(setLoading(false)) })
  }

  const postInterTransfer = async (companyId, payload) => {
    dispatch(setLoading(true))
    await postInterTransferDetails(companyId, payload).then((res) => {
      if (res.data !== undefined) {
        if (res.data.status === true) {
          msg.success(res.data.message)
          handleMainReset();
          // getAssetTransHistDetails(branchData.branchName, compid);
        }
        else {
          msg.warning(res.data.message)
        }
      }
    }).catch((err) => { }).finally(() => { dispatch(setLoading(false)) })
  }
  // INTRA
  const posIntraTransfer = async (companyId, payload) => {
    dispatch(setLoading(true))
    console.log("sachin");
    await postIntraTransferDetails(companyId, payload).then((res) => {
      if (res.data !== undefined) {
        if (res.data.status === true) {
          msg.success(res.data.message)
          // getAssetTransHistDetails(branchData.branchName, compid);
          setIsMainDialogOpen(false);
          handleMainReset();
          handleDialogReset();
        }
        else {
          msg.warning(res.data.message);
        }
      }
    }).catch((err) => { }).finally(() => { dispatch(setLoading(false)) })
  }

  function timestampToDateConversion(dateStr: string): string {
    const date = new Date(dateStr);
    const formatted =
      date.getDate().toString().padStart(2, "0") + "/" +
      (date.getMonth() + 1).toString().padStart(2, "0") + "/" +
      date.getFullYear();

    return formatted;
  }

  const handleSave = (flag) => {
    console.log("rohi", flag);
    if (supplyStatus === 0 && flag === "false") {
      console.log("rohitttt11");
      let assetsArray2 = dataSource?.map((x) => (
        {
          "AssetId": x.AssetID?.toString(),
          "AssetName": x.AssetName,
          "HSNCode": x.HSNCode,
          "TaxableValue": x.PurchasedPrice?.toString(),
          "CGSTRate": x.CGSTRate?.toString(),
          "SGSTRate": x.SGSTRate?.toString(),
          "IGSTRate": x.IGSTRate?.toString(),
          "CessRate": x.CessRate?.toString()
        }
      ))
      let payload = {
        "AddAssetTransferDetails": [
          {
            "FromBranchId": branchId,
            "LocationId": watch("levelfivelocation").length === 0 ? "" : watch("levelfivelocation").join(","),
            "DepartmentId": watch("levelfivedepartment").length === 0 ? "" : watch("levelfivedepartment").join(","),
            "CostCenterId": watch("levelfivecostcenter").length === 0 ? "" : watch("levelfivecostcenter").join(","),
            "Remarks": watch("Remark"),
            "TransferDate": timestampToDateConversion(watch("transferdate")),
            "WDV": "",
            "GSTDetails": assetsArray2,
          }
        ]
      }
      postInterTransfer(companyId, payload)
    } else if (supplyStatus === 1 && flag === "true") {
      setIsMainDialogOpen(true);
    }
  }

  const handleIntraSave = (flag) => {
    if (supplyStatus === 1 && flag === "true") {
      console.log("rohitttt");
      setIsMainDialogOpen(true);
      let assetArray = dataSource?.map((x) => (
        {
          "AssetId": x.AssetID?.toString(),
          "AssetName": x.AssetName,
          "HSNCode": x.HSNCode,
          "TaxableValue": x.PurchasedPrice?.toString(),
          "CGSTRate": x.CGSTRate?.toString(),
          "SGSTRate": x.SGSTRate?.toString(),
          "IGSTRate": x.IGSTRate?.toString(),
          "CessRate": x.CessRate?.toString(),
        }
      ))
      let payload = {
        "AddAssetTransferDetails": [
          {
            "FromBranchId": branchId,
            "LocationId": watch("levelfivelocation")?.toString(),
            "DepartmentId": watch("levelfivedepartment").length === 0 ? "" : watch("levelfivedepartment").join(''),
            "CostCenterId": watch("levelfivecostcenter").length === 0 ? "" : watch("levelfivecostcenter").join(''),
            "TransferDate": timestampToDateConversion(watch("transferdate")),
            "WDV": "",
            "InvoiceNo": watch("invoiceno"),
            "InvoiceDate": watch("invoicedate") ? timestampToDateConversion(watch("invoicedate")) : "",
            "DeliveryDate": timestampToDateConversion(watch("deliverychalldate")),
            "DeliveryRemarks": watch("remarksindialog"),
            "ModeofTransport": watch("modeoftransport"),
            "TransportName": watch("transportname"),
            "VehicleRegNo": watch("registrationno"),
            "LrNo": watch("license"),
            "DriverName": watch("drivername"),
            "ContactNumber": watch("contacts"),
            "GSTDetails": assetArray,
          }
        ]
      }
      posIntraTransfer(companyId, payload)
    }
  }

  function handleDialogReset() {
    const current = getValues();
    reset({
      ...current,
      invoiceno: '',
      invoicedate: '',
      deliverychalldate: '',
      remarksindialog: '',
      modeoftransport: '',
      transportname: '',
      registrationno: '',
      license: '',
      drivername: '',
      contacts: '',
    })
  }

  function handleMainReset() {
    reset({
      levelfivecompany: '',
      levelfivedepartment: '',
      levelfivecostcenter: '',
      placeofsupply: '',
      levelfivelocation: '',
      transferdate: '',
      remarks: ''
    })
  }

  const commonFields = ['levelfivecompany', 'levelfivedepartment', 'levelfivecostcenter', 'placeofsupply', 'levelfivelocation', 'transferdate']

  return (
    <ScrollArea className='h-full'>
      <div className="p-4 sm:p-4 space-y-4 sm:space-y-4">
        <div className=" px-4 lg:px-1 flex flex-col sm:flex-row justify-between gap-4 shrink-0"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
              To level five company Details            </h1>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <ReusableButton
              // size="small"
              variant="primary"
              // onClick={(data) => handleSubmit(handleSave)(data)}
              onClick={() => { supplyStatus === 1 ? handleSubmit((data) => handleSave("true"))() : handleSubmit((data) => handleSave("false"))() }}
              icon={<Save className="h-4 w-4" />}
              className='btn-submit-style'
            >
              {supplyStatus === 1 ? "Delivery Challan Details" : "Save"}
            </ReusableButton>
          </div>
        </div>
        <Dialog open={isMainDialogOpen}
          onOpenChange={(open) => {
            setIsMainDialogOpen(open);
            if (!open) {
              // handleCancel(); 
            }
          }}
        >
          <DialogTrigger asChild>
          </DialogTrigger>
          <DialogContent className="w-full max-w-[40rem] h-[33rem]">
            <DialogHeader>
              <DialogTitle>Transfer Delivery Challan Details</DialogTitle>
            </DialogHeader>
            <div className='grid w-full grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4'>
              {/* <div className=""> */}
              {getFieldsByNames(['invoiceno', 'invoicedate', 'deliverychalldate', 'remarksindialog', 'modeoftransport', 'transportname', 'registrationno', 'license', 'drivername', 'contacts']).map((renderField))}
              {/* </div> */}
            </div>
            <div className="flex gap-3 justify-end">
              <ReusableButton
                htmlType="submit"
                variant="primary"
                className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                onClick={handleDialogReset}
              >
                Clear
              </ReusableButton>
              <ReusableButton
                htmlType="submit"
                variant="primary"
                className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                // onClick={handleSubmit(() => submit("true"))}
                onClick={() => handleSubmit((data) => handleIntraSave("true"))()}
              >
                Submit
              </ReusableButton>
            </div>
          </DialogContent>
        </Dialog>

        <div className="pt-0">
          <Card className="border-0 shadow-sm">
            <CardContent className='mt-1 py-2 flex flex-col gap-5'>
              <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFieldsByNames(supplyStatus === 1 ? commonFields : [...commonFields, 'remarks']).map((field) => {
                  return (<div> {renderField(field)} </div>)
                })}
              </div>
              <div>
                <h1 className="font-semibold">Asset Transfer Details</h1>
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
                <h6 className='mb-2 px-1 font-semibold' style={{ fontSize: "15px" }}>Delivery Challan Details</h6>
                {/* <div className='p-4 flex flex-wrap gap-5 justify-content-between' style={{ width: "60%", backgroundColor: "#f1f5fa" }}>
                  <div><p style={{ fontSize: "13px", color: "#67708c" }}>Total Taxable Value</p><h6 style={{ fontSize: "15px" }}>{totalTaxable}</h6></div >
                  <div> <p style={{ fontSize: "13px", color: "#67708c" }}>GST</p><h6>{gst}</h6></div>
                  <div><p style={{ fontSize: "13px", color: "#67708c" }}>Cess</p><h6>{cess}</h6>  </div>
                  <div><p style={{ fontSize: "13px", color: "#67708c" }}>Total invoice Value</p><h6>{totalInvoiceValue}</h6></div>
                  <div><p style={{ fontSize: "13px", color: "#67708c" }}>Total invoice(In words)</p><h6>{`${inWords.charAt(0).toUpperCase() + inWords.slice(1)}`}</h6>
                  </div>
                </div> */}
                <div className="p-4 flex gap-5 flex-wrap justify-between" style={{ width: "60%", backgroundColor: "#f1f5fa" }}>
                  <div>
                    <p className="text-sm text-[#67708c]">Total Taxable Value</p>
                    <h6 className="text-[15px]">{totalTaxable}</h6>
                  </div>

                  <div>
                    <p className="text-sm text-[#67708c]">GST</p>
                    <h6 className="text-[15px]">{gst}</h6>
                  </div>

                  <div>
                    <p className="text-sm text-[#67708c]">Cess</p>
                    <h6 className="text-[15px]">{cess}</h6>
                  </div>

                  <div>
                    <p className="text-sm text-[#67708c]">Total Invoice Value</p>
                    <h6 className="text-[15px]">{totalInvoiceValue}</h6>
                  </div>

                  <div>
                    <p className="text-sm text-[#67708c]">Total Invoice (In words)</p>
                    <h6 className="text-[15px]">
                      {inWords ? inWords.charAt(0).toUpperCase() + inWords.slice(1) : ""}
                    </h6>
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