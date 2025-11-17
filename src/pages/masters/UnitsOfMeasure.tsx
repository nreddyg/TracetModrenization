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
import { addNewUOM, deleteUOM, getEditUOMData, getUOMData, updateUOM } from '@/services/unitsOfMeasureServices';
import { UNITS_OF_MEASURE_DB } from '@/Local_DB/Form_JSON_Data/UnitsOfMeasureDB';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { FaAngleRight } from 'react-icons/fa';

const UnitOfMeasure = () => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [fields, setFields] = useState<BaseField[]>(UNITS_OF_MEASURE_DB);
    const [dataSource, setDataSource] = useState([])
    const [isDelModalOpen, setIsDelModalOpen] = useState(false);
    const [recordToEditId, setRecordToEditId] = useState(null);
    const dispatch = useDispatch()
    const msg = useMessage()
    const companyId = useAppSelector(state => state.projects.companyId);
    const branch = useAppSelector(state => state.projects.branch) || '';
    let navigate = useNavigate()
    useEffect(() => {
        if (companyId) {
            fetchUOMGetData(companyId)
        }
    }, [companyId, branch])
    const form = useForm<GenericObject>({
        defaultValues: fields.reduce((acc, f) => {
            acc[f.name!] = f.defaultChecked ?? '';
            return acc;
        }, {} as GenericObject),
        mode: 'onChange',
    });
    const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;
    const getFieldsByNames = (names: string[]) => fields.filter(f => names.includes(f.name!));
    const renderField = (field: BaseField) => {
        const { name, label, fieldType, isRequired, dependsOn, show = true } = field;
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
                <div className="flex gap-2" title='Actions'>
                    <ReusableButton
                        variant="text"
                        size="small"
                        title='Edit'
                        onClick={() => { setRecordToEditId(row.original.UOMId); fetchUOMById(companyId, row.original.UOMId) }}
                    >
                        <Edit className="h-4 w-4 text-blue-600" />
                    </ReusableButton>
                    <ReusableButton
                        variant="text"
                        size="small"
                        title="Delete"
                        danger
                        onClick={() => { setIsDelModalOpen(true); setRecordToEditId(row.original.UOMId) }}
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
                setDataSource(res.data.UOMDetails)
            } else {
                setDataSource([])
                msg.warning(res.data.message || "No Data Found")
            }
        }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
    }
    async function fetchUOMById(companyId, id) {
        dispatch(setLoading(true))
        await getEditUOMData(companyId, id).then(res => {
            if (res.data && res.data.status == undefined) {

                handleEdit(res.data.UOMDetails)
            } else {
                msg.warning(res.data.message || "No Data Found")
            }
        }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
    }
    const deleteUOMData = async (id: number, data: any) => {
        dispatch(setLoading(true))
        await deleteUOM(companyId, id, data).then(res => {
            if (res.success) {
                if (res.data.status) {
                    msg.success(res.data.message);
                } else {
                    msg.warning(res.data.message);
                }
            } else {
                msg.warning('Failed to delete UOM !!')
            }
        }).catch(err => { }).finally(() => {
            dispatch(setLoading(false))
        })
    }
    const addNewUOMData = async (branch: any, data: any) => {
        dispatch(setLoading(true))
        await addNewUOM(companyId, data).then(res => {
            if (res.success) {
                if (res.data.status) {
                    msg.success(res.data.message);
                    fetchUOMGetData(companyId)
                } else {
                    msg.warning(res.data.ErrorDetails[0]["Error Message"]);
                }
            } else {
                msg.warning('Failed to Add UOM')
            }
        }).catch(err => { }).finally(() => {
            dispatch(setLoading(false));
        })
    }
    const updateUOMData = async (id: any, data: any) => {
        dispatch(setLoading(true))
        await updateUOM(companyId, id, data).then(res => {
            if (res.success) {
                if (res.data.status) {
                    msg.success(res.data.message);
                    fetchUOMGetData(companyId)
                } else {
                                        msg.warning(res.data.ErrorDetails[0]["Error Message"]);

                }
            } else {
                msg.warning('Failed to update UOM !!')
            }
        }).catch(err => { }).finally(() => {
            dispatch(setLoading(false))
        })
    }
    const submit = () => {
        let Payload = {
            "UOMDetails": [
                {
                    "Name": watch("Name"),
                    "Description": watch("Description"),
                }
            ]
        }
        if (recordToEditId == null && companyId) {
            if(watch("Name")!=""){
            addNewUOMData(companyId, Payload)
            setIsAddDialogOpen(false)

            }
            else{
                msg.warning("Name should not be empty")
            }
        }
        else if (recordToEditId !== null && companyId) {
            if(watch("Name")!=""){
            updateUOMData(recordToEditId, Payload)
            setIsAddDialogOpen(false)
            }
            else{
                msg.warning("Name should not be empty")
            }
        }
    }
    const handleEdit = (data) => {
        reset({ Name: data.Name, Description: data.Description })
        setIsAddDialogOpen(true)
    };
    return (
        <div className="h-full overflow-y-auto bg-gray-50 flex flex-col ">
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 flex flex-col min-w-0 ">
                     <header className="px-6 py-3">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <span>Masters</span>
                                  <FaAngleRight />
                                  <span>Consumables</span>
                                  <FaAngleRight />
                                  <span className="text-gray-900 font-medium">Units of Measure</span>
                                </div>
                                <div className="flex items-center gap-2">
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <ReusableButton
                                        variant="primary"
                                        icon={<Plus className="h-4 w-4" />}
                                        className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                                        onClick={() => { setRecordToEditId(null); reset({ Name: "", Description: "" }) }}
                                    >
                                        Add Unit
                                    </ReusableButton>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>{recordToEditId ? "Update Unit Of Measure" : "Add Unit Of Measure"}</DialogTitle>
                                    </DialogHeader>
                                    <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4'>
                                        {getFieldsByNames(['Name', 'Description']).map((field) => {
                                            return <div className="flex items-center space-x-2">
                                                {renderField(field)}
                                            </div>;
                                        })}
                                    </div>
                                    {/* <div className='w-100'>
                                        {getFieldsByNames(['Description']).map((field) => {
                                            return <div className=" space-x-2">
                                                {renderField(field)}
                                            </div>;
                                        })}
                                    </div> */}
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
                                onClick={() => { navigate('/layout/masters/consumables/unitsofmeasure/manageunitconverstion'); }}
                            >
                                Manage Unit Conversations
                            </ReusableButton>
                        </div>
                              </div>
                            </header>
                    <div className="flex-1 p-3 pt-0 overflow-hidden min-h-0  ">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 h-full">
                            <div className="lg:col-span-12 flex flex-col  min-h-0 ">
                                <ScrollArea className="flex-1">
                                    <div className="space-y-2 pr-1">
                                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                            <CardContent className="p-2">
                                                <div className="p-2">
                                                    <div className="bg-gray-50/30">
                                                        <ReusableTable
                                                            title='Units of Measure'
                                                            data={dataSource}
                                                            columns={columns}
                                                            enableExport={false}
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
                            Are you sure you want to delete Unit Of Measure?
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
                            onClick={() => { deleteUOMData(recordToEditId, ""); setIsDelModalOpen(false) }}
                        >
                            Delete
                        </ReusableButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
export default UnitOfMeasure;