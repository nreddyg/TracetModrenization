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
import { useMessage } from '@/components/ui/reusable-message';
import { useAppSelector } from '@/store';
import { Controller, useForm } from 'react-hook-form';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { addNewUOM, deleteUOM, getEditUOMData, getUOMData, updateUOM } from '@/services/unitsOfMeasureServices';
import { UNITS_OF_MEASURE_DB } from '@/Local_DB/Form_JSON_Data/UnitsOfMeasureDB';
import { useNavigate } from 'react-router-dom';



const UnitOfMeasure = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isConverDialogOpen, setIsConvertDialogOpen] = useState(false);
    const [fields, setFields] = useState<BaseField[]>(UNITS_OF_MEASURE_DB);
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
    let navigate=useNavigate()
    

    useEffect(() => {
        if (companyId )
        {
            fetchUOMGetData(companyId)
        }
       
    }, [companyId,branch])
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
            id: 'Name',
            header: 'Name',
            accessorKey: 'Name',
            enableSorting: true,
        },
        {
            id: 'Description',
            header: 'Description',
            accessorKey: 'Description',
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
                        //   icon={}
                        onClick={() => {setRecordToEditId(row.original.UOMId);fetchUOMById(companyId,row.original.UOMId) }}
                    >
                      <Edit className="h-4 w-4" />
                    </ReusableButton>
                    <ReusableButton
                        variant="text"
                        size="small"
                        danger
                       
                        onClick={() => {setIsDelModalOpen(true);setRecordToEditId(row.original.UOMId);console.log(row.original),"C"}}
                    >
                        <Trash2 className="h-4 w-4" />
                    </ReusableButton>
                </div>
            ),
        },
    ];
    async function fetchUOMGetData(companyId) {
        dispatch(setLoading(true))
        await getUOMData(companyId).then(res => {
            if (res.data && res.data.status == undefined) {
                //  console.log(res.data,"Nag")
                setDataSource(res.data.UOMDetails)
            } else {
                setDataSource([])
                msg.warning(res.data.message || "No Data Found")
            }
        }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
    }
  async function fetchUOMById(companyId,id) {
        dispatch(setLoading(true))
        await getEditUOMData(companyId,id).then(res => {
            if (res.data && res.data.status == undefined) {
                
                handleEdit(res.data.UOMDetails)
            } else {
                msg.warning(res.data.message || "No Data Found")
            }
        }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
    }
  const deleteUOMData = async (id: number,data:any) => {
    await deleteUOM(companyId, id,data).then(res => {
      if (res.success) {
        if (res.data.status) {
          msg.success(res.data.message);
        //   if (selectedStatusRec && selectedStatusRec.Id == id) {
        //     handleReset('DeleteStatus');
        //   }
        //   fetchAllStatusList();
        } else {
          msg.warning(res.data.message);
        }
      } else {
        msg.warning('Failed to delete UOM !!')
      }
    }).catch(err => { }).finally(() => {

    })
  }
   const addNewUOMData = async (branch: any,data:any) => {
    await addNewUOM(companyId, data).then(res => {
      if (res.success) {
        if (res.data.status) {
          msg.success(res.data.message);
        fetchUOMGetData(companyId)

        } else {
          msg.warning(res.data.message);
        }
      } else {
        msg.warning('Failed to delete status !!')
      }
    }).catch(err => { }).finally(() => {

    })
  }
    const updateUOMData = async (id: any,data:any) => {
    await updateUOM(companyId, id,data).then(res => {
      if (res.success) {
        if (res.data.status) {
          msg.success(res.data.message);
            fetchUOMGetData(companyId)

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
            "UOMDetails": [
                {
                    "Name": watch("Name"),
                    "Description": watch("Description"),
                }
            ]
        }
        if(recordToEditId==null && companyId){
            addNewUOMData(companyId,Payload)
            setIsAddDialogOpen(false)
        }
        else if(recordToEditId!==null && companyId){
            updateUOMData(recordToEditId,Payload)
            setIsAddDialogOpen(false)

        }
  }

   

  
      const handleEdit = (data) => {
        reset({
            Name: data.Name,
            Description:data.Description
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
                    <h1>Units Of Measure</h1>
<div className='flex gap-3'>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <ReusableButton
                                variant="primary"
                                icon={<Plus className="h-4 w-4" />}
                                className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                                onClick={()=>{setRecordToEditId(null);reset({Name:"",Description:""})}}
                            >
                                Add Unit
                            </ReusableButton>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{recordToEditId?"Update Unit Of Measure":"Add Unit Of Measure"}</DialogTitle>
                            </DialogHeader>
                            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4'>
                                {getFieldsByNames(['Name', 'Branch']).map((field) => {
                                    return <div className="flex items-center space-x-2">
                                        {renderField(field)}
                                    </div>;
                                })}
                            </div>
                            <div className='w-100'>
                                {getFieldsByNames(['Description']).map((field) => {
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
                    <ReusableButton
                                variant="primary"
                                icon={<Plus className="h-4 w-4" />}
                                className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                                onClick={()=>{ navigate('/masters/consumables/unitsofmeasure/manageunitconverstion');}}
                            >
                                Manage Unit Conversations 
                            </ReusableButton>
</div>

                    <Dialog open={isDelModalOpen} onOpenChange={setIsDelModalOpen}>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Confirm the action</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete Unit Of Measure?
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
                                    onClick={()=>{deleteUOMData(recordToEditId,"");setIsDelModalOpen(false)}}
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

export default UnitOfMeasure;