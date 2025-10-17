
import React, { useEffect, useMemo, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Trash2, ChevronRight, ChevronDown, Folder, Info, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReusableButton } from '@/components/ui/reusable-button';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { DEPARTMENT_DB } from '@/Local_DB/Form_JSON_Data/departmentDB';
import { Controller, useForm } from 'react-hook-form';
import { useMessage } from '@/components/ui/reusable-message';
import { useDispatch } from 'react-redux';
import { ReusableInput } from '@/components/ui/reusable-input';
import { setLoading } from '@/store/slices/projectsSlice';
import { deleteDepartmentData, getDepartmentData, getDepartmentDataByID, getHierarchyLevelsdata, postOrUpdateDepartmentData } from '@/services/departmentServices';
import { useAppSelector } from '@/store';
import { TreeConfig, TreeView } from '@/components/ui/reusable-treeView';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MenubarShortcut } from '@/components/ui/menubar';
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
  showLine: false,
  Multiple: true,
  expandAll: true,
};

const mockData: TreeNode = {
  id: '1',
  name: 'Zoho corporataion',
  code: 'ZHC',
  type: 'company',
  children: [
    {
      id: '2',
      name: 'Infras',
      code: 'INFD',
      type: 'department',
      children: [
        {
          id: '3',
          name: 'Manage',
          code: 'MN',
          type: 'unit',
          children: [
            {
              id: '4',
              name: 'Securities',
              code: 'SC',
              type: 'unit',
              children: [
                {
                  id: '5',
                  name: 'Acquisition',
                  code: 'ACQ',
                  type: 'unit',
                  children: [
                    { id: '6', name: 'test1', code: 'TS', type: 'unit' },
                    { id: '7', name: 'ACQ', code: 'TG', type: 'unit' },
                    { id: '8', name: 'Tests', code: 'TR', type: 'unit' },
                    { id: '9', name: 'test08', code: 'T08', type: 'unit' },
                    { id: '10', name: 'test014', code: 'T014', type: 'unit' },
                    // { id: '11', name: 'abc_test', code: 'testabc', type: 'unit' },
                    // { id: '12', name: 'test2553', code: 'tsrerf33', type: 'unit' },
                  ]
                }
              ]
            },
            {
              id: '13',
              name: 'Talent',
              code: 'TT',
              type: 'unit',
              children: [
                { id: '14', name: 'Minimum', code: 'MIN', type: 'unit' },
                { id: '15', name: 'Maximuew', code: 'MX', type: 'unit' },
              ]
            },
            {
              id: '16',
              name: 'NOTalent',
              code: 'nt',
              type: 'unit',
              children: [
                { id: '17', name: 'Minimums', code: 'MINS', type: 'unit' },
                { id: '18', name: 'Maximuews', code: 'MXS', type: 'unit' },
              ]
            }
          ]
        }
      ]
    }
  ]
};


const SearchButton = {
  type: "text",
  name: "searchValue",
  value: "",
  placeholder: "Search...",
};
interface SelectedNode {
  id?: string | number;
  parent?: string | number;
  type?: string | number;
  TypeId?: string | number;
  // add other fields if needed
}
const Department = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1', '2', '3', '4', '5']));
  const [selectedLevel, setSelectedLevel] = useState(99);
  const [selectedNodeParents, setSelectedNodeParents] = useState([]);
  const [fields, setFields] = useState(DEPARTMENT_DB);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState({
    BranchName: "",
    BranchCode: "",
    TypeId: 0,
    id: 99999,
    parent: 0,
    type: ''
  });
  const [departrmentData, setDepartmentData] = useState<BaseField[]>(fields[selectedLevel]);
  const [recordToEditId, setRecordToEditId] = useState(null);
  // const [selectedNode, setSelectedNode] = useState<SelectedNode>({});
  const [selectedId, setSelectedId] = useState('');
  const [treeView, setTreeview] = useState([]);
  const [tree, setTree] = useState([]);
  const [lastLevel, setLastLevel] = useState(null);
  const [level, setLevel] = useState([]);
  const [nextLevel, setNextLevel] = useState("");
  const [search, setSearch] = useState(SearchButton);
  const [breadCrumb, setBreadCrumb] = useState(["Company"]);
  const companyId = useAppSelector(state => state.projects.companyId);
  const [isClearDisable, setIsClearDisable] = useState(true);
  const [disable, setDisable] = useState(true);
    const [isDelModalOpen, setIsDelModalOpen] = useState(false);

  // const branch = useAppSelector(state=>state.projects.branchId)
  const dispatch = useDispatch()
  const msg = useMessage()

  // const branch = 

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

  useEffect(() => {
    if (companyId) {
      fetchDepartmentGetData(companyId);
    }
  }, [companyId])

  useEffect(() => {
    if (companyId && selectedLevel) getlevels();
  }, [companyId, selectedLevel])

  useEffect(() => {
    if (recordToEditId !== null) {
      getIndDepartDataByID(recordToEditId, companyId)
    }
  }, [recordToEditId])

  const form = useForm<GenericObject>({
    defaultValues: departrmentData.reduce((acc, f) => {
      acc[f.name!] = f.defaultChecked ?? '';
      return acc;
    }, {} as GenericObject),
  });

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderTreeNode = (node: TreeNode, level: number = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    // const isSelected = selectedNode?.id === node.id;

    return (
      <div key={node.id} className=''>
        {hasChildren && isExpanded && (
          <div>
            {/* {node.children?.map(child => renderTreeNode(child, level + 1))} */}
            <TreeView
              treeData={mainTreeData}
              config={treeConfig}
              onSelect={onSelect}
              expandedKeys={Array.from(expandedKeys)}
              onExpand={handleToggleNode}
            />
          </div>
        )}
      </div>
    );
  };

  const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;
  const getFieldsByNames = (names: string[]) => departrmentData.filter(f => names.includes(f.name!));

  const renderField = (field: BaseField) => {
    const { name, label, fieldType, isRequired, dependsOn, show = true } = field;
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
    }
  }

  const mainTreeData = useMemo(() => {
    const loop = (data) =>
      data.map((item) => {
        const titleStr = item.title || item.name || '';
        const searchVal = search.value.trim().toLowerCase();

        if (!searchVal) {
          return {
            ...item,
            title: <span key={item.key}>{titleStr}</span>,
            children: item.children ? loop(item.children) : [],
          };
        }

        const index = titleStr.toLowerCase().indexOf(searchVal);
        if (index === -1) {
          return {
            ...item,
            title: <span key={item.key}>{titleStr}</span>,
            children: item.children ? loop(item.children) : [],
          };
        }

        const beforeStr = titleStr.substring(0, index);
        const matchStr = titleStr.substring(index, index + searchVal.length); // ✅ keep original case
        const afterStr = titleStr.substring(index + searchVal.length);

        const title = (
          <span key={item.key}>
            {beforeStr}
            <span className="text-blue-500 font-medium">{matchStr}</span>
            {afterStr}
          </span>
        );

        return {
          ...item,
          title,
          children: item.children ? loop(item.children) : [],
        };
      });

    return loop(treeView);
  }, [treeView, search.value]);

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

  async function fetchDepartmentGetData(companyId) {
    dispatch(setLoading(true))
    await getDepartmentData(companyId).then(res => {
      if (res.data && res.data.length > 0) {
        setTree(res.data);
        const latestTreeData = treefun(res.data, "#");
        setTreeview(latestTreeData);
        if (selectedLevel === 99) {
          const { Name, Code } = res.data[0];
          reset({
            Name: Name || "",
            Code: Code || "",
          });

          const data = departrmentData;
          data[0].disabled = true
          data[1].disabled = true
          setDepartmentData(data)
        }
      } else {
        msg.warning(res.data.message || "No Data Found")
      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }

  // 103 level conatins labels for departmeent module in the departmentApi
  const getlevels = async () => {
    dispatch(setLoading(true))
    await getHierarchyLevelsdata(103, companyId).then((res) => {
      if (res.data) {
        getjsonMapping(res.data["Department/Unit"][0].LevelName);
        fetchDepartmentGetData(companyId);
        setLastLevel(res.data["Department/Unit"][0].LevelName.at(-1)["Id"]);
        setNextLevel(res.data["Department/Unit"][0].LevelName[0].LevelName)
        setLevel(res.data["Department/Unit"][0].LevelName);
      }
    })
      .catch((err) => { }).finally(() => { dispatch(setLoading(false)) })
  };

  // assigning labels to the JSONdata of departmentDB
  const getjsonMapping = (leveldata) => {
    let Labels = Object.keys(fields);
    Labels.forEach((element) => {
      var index = leveldata.findIndex((x) => x.Id === parseInt(element));
      if (index !== -1) {
        fields[parseInt(element)].forEach((item) => {
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

  // getting departmentDataByID
  async function getIndDepartDataByID(id, companyId) {
    dispatch(setLoading(true))
    await getDepartmentDataByID(id, companyId).then(res => {
      if (res.data && res.data.length > 0) {
        const details = res.data[0];
        if (details) {
          reset({
            Name: details.Name,
            Code: details.Code
          })
        }
      } else {
        msg.warning(res.data.message || "No Data Found")
      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }

  const getParents = (node, id, parents = []) => {
    if (node.id === id || node.id === 99999) return parents;
    for (let child of node.children) {
      const result = getParents(child, id, [...parents, node]);
      if (result) return result;
    }
    return null;
  };

  const handleRoute = () => {
    // handleReset();
    setRecordToEditId(null);
    const treeData = structuredClone(tree);
    const tempObj = {
      BranchName: "",
      BranchCode: "",
      TypeId: selectedLevel + 1,
      id: 99999,
      parent: selectedNode?.id,
      type: ''
    };

    treeData.push(tempObj);
    const latestTreeData = treefun(treeData, "#");

    let selectId =
      selectedNode["children"].length >= 1
        ? selectedNode["children"][0].id
        : 99999;
    const findroots = getParents(latestTreeData[0], selectId);
    setSelectedNodeParents(findroots);
    setSelectedLevel((prev) => 1 + +prev);
    setSelectedNode(tempObj);
    setDepartmentData(fields[selectedLevel + 1])
  };

  const onSelect = (selectedKeys, info) => {
    const findroots = getParents(treeView[0], info.node.id);
    setSelectedNodeParents(findroots);
    setSelectedId(info.node.id)
    setDisable(false);
    setRecordToEditId(info.node.id);
    setSelectedNode(info.node);
    setDepartmentData(fields[info.node.type])
    setSelectedLevel(parseInt(info.node.type));
  };

  const handleDelete = () => {
    if (selectedId && companyId) {
      delBranch(selectedId, companyId);
    }
  }

  //    delete based on Id
  const delBranch = async (leafId, companyId) => {
    dispatch(setLoading(true))
    await deleteDepartmentData(leafId, companyId, "")
      .then((res) => {
        if (res.data !== undefined) {
          if (res.data.status === true) {
            // clearFields(0);
            setRecordToEditId(null);
            msg.success(res.data.message);
            fetchDepartmentGetData(companyId);
          } else {
            msg.warning(res.data.message);
          }
        }
      })
      .catch((err) => {
        // TracetMessage("error","65vh","Failed to Delete Department","departmentdelete");
      })
      .finally(() => { dispatch(setLoading(false)) })
  }
  const name = watch('Name');
  const code = watch('Code');

  const onSubmit = () => {
    updateTreeData();
  }

  const updateTreeData = async () => {
    const submitedData = [];
    const parentNodes = structuredClone(selectedNodeParents);
    const result = await Promise.all(
      parentNodes.map(async (parent) => {
        try {
          if (parent.id !== 0) {
            const response = await getDepartmentDataByID(parent.id, companyId);
            return response.data[0];
          }
        } catch (error) {
          msg.warning("Failed to Fetch Data");
        }
      })
    );
    submitedData.push(...result, selectedNode);
    submit(submitedData);
  };

  const submit = async (submitedData: any[]) => {
    dispatch(setLoading(true));
    let payload = {
      "Details": [
        {
          "ParentId": recordToEditId ? selectedNode.id || '' : selectedNode?.parent || '',
          "TypeId": recordToEditId ? selectedNode?.type || '' : selectedNode?.TypeId || '',
          "Name": name,
          "Code": code,
        }]
    }
    // let branchId = recordToEditId ? selectedNode?.id : 0
    console.log("payload", payload);
    const branchId = Number(recordToEditId ? selectedNode?.id : 0);
    await postOrUpdateDepartmentData(branchId, companyId, payload).then(res => {
      if (res.data.status) {
        fetchDepartmentGetData(companyId);
        msg.success(`${res.data.message}`);
        if (recordToEditId === null) {
          handleReset();
          msg.success(`${res.data.message}`);
        }
        // dispatch(isbranchlistupdate(true));
      } else {
        msg.warning(`${res.data.message}`);
      }
    }).catch(err => { })
      .finally(() => { dispatch(setLoading(false)) })
  }

  const handleReset = () => {
    reset({
      Name: "",
      Code: ""
    })
    setRecordToEditId(null);
  };

  const handleSearch = (val: string) => {
    setSearch((prev) => ({ ...prev, value: val }));

    if (!val) {
      const allKeys: string[] = [];
      const collectKeys = (nodes: any[]) => {
        nodes.forEach((node) => {
          allKeys.push(node.key);
          if (node.children?.length) collectKeys(node.children);
        });
      };
      collectKeys(treeView);
      setExpandedKeys(new Set(allKeys));
      return;
    }

    const matchedKeys: string[] = [];

    const findMatchingNodes = (nodes: any[]) => {
      nodes.forEach((node) => {
        const title = (node.title || node.name || '').toLowerCase();
        if (title.includes(val.toLowerCase())) matchedKeys.push(node.key);
        if (node.children?.length) findMatchingNodes(node.children);
      });
    };
    findMatchingNodes(treeView);

    const parentKeys = new Set<string>();
    const findParentKeys = (nodes: any[], targets: string[]) => {
      nodes.forEach((node) => {
        if (node.children?.some((child) => targets.includes(child.key))) {
          parentKeys.add(node.key);
          findParentKeys(treeView, [node.key]);
        } else if (node.children) {
          findParentKeys(node.children, targets);
        }
      });
    };
    findParentKeys(treeView, matchedKeys);

    // ✅ Collapse all, then expand only matched + parents
    const newExpanded = new Set([...matchedKeys, ...parentKeys]);
    setExpandedKeys(newExpanded);
  };

  const handleToggleNode = (
    newExpandedKeys: string[],
    info: { expanded: boolean; node: any }
  ) => {
    setExpandedKeys(new Set(newExpandedKeys));
  };

  useEffect(() => {
    if (treeView?.length) {
      const allKeys: string[] = [];

      const collectKeys = (nodes: any[]) => {
        nodes.forEach((node) => {
          allKeys.push(node.key);
          if (node.children?.length) {
            collectKeys(node.children);
          }
        });
      };

      collectKeys(treeView);
      setExpandedKeys(new Set(allKeys));
    }
  }, [treeView]);

  return (
    <div className="bg-hsl(214.3 31.8% 91.4%) overflow-y-auto">
      <header className="bg-card flex justify-between border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Masters</span>
            <span>/</span>
            <span className="text-foreground font-medium">Department</span>
          </div>
        </div>
        <div className='flex gap-2'>
          <ReusableButton
            htmlType="button"
            variant="default"
            onClick={handleReset}
            iconPosition="left"
            size="middle"
            className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
          >
            Reset
          </ReusableButton>
          <ReusableButton
            htmlType="button"
            variant="default"
            onClick={handleSubmit(onSubmit)}
            iconPosition="left"
            size="middle"
            className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
          >
            {selectedLevel <= 99 || recordToEditId === null ? "Save" : "Update"}
          </ReusableButton>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Tree Structure Panel */}
        <div className="w-[400px] border-r bg-card flex flex-col">
          <div className=" flex items-center justify-center pt-4 pb-4 ps-0 ms-0 border-b gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); handleSearch(e.target.value) }}
                className="pl-9 "
              />
            </div>
            <div className="flex gap-3 flex items-center justify-center">
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
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
                            handleReset();
                            setDisable(true);
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </ReusableButton>
                    </TooltipTrigger>
                    {selectedLevel !== lastLevel && recordToEditId && (
                      <TooltipContent>
                        Add {nextLevel ? nextLevel : "Department/Unit"}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div>
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
                <ReusableButton
                  size="small"
                  // className="border border-0 h-8 w-8 flex items-center justify-center"
                  className="bg-primary h-[2rem] hover:bg-blue-700 text-white"
                  style={{
                    cursor: disable || selectedLevel === 99 ? "not-allowed" : "pointer",
                  }}
                  onClick={() => {
                    if (!disable && selectedLevel !== 99) {
                      // handleDelete();
                    setIsDelModalOpen(true)
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </ReusableButton>
              </div>
            </div>
          </div>
          <div className="h-[370px] overflow-y-scroll p-2">
            {renderTreeNode(mockData)}
          </div>
        </div>

        {/* Details Panel */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
              <div>
                <h4 className="master-heading mb-2 flex items-center gap-2">
                  {!recordToEditId
                    ? selectedLevel === 99
                      ? "Department"
                      : "Add Department"
                    : selectedLevel === 99
                      ? "Department"
                      : "Update Department"}
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
              <h5>{recordToEditId && selectedLevel !== 99 ? `Update ${departrmentData[0].heading}` : `${selectedLevel !== 99 ? "Enter" : ""} ${departrmentData[0].heading}`}</h5>
              <div className="px-1">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {getFieldsByNames(['Name', 'Code']).map((field) => {
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

export default Department;
