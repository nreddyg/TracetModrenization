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


interface Store {
    id: string;
    name: string;
    branch: string;
    description: string;
}
const Store = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [fields, setFields] = useState<BaseField[]>(STORE_DB);
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
    const branch=useAppSelector(state => state.projects.branch) || '';
    const branchCode=useAppSelector(state => state.projects.branchCode) || '';
    

    useEffect(() => {
        if (companyId && branch=="All")
        {
            fetchStoreGetData(companyId)
        }
        if(companyId && branch!="All" && branch!="")
        {
            fetchStoreDataByBranchName(companyId,branch)
        }
    }, [companyId,branch])


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
            id: 'StoreName',
            header: 'Store Name',
            accessorKey: 'StoreName',
            enableSorting: true,
        },
        {
            id: 'BranchName',
            header: 'Branch',
            accessorKey: 'BranchName',
            enableSorting: true,
        },
        {
            id: 'StoreDescription',
            header: 'Store Description',
            accessorKey: 'StoreDescription',
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
                        onClick={() => { setSelectedStore(row.original);setRecordToEditId(row.original.StoreId);fetchStoreDataByStoreId(companyId,row.original.StoreId) }}
                    >
                        Edit
                    </ReusableButton>
                    <ReusableButton
                        variant="text"
                        size="small"
                        danger
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => {setIsDelModalOpen(true);setRecordToEditId(row.original.StoreId);console.log(row.original),"C"}}
                    >
                        Delete
                    </ReusableButton>
                </div>
            ),
        },
    ];
    async function fetchStoreGetData(companyId) {
        dispatch(setLoading(true))
        await getStoreData(companyId).then(res => {
            if (res.data && res.data.status == undefined) {
                //  console.log(res.data,"Nag")
                setDataSource(res.data.StoreDetails)
            } else {
                setDataSource([])
                msg.warning(res.data.message || "No Data Found")
            }
        }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
    }
       async function fetchStoreDataByBranchName(companyId,branch) {
        dispatch(setLoading(true))
        await getStoreDataByCompanyIdAndBranchName(companyId,branch).then(res => {
            if (res.data && res.data.status == undefined) {
                //  console.log(res.data,"Nag")
                setDataSource(res.data)
            } else {
                msg.warning(res.data.message || "No Data Found")
            }
        }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
    }
  async function fetchStoreDataByStoreId(companyId,id) {
        dispatch(setLoading(true))
        await getEditStoreData(companyId,id).then(res => {
            if (res.data && res.data.status == undefined) {
                //  console.log(res.data,"Nag")
                // setDataSource(res.data.StoreDetails)
                handleEdit(res.data.StoreDetails)
            } else {
                msg.warning(res.data.message || "No Data Found")
            }
        }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
    }
  const deleteStoreData = async (id: number,data:any) => {
    await deleteStore(companyId, id,data).then(res => {
      if (res.success) {
        if (res.data.status) {
          msg.success(res.data.message);
        //   if (selectedStatusRec && selectedStatusRec.Id == id) {
        //     handleReset('DeleteStatus');
        //   }
        //   fetchAllStatusList();
        fetchStoreGetData(companyId)
        } else {
          msg.warning(res.data.message);
        }
      } else {
        msg.warning('Failed to delete status !!')
      }
    }).catch(err => { }).finally(() => {

    })
  }
   const addNewStoreData = async (branch: any,data:any) => {
    await addNewStore(companyId, branch,data).then(res => {
      if (res.success) {
        if (res.data.status) {
          msg.success(res.data.message);
        //   if (selectedStatusRec && selectedStatusRec.Id == id) {
        // //     handleReset('DeleteStatus');
        // //   }
        // //   fetchAllStatusList();
        // if(recordToEditId==null && companyId){

        // }
        // fetchStoreGetData(companyId)
        fetchStoreDataByBranchName(companyId,branch)

        } else {
          msg.warning(res.data.message);
        }
      } else {
        msg.warning('Failed to delete status !!')
      }
    }).catch(err => { }).finally(() => {

    })
  }
    const updateStoreData = async (id: any,data:any) => {
    await updateStore(companyId, id,data).then(res => {
      if (res.success) {
        if (res.data.status) {
          msg.success(res.data.message);
        //   if (selectedStatusRec && selectedStatusRec.Id == id) {
        // //     handleReset('DeleteStatus');
        // //   }
        // //   fetchAllStatusList();
        // if(recordToEditId==null && companyId){

        // }
        // fetchStoreGetData(companyId)
            fetchStoreDataByBranchName(companyId,branch)

        } else {
          msg.warning(res.data.message);
        }
      } else {
        msg.warning('Failed to delete status !!')
      }
    }).catch(err => { }).finally(() => {

    })
  }
  const submit=()=>{
  let Payload = {
            "StoreDetails": [
                {
                    "Store Name": watch("StoreName"),
                    "Store Description": watch("StoreDescription"),
                    "BranchName": branch,
                    "Branch Code":branchCode
                }
            ]
        }
        if(recordToEditId==null && companyId){
            addNewStoreData(branch,Payload)
            setIsAddDialogOpen(false)
        }
        else if(recordToEditId!==null && companyId){
            updateStoreData(recordToEditId,Payload)
            setIsAddDialogOpen(false)

        }
  }

   

  
      const handleEdit = (data) => {
        reset({
            StoreName: data.StoreName,
            Branch:data.Branch,
            StoreDescription:data.StoreDescription
        })
        setIsAddDialogOpen(true)
        // e.preventDefault();
        // console.log('Store data:', formData);
        // setIsAddDialogOpen(false);
        // setFormData({ name: '', branch: '', description: '' });
      };

    return (
        <PageLayout>
            {/* <PageHeader 
        title="Store List" 
        breadcrumbs={[
          { label: 'Masters', href: '/masters' },
          { label: 'Consumables', href: '/masters/consumables' },
          { label: 'Store', href: '/masters/store' }
        ]}
      /> */}

            <div className="space-y-6 p-5">
                {/* Search and Actions */}
                <div className="flex justify-between items-center">
                    <h1>Store</h1>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <ReusableButton
                                variant="primary"
                                icon={<Plus className="h-4 w-4" />}
                                className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                                onClick={()=>{setRecordToEditId(null);reset({StoreName:"",Branch:"",StoreDescription:""})}}
                            >
                                Add
                            </ReusableButton>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{recordToEditId?"Update Store":"Add Store"}</DialogTitle>
                            </DialogHeader>
                            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4'>
                                {getFieldsByNames(['StoreName', 'Branch']).map((field) => {
                                    return <div className="flex items-center space-x-2">
                                        {renderField(field)}
                                    </div>;
                                })}
                            </div>
                            <div className='w-100'>
                                {getFieldsByNames(['StoreDescription']).map((field) => {
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
                                    onClick={()=>submit()}
                                >
                                   {recordToEditId?"Update":"Save"}
                                </ReusableButton>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isDelModalOpen} onOpenChange={setIsDelModalOpen}>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Confirm the action</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete Store?
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
                                    onClick={()=>{deleteStoreData(recordToEditId,"");setIsDelModalOpen(false)}}
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

export default Store;