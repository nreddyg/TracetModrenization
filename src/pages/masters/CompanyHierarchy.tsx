
import React, { useEffect, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Trash2, ChevronRight, ChevronDown, Folder, Info, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReusableButton } from '@/components/ui/reusable-button';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
// import { DEPARTMENT_DB } from '@/Local_DB/Form_JSON_Data/departmentDB';
import { Controller, useForm } from 'react-hook-form';
import { useMessage } from '@/components/ui/reusable-message';
import { useDispatch } from 'react-redux';
import { ReusableInput } from '@/components/ui/reusable-input';
import { setLoading } from '@/store/slices/projectsSlice';
import { getDepartmentData } from '@/services/departmentServices';
import { useAppSelector } from '@/store';
import { TreeConfig, TreeNodeData, TreeView } from '@/components/ui/reusable-treeView';
import { addOrUpdateHierarchyLevel, deleteHierarchyLevel, getCompanyData, getCompanyDataBybranchId, getHierarchyLevelsData, getStateData } from '@/services/companyHierarchyServices';
import { COMPANY_DB } from '@/Local_DB/Form_JSON_Data/CompanyHierarchyDB';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
interface TreeNode {
  id: string;
  name: string;
  code: string;
  children?: TreeNode[];
  type: 'company' | 'department' | 'unit';
}

export const treeConfig: TreeConfig = {
  isCheckable: false,
  showIcon: true,     // ✅ Enables automatic icons
  Multiple: true,
  expandAll: true,
};
let lastLevelData:BaseField[] = [
  {
    label: "Branch Name",
    fieldType: "text",
    name: "Name",
    // value: "",
   
    isRequired: true,
  },
  {
    label: "Branch Code",
    fieldType: "text",
    name: "Code",
    value: "",
    // error: false,
    // errormsg: "",
    isRequired: true,
  },
  {
    label: "Reg/PAN",
    fieldType: "text",
    name: "PAN",
    value: "",
    // error: false,
    // errormsg: "",
    isRequired: false,
  },
  {
    label: "GSTIN/UIN",
    fieldType: "text",
    name: "GSTIN",
    value: "",
    // error: false,
    // errormsg: "",
    isRequired: false,
  },
  {
    label: "Address",
    fieldType: "text",
    name: "Address",
    value: "",
    // error: false,
    // errormsg: "",
    isRequired: false,
  },
  {
    label: "State",
    fieldType: "dropdown",
    name: "State",
    value: "",
    options: [],
    default: "Select State",
    // error: false,
    // errormsg: "",
    isRequired: true,
  },
  {
    label: "City",
    fieldType: "text",
    name: "City",
    value: "",
    // error: false,
    // errormsg: "",
    isRequired: false,
  },
  {
    label: "Zip Code",
    fieldType: "text",
    name: "ZipCode",
    value: "",
    // error: false,
    // errormsg: "",
    isRequired: false,
  },
  {
    label: "Email Id",
    fieldType: "text",
    name: "EmailId",
    value: "",
    // error: false,
    // errormsg: "",
    isRequired: false,
  },
  {
    label: "Mobile Number",
    fieldType: "text",
    name: "MobileNo",
    value: "",
    // error: false,
    // errormsg: "",
    isRequired: false,
  },
];



const CompanyHierarchy = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedKeys, setExpandedKeys] = useState(["0"]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [lastLevel, setLastLevel] = useState(null);
  const [level, setLevel] = useState([]);
  const [nextLevel, setNextLevel] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(99)
  const [allLevelsJson, setAllLevelsJson] = useState(COMPANY_DB)
  const [branchData, setBranchData] = useState(allLevelsJson[lastLevel]);
  const [fields, setFields] = useState<BaseField[]>(allLevelsJson[99]);
  const companyId = useAppSelector(state => state.projects.companyId);
  const [selectedId, setSelectedId] = useState(null)
  const [tree, setTree] = useState([])
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [treeViewData,setTreeViewData]=useState([])
  const [disable, setDisable] = useState(true);
  const dispatch = useDispatch()
    const [selectedNodeParents, setSelectedNodeParents] = useState([]);
    const [selectedNode, setSelectedNode] = useState({
      BranchName: "",
      BranchCode: "",
      TypeId: 0,
      id: 99999,
      parent: 0,});
    const [recordToEditId, setRecordToEditId] = useState(null);
  const [breadCrumb, setBreadCrumb] = useState(["Company"]);
  const [open, setOpen] = useState(false)
 
 
  const msg = useMessage()


  useEffect(() => {
    if (companyId) {
      fetchCompanyGetData(companyId)
    }
  }, [companyId])
  useEffect(()=>{
    if(companyId && selectedLevel){
      fetchHierarchyLevelsData(companyId)
      // console.log(selectedLevel,"Nag")
    }  
  },[companyId,selectedLevel])
  useEffect(() => {
    if (recordToEditId) {
      fetchCompanyGetDataByBranchId(companyId, recordToEditId)
    }
  }, [recordToEditId])
 useEffect(() => {
    let name = []
    for (let i = 0; i <= level.length; i++) {
      if (selectedLevel !== 99) {
        name.push(level[i]?.LevelName)
        setNextLevel(level[i + 1]?.LevelName)
        if (selectedLevel === level[i]?.Id) {
          setBreadCrumb(["Company", ...name])
          return;
        }
      } else {
        setBreadCrumb(["Company"]);
        setNextLevel(level[0]?.LevelName);
      }
    }
  }, [selectedLevel])
  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultChecked ?? '';
      return acc;
    }, {} as GenericObject),
    // mode: 'onChange',
    // reValidateMode: "onChange"
  });

  const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;
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
    }
  }
  const handleExpand = (keys: string[]) => {
    setExpandedKeys(keys);
  };
  const handleSelect = (selectedKeys, info) => {
    setRecordToEditId(info.node.id)
    setSelectedKeys(selectedKeys)
    setSelectedNode(info.node)
    setDisable(false)
    setSelectedLevel(Number(info.node.type))
    setSelectedId(info.node.id)
    setFields(allLevelsJson[Number(info.node.type)])

  };
  const treefun = (data, id) => {
    const treeData = [];
    const keys = [];
    data.forEach((item) => {
      keys.push(item.key)
      if (item.parent === id) {
        item.title = item.text;
        item.key = item.id;
        item.value = item[item.name];
        const child = treefun(data, item.id);
        item.children = child;
        treeData.push(item);
      }
    });
    // setExpandedKeys(keys);
    return treeData;
  };
    const getParents = (node, id, parents = []) => {
    if (node.id === id || node.id === 99999) return parents;
    for (let child of node.children) {
      const result = getParents(child, id, [...parents, node]);
      if (result) return result;
    }
    return null;
  };
    const submit = async () => {
    dispatch(setLoading(true));
    let payload = {
      "Details": [
        {
          "ParentId": recordToEditId ? selectedNode.id || '' : selectedNode?.parent || '',
          "TypeId": selectedLevel,
          "Name": watch("Name"),
          "Code": watch("Code"),
           "RegPan": watch('PAN') || "", 
        "GstinUin": watch('GSTIN') || "", 
        "Address": watch('Address') || "", 
        "StateId": watch('State') || "", 
        "City": watch('City') || "", 
        "ZipCode": watch('ZipCode') || "", 
        "EmailId": watch('EmailId') || "",
        "MobileNo": watch('MobileNo') || ""
        }]
    }
    // let branchId = recordToEditId ? selectedNode?.id : 0
    const branchId = Number(recordToEditId ? selectedNode?.id : 0);
    await addOrUpdateHierarchyLevel( companyId,branchId, payload).then(res => {
      if (res.data.status) {
        fetchCompanyGetData(companyId);
        msg.success(`${res.data.message}`);
        if (recordToEditId === null) {
          // handleReset(0);
        }
        // dispatch(isbranchlistupdate(true));
      } else {
        msg.warning(`${res.data.message}`);
      }
    }).catch(err => { })
      .finally(() => { dispatch(setLoading(false)) })
  }
   const handleRoute = () => {
    setRecordToEditId(null);
    handleReset()
    const treeData = structuredClone(tree);
    const tempObj = {
      BranchName: "",
      BranchCode: "",
      TypeId: selectedLevel + 1,
      id: 99999,
      parent: selectedNode?.id,
    };
    treeData.push(tempObj);
    const latestTreeData = treefun(treeData, "#");
    let selectId =
      selectedNode["children"].length >= 1
        ? selectedNode["children"][0].id
        : 99999;
    const findroots = getParents(latestTreeData[0], selectId);
    setSelectedNodeParents(findroots);
    setSelectedLevel(tempObj.TypeId);
    setSelectedNode(tempObj);
    setFields(allLevelsJson[selectedLevel+1])
  };


  async function fetchCompanyGetData(companyId) {
    dispatch(setLoading(true))
    await getCompanyData(companyId).then(res => {
      if (res.data && res.data.length > 0) {
        setTree(res.data)

        const result = treefun(res.data, "#")
          // if (selectedLevel === 99) {
          //   let data = allLevelsJson;
          //   data[selectedLevel][0].value = res.data[0].Name;
          //   data[selectedLevel][1].value = res.data[0].Code;
          //   setAllLevelsJson(data);
          // }
           if (selectedLevel === 99) {
          const { Name, Code } = res.data[0];
          reset({
            Name: Name || "",
            Code: Code || "",
          });
 
          const data = fields;
          console.log("data",data);
          data[0].disabled = true
          data[1].disabled = true
          setFields(data)
        }
 
          setTreeViewData(result)
      } else {
        msg.warning(res.data.message || "No Data Found")
      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }
   async function fetchStateLookUpData(companyId) {
    dispatch(setLoading(true))
   await getStateData( companyId)
      .then((res) => {
        if (res.data ) {
          res.data.Details?.forEach((element) => {
            element["label"] = element.StateName;
            element["value"] = element.Id;
          });
          // let data = lastLevelData;
          if (lastLevel !== null) {
            let last = allLevelsJson;
            let lastData = last[lastLevel];
            const stateIndex = lastData.findIndex((x) => x.name === "State");
            console.log(stateIndex,'Nag')
            lastData[stateIndex].options = res.data.Details;

            setAllLevelsJson({ ...last,lastLevel:lastData });
          }
        } else {
          // TracetMessage("warning", "65vh", "Please Add Company Hierarchy Levels in Hierarchy configuration", "comapnyHierarchyLevels");
        }
      }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }
    async function fetchHierarchyLevelsData(companyId) {
    dispatch(setLoading(true))
   await getHierarchyLevelsData( companyId,100)
      .then((res) => {
        if (res.data && typeof res.data === "object") {
          setLevel(res.data["Company Hierarchy"][0].LevelName); 
          setNextLevel(res.data["Company Hierarchy"][0].LevelName[0].LevelName);
          setLastLevel(res.data["Company Hierarchy"][0].LevelName.at(-1)["Id"]);
          let lastData = allLevelsJson;
          lastData[res.data["Company Hierarchy"][0].LevelName.at(-1)["Id"]] = lastLevelData;
          // console.log(lastData)  
          setAllLevelsJson(lastData);
          // getStates.current = true;
          getjsonMapping(res.data["Company Hierarchy"][0].LevelName);
        } else {
          // TracetMessage("warning", "65vh", "Please Add Company Hierarchy Levels in Hierarchy configuration", "comapnyHierarchyLevels");
        }
      }).catch(err => { }).finally(() => { 
        fetchStateLookUpData(companyId)
        dispatch(setLoading(false)) })
  }
    const getjsonMapping = (leveldata) => {
    let Labels = Object.keys(allLevelsJson);
    Labels.forEach((element) => {
      var index = leveldata.findIndex((x) => x.Id === parseInt(element));
      if (index !== -1) {
        allLevelsJson[parseInt(element)].forEach((item) => {
          if (item.name === "Name") {
            item.label = `${leveldata[index].LevelName} Name`;
            item.heading = `${leveldata[index].LevelName} Details`;
          }
          if (item.name === "Code") {
            item.label = `${leveldata[index].LevelName} Code`;
          }
        });
      }
    });
  };
  const handleReset = () => {
      if(selectedLevel!==lastLevel){
  reset({
            Name: "",
            Code: ""
          })
          }
          else{
              reset({
            Name: "",
            Code: "",
            PAN:"",
            GSTIN : "",
            Address : "",
            State : "",
            City : "",
            ZipCode : "",
            EmailId : "",
            MobileNo : ""
          })
          }
    // form.reset()
  };

  async function fetchCompanyGetDataByBranchId(companyId: any, branchid: any) {
    dispatch(setLoading(true))
    await getCompanyDataBybranchId(companyId, branchid).then(res => {
      if (res.data && res.data.length > 0) {
        // const result = treefun(res.data, "#")
        // setTree(result)
        console.log(res.data,"Nag")
        const details = res.data[0];
        if (details) {
          if(selectedLevel!==lastLevel){
  reset({
            Name: details.BranchName,
            Code: details.BranchCode
          })
          }
          else{
              reset({
            Name: details.BranchName,
            Code: details.BranchCode,
            PAN:details.PAN,
            GSTIN : details.GSTIN,
            Address : details.Address,
            State : details.State,
            City : details.City,
            ZipCode : details.ZipCode,
            EmailId : details.EmailId,
            MobileNo : details.MobileNo
          })
          }
        
        }
      } else {
        msg.warning(res.data.message || "No Data Found")
      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }

  async function deleteLevel(compId: string, id: any, data: any) {
    dispatch(setLoading(true));
    await deleteHierarchyLevel(compId, id, data).then(res => {
      if (res.data.status === true) {
        msg.success(res.data.message)
        fetchCompanyGetData(companyId)
      }
      else {
        msg.error(res.data.message)
      }
    })
      .catch(err => {
      }).finally(() => {
        dispatch(setLoading(false))
      })
  }
  function handleDelete() {
    if (selectedId) {
      deleteLevel(companyId, selectedId, "")
      setSelectedId(null)
      // recordToEditId(null)
    }
  }

  return (
    <div className="bg-hsl(214.3 31.8% 91.4%) overflow-y-auto">
      <header className="bg-card flex justify-between border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Masters</span>
            <span>/</span>
            <span className="text-foreground font-medium">CompanyHierarchy</span>
          </div>
        </div>
        <div className='flex gap-2'>
          <ReusableButton
            htmlType="button"
            variant="default"
            onClick={()=>handleReset()}
            iconPosition="left"
            size="middle"
            className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
          >
            Reset
          </ReusableButton>
          <ReusableButton
            htmlType="button"
            variant="default"
            onClick={submit}
            iconPosition="left"
            size="middle"
            className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
          >
            Save
          </ReusableButton>
        </div>
      </header>

      <div className="flex h-full">
        {/* Tree Structure Panel */}
        <div className="w-[26vw] border-r bg-card flex flex-col">
          <div className=" flex items-center justify-center pt-4 pb-4 ps-0 ms-0 border-b gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 "
              />
            </div>
            <div className="flex gap-2 flex items-center justify-center">
                        <ReusableButton
                        size="small"
                        className="bg-primary h-[2rem] hover:bg-blue-700 text-white"
                        style={{
                          cursor: selectedLevel >= 99 + level.length || disable ? "not-allowed" : "pointer",
                        }}
                        disabled={selectedLevel >= 99 + level.length || disable}
                        onClick={() => {
                          if (!(selectedLevel >= 99 + level.length || disable)) {
                            handleRoute();
                            setDisable(true);
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </ReusableButton>
                <Dialog open={isDelModalOpen} onOpenChange={setIsDelModalOpen}>
                                              <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                  <DialogTitle>Confirm the action</DialogTitle>
                                                  <DialogDescription>
                                                    Are you sure you want to delete Hierarchy level?
                                                    {/* {currentTab === "service-request-type"
                                                      ? `${selectedRecord?.ServiceRequestType || "this"} Service Request Type`
                                                      : `${selectedStatusRec?.StatusType || "this"} Status`
                                                    } */}
                                                  </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                  <ReusableButton
                                                    variant="default"
                                                    onClick={() => setIsDelModalOpen(false)}
                                                  >
                                                    Cancel
                                                  </ReusableButton>
                                                  <ReusableButton
                                                    variant="primary"
                                                    danger={true}
                                                    onClick={()=>{handleDelete();setIsDelModalOpen(false);setRecordToEditId(null);handleReset()}}
                                                    // onClick={currentTab === "service-request-type" ? () => { deleteServiceRequestType(selectedRecord?.Id); setIsDelModalOpen(false) } : () => { deleteStatus(selectedStatusRec?.Id); setIsDelModalOpen(false) }}
                                                  >
                                                    Delete
                                                  </ReusableButton>
                                                </DialogFooter>
                                              </DialogContent>
                                            </Dialog>
                  <Button size="sm" variant="outline" className="h-8" onClick={()=>setIsDelModalOpen(true)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
            </div>
          </div>
          <div className="min-h-20 h-[63vh] overflow-y-auto p-2">
            <TreeView treeData={treeViewData} config={treeConfig} onSelect={handleSelect} selectKeys={selectedKeys} expandedKeys={expandedKeys} onExpand={setExpandedKeys} />
          </div>
        </div>

        {/* Details Panel */}
         <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6" style={{height:"77vh",overflowY:"auto"}}>
            <div className="flex flex-col gap-2">
              <div>
              <h4 className="master-heading mb-2 flex items-center gap-2">
                {!recordToEditId
                  ? selectedLevel === 99
                    ? "Company Hierarchy"
                    : "Add Company Hierarchy"
                  : selectedLevel === 99
                    ? "Company Hierarchy"
                    : "Update Company Hierarchy"}
                {selectedLevel !== lastLevel && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button">
                          <Info className="mb-1 cursor-pointer" fontSize={22} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        To Add {nextLevel || "Department/Unit"} to{" "}
                        {breadCrumb?.at(-1) || "the selected department"}, click on{" "}
                        {breadCrumb?.at(-1) || "the name"} and then click on the plus icon.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </h4>
             </div>
              <div className="text-sm text-primary">
                <h6 className="breadCrumb">{breadCrumb.map(x => { return `${x} >` })}</h6>
              </div>
            </div>
            <div className="space-y-6">
              {/* <h5 className="text-base font-semibold">Department Details</h5> */}
              <h5>{recordToEditId && selectedLevel !== 99 ? `Update ${fields[0].heading}` : `${selectedLevel !== 99 ? "Enter" : ""} ${fields[0].heading}`}</h5>
              <div className="px-1">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {getFieldsByNames((selectedLevel!=lastLevel)?['Name', 'Code']:['Name', 'Code',"PAN","GSTIN","Address","State","City","ZipCode","EmailId","MobileNo"]).map((field) => {
                    return <div className="flex items-center space-x-2">
                      {renderField(field)}
                    </div>;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
 
      </div>
    </div>
  );
};

export default CompanyHierarchy;
