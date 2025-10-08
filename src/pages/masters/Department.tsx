
import React, { useEffect, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Trash2, ChevronRight, ChevronDown, Folder, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReusableButton } from '@/components/ui/reusable-button';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { DEPARTMENT_DB } from '@/Local_DB/Form_JSON_Data/departmentDB';
import { Controller, useForm } from 'react-hook-form';
import { useMessage } from '@/components/ui/reusable-message';
import { useDispatch } from 'react-redux';
import { ReusableInput } from '@/components/ui/reusable-input';
import { setLoading } from '@/store/slices/projectsSlice';
import { getDepartmentData } from '@/services/departmentServices';
import { useAppSelector } from '@/store';
import { TreeConfig, TreeView } from '@/components/ui/reusable-treeView';


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

const Department = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1', '2', '3', '4', '5']));
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(mockData);
  const [fields, setFields] = useState<BaseField[]>(DEPARTMENT_DB);
    const [departrmentData, setDepartmentData]=useState([])

  const companyId = useAppSelector(state => state.projects.companyId);
  const dispatch = useDispatch()
  const msg = useMessage()


  useEffect(() => {
    if (companyId) {
      fetchDepartmentGetData(companyId)
    }
  }, [companyId])

  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultChecked ?? '';
      return acc;
    }, {} as GenericObject),
    // mode: 'onChange',
    // reValidateMode: "onChange"
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
    const isSelected = selectedNode?.id === node.id;

    return (
      <div key={node.id} className=''>
        {/* <div
          className={cn(
            "flex items-center gap-2 py-1.5 px-2 hover:bg-accent/50 cursor-pointer rounded-sm transition-colors",
            isSelected && "bg-accent"
          )}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => setSelectedNode(node)}
        > */}
          {/* {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="p-0.5 hover:bg-muted rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}
          <Folder className="h-4 w-4 text-yellow-600" />
          <span className="text-sm">
            {node.name}({node.code})
          </span> */}
        {/* </div> */}
        {hasChildren && isExpanded && (
          <div>
            {/* {node.children?.map(child => renderTreeNode(child, level + 1))} */}
            <TreeView treeData={departrmentData} config={treeConfig} />
          </div>
        )}
      </div>
    );
  };

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
    }
  }

    const treefun = (data, id) => {
    const treeData = [];
    const keys =[];
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
        console.log("res",res);
         const result=treefun(res.data,"#")
        setDepartmentData(result)
      } else {
        msg.warning(res.data.message || "No Data Found")
      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }

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
            onClick={null}
            iconPosition="left"
            size="middle"
            className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
          >
            Reset
          </ReusableButton>
          <ReusableButton
            htmlType="button"
            variant="default"
            onClick={null}
            iconPosition="left"
            size="middle"
            className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
          >
            Save
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 "
              />
            </div>
            <div className="flex gap-2 flex items-center justify-center">
              <Button size="sm" variant="outline" className="h-8">
                <Plus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="h-8">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
          <div className="min-h-20 max-h-[27rem] overflow-y-auto p-2">
            {renderTreeNode(mockData)}
          </div>
        </div>

        {/* Details Panel */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Department</h2>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="text-sm text-primary">
              Department &gt;
            </div>

            <div className="space-y-6">
              <h3 className="text-base font-semibold">Department Details</h3>

              <div className="px-1">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {getFieldsByNames(['depname', 'depcode']).map((field) => {
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
