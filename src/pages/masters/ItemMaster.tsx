import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/common/PageLayout';
import PageHeader from '@/components/common/PageHeader';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableTable } from '@/components/ui/reusable-table';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { setLoading } from '@/store/slices/projectsSlice';
import { useDispatch } from 'react-redux';
import { addNewStore, deleteStore, getEditStoreData, getStoreData, getStoreDataByCompanyIdAndBranchName, updateStore } from '@/services/storeServices';
import { useMessage } from '@/components/ui/reusable-message';
import { useAppSelector } from '@/store';
import { Controller, useForm } from 'react-hook-form';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { STORE_DB } from '@/Local_DB/Form_JSON_Data/StoreDB';
import { ITEM_MASTER_DB } from '@/Local_DB/Form_JSON_Data/ItemMasterDB';
import { addNewItemMaster, deleteItemMaster, getEditItemMasterData, getItemMasterData } from '@/services/ItemMasterServices';
import { getMainCategoryLookUp, getSubCategoryLookUp } from '@/services/servicedeskReportsServices';


interface Store {
  id: string;
  name: string;
  branch: string;
  description: string;
}
const ItemMaster = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [fields, setFields] = useState<BaseField[]>(ITEM_MASTER_DB);
  const [dataSource, setDataSource] = useState([])
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [recordToEditId, setRecordToEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    description: '',
  });
  const dispatch = useDispatch()
  const msg = useMessage()
  const companyId = useAppSelector(state => state.projects.companyId);
  const branch = useAppSelector(state => state.projects.branch) || '';
  const branchCode = useAppSelector(state => state.projects.branchCode) || '';


  useEffect(() => {
    if (companyId) {
      fetchItemMasterData(companyId)
      fetchAllLookUps()
    }
  }, [companyId])

  async function fetchAllLookUps() {
    dispatch(setLoading(true));
    try {
      const [SRMainCategoryLookUps] =
        await Promise.allSettled([
          getMainCategoryLookUp(companyId),
        ]);
      const allResponses = {

        MainCategory: { data: SRMainCategoryLookUps.status === 'fulfilled' && SRMainCategoryLookUps.value.success && SRMainCategoryLookUps.value.data && SRMainCategoryLookUps.value.data.CategoriesLookup ? SRMainCategoryLookUps.value.data.CategoriesLookup : [], label: "CategoryName", value: "CategoryId" },
      };
      setLookupsDataInJson(allResponses);
    } catch (error) {
      msg.warning(`Error fetching lookups: ${error}`)
    } finally {
      dispatch(setLoading(false));
    }
  }
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
    console.log(data, "Chitti")
    setFields(data);
    // setFieldsCopy(data);
  }
  //   const filteredStores = mockStores.filter(store =>
  //     store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     store.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     store.description.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
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
  const selectedMainCategory = watch("MainCategory");
  useEffect(() => {
    if (selectedMainCategory) {
      getSubCategoryDetails(companyId, selectedMainCategory)
    } else {
      getSubCategoryDetails(companyId, null)
    }
  }, [selectedMainCategory, companyId])
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
        if (id === selectedMainCategory) {
          const idx = data.findIndex(x => x.name === "SubCategory");
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
        <div className="flex gap-2">
          <ReusableButton
            variant="text"
            size="small"
            //   icon={<Edit className="h-4 w-4" />}
            onClick={() => { setSelectedStore(row.original); setRecordToEditId(row.original.ItemId); fetchItemMasterDataByItemMasterId(companyId, row.original.ItemId); }}
          >
            <Edit className="h-4 w-4" />
          </ReusableButton>
          <ReusableButton
            variant="text"
            size="small"
            danger
            icon={<Trash2 className="h-4 w-4" />}
            onClick={() => { setIsDelModalOpen(true); setRecordToEditId(row.original.ItemId); console.log(row.original), "C" }}
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
        //  console.log(res.data,"Nag")
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
        //  console.log(res.data,"Nag")
        // setDataSource(res.data.StoreDetails)
        handleEdit(res.data.ItemMasterDetails)
      } else {
        msg.warning(res.data.message || "No Data Found")
      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
  }
  const deleteItemMasterData = async (id: number, data: any) => {
    await deleteItemMaster(companyId, id, data).then(res => {
      if (res.success) {
        if (res.data.status) {
          msg.success(res.data.message);
          //   if (selectedStatusRec && selectedStatusRec.Id == id) {
          //     handleReset('DeleteStatus');
          //   }
          //   fetchAllStatusList();
          fetchItemMasterData(companyId)
        } else {
          msg.warning(res.data.message);
        }
      } else {
        msg.warning('Failed to delete status !!')
      }
    }).catch(err => { }).finally(() => {

    })
  }
  const addNewItemMasterData = async (data: any) => {
    await addNewItemMaster(companyId, data).then(res => {
      if (res.success) {
        if (res.data.status) {
          msg.success(res.data.message);
        
          fetchItemMasterData(companyId)
          // fetchStoreDataByBranchName(companyId,branch)

        } else {
          msg.warning(res.data.ErrorDetails[0]["Error Message"]);
        }
      } else {
        msg.warning('Failed to delete status !!')
      }
    }).catch(err => { }).finally(() => {

    })
  }
  const updateStoreData = async (id: any, data: any) => {
    await updateStore(companyId, id, data).then(res => {
      if (res.success) {
        if (res.data.status) {
          msg.success(res.data.message);
          //   if (selectedStatusRec && selectedStatusRec.Id == id) {
          // //     handleReset('DeleteStatus');
          // //   }
          // //   fetchAllStatusList();
          // if(recordToEditId==null && companyId){

          // }
          fetchItemMasterData(companyId)
          // fetchStoreDataByBranchName(companyId,branch)

        } else {
          msg.warning(res.data.message);
        }
      } else {
        msg.warning('Failed to delete status !!')
      }
    }).catch(err => { }).finally(() => {

    })
  }
  const submit = () => {
    console.log(watch("MainCategory"),watch("SubCategory"),'Nag')
    let Payload = {

      "ItemMasterDetails": [
        {
          "Item Name": watch("ItemName") ||"",
          "Code": watch("ItemCode") ||"",
          "Description": watch("ItemDescription") ||"",
          "Level1 category": watch("MainCategory") ||"",
          "Level2 category": watch("SubCategory") ||"",
          "Unit of measure": watch("UnitofMeasure") ||"",
          "Reorder level": watch("ReorderLevel") ||"",
          "Unit price": watch("UnitPrice") ||"",
        },
      ]
    }
    if (recordToEditId == null && companyId) {
      addNewItemMasterData(Payload)
      setIsAddDialogOpen(false)
    }
    else if (recordToEditId !== null && companyId) {
      updateStoreData(recordToEditId, Payload)
      setIsAddDialogOpen(false)

    }
  }




  const handleEdit = (data) => {
    console.log()
    setIsAddDialogOpen(true)
    reset({
      ...watch(),
      ItemName: data.ItemName,
      ItemCode: data.Code,
      MainCategory: parseInt(data.Level1CategoryId),
      SubCategory: data.Level2CategoryId,
      UnitofMeasure: data.UnitOfMeasure,
      ReorderLevel: data.ReorderLevel,
      ItemDescription: data.Description
    })
    // e.preventDefault();
    // console.log('Store data:', formData);
    // setIsAddDialogOpen(false);
    // setFormData({ name: '', branch: '', description: '' });
  };

  return (
    <PageLayout>
      <div className="space-y-6 p-5">
        <div className="flex justify-between items-center">
          <h1>Item Master</h1>
          <div className='flex gap-3'>
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
                    onClick={() => submit()}
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
            // onClick={()=>{setRecordToEditId(null);reset({StoreName:"",Branch:"",StoreDescription:""})}}
            >
              Import
            </ReusableButton>
          </div>
          <Dialog open={isDelModalOpen} onOpenChange={setIsDelModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirm the action</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete Item master?
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
                  onClick={() => { deleteItemMasterData(recordToEditId, ""); setIsDelModalOpen(false) }}
                // onClick={currentTab === "service-request-type" ? () => { deleteServiceRequestType(selectedRecord?.Id); setIsDelModalOpen(false) } : () => { deleteStatus(selectedStatusRec?.Id); setIsDelModalOpen(false) }}
                >
                  Delete
                </ReusableButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <div className="bg-card ">
          <ReusableTable
            data={dataSource}
            columns={columns}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default ItemMaster;