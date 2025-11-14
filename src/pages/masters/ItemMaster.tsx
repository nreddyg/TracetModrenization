import { useEffect, useState } from 'react';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableTable } from '@/components/ui/reusable-table';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { setLoading } from '@/store/slices/projectsSlice';
import { useDispatch } from 'react-redux';
import { useMessage } from '@/components/ui/reusable-message';
import { useAppSelector } from '@/store';
import { Controller, useForm } from 'react-hook-form';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { ITEM_MASTER_DB } from '@/Local_DB/Form_JSON_Data/ItemMasterDB';
import { addNewItemMaster, deleteItemMaster, getEditItemMasterData, getItemMasterData, updateItemMaster } from '@/services/ItemMasterServices';
import { getItemCategoryData } from '@/services/itemCategoryServices';
import { getUOMData } from '@/services/unitsOfMeasureServices';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';

interface Store {
  id: string;
  name: string;
  branch: string;
  description: string;
}
const ItemMaster = () => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [fields, setFields] = useState<BaseField[]>(ITEM_MASTER_DB);
  const [dataSource, setDataSource] = useState([])
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [recordToEditId, setRecordToEditId] = useState(null);
  const dispatch = useDispatch()
  const msg = useMessage()
  const companyId = useAppSelector(state => state.projects.companyId);
  useEffect(() => {
    if (companyId) {
      fetchItemMasterData(companyId)
    }
  }, [companyId])
  const setLookupsDataInJson = (lookupsData): void => {
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
  }
  const form = useForm<GenericObject>({
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name!] = f.defaultChecked ?? '';
      return acc;
    }, {} as GenericObject),
    mode: 'onChange',
  });

  const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;
  const getFieldsByNames = (names: string[]) => fields.filter(f => names.includes(f.name!));
  const selectedMainCategory = watch("MainCategory") || null;
  useEffect(() => {
    getItemCategoryForDropdown(companyId)
  }, [selectedMainCategory, companyId])

  const getUOMDetailsForDropdown = async (id) => {
    dispatch(setLoading(true))
    await getUOMData(id)
      .then((res) => {
        if (res.data !== undefined) {
          res.data.UOMDetails.forEach((element) => {
            element["label"] = element.Name
            element["value"] = element.Name
          })
          const tempData = fields;
          const itemIndex = tempData.findIndex((x) => x.name === "UnitofMeasure");
          tempData[itemIndex].options = res.data.UOMDetails;
          setFields(structuredClone(tempData))
        }
      }).catch((err) => { })
      .finally(() => { dispatch(setLoading(false)) })
  }
  const getItemCategoryForDropdown = async (id) => {
    dispatch(setLoading(true))
    await getItemCategoryData(id).then((res) => {
      if (res.data !== undefined && res.data.length !== 0) {
        res.data.MainCategories.forEach((element) => {
          element["label"] = element.CategoryName;
          element["value"] = element.CategoryName;
        })
        const tempItems = fields;
        const index = tempItems.findIndex(x => x.name === "MainCategory");
        tempItems[index].options = res.data.MainCategories
        let selectedMainObj = res.data.MainCategories.filter(x => x.CategoryName === selectedMainCategory)
        if (selectedMainObj !== null) {
          let tempCategory = res.data.SubCategories.filter((obj) => obj.ParentId === selectedMainObj[0].CategoryId)
          tempCategory.forEach((sub) => {
            sub["label"] = sub.CategoryName;
            sub["value"] = sub.CategoryName;
          })
          const tempItems = fields;
          const index = tempItems.findIndex(x => x.name === "SubCategory");
          tempItems[index].options = tempCategory
        }
        setFields(structuredClone(tempItems))
      }
    }).catch((err) => { })
      .finally(() => {
        dispatch(setLoading(false))
        getUOMDetailsForDropdown(companyId)
      })
  }
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
                usePortal={false}
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      case 'textarea':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableTextarea
                {...field}
                value={ctrl.value}
                onChange={ctrl.onChange}
                error={errors[name]?.message as string}
              />
            )}
          />
        );
      default:
        return null;
    }
  }

  const columns = [
    {
      id: 'ItemName',
      header: 'Item Name',
      accessorKey: 'ItemName',
      enableSorting: true,
    },
    {
      id: 'Code',
      header: 'Item Code',
      accessorKey: 'Code',
      enableSorting: true,
    },
    {
      id: 'Description',
      header: 'Description',
      accessorKey: 'Description',
      enableSorting: true,
    },
    {
      id: 'Level1Category',
      header: 'Main Category',
      accessorKey: 'Level1Category',
      enableSorting: true,
    },
    {
      id: 'Level2Category',
      header: 'Sub Category',
      accessorKey: 'Level2Category',
      enableSorting: true,
    },
    {
      id: 'UnitOfMeasure',
      header: 'Unit Of Measure',
      accessorKey: 'UnitOfMeasure',
      enableSorting: true,
    },
    {
      id: 'ReorderLevel',
      header: 'Reorder Level',
      accessorKey: 'ReorderLevel',
      enableSorting: true,
    },
    {
      id: 'actions',
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2" title='Actions'>
          <ReusableButton
            variant="text"
            size="small"
            title='Edit'
            //   icon={<Edit className="h-4 w-4" />}
            onClick={() => { setSelectedStore(row.original); setRecordToEditId(row.original.ItemId); fetchItemMasterDataByItemMasterId(companyId, row.original.ItemId); }}
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </ReusableButton>
          <ReusableButton
            variant="text"
            size="small"
            danger
            title='Delete'
            icon={<Trash2 className="h-4 w-4" />}
            onClick={() => { setIsDelModalOpen(true); setRecordToEditId(row.original.ItemId); }}
          >
            <Trash2 className="h-4 w-4" />
          </ReusableButton>
        </div>
      ),
    },
  ];
  async function fetchItemMasterData(companyId) {
    dispatch(setLoading(true))
    await getItemMasterData(companyId).then(res => {
      if (res.data && res.data.status == undefined) {
        setDataSource(res.data.ItemMasterDetails)
      } else {
        setDataSource([])
        msg.warning(res.data.message || "No Data Found")
      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }
  async function fetchItemMasterDataByItemMasterId(companyId, id) {
    dispatch(setLoading(true))
    await getEditItemMasterData(companyId, id).then(res => {
      if (res.data && res.data.status == undefined) {
        handleEdit(res.data.ItemMasterDetails)
      } else {
        msg.warning(res.data.message || "No Data Found")
      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }
  const deleteItemMasterData = async (id: number, data: any) => {
    dispatch(setLoading(true))
    await deleteItemMaster(companyId, id, data).then(res => {
      if (res.success) {
        if (res.data.status) {
          msg.success(res.data.message);
          fetchItemMasterData(companyId)
        } else {
          msg.warning(res.data.message);
        }
      } else {
        msg.warning('Failed to delete status !!')
      }
    }).catch(err => { }).finally(() => {
      dispatch(setLoading(false))
    })
  }
  const addNewItemMasterData = async (data: any) => {
    dispatch(setLoading(true))
    await addNewItemMaster(companyId, data).then(res => {
      if (res.success) {
        if (res.data.status) {
          msg.success(res.data.message);
          fetchItemMasterData(companyId)
          setIsAddDialogOpen(false)
        } else {
          msg.warning(res.data.ErrorDetails[0]["Error Message"]);
        }
      } else {
        msg.warning('Failed to delete status !!')
      }
    }).catch(err => { }).finally(() => {
        dispatch(setLoading(false))
    })
  }
  const updateStoreData = async (id: any, data: any) => {
    dispatch(setLoading(true))
    await updateItemMaster(companyId, id, data).then(res => {
      if (res.success) {
        if (res.data.status) {
          msg.success(res.data.message);
          setIsAddDialogOpen(false)
          fetchItemMasterData(companyId)
        } else {
          msg.warning(res.data.ErrorDetails[0]["Error Message"]);
        }
      } else {
        msg.warning('Failed to delete status !!')
      }
    }).catch(err => { }).finally(() => {
      dispatch(setLoading(false))
    })
  }
  const submit = () => {
    let Payload = {
      "ItemMasterDetails": [
        {
          "Item Name": watch("ItemName") || "",
          "Code": watch("ItemCode") || "",
          "Description": watch("ItemDescription") || "",
          "Level1 category": watch("MainCategory") || "",
          "Level2 category": watch("SubCategory") || "",
          "Unit of measure": watch("UnitofMeasure") || "",
          "Reorder level": watch("ReorderLevel") || "",
          "Unit price": watch("UnitPrice") || "",
        },
      ]
    }
    if (recordToEditId == null && companyId) {
      addNewItemMasterData(Payload)
    }
    else if (recordToEditId !== null && companyId) {
      updateStoreData(recordToEditId, Payload)
      setIsAddDialogOpen(false)
    }
  }
  const handleEdit = (data) => {
    setIsAddDialogOpen(true)
    reset({
      ...watch(),
      ItemName: data.ItemName,
      ItemCode: data.Code,
      MainCategory: data.Level1Category,
      SubCategory: data.Level2Category,
      UnitofMeasure: data.UnitOfMeasure,
      ReorderLevel: data.ReorderLevel,
      ItemDescription: data.Description
    })
  };
  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col ">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 ">
          <div className="min-h-[53px] bg-white border-b shadow-sm px-4 lg:px-6 py-3 flex flex-row xxs:flex-col xs2:flex-row lg:flex-row lg:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Masters</span>
                  <span>/</span>
                  <span>Consumables</span>
                  <span>/</span>
                  <span className="text-gray-900 font-medium">Item Master</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <ReusableButton
                    variant="primary"
                    icon={<Plus className="h-4 w-4" />}
                    className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                    onClick={() => { setRecordToEditId(null); reset({ StoreName: "", Branch: "", StoreDescription: "" }) }}
                  >
                    Add
                  </ReusableButton>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{recordToEditId ? "Update Item master" : "Add Item master"}</DialogTitle>
                  </DialogHeader>
                  <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4'>
                    {getFieldsByNames(['ItemName', 'ItemCode', "MainCategory", "SubCategory", "UnitofMeasure", "UnitPrice", "ReorderLevel"]).map((field) => {
                      return <div className="flex items-center space-x-2">
                        {renderField(field)}
                      </div>;
                    })}
                  </div>
                  <div className='w-100'>
                    {getFieldsByNames(['ItemDescription']).map((field) => {
                      return <div className=" space-x-2">
                        {renderField(field)}
                      </div>;
                    })}
                  </div>
                  <div className="flex justify-end gap-2">
                    <ReusableButton
                      variant="default"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </ReusableButton>
                    <ReusableButton
                      htmlType="submit"
                      variant="primary"
                      className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                      onClick={() => handleSubmit(submit)()}
                    >
                      {recordToEditId ? "Update" : "Save"}
                    </ReusableButton>
                  </div>
                </DialogContent>
              </Dialog>
              <ReusableButton
                variant="primary"
                icon={<Plus className="h-4 w-4" />}
                className="bg-orange-500 hover:bg-orange-600 border-orange-500"
              >
                Import
              </ReusableButton>
            </div>
          </div>
          <div className="flex-1 p-3 overflow-hidden min-h-0  ">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 h-full">
              <div className="lg:col-span-12 flex flex-col  min-h-0 ">
                <ScrollArea className="flex-1">
                  <div className="space-y-2 pr-1">
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="p-2">
                        <div className="p-2">
                          <div className="bg-gray-50/30">
                            <ReusableTable
                              title='Item Master'
                              data={dataSource}
                              columns={columns}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isDelModalOpen} onOpenChange={setIsDelModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm the action</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete Item master?
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
              onClick={() => { deleteItemMasterData(recordToEditId, ""); setIsDelModalOpen(false) }}
            >
              Delete
            </ReusableButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ItemMaster;