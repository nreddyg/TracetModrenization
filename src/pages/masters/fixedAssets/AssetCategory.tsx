import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/common/PageLayout';
import PageHeader from '@/components/common/PageHeader';
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
import { deleteAssetCat, getAssetCatByID, getAssetCategoryData, postAssetCatDetails, updateAssetCat } from '@/services/assetCategoryServices';
import { Controller, useForm } from 'react-hook-form';
import { Asset_Main_Category_DB } from '@/Local_DB/Form_JSON_Data/AssetCategoryDB';
import { BaseField, GenericObject } from '@/Local_DB/types/types';

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
    const [selectedMainLocation, setSelectedMainLocation] = useState('');
    const [mainCategoryName, setMainCategoryName] = useState('');
    const [subCategoryName, setSubCategoryName] = useState('');
    const [getMainCategoryData, setGetMainCategoryData] = useState([]);
    const [recordToEditId, setRecordToEditId] = useState(null);
    const [mainCatfields, setMainCatFields] = useState<BaseField[]>(Asset_Main_Category_DB);
    const [mainDelRec, setMainDelRec] = useState({ Name: '', AssetCategoryId: 0 });
    const companyId = useAppSelector(state => state.projects.companyId);
    const branch = useAppSelector(state => state.projects.branch) || '';
    const msg = useMessage()
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (companyId) getCategoryDetails(companyId)
    }, [companyId])

    console.log('rec', mainDelRec);

    const form = useForm<GenericObject>({
        defaultValues: mainCatfields.reduce((acc, f) => {
            acc[f.name!] = f.defaultChecked ?? '';
            return acc;
        }, {} as GenericObject),
    });

    const [subCatgory] = useState<SubCategory[]>([]);

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
                <div className="flex gap-2">
                    <ReusableButton
                        variant="text"
                        size="small"
                        //   icon={<Edit className="h-4 w-4" />}
                        onClick={() => { setRecordToEditId(row.original.AssetCategoryId); getAssetCategoryByID(row.original.AssetCategoryId, companyId) }}
                    >
                        Edit
                    </ReusableButton>
                    <ReusableButton
                        variant="text"
                        size="small"
                        danger
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => { setRecordToEditId(row.original.AssetCategoryId); setMainDelRec(row.original); setIsMainDelOpen(true) }}
                    >
                        Delete
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
                <span className="font-medium text-gray-900 text-sm">hello</span>
            ),
        }
    ];

    const filteredSubLocations = selectedMainLocation
        ? subCatgory.filter(sub => sub.mainLocationId === selectedMainLocation)
        : [];

    const handleAddMainLocation = () => {
        console.log('Add main location:', mainCategoryName);
        setIsMainDialogOpen(false);
        setMainCategoryName('');
    };

    const handleAddSubLocation = () => {
        console.log('Add sub location:', subCategoryName);
        setIsSubDialogOpen(false);
        setSubCategoryName('');
    };

    // Define table permissions
    const tablePermissions: TablePermissions = {
        canEdit: true,
        canDelete: true,
        canView: true,
        canExport: false,
        canAdd: true,
        canManageColumns: false,
    };

    const tableActions2: TableAction<SubCategory>[] = [
        {
            label: 'Edit',
            icon: Edit,
            onClick: () => { },
            variant: 'default',
        },
        {
            label: 'Delete',
            icon: Trash2,
            onClick: () => { },
            variant: 'destructive',
        },
    ];

    const { control, register, handleSubmit, watch, setValue, reset, formState: { errors } } = form;

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
                    // setSubCategoryData(subarr.reverse());
                } else {
                    setGetMainCategoryData([]);
                    // setSubCategoryData([]);
                }

            })
            .catch((err) => { })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    console.log('record', recordToEditId);
    //adding Asset Category
    const addNewCategoryAPI = async (companyId, payload) => {
        dispatch(setLoading(true))
        await postAssetCatDetails(companyId, payload).then((res) => {
            if (res.data.status !== undefined) {
                if (res.data.status === true) {
                    msg.success(res.data.message);
                    getCategoryDetails(companyId);
                    handleCancel()
                }
                else {
                    msg.warning(res.data.message);
                }
            }
            else {
                msg.warning(res.data.ErrorDetails[0]["Error Message"]);
            }
        }).catch(() => { }).finally(() => { dispatch(setLoading(false)) })
    }
    // update MainCategory API
    const updateAssetCategoryData = async (MainId, subID, companyId, data) => {
        console.log("data", data);
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
                console.log(payload);
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
        }
    }

    //getAssetCategory by id
    const getAssetCategoryByID = async (recordToEditId, companyId) => {
        dispatch(setLoading(true))
        await getAssetCatByID(recordToEditId, companyId).then(res => {
            if (res.data && res.data.length > 0) {
                handleEdit(res.data)
            } else {
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
        // handleMainCancel()
        // handleSubCancel()
    };

    function handleCancel() {
        setRecordToEditId(null);
        setIsMainDialogOpen(false);
        setIsSubDialogOpen(false);
        setIsMainDelOpen(false);
        handleReset();
    }

    function handleReset() {
        reset({
            name: '',
            code: '',
            assetacquisitionaccount: '',
            assetdepreciationaccount: '',
            description: '',
            depreciationaccount: ''
        })
    }

    const handleEdit = (data) => {
        reset({
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
        <div className="h-full overflow-y-scroll bg-gray-50/30">
            <header className="bg-card flex justify-between border-b px-6 py-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Masters</span>
                        <span>/</span>
                        <span>Fixed Assets</span>
                        <span>/</span>
                        <span className="text-foreground font-medium">Asset Category</span>
                    </div>
                </div>
            </header>
            <div className="p-4 space-y-4">
                <div className='ps-3'>
                    <h1 className="text-3xl font-bold text-gray-900">Asset Category</h1>
                </div>
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
                                        onClick={() => activeTab === 'main' ? setIsMainDialogOpen(true) : setIsSubDialogOpen(true)}
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
                                            <ReusableDropdown
                                                placeholder="Select Main Location"
                                                // options={mainCategory.map(loc => ({ label: loc.name, value: loc.id }))}
                                                value={selectedMainLocation}
                                                onChange={(value) => setSelectedMainLocation(value as string)}
                                            />
                                        </div>
                                    </div>
                                    <ReusableTable
                                        data={subCatgory}
                                        columns={subLocationColumns}
                                        actions={tableActions2}
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
                        {/* <h1>Asset Category</h1> */}

                        <Dialog open={isMainDialogOpen}
                            // onOpenChange={setIsMainDialogOpen}
                            onOpenChange={(open) => {
                                setIsMainDialogOpen(open);

                                if (!open) {
                                    // 👇 Runs when the user clicks X or closes the dialog
                                    console.log("Dialog closed!");
                                    // put your custom cleanup or reset logic here
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
                                    // onClick={() => setIsAddDialogOpen(false)}
                                    >
                                        Cancel
                                    </ReusableButton>
                                    <ReusableButton
                                        htmlType="submit"
                                        variant="primary"
                                        className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                                        onClick={(e) => { handleSubmit(() => submit(e, true))(e) }}
                                    >
                                        {/* {recordToEditId?"Update":"Save"} */}
                                        Save
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
                                        Save
                                    </ReusableButton>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Sub Location Dialog */}
                    <Dialog open={isSubDialogOpen} onOpenChange={setIsSubDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Sub Location</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label>Main Location <span className="text-red-500">*</span></Label>
                                    <ReusableDropdown
                                        placeholder="Select Main Location"
                                    // options={mainCategory.map(loc => ({ label: loc.name, value: loc.id }))}
                                    />
                                </div>
                                <ReusableInput
                                    label="Sub Location Name"
                                    // value={subCategoryName}
                                    // onChange={(e) => setSubCategoryName(e.target.value)}
                                    required
                                />
                                <div className="flex justify-end gap-2">
                                    <ReusableButton onClick={() => setIsSubDialogOpen(false)}>
                                        Cancel
                                    </ReusableButton>
                                    <ReusableButton variant="primary" onClick={handleAddSubLocation}>
                                        Save
                                    </ReusableButton>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

        </div>

    );
};

export default AssetCategory;

