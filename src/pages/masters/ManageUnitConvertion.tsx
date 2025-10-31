
import React, { useState, useMemo, useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2} from 'lucide-react';
import { Form, } from '@/components/ui/form';
import { useForm, Controller } from 'react-hook-form';
import { ColumnDef } from '@tanstack/react-table';
import { ReusableButton } from '../../components/ui/reusable-button';
import { ReusableInput } from '../../components/ui/reusable-input';
import { ReusableDropdown } from '../../components/ui/reusable-dropdown';
import { ReusableTable, TableAction, TablePermissions } from '../../components/ui//reusable-table';
import { MessageProvider, useMessage } from '../../components/ui/reusable-message';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { getSRCustomerLookupsList } from '@/services/ticketServices';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SUBSCRIPTION_DB } from '@/Local_DB/Form_JSON_Data/SubscriptionDB';
import { getProductName, getSubscriptionTableData } from '@/services/subscriptionServices';
import ExcelJS from "exceljs";
import { Badge } from '@/components/ui/badge';
import { useAppSelector } from '@/store';
import { setLoading } from '@/store/slices/projectsSlice';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { getUnitOfMeasure } from '@/services/itemCategoryServices';
import { MANAGE_UNITS_OF_MEASURE_DB } from '@/Local_DB/Form_JSON_Data/UnitsOfMeasureDB';
import { addNewConversion, deleteConversion, getConversionUOMData } from '@/services/unitsOfMeasureServices';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';





interface subscriptionrecord {
    SubscriptionId: number,
    CustomerId: number,
    CustomerName: string,
    ProductId: number,
    ProductName: string,
    AMCFromDate: string,
    AMCToDate: string,
    SubscriptionType: string,
    SubscriptionStatus: string
}




const ManageUnitConversion = () => {
    const message = useMessage();
    const [dataSource, setDatasource] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [fields, setFields] = useState<BaseField[]>(MANAGE_UNITS_OF_MEASURE_DB);
    const [isDelModalOpen, setIsDelModalOpen] = useState(false);

    const [recordToEditId, setRecordToEditId] = useState(null);
    const dispatch = useDispatch();
    const companyId = useAppSelector(state => state.projects.companyId);
    const branchName = useAppSelector(state => state.projects.branch);
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
                //  console.log(res.data,"Nag")
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
                    console.log(newOptions, "Nag")
                    let data = structuredClone(fields)
                    let NewData = data.map((obj) => {
                        if (obj.name === "baseUOM" || obj.name === "targetUOM") {
                            return { ...obj, options: newOptions }
                        }
                        return obj
                    });
                    console.log(data, "Nag")
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

        })
    }
    const deleteConversionData = async (id: number, data: any) => {
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800 border-green-300';
            case 'Expired': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

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
                <div className="flex gap-2">

                    <ReusableButton
                        variant="text"
                        size="small"
                        danger
                        // icon={}
                    onClick={() => {setIsDelModalOpen(true);setRecordToEditId(row.original.UnitConversionId);}}
                    >
                        <Trash2 className="h-4 w-4" />
                    </ReusableButton>
                </div>
            ),
        },
    ];
    const handleReset=()=>{
        reset({
            base:1,
            baseUOM:"",
            target:"",
            targetUOM:""
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
        <div className="bg-gray-50/30 h-full overflow-y-scroll">

            <div className="p-4 space-y-4 " >
                <div className='flex w-full justify-between'>
                <h1 className='text-lg font-semibold text-gray-900'>Add Unit of Conversion</h1>
                <ReusableButton 
                className=' flex-1 sm:flex-none bg-primary h-[2.38rem] text-white p-4'
                onClick={()=>navigate("/masters/consumables/unitsofmeasure")}>Back</ReusableButton>
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
                                // onClick={currentTab === "service-request-type" ? () => { deleteServiceRequestType(selectedRecord?.Id); setIsDelModalOpen(false) } : () => { deleteStatus(selectedStatusRec?.Id); setIsDelModalOpen(false) }}
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

                    {/* Action Buttons */}
                    <div className="flex justify-end mt-6 gap-3">
                        <ReusableButton
                            htmlType="submit"
                            variant="primary"
                            className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                            onClick={() => submit()}
                        >Save</ReusableButton>
                        <ReusableButton variant="default"
                        onClick={()=>handleReset()}
                        >Clear</ReusableButton>
                        {/* <Button variant="default">Save</Button>
                        <Button variant="destructive">Clear</Button> */}
                    </div>
                </div>




                {/* User Group List with ReusableTable */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3 pt-2">
                        Unit of Measures Conversion list
                    </CardHeader>
                    <CardContent className="pt-0">
                        <ReusableTable
                            data={filteredData}
                            columns={columns}
                            // actions={tableActions}
                            permissions={tablePermissions}
                            // loading={loading}
                            title=""
                            // onRefresh={handleRefresh}
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
    );
};

export default ManageUnitConversion;
