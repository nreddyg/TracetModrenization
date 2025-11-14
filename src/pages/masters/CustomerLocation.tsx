
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableTable, TablePermissions } from '@/components/ui/reusable-table';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ColumnDef } from '@tanstack/react-table';
import { useMessage } from '@/components/ui/reusable-message';
import { useAppDispatch, useAppSelector } from '@/store/reduxStore';
import { setLoading } from '@/store/slices/projectsSlice';
import { Controller, useForm } from 'react-hook-form';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import ReusableMultiSelect from '@/components/ui/reusable-multi-select';
import { FaSearch } from 'react-icons/fa';
import { deleteCustomerLocation, getCustomerLocations, postNewCustomerLocation, updateCustomerLocation } from '@/services/CustomerLocationsServices';
import { useLocation, useNavigate } from 'react-router-dom';
import { Customer_Location_DB } from '@/Local_DB/Form_JSON_Data/CustomerLocationDB';

interface MainCategory {
    Name: string
}

interface SubCategory {
    id: string;
    name: string;
    mainLocationId: string;
}

const CustomerLocation = () => {
    const [activeTab, setActiveTab] = useState('main');
    const location = useLocation();
    const navigate = useNavigate()
    const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
    const [isSubDialogOpen, setIsSubDialogOpen] = useState(false);
    const [isMainDelOpen, setIsMainDelOpen] = useState(false)
    const [getMainCategoryData, setGetMainCategoryData] = useState([]);
    const [subCategoryData, setSubCategoryData] = useState([]);
    const [subDataToShow, setSubDataToShow] = useState([]);
    const [recordToEditId, setRecordToEditId] = useState(null);
    const [subRecID, setSubRecID] = useState(null);
    const [mainCatfields, setMainCatFields] = useState<BaseField[]>(Customer_Location_DB);
    const [mainDelRec, setMainDelRec] = useState<any>();
    const [selectedParentData, setSelectedParentData] = useState(null);
    const companyId = useAppSelector(state => state.projects.companyId);
    const [customerId, setCustomerId] = useState(location.state?.selectedCustomerData ? location.state.selectedCustomerData.CustomerID : "")
    const form = useForm<GenericObject>({
        defaultValues: mainCatfields.reduce((acc, f) => {
            acc[f.name!] = f.defaultChecked ?? '';
            return acc;
        }, {} as GenericObject),

    });
    const { control, register, handleSubmit, watch, setValue, reset, formState: { errors } } = form;
    const msg = useMessage()
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (companyId) {
            getLocationDetails(companyId);
        }
    }, [companyId])
    useEffect(() => {
        const parentId = watch('mainLocationDropdown');
        if (parentId) {
            let find = getMainCategoryData.find((x) => x.LocationId === parentId);
            setSelectedParentData(find)
            let subdata = []
            subCategoryData?.forEach((obj) => {
                if (parentId == obj.Parent) {
                    subdata.push(obj)
                }
            })
            setSubDataToShow(subdata)
        } else {
            setSubDataToShow([])
        }

    }, [watch("mainLocationDropdown"), subCategoryData])
    const mainCategoryColumns: ColumnDef<MainCategory>[] = [
        {
            accessorKey: 'LocationName',
            header: 'Name',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue('LocationName')}</span>
            ),
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
                        onClick={() => { setRecordToEditId(row.original.LocationId); handleEdit(true, row.original) }}
                    >
                        Edit
                    </ReusableButton>
                    <ReusableButton
                        variant="text"
                        size="small"
                        danger
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => { setRecordToEditId(row.original.LocationId); setMainDelRec(row.original); setIsMainDelOpen(true) }}
                    >
                        Delete
                    </ReusableButton>
                </div>
            ),
        },
    ]
    const subLocationColumns: ColumnDef<SubCategory>[] = [
        {
            accessorKey: 'LocationName',
            header: 'Name',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue('LocationName')}</span>
            ),
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
                        onClick={() => { setSubRecID(row.original.LocationId); handleEdit(false, row.original) }}
                    >
                        Edit
                    </ReusableButton>
                    <ReusableButton
                        variant="text"
                        size="small"
                        danger
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => { setSubRecID(row.original.LocationId); setMainDelRec(row.original); setIsMainDelOpen(true) }}
                    >
                        Delete
                    </ReusableButton>
                </div>
            ),
        },
    ];
    let handleReset = () => {
        reset({
            "LocationName": "",
            "mainLocationDropdown": watch("mainLocationDropdown"),
            "LocationNameSub": "",
            "Address": "",
            "City": "",
            "State": "",
            "Country": "",
            "MobileNo": "",
            "ZipCode": "",
            "TIN_GSTIN_UIN": ""
        })
    }
    function handleCancel() {
        setSubRecID(null)
        setRecordToEditId(null);
        setIsMainDialogOpen(false);
        setIsSubDialogOpen(false);
        setIsMainDelOpen(false);
        handleReset();
    }
    function handleSubReset() {
        reset({
            ...watch(),
            subname: '',
            subcode: '',
            attributegroup: '',
            costbreakgroup: '',
            lifespan: '',
            salvagevalue: '',
            subdescription: '',
        })
    }
    // Define table permissions
    const tablePermissions: TablePermissions = {
        canEdit: true,
        canDelete: true,
        canView: true,
        canExport: false,
        canAdd: true,
        canManageColumns: false,
    };
    const getFieldsByNames = (names: string[]) => mainCatfields.filter(f => names.includes(f.name!));
    const renderField = (field: BaseField) => {
        const { name, label, fieldType, isRequired, dependsOn, show = true } = field;
        if (!name || !show) return null;
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
                        render={({ field: ctrl }) => (
                            <ReusableInput
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
                                usePortal={true}
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
                                    usePortal={false}
                                    label={label!}
                                    {...field}
                                    value={ctrl.value}
                                    onChange={ctrl.onChange}
                                    error={errors[name]?.message as string}
                                    suffixIcon={<FaSearch onClick={null} />}
                                />
                            )}
                        />
                    </div>
                );
        }
    }
    // getAll AssetCat Details
    const getLocationDetails = async (companyId) => {
        dispatch(setLoading(true));
        await getCustomerLocations(companyId)
            .then((res) => {
                let mainarr = []
                let subarr = []
                if (res.data !== undefined) {
                    res.data?.CustomerLocation.map((obj) => {
                        if (obj.Parent === "#" && obj.CustomerId == customerId) {
                            mainarr.push(obj)
                        } else if (obj.CustomerId == customerId) {
                            subarr.push(obj)
                        }
                    })
                    setMainData(mainarr)
                    setSubCategoryData(subarr.reverse());
                } else {
                    setGetMainCategoryData([]);
                    setSubCategoryData([]);
                }
            })
            .catch((err) => { })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };
    const setMainData = (mainlocations) => {
        let mainloc = []
        let mainLocOptions = []
        mainlocations?.forEach((obj) => {
            if (obj.CustomerId == customerId) {
                mainloc.push(obj)
                mainLocOptions.push({
                    label: obj.LocationName,
                    value: obj.LocationId
                })
            }
        }
        )
        const fieldData = [...mainCatfields]
        fieldData.forEach((obj) => {
            if (obj.name === "mainLocationDropdown") {
                obj.options = mainLocOptions
            }
        })
        setMainCatFields(fieldData)
        setGetMainCategoryData(mainloc);
    }
    //adding Asset Category
    const addNewCustLocationAPI = async (companyId, payload) => {
        dispatch(setLoading(true))
        await postNewCustomerLocation(companyId, customerId, payload).then((res) => {
            if (res.data.status !== undefined) {
                if (res.data.status === true) {
                    msg.success(res.data.message);
                    getLocationDetails(companyId);
                    handleCancel()
                }
                else {
                    // msg.warning(res.data.message);
                    msg.warning(res.data.ErrorDetails[0]["Error Message"]);
                }
            }
            else {
                msg.warning(res.data.ErrorDetails[0]["Error Message"]);
            }
        }).catch(() => { }).finally(() => { dispatch(setLoading(false)) })
    }
    // update MainCategory API
    const updateAPI = async (companyId, customerId, LocationId, ParentId, data) => {
        dispatch(setLoading(true))
        await updateCustomerLocation(companyId, customerId, LocationId, ParentId, data).then((res) => {
            if (res.data.status !== undefined) {
                if (res.data.status === true) {
                    handleCancel()
                    msg.success(res.data.message);
                    getLocationDetails(companyId);
                }
                else {
                    msg.warning(res.data.message);
                }
            } else {
                msg.warning(res.data.ErrorDetails[0]["Error Message"]);
            }
        }).catch(() => { }).finally(() => { dispatch(setLoading(false)) })
    }
    // post submit function
    const submit = (e, isMain, data) => {
        e.preventDefault();
        if (isMain) {
            let payload = {
                'CustomerLocationDetails': [
                    {
                        "MainLocationName": data["LocationName"],
                        "SubLocationName": "",
                        "Address": "",
                        "City": "",
                        "State": "",
                        "Country": "",
                        "MobileNo": "",
                        "Zipcode": "",
                        "TINGSTINUIN": "",
                    }
                ]
            }
            if (recordToEditId === null) {
                addNewCustLocationAPI(companyId, payload)
            }
            if (recordToEditId !== null) {
                updateAPI(companyId, customerId, 0, recordToEditId, payload)
            }
        }
        else {
            let payload = {
                'CustomerLocationDetails': [
                    {
                        "MainLocationName": selectedParentData["LocationName"],
                        "SubLocationName": data["LocationNameSub"],
                        "Address": data["Address"],
                        "City": data["City"],
                        "State": data["State"],
                        "Country": data["Country"],
                        "MobileNo": data["MobileNo"],
                        "Zipcode": data["ZipCode"],
                        "TINGSTINUIN": data["TIN_GSTIN_UIN"],
                    }
                ]
            }
            if (subRecID === null) {
                addNewCustLocationAPI(companyId, payload)
            }
            if (subRecID !== null) {
                updateAPI(companyId, customerId, subRecID, selectedParentData?.LocationId, payload)
            }
        }
    }
    //Deleting main
    const handleMainDelete = async (companyId, ID) => {
        dispatch(setLoading(true));
        await deleteCustomerLocation(companyId, ID)
            .then((res) => {
                if (res.data.status !== undefined) {
                    if (res.data.status === true) {
                        msg.success(res.data.message);
                        getLocationDetails(companyId);
                        handleCancel();
                    }
                    else {
                        msg.warning(res.data.message);
                    }
                } else {
                    msg.warning(res.data.ErrorDetails[0]["Error Message"]);
                }
            })
            .catch((err) => {
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
        handleCancel()
    };
    function handleModalOpen(flag) {
        if (flag === true) {
            setIsMainDialogOpen(true)
        } else if (flag === false) {
            if (watch("mainLocationDropdown")) {
                setIsSubDialogOpen(true);
                handleSubReset();
                setSubRecID(null);
            } else {
                msg.warning("Please Select Main Location")
            }
        } else {
            setIsMainDialogOpen(false);
            setIsSubDialogOpen(false)
        }
    }
    const handleEdit = (isMain, data) => {
        if (isMain) {
            reset({

                "LocationName": data["LocationName"],
                "mainLocationDropdown": "",
                "LocationNameSub": "",
                "Address": "",
                "City": "",
                "State": "",
                "Country": "",
                "MobileNo": "",
                "ZipCode": "",
                "TIN_GSTIN_UIN": ""

            })
            setIsMainDialogOpen(true)
        } else {
            reset({
                "LocationName": "",
                "mainLocationDropdown": watch("mainLocationDropdown"),
                "LocationNameSub": data["LocationName"],
                "Address": data["Address"],
                "City": data["City"],
                "State": data["State"],
                "Country": data["Country"],
                "MobileNo": data["MobileNo"],
                "ZipCode": data["ZipCode"],
                "TIN_GSTIN_UIN": data["TIN_GSTIN_UIN"]
            })
            setIsSubDialogOpen(true);
        }

    }
    return (
        <div className="h-full overflow-y-auto bg-gray-50/30">
            <header className="bg-card flex justify-between border-b px-6 py-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Masters</span>
                        <span>/</span>
                        <span>Company</span>
                        <span>/</span>
                        <span className="text-foreground font-medium">Customer Location</span>
                    </div>
                </div>
            </header>
            <div className="p-4 space-y-4">
                <div className='ps-3'>
                    <h1 className="text-3xl font-bold text-gray-900">Customer Location</h1>
                </div>
                <Card className="border-0 shadow-sm mt-2">
                    <CardHeader className="pb-2 pt-2">
                        <div className='mt-2 p-2'>
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <TabsList>
                                        <TabsTrigger value="main">Main Location</TabsTrigger>
                                        <TabsTrigger value="sub">Sub Location</TabsTrigger>
                                    </TabsList>
                                    <div className='flex items-center gap-2'>
                                        <ReusableButton
                                            variant="text"
                                            onClick={() => { navigate("/layout/masters/company/customer") }}
                                            icon={""}
                                        >
                                            Back
                                        </ReusableButton>
                                        <ReusableButton
                                            variant="primary"
                                            icon={<Plus className="h-4 w-4" />}
                                            onClick={() => activeTab === 'main' ? handleModalOpen(true) : handleModalOpen(false)}
                                        >
                                            Add
                                        </ReusableButton>
                                    </div>
                                </div>
                                <TabsContent value="main" className="space-y-4">
                                    <ReusableTable
                                        data={getMainCategoryData}
                                        columns={mainCategoryColumns}
                                        permissions={tablePermissions}
                                        title=""
                                        enableSearch={false}
                                        enableSelection={false}
                                        enableColumnVisibility={true}
                                        enablePagination={true}
                                        enableSorting={true}
                                        enableFiltering={true}
                                        pageSize={10}
                                        emptyMessage="No user groups found"
                                        rowHeight="normal"
                                        storageKey="usergroups-table"
                                    />
                                </TabsContent>
                                <TabsContent value="sub" className="space-y-4">
                                    <div className='flex items-center gap-6 mb-3'>
                                        <div>
                                            <h2 className='text-lg mb-2'>Select Main Location</h2>
                                        </div>
                                        <div className="mb-4">
                                            {getFieldsByNames(['mainLocationDropdown']).map((field) => {
                                                return <div className=" space-x-2">
                                                    {renderField(field)}
                                                </div>;
                                            })}
                                        </div>
                                    </div>
                                    <ReusableTable
                                        data={subDataToShow}
                                        columns={subLocationColumns}
                                        permissions={tablePermissions}
                                        title=""
                                        enableSearch={false}
                                        enableSelection={false}
                                        enableColumnVisibility={true}
                                        enablePagination={true}
                                        enableSorting={true}
                                        enableFiltering={true}
                                        pageSize={10}
                                        emptyMessage="No user groups found"
                                        rowHeight="normal"
                                        storageKey="usergroups-table"
                                    />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                    </CardContent>
                </Card>
                <div className="">
                    <div className="flex justify-between items-center">
                        <Dialog open={isMainDialogOpen}
                            onOpenChange={(open) => {
                                setIsMainDialogOpen(open);
                                if (!open) {
                                    handleCancel();
                                }
                            }}
                        >
                            <DialogTrigger asChild>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>{recordToEditId ? "Update Main Location" : "Add Main Location"}</DialogTitle>
                                </DialogHeader>
                                <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4'>
                                    {getFieldsByNames(['LocationName']).map((field) => {
                                        return <div className="flex items-center space-x-2">
                                            {renderField(field)}
                                        </div>;
                                    })}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <ReusableButton
                                        variant="default"
                                        onClick={() => { setIsSubDialogOpen(false); setSubRecID(null), handleCancel() }}
                                    >
                                        Cancel
                                    </ReusableButton>
                                    <ReusableButton
                                        htmlType="submit"
                                        variant="primary"
                                        className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                                        onClick={(e) => { handleSubmit((data) => submit(e, true, data))(e) }}
                                    >
                                        {recordToEditId ? "Update" : "Save"}
                                    </ReusableButton>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <Dialog open={isMainDelOpen} onOpenChange={setIsMainDelOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirm the action</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <h4>{`Are you sure want to delete ${mainDelRec?.LocationName} Location`}</h4>
                                <div className="flex justify-end gap-2">
                                    <ReusableButton onClick={() => { setIsMainDelOpen(false); handleCancel() }}>
                                        Cancel
                                    </ReusableButton>
                                    <ReusableButton variant="primary" onClick={() => { (recordToEditId) ? handleMainDelete(companyId, recordToEditId) : handleMainDelete(companyId, subRecID) }}>
                                        Delete
                                    </ReusableButton>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isSubDialogOpen} onOpenChange={() => handleCancel()}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{subRecID ? "Update Sub Location" : "Add Sub Location"}</DialogTitle>
                            </DialogHeader>
                            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4'>
                                {getFieldsByNames(['LocationNameSub', 'Address', 'City', 'State', 'lifespan', 'Country', 'MobileNo', 'ZipCode', 'TIN_GSTIN_UIN']).map((field) => {
                                    return (
                                        <div className="flex items-center space-x-2">
                                            {renderField(field)}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-end gap-2">
                                <ReusableButton onClick={() => { setIsSubDialogOpen(false); handleCancel() }}>
                                    Cancel
                                </ReusableButton>
                                <ReusableButton variant="primary" onClick={(e) => { handleSubmit((data) => submit(e, false, data))(e) }}>
                                    {subRecID ? "Update" : "Save"}
                                </ReusableButton>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};
export default CustomerLocation;
