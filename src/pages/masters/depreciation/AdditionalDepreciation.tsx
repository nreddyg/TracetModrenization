import { Card, CardContent, CardTitle } from '@/components/ui/card';
import ReusableTable, { TableAction, TablePermissions } from '@/components/ui/reusable-table';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { ArrowLeft, Edit, Plus, Search, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';
import { REGISTRY_DB } from '@/Local_DB/Form_JSON_Data/AssetRegistryDB';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { Controller, useForm } from 'react-hook-form';
import ReusableSingleCheckbox from '@/components/ui/reusable-single-checkbox';
import { ReusableMultiSelect } from '@/components/ui/reusable-multi-select';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableInput } from '@/components/ui/reusable-input';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import { useAppSelector } from '@/store';
import { addOrUpdateSoftwareAsset, categoryLookUp, deleteSoftwareById, getSoftwaresList, vendorsLookUp } from '@/services/assetRegistryServices';
import { useMessage } from '@/components/ui/reusable-message';
import { formatDates } from '@/_Helper_Functions/HelperFunctions';
import { setLoading } from '@/store/slices/projectsSlice';
import { useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Additional_Depreciation_DB } from '@/Local_DB/Form_JSON_Data/AdditionalDepreciationDB';
import { AddAdditionalDepreciationBookDetails, GetAdditionalDepreciationBookDetails, updateAdditionalDepreciationDetails } from '@/services/BookServices';

interface SoftwareData {
    SoftwareID: Number,
    AssignmentId: string,
    Employee: string,
    Department: string,
    Software: string,
    Licensekey: string,
    AssignmentDate: string,
    LicenseExpiryDate: string
}
interface OptionItem {
    [key: string]: any;
}
interface OptType {
    data: OptionItem[];
    label: string;
    value: string;
    defaultValues?: string | string[];
    extendedlable?: string
}
interface allResponsesType {
    VendorId: OptType
    CategoryId: OptType
}


const defaultRow = {
    key: 0,
    LicenseKey: '',
    LicenseDetailId: "",
    LicenseCost: "",
    LicenseExpiryDate: "",
    Status: "Active"
    // cellsData: cellsData,
};
const tablePermissions: TablePermissions = {
    canEdit: true,
    canDelete: true,
    canView: true,
    canExport: false,
    canAdd: true,
    canManageColumns: true,
};

const AdditionalDepreciation = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const msg = useMessage()
    const dispatch = useDispatch()
    const companyId = useAppSelector(state => state.projects.companyId);
    const [fields, setFields] = useState<BaseField[]>(Additional_Depreciation_DB);
    const [isOpenCard, setIsOpenCard] = useState(false);
    const [getAllTableData, setGetAllTableData] = useState([])
    const [dataSource, setDatasource] = useState([]);
    const [editingRecord, setEditingRecord] = useState<GenericObject | null>(null)
    const [isDelModalOpen, setIsDelModalOpen] = useState(false);
    const [deletingRecord, setDeletingRecord] = useState(null);

    const form = useForm<GenericObject>({
        defaultValues: fields.reduce((acc, f) => {
            acc[f.name!] = f.defaultValue ?? '';
            return acc;
        }, {} as GenericObject),
        mode: 'onChange'
    });
    const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;

    useEffect(() => {
        if (companyId)
            getAdditionalDepreciationListAPI()
    }, [companyId])
    const SoftwareDataColumns = [
        { id: 'Name', accessorKey: "Name", header: "Name" },
        { id: 'AdditionalDepreciationRate"', accessorKey: "AdditionalDepreciationRate", header: "Rate Of Additional Depreciation" },
        { id: 'UptoDateRange', accessorKey: "UptoDateRange", header: "Date Range Upto Financial Year" },
        { id: 'ApplicableFor', accessorKey: "ApplicableFor", header: "Applicable For" },
        { id: 'Condition', accessorKey: "Condition", header: "Condition" },
    ]
    const [columns, setColumns] = useState<ColumnDef<SoftwareData>[]>(SoftwareDataColumns);


    const generateRowsInTable = (num?: number, startNum?: number, data?: any) => {
        const result = [];
        if (data) {
            for (let i = startNum ? startNum : 0; i < data.length; i++) {
                result.push({
                    key: i,
                    LicenseKey: data[i]["LicenseKey"],
                    LicenseDetailId: data[i]["LicenseDetailId"],
                    LicenseCost: data[i]["LicenseCost"],
                    LicenseExpiryDate: data[i]["LicenseExpiryDate"],
                    Status: data[i]["Status"]
                });
            }
        } else {
            for (let i = startNum ? startNum : 0; i < num; i++) {
                result.push({
                    key: i,
                    LicenseKey: '',
                    LicenseDetailId: '',
                    LicenseCost: '',
                    LicenseExpiryDate: '',
                    Status: 'Active'
                });
            }
        }


        return result
    }
    const handleEnterLicenseDetails = () => {
        let NoOfLicenses = form.watch("NumberOfLicenses")
        let LicenseType = form.watch("LicenseType")
        if (NoOfLicenses && LicenseType) {
            if (dataSource.length != NoOfLicenses) {
                setDatasource(generateRowsInTable(parseInt(NoOfLicenses), 0))
                let fieldsData = [...fields]
                fieldsData.forEach((obj) => {
                    if (obj.name == "NumberOfLicenses" || obj.name == "LicenseType") {
                        obj.disabled = true
                    }
                })
                setFields(fieldsData)

            }
        } else {
            msg.warning("Enter Number Of Licenses and License Type");
        }

    }

    const renderField = (field: BaseField) => {
        const { name, label, fieldType, isRequired, validationPattern, patternErrorMessage, show = true } = field;
        const validationRules = {
            required: isRequired ? `${label} is Required` : false,
            ...(validationPattern && {
                pattern: {
                    value: new RegExp(validationPattern),
                    message: patternErrorMessage || 'Invalid input format'
                }
            }),
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
            case 'date':
                return (
                    <Controller
                        key={name}
                        name={name}
                        control={control}
                        rules={validationRules}
                        render={({ field: ctrl }) => (
                            <ReusableDatePicker
                                {...field}
                                value={ctrl.value}
                                onChange={ctrl.onChange}
                                error={errors[name]?.message as string}
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
            case 'multiselect':
                return (
                    <div>
                        <Controller
                            key={name}
                            name={name}
                            control={control}
                            rules={validationRules}
                            render={({ field: ctrl }) => (
                                <ReusableMultiSelect
                                    label={label!}
                                    {...field}
                                    value={ctrl.value}
                                    onChange={ctrl.onChange}
                                    error={errors[name]?.message as string}
                                />
                            )}
                        />
                    </div>
                );
            case 'checkbox':
                return (
                    <Controller
                        name={name}
                        control={control}
                        render={({ field: ctrl }) => (
                            <ReusableSingleCheckbox
                                label={label}
                                onChange={ctrl.onChange}
                                value={ctrl.value}
                                className="text-orange-500"
                                {...field}
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
            case 'numeric':
                return (
                    <Controller
                        key={name}
                        name={name}
                        control={control}
                        rules={validationRules}
                        render={({ field: ctrl }) => (
                            <ReusableInput
                                {...field}
                                type="number"
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
    };
    const handleDelete = (data: any): void => {
        setIsDelModalOpen(true);
        setDeletingRecord(data)
    }
    const handleEdit = (data: any): void => {
        dispatch(setLoading(true))
        setTimeout(()=>{
            form.reset({ ...form.getValues(), ...data }) ;
            dispatch(setLoading(false))     
        },100)
        setEditingRecord(data)  
        setIsOpenCard(true)
    }
    const handleReset = () => {
        setDatasource([])
        form.reset({ ...form.getValues(), Name: '', Description: "", ApplicableFor: "", Condition: '', AdditionalDepreciationRate: '', UptoDateRange: '' });
        setEditingRecord(null)
    }
    
    const deleteSoftwareAsset = async (id: string) => {
        dispatch(setLoading(true));
        await deleteSoftwareById(companyId, id).then(res => {
            if (res.success) {
                if (res.data.status) {
                    msg.success(res.data.message);

                    handleReset();
                    getAdditionalDepreciationListAPI()
                } else {
                    msg.warning(res.data.message);
                }
            } else {
                msg.warning('Failed to delete Software Asset !!');
            }
        }).catch((error) => {
            msg.error("Error deleting Software Asset");
        }).finally(() => {
            dispatch(setLoading(false));
        })
    }
    const tableActions: TableAction<SoftwareData>[] = [
        {
            label: 'Edit',
            icon: Edit,
            onClick: handleEdit,
            variant: 'default',
        },
        {
            label: 'Delete',
            icon: Trash2,
            onClick: handleDelete,
            variant: 'destructive',
        },
    ];

    // handle refresh
    const handleRefresh = useCallback(() => {
        toast({ title: "Data Refreshed", description: "Additional Depreciation data has been updated", });
        // fetchAllCustomerList();
        getAdditionalDepreciationListAPI()
    }, [toast,companyId]);
    const getLicenseDetails = (id?: string): any => {
        let licenseDetails = []

        dataSource.some((obj) => {
            let licenseKey = obj.LicenseKey
            let licenseCost = obj.LicenseCost
            let expiryDate = obj.LicenseExpiryDate

            if (licenseKey && licenseCost && (watch("LicenseType") == "Perpetual") || (expiryDate && watch("LicenseType") !== "Perpetual")) {
                licenseDetails.push({
                    "LicenseDetailId": id ? obj.LicenseDetailId : "",
                    "LicenseKey": licenseKey,
                    "LicenseCost": licenseCost,
                    "ExpiryDate": (typeof (expiryDate) == "string") ? expiryDate : formatDates(expiryDate, 'YYYY/MM/DD'),

                    "Status": obj.Status
                })

            } else {

                licenseDetails = []
                return true

            }

        })
        return licenseDetails
    }
    const handleSave = async (data) => {
        const payload = {
            "AdditionalDepreciation": [{

                AdditionalDepreciationId: editingRecord.AdditionalDepreciationId,
                "Name": data["Name"],
                "Description": data["Description"],
                "ApplicableFor": data["ApplicableFor"],
                "Condition": data["Condition"],
                "AdditionalDepreciationRate": data["AdditionalDepreciationRate"],
                "UptoDateRange": data["UptoDateRange"],
            }]
        }
        if (editingRecord) {
            try {
                dispatch(setLoading(true))
                const res = await updateAdditionalDepreciationDetails(companyId, payload);
                if (res.success) {
                    if (res.data.status) {
                        msg.success(res.data.message)
                        handleReset()
                        getAdditionalDepreciationListAPI()
                    } else {
                        let errMsg = (res.data.ErrorDetails && res.data.ErrorDetails[0]['Error Message']) ? res.data.ErrorDetails[0]['Error Message'] : res.data.message
                        msg.warning(errMsg);
                    }
                }

            } catch { } finally { dispatch(setLoading(false)) }

        } else {
            dispatch(setLoading(true));
            await AddAdditionalDepreciationBookDetails(companyId, payload).then(res => {
                if (res.data.status) {
                    msg.success(res.data.message)
                    getAdditionalDepreciationListAPI()
                    handleReset();
                } else {
                    let errMsg = (res.data.ErrorDetails && res.data.ErrorDetails[0]['Error Message']) ? res.data.ErrorDetails[0]['Error Message'] : res.data.message
                    msg.warning(errMsg);
                }
            }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
        }
    };


    const getAdditionalDepreciationListAPI = async () => {
        dispatch(setLoading(true))
        await GetAdditionalDepreciationBookDetails(companyId).then(res => {
            if (res.success && res.data.status === undefined) {
                setGetAllTableData((res.data.AdditionalDepreciationDetails).reverse())
            } else {
                setGetAllTableData([]);
            }
        })
            .catch(err => {
            }).finally(() => {
                dispatch(setLoading(false));
            })
    }


    return (
        <div className="h-full overflow-y-scroll bg-gray-50/30">
            <div className="p-4 sm:p-4 space-y-4 sm:space-y-4">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="relative">
                        {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search tickets..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-hsl(214.3 31.8% 91.4%)"
                        /> */}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <ReusableButton
                            variant="text"

                            onClick={() => { navigate("/masters/depreciation/book") }}
                            icon={""}
                        >
                            Back
                        </ReusableButton>
                        <ReusableButton
                            size="small"
                            // variant="primary"
                            className=' flex-1 sm:flex-none bg-primary h-[2.38rem] text-white p-4'
                            onClick={() => setIsOpenCard((prev) => !prev)}>
                          
                             {isOpenCard ? (
                                                                <div className='flex items-center gap-2'>
                                                                    <ArrowLeft className="h-4 w-4 text-current stroke-[3]" /> Grid View
                                                                </div>
                                                            ) : (
                                                                ' Add Additional Depreciation'
                                                            )}
                        </ReusableButton>
                    </div>
                </div>
                {isOpenCard &&
                    <Card>
                        <CardContent className="pt-6">
                            <div className="">
                                <div className="space-y-4">
                                    <span className='text-2xl'>Additional Depreciation</span>
                                    <div className={`grid xxs:grid-cols-1 xs2:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6`}>
                                        {fields.map((field) => {
                                            return <> <div className="flex-1 items-center space-x-2">
                                                {renderField(field)}
                                                {(field.name === 'NumberOfLicenses') && <div className='mt-2 float-right'><ReusableButton
                                                    htmlType="button"
                                                    variant="default"
                                                    onClick={() => { handleEnterLicenseDetails() }}
                                                    iconPosition="left"
                                                    size="middle"
                                                    className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                                                > {'Click To Enter License Details'}
                                                </ReusableButton></div>}
                                            </div>
                                            </>
                                        })}

                                    </div>
                                    <div className={`grid xxs:grid-cols-1 xs2:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-6`}>
                                        {/* {getFieldsByNames(['description']).map((field) => {
                                        return <div className="flex-1 items-center space-x-2">
                                            {renderField(field)}
                                        </div>;
                                    })} */}



                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-6">
                                <ReusableButton
                                    htmlType="button"
                                    variant="default"
                                    onClick={() => { handleSubmit(handleSave)() }}
                                    iconPosition="left"
                                    size="middle"
                                    className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                                >
                                    {editingRecord ? 'Update':'Save'}
                                </ReusableButton>
                                <ReusableButton
                                    htmlType="button"
                                    variant="default"
                                    onClick={() => handleReset()}
                                    iconPosition="left"
                                    size="middle"
                                >
                                    Cancel
                                </ReusableButton>
                            </div>
                        </CardContent>
                    </Card>
                }
                <div className="bg-white p-6 rounded-lg">
                    <ScrollArea className=" w-full ">
                        <ReusableTable
                            data={getAllTableData} columns={columns}
                            // permissions={""}
                            permissions={tablePermissions}
                            title="Additional Depreciation Details"
                            onRefresh={handleRefresh}
                            enableSearch={true}
                            enableSelection={false}
                            enableExport={true}
                            enableColumnVisibility={true}
                            enablePagination={true}
                            enableSorting={true}
                            enableFiltering={true}
                            pageSize={10}
                            emptyMessage="No Data found"
                            // rowHeight="normal"
                            // storageKey="service-request-type-list-table"
                            actions={tableActions}
                            enableColumnPinning
                        />

                    </ScrollArea>
                </div>
            </div>
            <Dialog open={isDelModalOpen} onOpenChange={setIsDelModalOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>Confirm the action</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this row?

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
                            onClick={() => { deleteSoftwareAsset(deletingRecord?.SoftwareId); setIsDelModalOpen(false) }}
                        >
                            Delete
                        </ReusableButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}

export default AdditionalDepreciation;