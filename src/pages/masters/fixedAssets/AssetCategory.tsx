import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableTable, TableAction, TablePermissions } from '@/components/ui/reusable-table';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ColumnDef } from '@tanstack/react-table';
import { useMessage } from '@/components/ui/reusable-message';
import { useAppDispatch, useAppSelector } from '@/store/reduxStore';
import { setLoading } from '@/store/slices/projectsSlice';
import { deleteAssetCat, getAssetCatByID, getAssetCategoryData, getCostBreakUpAttribute, getUserAttributes, postAssetCatDetails, updateAssetCat } from '@/services/assetCategoryServices';
import { Controller, useForm } from 'react-hook-form';
import { Asset_Main_Category_DB } from '@/Local_DB/Form_JSON_Data/AssetCategoryDB';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import ReusableMultiSelect from '@/components/ui/reusable-multi-select';
import { FaAngleRight, FaSearch } from 'react-icons/fa';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { ScrollArea } from '@/components/ui/scroll-area';


interface MainCategory {
    Name: string
}

interface SubCategory {
    id: string;
    name: string;
    mainLocationId: string;
}

const AssetCategory = () => {
    const [activeTab, setActiveTab] = useState('main');
    const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
    const [isSubDialogOpen, setIsSubDialogOpen] = useState(false);
    const [isMainDelOpen, setIsMainDelOpen] = useState(false)
    const [isSubDelOpen, setIsSubDelOpen] = useState(false);
    const [getMainCategoryData, setGetMainCategoryData] = useState([]);
    const [subCategoryData, setSubCategoryData] = useState([]);
    const [subDataToShow, setSubDataToShow] = useState([]);
    const [recordToEditId, setRecordToEditId] = useState(null);
    const [subRecID, setSubRecID] = useState(null);
    const [subRecord, setSubRecord] = useState({ Name: '', AssetCategoryId: 0, CostBreakupGroupNames: null, SalvageValuePercentage: "%" });
    const [mainCatfields, setMainCatFields] = useState<BaseField[]>(Asset_Main_Category_DB);
    const [mainDelRec, setMainDelRec] = useState({ Name: '', AssetCategoryId: 0 });
    const [isMainEdit, setIsMainEdit] = useState(false);
    const [selectedParentData, setSelectedParentData] = useState({});
    const companyId = useAppSelector(state => state.projects.companyId);
    const branch = useAppSelector(state => state.projects.branch) || '';
    const msg = useMessage()
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (companyId) {
            getCategoryDetails(companyId);
            getuserAttributes(companyId)
            getCostBreakUpData(companyId)
        }
    }, [companyId])

    const form = useForm<GenericObject>({
        defaultValues: mainCatfields.reduce((acc, f) => {
            acc[f.name!] = f.defaultValue ?? '';
            return acc;
        }, {} as GenericObject),
    });


    const { control, register, handleSubmit, watch, setValue, reset, formState: { errors } } = form;
    const parentId = watch('mainCatdropdown');

    useEffect(() => {
        if (parentId) {
            getAssetCategoryByID(parentId, companyId, false)
        }
    }, [parentId])

    useEffect(() => {
        if (parentId) settingSubdata(parentId);
    }, [parentId, subCategoryData])

    const settingSubdata = (val) => {
        let subdata = []
        subCategoryData.forEach((obj) => {
            if (val == obj.Parent) {
                subdata.push(obj)
            }
        })
        setSubDataToShow(subdata)
    }

    const mainCategoryColumns: ColumnDef<MainCategory>[] = [
        {
            accessorKey: 'Name',
            header: 'Name',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue('Name')}</span>
            ),
        },
        {
            accessorKey: 'Code',
            header: 'Code',
            cell: ({ row }) => (

                <span className="font-medium text-gray-900 text-sm">{row.getValue('Code')}</span>
            ),
        },
        {
            accessorKey: 'Description',
            header: 'Description',
            cell: ({ row }) => (

                <span className="font-medium text-gray-900 text-sm">{row.getValue('Description')}</span>
            ),
        },
        {
            accessorKey: 'AssetAcquisitionAccount',
            header: 'Asset Acquisition',
            cell: ({ row }) => (

                <span className="font-medium text-gray-900 text-sm">{row.getValue('AssetAcquisitionAccount')}</span>
            ),
        },
        {
            accessorKey: 'AssetDepreciationAccount',
            header: 'Asset Depreciation',
            cell: ({ row }) => (

                <span className="font-medium text-gray-900 text-sm">{row.getValue('AssetDepreciationAccount')}</span>
            ),
        },
        {
            accessorKey: 'DepreciationAccount',
            header: 'Depreciation Account',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue('DepreciationAccount')}</span>
            ),
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
                        onClick={() => { setRecordToEditId(row.original.AssetCategoryId); getAssetCategoryByID(row.original.AssetCategoryId, companyId, true) }}
                    >
                        <Edit className="h-4 w-4 text-blue-600" />
                    </ReusableButton>
                    <ReusableButton
                        variant="text"
                        size="small"
                        danger
                        title='Delete'
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => { setRecordToEditId(row.original.AssetCategoryId); setMainDelRec(row.original); setIsMainDelOpen(true) }}
                    >
                        <Trash2 className="h-4 w-4" />

                    </ReusableButton>
                </div>
            ),
        },
    ]

    const subLocationColumns: ColumnDef<SubCategory>[] = [
        {
            accessorKey: 'Name',
            header: 'Name',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue('Name')}</span>
            ),
        },
        {
            accessorKey: 'Code',
            header: 'Code',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue('Code')}</span>
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
                        title='Edit'
                        //   icon={<Edit className="h-4 w-4" />}
                        onClick={() => { setSubRecID(row.original.AssetCategoryId); setSubRecord(row.original); handleSubEdit(row.original); }}
                    >
                        <Edit className="h-4 w-4 text-blue-600" />
                    </ReusableButton>
                    <ReusableButton
                        variant="text"
                        size="small"
                        danger
                        title='Delete'
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => { setSubRecID(row.original.AssetCategoryId); setIsSubDelOpen(true) }}
                    >
                        <Trash2 className="h-4 w-4" />

                    </ReusableButton>
                </div>
            ),
        },
    ];


    //userAttributes getCall
    const getuserAttributes = async (companyId) => {
        dispatch(setLoading(true))
        await getUserAttributes(companyId)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    const options = res.data.map((main: any) => ({
                        value: main?.GroupName,
                        label: main?.GroupName,
                    }));
                    setMainCatFields((prev) =>
                        prev.map((f) =>
                            f.name === "attributegroup" ? { ...f, options } : f
                        )
                    );
                } else {
                    msg.warning('no data found')
                }
            })
            .catch(err => { })
            .finally(() => {
                dispatch(setLoading(false))
            })
    }

    //userAttributes getCall
    const getCostBreakUpData = async (companyId) => {
        dispatch(setLoading(true))
        await getCostBreakUpAttribute(companyId)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    const options = res.data.map((main: any) => ({
                        value: main?.GroupName,
                        label: main?.GroupName,
                    }));
                    setMainCatFields((prev) =>
                        prev.map((f) =>
                            f.name === "costbreakgroup" ? { ...f, options } : f
                        )
                    );
                } else {
                    msg.warning('no data found')
                }
            })
            .catch(err => { })
            .finally(() => {
                dispatch(setLoading(false))
            })
    }

    const handleSubEdit = (subData) => {
        reset({
            ...watch(),
            subname: subData.Name,
            subcode: subData.Code,
            attributegroup: subData?.AttributeGroupNames ? subData?.AttributeGroupNames?.split(',') : [],
            costbreakgroup: subData.CostBreakupGroupNames ? subData?.CostBreakupGroupNames : [],
            lifespan: subData.LifeSpan,
            salvagevalue: subData.SalvageValue,
            salvagevalue_unit: subData.SalvageValuePercentage,
            subdescription: subData.Description,
        });

        setIsSubDialogOpen(true);
    };

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
    // const percentage = watch("salvagevalue_unit");
    const renderField = (field: BaseField) => {
        const { name, label, fieldType, isRequired, dependsOn, show = true } = field;
        if (!name || !show) return null;
        const validationRules = {
            required: isRequired ? `${label} is Required` : false,
            ...(["name", "code", "description", "subname", "subcode", "subdescription"].includes(name) && {
                validate: (value: string) =>
                    value === undefined || value.trimStart() === value || "Leading spaces are not allowed",
            })
        };

        switch (fieldType) {
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
            case 'text':
                return (
                    <Controller
                        name={name}
                        control={control}
                        rules={validationRules}
                        render={({ field: ctrl }) => (
                            <ReusableInput
                                disabled={(recordToEditId && name === "code") ? true : (subRecID && name === "subcode") ? true : false}
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
                                defaultValue={name === 'salvagevalue_unit' ? '%' : ''}
                                usePortal={(name === 'mainCatdropdown') ? true : false}
                                {...field}
                                disabled={(name === "costbreakgroup" && subRecord.CostBreakupGroupNames) ? true : false}
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
                                    // usePortal={false}
                                    label={label!}
                                    usePortal={(name === 'mainCatdropdown') ? true : false}
                                    {...field}
                                    value={ctrl.value}
                                    onChange={ctrl.onChange}
                                    error={errors[name]?.message as string}
                                />
                            )}
                        />
                    </div>
                );
        }
    }

    // getAll AssetCat Details
    const getCategoryDetails = async (companyId) => {
        dispatch(setLoading(true));
        await getAssetCategoryData(companyId)
            .then((res) => {
                let mainarr = []
                let subarr = []
                if (res.data !== undefined) {
                    res.data.map((obj) => {
                        if (obj.Parent === "#") {
                            mainarr.push(obj)
                        } else {
                            subarr.push(obj)
                        }
                    })
                    setGetMainCategoryData(mainarr.reverse());
                    if (mainarr.length > 0) {
                        const options = mainarr.map((main: any) => ({
                            label: main?.Name,
                            value: main?.AssetCategoryId,
                        }));
                        setMainCatFields((prev) =>
                            prev.map((f) =>
                                f.name === "mainCatdropdown" ? { ...f, options } : f
                            )
                        );
                    }
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

    //adding Asset Category
    const addNewCategoryAPI = async (companyId, payload) => {
        dispatch(setLoading(true))
        await postAssetCatDetails(companyId, payload).then((res) => {
            if (res.data.status !== undefined) {
                if (res.data.status === true) {
                    msg.success(res.data.message);
                    getCategoryDetails(companyId);
                    handleCancel()
                    setIsMainDialogOpen(false);
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
    const updateAssetCategoryData = async (MainId, subID, companyId, data) => {
        dispatch(setLoading(true))
        await updateAssetCat(MainId, subID, companyId, data).then((res) => {
            if (res.data.status !== undefined) {
                if (res.data.status === true) {
                    handleCancel()
                    msg.success(res.data.message);
                    getCategoryDetails(companyId);
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
    const submit = (e, isMain) => {
        e.preventDefault();
        if (isMain) {
            if (recordToEditId === null) {
                let payload = {
                    'AssetCategoryDetails': [
                        {
                            "Main category name": watch("name"),
                            "Main category code": watch("code"),
                            "Asset Acquisition Account": watch("assetacquisitionaccount"),
                            "Asset Depreciation Account": watch("assetdepreciationaccount"),
                            "Depreciation Account": watch("depreciationaccount"),
                            "Main category description": watch("description"),
                            "Sub category name": "",
                            "Sub category code": "",
                            "Sub category description": "",
                            "Attribute group": "",
                            "Costbreakup group": "",
                            "Life span": "",
                            "Salvage value percentage": "",
                            "Salvage value amount": ""
                        }
                    ]
                }
                addNewCategoryAPI(companyId, payload);
            } else if (recordToEditId !== null) {
                let payload = {
                    'AssetCategoryDetails': [
                        {
                            "Main category name": watch("name"),
                            "Asset Acquisition Account": watch("assetacquisitionaccount"),
                            "Asset Depreciation Account": watch("assetdepreciationaccount"),
                            "Depreciation Account": watch("depreciationaccount"),
                            "Main category description": watch("description"),
                            "Sub category name": "",
                            "Sub category description": "",
                            "Attribute group": "",
                            "Costbreakup group": "",
                            "Life span": "",
                            "Salvage value percentage": "",
                            "Salvage value amount": ""
                        }
                    ]
                }
                // update API here
                updateAssetCategoryData(recordToEditId, 0, companyId, payload)
            }
        } else {
            if (subRecID === null) {
                let payload = {
                    'AssetCategoryDetails': [
                        {
                            "Main category name": selectedParentData[0]?.Name,
                            "Main category code": selectedParentData[0].Code,
                            "Asset Acquisition Account": selectedParentData[0].AssetAcquisitionAccount,
                            "Asset Depreciation Account": selectedParentData[0].AssetDepreciationAccount,
                            "Depreciation Account": selectedParentData[0].DepreciationAccount,
                            "Main category description": selectedParentData[0].Description,
                            "Sub category name": watch("subname"),
                            "Sub category code": watch("subcode"),
                            "Sub category description": watch("subdescription"),
                            "Attribute group": Array.isArray(watch("attributegroup")) ? watch("attributegroup").join(',') : watch("attributegroup") || "",
                            "Costbreakup group": watch("costbreakgroup"),
                            "Life span": watch("lifespan"),
                            "Salvage value percentage": watch('salvagevalue_unit'),
                            "Salvage value amount": watch("salvagevalue")
                        }
                    ]
                }
                addNewCategoryAPI(companyId, payload);
            } else if (subRecID !== null) {
                let payload = {
                    'AssetCategoryDetails': [
                        {
                            "Main category name": selectedParentData[0].Name,
                            "Asset Acquisition Account": selectedParentData[0].AssetAcquisitionAccount,
                            "Asset Depreciation Account": selectedParentData[0].AssetDepreciationAccount,
                            "Depreciation Account": selectedParentData[0].DepreciationAccount,
                            "Main category description": selectedParentData[0].Description,
                            "Sub category name": watch("subname"),
                            "Sub category description": watch("subdescription"),
                            "Attribute group": (watch("attributegroup").join()),
                            "Costbreakup group": watch("costbreakgroup"),
                            "Life span": watch("lifespan"),
                            "Salvage value percentage": watch('salvagevalue_unit'),
                            "Salvage value amount": watch("salvagevalue"),
                        }
                    ]
                }
                updateAssetCategoryData(selectedParentData[0].AssetCategoryId, subRecID, companyId, payload)
            }
        }
    }

    //getAssetCategory by id
    const getAssetCategoryByID = async (recordToEditId, companyId, isMainEdit) => {
        dispatch(setLoading(true))
        await getAssetCatByID(recordToEditId, companyId).then(res => {
            if (res.data && res.data.length > 0) {
                if (isMainEdit) {
                    handleEdit(res.data)
                }
                setSelectedParentData(res.data);
            } else {
                setSelectedParentData({});
                msg.warning('no data found')
            }
        }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
    }

    //Deleting main
    const handleMainDelete = async (ID, companyId, data) => {
        dispatch(setLoading(true));
        await deleteAssetCat(ID, companyId, data)
            .then((res) => {
                if (res.data.Status !== undefined) {
                    if (res.data.Status === true) {
                        msg.success(res.data.Message);
                        getCategoryDetails(companyId);
                        handleCancel();
                    }
                    else {
                        msg.warning(res.data.Message);
                    }
                } else {
                    msg.warning(res.data.ErrorDetails[0]["Error Message"]);
                }
            })
            .catch((err) => {
                // TracetMessage("error","1vh","Failed to Delete Asset Category","assetcategorydelete");   
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    function handleCancel() {
        setRecordToEditId(null);
        setIsMainDialogOpen(false);
        setIsSubDialogOpen(false);
        setIsMainDelOpen(false);
        setIsSubDelOpen(false);
        handleReset();
    }

    function subDialogFN() {
        setIsSubDialogOpen(false);
        setSubRecID(null);
    }

    function handleReset() {
        reset({
            // ...watch(),
            name: '',
            code: '',
            assetacquisitionaccount: '',
            assetdepreciationaccount: '',
            description: '',
            depreciationaccount: '',
            subname: '',
            subcode: '',
            attributegroup: '',
            lifespan: '',
            salvagevalue: '0.00',
            salvagevalue_unit: "%",
            subdescription: '',
            mainCatdropdown: selectedParentData[0]?.AssetCategoryId,
        })
    }

    function handleModalOpen(flag) {
        if (flag === true) {
            setIsMainDialogOpen(true)
        } else if (flag === false) {
            if (parentId) {
                setIsSubDialogOpen(true);
                handleSubReset();
                setSubRecID(null);
                setSubRecord({ Name: '', AssetCategoryId: 0, CostBreakupGroupNames: null, SalvageValuePercentage: "%" });
            } else {
                msg.warning("Please select Main Category ")
            }

        } else {
            setIsMainDialogOpen(false);
            setIsSubDialogOpen(false);
        }
    }

    const handleEdit = (data) => {
        reset({
            ...watch(),
            name: data[0].Name,
            code: data[0].Code,
            assetacquisitionaccount: data[0].AssetAcquisitionAccount,
            assetdepreciationaccount: data[0].AssetDepreciationAccount,
            depreciationaccount: data[0].DepreciationAccount,
            description: data[0].Description
        })
        setIsMainDialogOpen(true);
    }
    return (
        <ScrollArea>
        <div className="h-full">
            <header className="px-6 py-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                            Asset Category
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Masters</span>
                        <FaAngleRight />
                        <span>Fixed Assets</span>
                        <FaAngleRight />
                        <span className="text-gray-900 font-medium">Asset Category</span>
                    </div>
                </div>
            </header>
            <div className="p-4 space-y-4 pt-0">
                <Card className="border-0 shadow-sm mt-2">
                    <CardHeader className="pb-2 pt-2">
                        <div className='mt-2 p-2'>
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <TabsList>
                                        <TabsTrigger value="main">Main Category</TabsTrigger>
                                        <TabsTrigger value="sub">Sub Category</TabsTrigger>
                                    </TabsList>
                                    <ReusableButton
                                        variant="primary"
                                        icon={<Plus className="h-4 w-4" />}
                                        onClick={() => activeTab === 'main' ? handleModalOpen(true) : handleModalOpen(false)}
                                    >
                                        Add
                                    </ReusableButton>
                                </div>

                                <TabsContent value="main" className="space-y-4">
                                    <ReusableTable
                                        data={getMainCategoryData}
                                        columns={mainCategoryColumns}
                                        // actions={tableActions}
                                        permissions={tablePermissions}
                                        title=""
                                        //    onRefresh={handleRefresh}
                                        enableSearch={false}
                                        enableSelection={false}
                                        // enableExport={true}
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
                                            <h2 className='text-lg mb-2'>Select Main Category</h2>
                                        </div>
                                        <div className="mb-4">
                                            {getFieldsByNames(['mainCatdropdown']).map((field) => {
                                                return <div className=" space-x-2">
                                                    {renderField(field)}
                                                </div>;
                                            })}
                                        </div>
                                    </div>
                                    <ReusableTable
                                        data={subDataToShow}
                                        columns={subLocationColumns}
                                        // actions={tableActions2}
                                        permissions={tablePermissions}
                                        title=""
                                        //    onRefresh={handleRefresh}
                                        enableSearch={false}
                                        enableSelection={false}
                                        // enableExport={false}
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

                {/* Main Category Dialog */}
                <div className="">
                    {/* Search and Actions */}
                    <div className="flex justify-between items-center">
                        <Dialog open={isMainDialogOpen}
                            onOpenChange={(open) => {
                                setIsMainDialogOpen(open);
                                if (!open) {
                                    handleCancel(); // example: reset form
                                }
                            }}
                        >
                            <DialogTrigger asChild>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Add Main Category</DialogTitle>
                                </DialogHeader>
                                <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4'>
                                    {getFieldsByNames(['name', 'code', 'assetacquisitionaccount', 'depreciationaccount', 'assetdepreciationaccount', 'description']).map((field) => {
                                        return <div className="flex items-center space-x-2">
                                            {renderField(field)}
                                        </div>;
                                    })}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <ReusableButton
                                        variant="default"
                                        onClick={() => { setIsMainDialogOpen(false); setSubRecID(null); handleCancel(); }}
                                    >
                                        Cancel
                                    </ReusableButton>
                                    <ReusableButton
                                        htmlType="submit"
                                        variant="primary"
                                        className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                                        onClick={(e) => { handleSubmit(() => submit(e, true))(e) }}
                                    >
                                        {recordToEditId ? "Update" : "Save"}
                                    </ReusableButton>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    {/* main delete dialog open */}
                    <Dialog open={isMainDelOpen} onOpenChange={setIsMainDelOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirm the action</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <h4>{`Are you sure want to delete ${mainDelRec?.Name} MainCategory`}</h4>
                                <div className="flex justify-end gap-2">
                                    <ReusableButton onClick={() => setIsMainDelOpen(false)}>
                                        Cancel
                                    </ReusableButton>
                                    <ReusableButton variant="primary" onClick={() => handleMainDelete(recordToEditId, companyId, '')}>
                                        Delete                           \
                                    </ReusableButton>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Sub Category Dialog */}
                    <Dialog open={isSubDialogOpen} onOpenChange={() => subDialogFN()}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Sub Category</DialogTitle>
                            </DialogHeader>
                            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4'>
                                {getFieldsByNames(['subname', 'subcode', 'attributegroup', 'costbreakgroup', 'lifespan']).map(renderField)}
                                <div className='flex'>
                                    <div className='w-[20rem]'>{getFieldsByNames(['salvagevalue']).map(renderField)}</div>
                                    <div className='flex items-center mt-[28px]'>{getFieldsByNames(['salvagevalue_unit']).map(renderField)}</div>
                                </div>
                                {getFieldsByNames(['subdescription']).map(renderField)}
                            </div>
                            {/* <div className="space-y-4"> */}

                            <div className="flex justify-end gap-2">
                                <ReusableButton onClick={() => setIsSubDialogOpen(false)}>
                                    Cancel
                                </ReusableButton>
                                <ReusableButton variant="primary" onClick={(e) => { handleSubmit(() => submit(e, false))(e) }}>
                                    {subRecID ? "Update" : "Save"}
                                </ReusableButton>
                            </div>
                            {/* </div> */}
                        </DialogContent>
                    </Dialog>

                    {/* sub delete dialog */}
                    <Dialog open={isSubDelOpen} onOpenChange={setIsSubDelOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirm the action</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <h4>{`Are you sure want to delete ${subRecord?.Name} SubCategory`}</h4>
                                <div className="flex justify-end gap-2">
                                    <ReusableButton onClick={() => setIsSubDelOpen(false)}>
                                        Cancel
                                    </ReusableButton>
                                    <ReusableButton variant="primary" onClick={() => handleMainDelete(subRecID, companyId, '')}>
                                        Delete
                                    </ReusableButton>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
        </ScrollArea>
    );
};

export default AssetCategory;

