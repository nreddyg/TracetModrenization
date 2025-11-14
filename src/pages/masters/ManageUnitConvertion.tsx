
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { ReusableButton } from '../../components/ui/reusable-button';
import { ReusableInput } from '../../components/ui/reusable-input';
import { ReusableDropdown } from '../../components/ui/reusable-dropdown';
import { ReusableTable, TablePermissions } from '../../components/ui//reusable-table';
import { useMessage } from '../../components/ui/reusable-message';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { setLoading } from '@/store/slices/projectsSlice';
import { getUnitOfMeasure } from '@/services/itemCategoryServices';
import { MANAGE_UNITS_OF_MEASURE_DB } from '@/Local_DB/Form_JSON_Data/UnitsOfMeasureDB';
import { addNewConversion, deleteConversion, getConversionUOMData } from '@/services/unitsOfMeasureServices';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const ManageUnitConversion = () => {
    const [dataSource, setDatasource] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [fields, setFields] = useState<BaseField[]>(MANAGE_UNITS_OF_MEASURE_DB);
    const [isDelModalOpen, setIsDelModalOpen] = useState(false);
    const [recordToEditId, setRecordToEditId] = useState(null);
    const dispatch = useDispatch();
    const companyId = useAppSelector(state => state.projects.companyId);
    const navigate = useNavigate();
    const msg = useMessage()
    useEffect(() => {
        if (companyId) {
            getUnitOfMeasureDetails(companyId)
            fetchUOMGetData(companyId)
        }
    }, [companyId])
    const form = useForm<GenericObject>({
        defaultValues: fields.reduce((acc, f) => {
            acc[f.name!] = f.defaultChecked ?? f.defaultValue ?? '';
            return acc;
        }, {} as GenericObject),
        mode: 'onChange',
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
            case "equals":
                return (

                    <div className="w-full h-full  rounded flex items-center justify-center">
                        <span className="text-2xl font-bold">=</span>
                    </div>


                )

            default:
                return null;
        }
    }
    async function fetchUOMGetData(companyId) {
        dispatch(setLoading(true))
        await getConversionUOMData(companyId).then(res => {
            if (res.data && res.data.status == undefined) {
                setDatasource(res.data)
            } else {
                setDatasource([])
                msg.warning(res.data.message || "No Data Found")
            }
        }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
    }
    const getUnitOfMeasureDetails = async (companyId) => {
        dispatch(setLoading(true))
        await getUnitOfMeasure(companyId)
            .then(res => {
                if (res.data && res.data.UOMDetails.length > 0) {
                    const newOptions = res.data.UOMDetails.map((main: any) => ({
                        value: main?.Name,
                        label: main?.Name,
                    }));
                    let data = structuredClone(fields)
                    let NewData = data.map((obj) => {
                        if (obj.name === "baseUOM" || obj.name === "targetUOM") {
                            return { ...obj, options: newOptions }
                        }
                        return obj
                    });
                    setFields(NewData)
                } else {
                    msg.warning('no data found')
                }
            })
            .catch(err => { })
            .finally(() => {
                dispatch(setLoading(false))
            })
    }
    const addNewConversionData = async (data: any) => {
        dispatch(setLoading(true))
        await addNewConversion(companyId, data).then(res => {
            if (res.success) {
                if (res.data.status) {
                    msg.success(res.data.message);
                    fetchUOMGetData(companyId)
                } else {
                    msg.warning(res.data.ErrorDetails[0]["Error Message"]);
                }
            } else {
                msg.warning('Failed to Add Conversion !!')
            }
        }).catch(err => { }).finally(() => {
            dispatch(setLoading(false))
        })
    }
    const deleteConversionData = async (id: number, data: any) => {
        dispatch(setLoading(true))
        await deleteConversion(companyId, id, data).then(res => {
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
            dispatch(setLoading(false))
        })
    }
    // Filter data based on search
    const filteredData = useMemo(() => {
        return dataSource.filter(group =>
            Object.values(group).some(value =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [dataSource, searchTerm]);
    const submit = () => {
        const payload = {
            UOMConversionDetails: [
                {
                    UnitConversionName: watch("baseUOM"),
                    TargetUnitMeasureValue: watch("target"),
                    TargetUnitConversionName: watch("targetUOM")
                }
            ]
        }
        addNewConversionData(payload)
    }
    const columns = [
        {
            id: 'BaseUnit',
            header: 'Base Unit',
            accessorKey: 'BaseUnit',
            // enableSorting: true,
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
                        title='Delete'
                        danger
                        onClick={() => { setIsDelModalOpen(true); setRecordToEditId(row.original.UnitConversionId); }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </ReusableButton>
                </div>
            ),
        },
    ];
    const handleReset = () => {
        reset({
            base: 1,
            baseUOM: "",
            target: "",
            targetUOM: ""
        })
    }
    const tablePermissions: TablePermissions = {
        canEdit: true,
        canDelete: true,
        canView: true,
        canExport: false,
        canAdd: true,
        canManageColumns: false,
    };
    return (
        <ScrollArea>
            <div className="h-full overflow-y-auto">
                <div className="p-4 space-y-3" >
                    <div className='flex w-full justify-between'>
                        <h1 className='text-lg font-semibold text-gray-900'>Add Unit of Conversion</h1>
                        <ReusableButton
                            className=' flex-1 sm:flex-none bg-primary text-white'
                            onClick={() => navigate("/masters/consumables/unitsofmeasure")}>Back</ReusableButton>
                    </div>
                    <div className="w-full p-4 bg-white rounded-md border">
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
                                        onClick={() => { deleteConversionData(recordToEditId, ""); setIsDelModalOpen(false) }}
                                    >
                                        Delete
                                    </ReusableButton>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <div className="grid grid-cols-5 gap-6 items-end">
                            {getFieldsByNames(['base', 'baseUOM', "equals", 'target', 'targetUOM']).map((field) => {
                                return <div className="flex items-center space-x-2">
                                    {renderField(field)}
                                </div>;
                            })}
                        </div>
                        <div className="flex justify-end mt-6 gap-3">
                            <ReusableButton
                                htmlType="submit"
                                variant="primary"
                                className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                                onClick={() => submit()}
                            >Save</ReusableButton>
                            <ReusableButton variant="default"
                                onClick={() => handleReset()}
                            >Clear</ReusableButton>
                        </div>
                    </div>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="pt-2">
                            <ReusableTable
                                data={filteredData}
                                columns={columns}
                                permissions={tablePermissions}
                                title="Unit of Measures Conversion List"
                                enableSearch={false}
                                enableSelection={false}
                                enableExport={true}
                                enableColumnVisibility={true}
                                enablePagination={true}
                                enableSorting={true}
                                enableFiltering={true}
                                pageSize={10}
                                emptyMessage="No user groups found"
                                rowHeight="normal"
                                storageKey="usergroups-table"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ScrollArea>
    );
};
export default ManageUnitConversion;
