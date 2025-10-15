import { Card, CardContent, CardTitle } from '@/components/ui/card';
import ReusableTable, { TableAction, TablePermissions } from '@/components/ui/reusable-table';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
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

interface SoftwareData {
    SoftwareID: Number,
    AssignmentId: string,
    Employee: string,
    Department: string,
    Software: string,
    Licensekey: string,
    AssignmentDate: string,
    ExpiryDate: string
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

const SoftwareDataColumns = [
    { id: 'SoftwareId', accessorKey: "SoftwareId", header: "Software ID" },
    { id: 'SoftwareName', accessorKey: "SoftwareName", header: "Software Name" },
    { id: 'Version', accessorKey: "Version", header: "Version" },
    { id: 'VendorId', accessorKey: "VendorId", header: "Vendor" },
    { id: 'CategoryId', accessorKey: "CategoryId", header: "Category" },
    { id: 'AssignmentDate', accessorKey: "LicenseType", header: "License Type" },
    { id: 'NumberOfLicenses', accessorKey: "NumberOfLicenses", header: "Total Licenses" },
    { id: 'Assigned', accessorKey: "Assigned", header: "Assigned" },
    { id: 'Status', accessorKey: "Status", header: "Status" },
    { id: 'Total Cost', accessorKey: "Total Cost", header: "Total Cost" },
]
const defaultRow = {
    key: 0,
    LicenseKey: '',
    LicenseDetailId: "",
    LicenseCost: "",
    ExpiryDate: "",
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

const AssetRegistry = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const msg = useMessage()
    const dispatch = useDispatch()
    const companyId = useAppSelector(state => state.projects.companyId);
    const [columns, setColumns] = useState<ColumnDef<SoftwareData>[]>(SoftwareDataColumns);
    const [fields, setFields] = useState<BaseField[]>(REGISTRY_DB);
    const [isOpenLicenseCard, setIsOpenLicenseCard] = useState(false);
    const [getAllTableData, setGetAllTableData] = useState([])
    const [dataSource, setDatasource] = useState([]);
    const [editRecordId, setEditRecordId] = useState<string>("")
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
            fetchAllLookups()
    }, [companyId])

    const tableColumnsData = [
        {
            accessorKey: "LicenseKey",
            header: "License Key",

            cell: ({ row }) => (

                <span className='flex'>
                    <ReusableInput
                        value={row.original.LicenseKey}
                        onChange={(e) => handleChange(e.target.value, row.id, "LicenseKey")}
                        name='LicenseKey'
                        // placeholder='Enter License key'
                        isRequired={true}
                        className='m-2 mt-0 me-0 bg-white border-2'
                        size='small'
                    ></ReusableInput><span className='text-red-500'>*</span>

                </span>
            )
        },
        {
            accessorKey: "LicenseCost",
            header: "Cost per License",
            cell: ({ row }) => (

                <span className='flex'>
                    <ReusableInput
                        value={row.original.LicenseCost}
                        onChange={(e) => handleChange(e.target.value, row.id, "LicenseCost")}
                        name='LicenseCost'
                        isRequired={true}
                        className='m-2 me-0  mt-0 bg-white border-2'
                        size='small'

                        //   placeholder='Enter Cost'
                        type="number"
                    ></ReusableInput><span className='text-red-500 ms-0 ps-0'>*</span>

                </span>
            )
        },
        ...(form.watch("LicenseType") !== "Perpetual" ? [
            {
                accessorKey: "ExpiryDate",
                header: "Expiry/Renewal Date",
                cell: ({ row }) => (

                    <span className='flex' >
                        <ReusableDatePicker
                            value={row.original.ExpiryDate}
                            onChange={(e) => handleChange(e, row.id, "ExpiryDate")}
                            placeholder=' '
                            disabled={form.watch("LicenseType") !== "Perpetual" ? false : true}
                            size="sm"
                            isRequired={true}
                            className='m-2 bg-white border-2'
                            wrapperClassName='m-2 ms-0  me-2'
                            backgroundColor="white"
                        ></ReusableDatePicker><span className='text-red-500 mt-2'>*</span>

                    </span>
                )
            }
        ] : []),

        {
            accessorKey: "Status",
            header: "Status",

            cell: ({ row }) => (

                <span>
                    <ReusableDropdown
                        containerClassName=" p-2"
                        className='h-8 border-2 '
                        placeholder=" "
                        options={[
                            { label: "Active", value: "Active" }, { label: "Expired", value: "Expired" }, { label: "Suspended", value: "Suspended" },
                        ]}
                        allowClear={false}
                        defaultValue={row.original.Status}
                        onChange={(e) => handleChange(e, row.id, "Status")}
                        backgroundColor="white"
                        size={"small"}

                    >

                    </ReusableDropdown>

                </span>
            )
        },
        {
            accessorKey: "Actions",
            header: "Actions  ",
            size: 70,
            cell: ({ row }) => (
                <div className={cn('flex justify-start',(row.id == dataSource.length - 1) && editRecordId!=="" && "justify-center")}>

                    {row.id != 0 && editRecordId=="" && <Trash2 height={18} className='display-inline text-red-400 cursor-pointer '
                        onClick={() => handleRowDelete(row)} />}

                    {row.id == dataSource.length - 1 && <Plus className='display-inline   cursor-pointer text-blue-500' onClick={() => { setDatasource([...dataSource, { ...defaultRow, key: dataSource.length }]); form.setValue("NumberOfLicenses", parseInt(watch("NumberOfLicenses")) + 1) }} height={18} />}
                </div>
            )
        },

    ]

    const handleRowDelete = (row) => {
        console.log("row", row.id)
        const data = [...dataSource]
        data.splice(row.id, 1)
        setDatasource(data)

        form.setValue("NumberOfLicenses", parseInt(watch("NumberOfLicenses")) - 1)

    }
    const fetchAllLookups = async () => {
        try {
            const [vendors, category, getAllTableData] = await Promise.allSettled([vendorsLookUp(companyId), categoryLookUp(companyId), getSoftwaresList(companyId)])
            const data = { VendorId: { data: [], label: '', value: "", extendedlable: "" }, CategoryId: { data: [], label: '', value: "" } }
            if (vendors.status === "fulfilled" && vendors.value.data && vendors.value.success && vendors.value.data.Vendors) {
                data["VendorId"] = { data: vendors.value.data.Vendors, label: "VendorName", value: "VendorID", extendedlable: "VendorType" }
            }
            if (category.status === "fulfilled" && category.value.data && category.value.success && category.value.data) {
                data["CategoryId"] = { data: category.value.data, label: "CategoryName", value: "CategoryId" }
            }
            if (getAllTableData.status === "fulfilled" && getAllTableData.value.success && getAllTableData.value.data && !getAllTableData.value.data.status) {
                setGetAllTableData((getAllTableData.value.data).reverse())
            }
            setLookupsDataInJson(data)
        } catch {

        } finally {

        }
    }


    const setLookupsDataInJson = (lookupsData: allResponsesType): void => {
        const arr = Object.keys(lookupsData)
        const opts: { [key: string]: any } = {}
        arr.forEach((obj) => {
            let ret = []
            ret = lookupsData[obj].data.map((element) => {
                let opt = {}
                opt["label"] = (lookupsData[obj].extendedlable) ? element[lookupsData[obj].label] + " - " + element[lookupsData[obj].extendedlable] : element[lookupsData[obj].label]
                opt["value"] = element[lookupsData[obj].value]
                return opt
            });
            opts[obj] = ret
        })
        const data = structuredClone(fields);
        data.forEach((obj) => {
            if (arr.includes(obj.name)) {
                obj.options = opts[obj.name]
            }
        });
        setFields(data);
    }

    function handleChange(val, id, accessorKey) {
        let data = dataSource
        //  data.forEach((obj)=>{
        //     if(obj.key==id){
        //         obj[accessorKey]=val
        //     }
        //  })
        data[parseInt(id)][accessorKey] = val
        setDatasource(data)
    }

    const generateRowsInTable = (num?: number, startNum?: number, data?: any) => {
        const result = [];
        if (data) {
            for (let i = startNum ? startNum : 0; i < data.length; i++) {
                result.push({
                    key: i,
                    LicenseKey: data[i]["LicenseKey"],
                    LicenseDetailId: data[i]["LicenseDetailId"],
                    LicenseCost: data[i]["LicenseCost"],
                    ExpiryDate: data[i]["ExpiryDate"],
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
                    ExpiryDate: '',
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

    const getFieldsByNames = (names: string[]) => {
        return fields.filter(f => names.includes(f.name!));
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
        form.reset({ ...form.getValues(), ...data })
        setDatasource(generateRowsInTable(0, 0, data.LicenseDetails))
        setIsOpenLicenseCard(true)
        setEditRecordId(data.SoftwareId)
    }
    const handleReset = () => {
        setDatasource([])
        form.reset({ ...form.getValues(), SoftwareName: '', Version: "", VendorId: "", CategoryId: '', LicenseType: '', NumberOfLicenses: '' });
        let fieldsData = [...fields]
        fieldsData.forEach((obj) => {
            if (obj.name == "NumberOfLicenses" || obj.name == "LicenseType") {
                obj.disabled = false
            }
        })
        setFields(fieldsData)


    }
    const deleteSoftwareAsset = async (id: string) => {
        dispatch(setLoading(true));
        await deleteSoftwareById(companyId, id).then(res => {
            if (res.success) {
                if (res.data.status) {
                    msg.success(res.data.message);

                    handleReset();
                    getSoftwaresListAPI(companyId)
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
        toast({ title: "Data Refreshed", description: "All Software Assets data has been updated", });
        // fetchAllCustomerList();
        getSoftwaresListAPI(companyId)
    }, [toast]);
    const getLicenseDetails = (id?: string):any => {
        let licenseDetails = []
       
        dataSource.some((obj) => {
            let licenseKey = obj.LicenseKey
            let licenseCost = obj.LicenseCost
            let expiryDate = obj.ExpiryDate

            if (licenseKey && licenseCost && (watch("LicenseType") == "Perpetual") ||(expiryDate && watch("LicenseType") !== "Perpetual") ){
                licenseDetails.push({
                    "LicenseDetailId": id ? obj.LicenseDetailId : "",
                    "LicenseKey": licenseKey,
                    "LicenseCost": licenseCost,
                    "ExpiryDate": (typeof (expiryDate) == "string") ? expiryDate : formatDates(expiryDate, 'DD/MM/YYYY'),
                    "Status": obj.Status
                })
              
            }else{

                 licenseDetails=[]
                return true
            
            }
             
        })
         return licenseDetails
    }
    const handleSave = async (data) => {
        let LicenseDetails = editRecordId ?getLicenseDetails(editRecordId) : getLicenseDetails();
        if (LicenseDetails.length > 0) {
            const payload = {
                "SoftwareLicenses": [{
                    "SoftwareId": editRecordId ? editRecordId : "",
                    "SoftwareName": data["SoftwareName"],
                    "Version": data["Version"],
                    "VendorId": data["VendorId"],
                    "CategoryId": data["CategoryId"],
                    "LicenseType": data["LicenseType"],
                    "NumberOfLicenses": data["NumberOfLicenses"],
                    "LicenseDetails": LicenseDetails
                }]
            }


            dispatch(setLoading(true));
            await addOrUpdateSoftwareAsset(companyId, payload).then(res => {
                if (res.data.status) {
                    msg.success(res.data.message)
                    getSoftwaresListAPI(companyId)
                    handleReset();
                } else {
                    let errMsg = (res.data.ErrorDetails && res.data.ErrorDetails[0]['Error Message']) ? res.data.ErrorDetails[0]['Error Message'] : res.data.message
                    msg.warning(errMsg);
                }
            }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
        } else {
            msg.warning("Enter All Mandatory License Details");
        }



    };


    const getSoftwaresListAPI = async (companyId) => {
        dispatch(setLoading(true))
        await getSoftwaresList(companyId).then(res => {
            if (res.success && res.data.status === undefined) {
                setGetAllTableData((res.data).reverse())
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
                            size="small"
                            // variant="primary"
                            className=' flex-1 sm:flex-none bg-primary h-[2.38rem] text-white p-4'
                            onClick={() => setIsOpenLicenseCard((prev) => !prev)}>
                            <span className="" > + Add Software Asset</span>
                        </ReusableButton>
                    </div>
                </div>
                {isOpenLicenseCard &&
                    <Card>
                        <CardContent className="pt-6">
                            <div className="">
                                <div className="space-y-4">
                                    <span className='text-2xl'>Add New Software Asset</span>
                                    <div className={`grid xxs:grid-cols-1 xs2:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6`}>
                                        {getFieldsByNames(['SoftwareName', 'Version', 'VendorId', 'CategoryId', 'LicenseType', 'NumberOfLicenses']).map((field) => {
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

                                        {dataSource.length !== 0 && <ReusableTable data={dataSource} columns={tableColumnsData} enableSearch={false}
                                            enableColumnVisibility={false}
                                            enableExport={false}
                                            enableSorting={false}
                                            enableFiltering={false}
                                            headerContentClassName={"justify-center "}
                                        />}

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
                                    {'Save'}
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
                            title="Software Assets Overview"
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

export default AssetRegistry