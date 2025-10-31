import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableTable, TableAction, TablePermissions } from '@/components/ui/reusable-table';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
import { FaSearch } from 'react-icons/fa';
import { ITEM_CATEGORY_DB } from '@/Local_DB/Form_JSON_Data/ItemCategoryDB';
import { deleteItemCat, getItemCategoryData, getItemtCatByID, getUnitOfMeasure, postItemCatDetails, updateItemCat } from '@/services/itemCategoryServices';
import { sub } from 'date-fns';

interface MainCategory {
    CategoryName: string
}

interface SubCategory {
    id: string;
    name: string;
    mainLocationId: string;
}

const ItemCategory = () => {
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
    const [subRecord, setSubRecord] = useState({ CategoryName: '', CategoryId: 0 });
    const [itemCatFields, setItemCatFields] = useState<BaseField[]>(ITEM_CATEGORY_DB);
    const [mainDelRec, setMainDelRec] = useState({ CategoryName: '', CategoryId: 0 });
    const [isMainEdit, setIsMainEdit] = useState(false);
    const [selectedParentData, setSelectedParentData] = useState({ CategoryId: 0, CategoryName: '', CategoryCode: '', CategoryDescription: '', CategoryUnitOfMeasureName: '' });
    const companyId = useAppSelector(state => state.projects.companyId);
    const branch = useAppSelector(state => state.projects.branch) || '';
    const msg = useMessage()
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (companyId) {
            getItemCategoryDetails(companyId);
            getUnitOfMeasureDetails(companyId)
        }
    }, [companyId])

    const form = useForm<GenericObject>({
        defaultValues: itemCatFields.reduce((acc, f) => {
            acc[f.name!] = f.defaultValue ?? '';
            return acc;
        }, {} as GenericObject),
        // salvagevalue_unit: '%',
    });

    const { control, register, handleSubmit, watch, setValue, reset, formState: { errors } } = form;

    const parentId = watch('mainCatdropdown');

    useEffect(() => {
        if (parentId) {
            getItemCategoryByID(parentId, companyId, false)
            // settingSubdata(parentId);
        }
    }, [parentId])
    useEffect(() => {
        if (parentId) {
            // getAssetCategoryByID(parentId, companyId, false)
            settingSubdata(parentId);
        }
    }, [parentId, subCategoryData])

    const settingSubdata = (val) => {
        let subdata = []
        subCategoryData.forEach((obj) => {
            if (val == obj.ParentId) {
                subdata.push(obj)
            }
        })
        setSubDataToShow(subdata)
    }

    const mainCategoryColumns: ColumnDef<MainCategory>[] = [
        {
            accessorKey: 'CategoryName',
            header: 'Category Name',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue('CategoryName')}</span>
            ),
        },
        {
            accessorKey: 'CategoryCode',
            header: 'Category Code',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue('CategoryCode')}</span>
            ),
        },
        {
            accessorKey: 'CategoryDescription',
            header: 'Description',
            cell: ({ row }) => (

                <span className="font-medium text-gray-900 text-sm">{row.getValue('CategoryDescription')}</span>
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
                        // onClick={() => { setRecordToEditId(row.original.AssetCategoryId); getAssetCategoryByID(row.original.AssetCategoryId, companyId, true) }}
                        onClick={() => { setRecordToEditId(row.original.CategoryId); handleEdit(row.original) }}
                    >
                        Edit
                    </ReusableButton>
                    <ReusableButton
                        variant="text"
                        size="small"
                        danger
                        icon={<Trash2 className="h-4 w-4" />}
                        // onClick={() => { setRecordToEditId(row.original.AssetCategoryId); setMainDelRec(row.original); setIsMainDelOpen(true) }}
                        onClick={() => { setRecordToEditId(row.original.CategoryId); setMainDelRec(row.original); setIsMainDelOpen(true) }}
                    >
                        Delete
                    </ReusableButton>
                </div>
            ),
        },
    ]

    const subItemCategoryColumns: ColumnDef<SubCategory>[] = [
        {
            accessorKey: 'CategoryName',
            header: 'Name',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue('CategoryName')}</span>
            ),
        },
        {
            accessorKey: 'CategoryCode',
            header: 'Code',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue('CategoryCode')}</span>
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
                        // onClick={() => { setSubRecID(row.original.AssetCategoryId); setSubRecord(row.original); handleSubEdit(row.original); }}
                        onClick={() => { setSubRecID(row.original.CategoryId); setSubRecord(row.original); handleSubEdit(row.original); }}
                    >
                        Edit
                    </ReusableButton>
                    <ReusableButton
                        variant="text"
                        size="small"
                        danger
                        icon={<Trash2 className="h-4 w-4" />}
                        // onClick={() => { setSubRecID(row.original.AssetCategoryId); setIsSubDelOpen(true) }}
                        onClick={() => { setSubRecID(row.original.CategoryId); setSubRecord(row.original); setIsSubDelOpen(true) }}
                    >
                        Delete
                    </ReusableButton>
                </div>
            ),
        },
    ];


    //userAttributes getCall
    const getUnitOfMeasureDetails = async (companyId) => {
        dispatch(setLoading(true))
        await getUnitOfMeasure(companyId)
            .then(res => {
                if (res.data && res.data.UOMDetails.length > 0) {
                    const options = res.data.UOMDetails.map((main: any) => ({
                        value: main?.Name,
                        label: main?.Name,
                    }));
                    setItemCatFields((prev) =>
                        prev.map((f) => ["unitofmeasure", "subunitofmeasure"].includes(f.name) ? { ...f, options } : f
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
            subname: subData.CategoryName,
            subcode: subData.CategoryCode,
            subunitofmeasure: subData.CategoryUnitOfMeasureName,
            subdescription: subData.CategoryDescription,
        });
        setIsSubDialogOpen(true);
    };


    function handleSubReset() {
        reset({
            ...watch(),
            subname: '',
            subcode: '',
            subunitofmeasure:'',
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

    const getFieldsByNames = (names: string[]) => itemCatFields.filter(f => names.includes(f.name!));
    // const percentage = watch("salvagevalue_unit");
    const renderField = (field: BaseField) => {
        const { name, label, fieldType, isRequired, dependsOn, show = true } = field;
        if (!name || !show) return null;
        const validationRules = {
            required: isRequired ? `${label} is Required` : false,
        };

        // special case for salvagevalue: render a combined visual control
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
                                defaultValue={name === 'salvagevalue_unit' ? '%' : ''}
                                usePortal={(name === 'mainCatdropdown') ? true : false}
                                {...field}
                                // disabled={(subRecID && subRecord.CostBreakupGroupNames) ? true : false}
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
    const getItemCategoryDetails = async (companyId) => {
        dispatch(setLoading(true));
        await getItemCategoryData(companyId)
            .then((res) => {
                if (res.data !== undefined && res.data?.length !== 0) {
                    setGetMainCategoryData(res.data.MainCategories.reverse());
                    if (res.data.MainCategories.length > 0) {
                        const options = res.data.MainCategories.map((main: any) => ({
                            label: main?.CategoryName,
                            value: main?.CategoryId,
                        }));
                        setItemCatFields((prev) =>
                            prev.map((f) =>
                                f.name === "mainCatdropdown" ? { ...f, options } : f
                            )
                        );

                    }
                    setSubCategoryData(res.data.SubCategories);
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
    const addNewItemCategoryAPI = async (companyId, payload) => {
        dispatch(setLoading(true))
        await postItemCatDetails(companyId, payload).then((res) => {
            if (res.data && res.data.status) {
                msg.success(res.data.message);
                getItemCategoryDetails(companyId);
                handleCancel()
                setIsMainDialogOpen(false);
            }
            else {
                msg.warning(res.data.ErrorDetails[0]["Error Message"]);
            }
        }).catch(() => { }).finally(() => { dispatch(setLoading(false)) })
    }
    // update MainCategory API
    const updateAssetCategoryData = async (ID, companyId, data) => {
        dispatch(setLoading(true))
        await updateItemCat(ID, companyId, data).then((res) => {
            if (res.data.status !== undefined) {
                if (res.data.status === true) {
                    handleCancel()
                    msg.success(res.data.message);
                    getItemCategoryDetails(companyId);
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
                    'ItemCategoryDetails': [
                        {
                            "Main category name": watch("name"),
                            "Main category code": watch("code"),
                            "Main Category Unit Of Measure": watch("unitofmeasure"),
                            "Main category description": watch("description"),
                            "Sub category name": "",
                            "Sub category code": "",
                            "Sub category description": "",
                            "Sub Category Unit Of Measure": ""
                        }
                    ]
                }
                addNewItemCategoryAPI(companyId, payload);
            } else if (recordToEditId !== null) {
                let payload = {
                    'CategoryDetails':
                    {
                        "CategoryName": watch("name"),
                        "CategoryCode": watch("code"),
                        "CategoryUnitOfMeasureName": watch("unitofmeasure"),
                        "CategoryDescription": watch("description"),
                    }
                }
                // update API here
                updateAssetCategoryData(recordToEditId, companyId, payload)
            }
        } else {
            if (subRecID === null) {
                let payload = {
                    'ItemCategoryDetails': [
                        {
                            "Main category name": selectedParentData.CategoryName,
                            "Main category code": selectedParentData.CategoryCode,
                            "Main Category Unit Of Measure": selectedParentData.CategoryUnitOfMeasureName,
                            "Main category description": selectedParentData.CategoryDescription,
                            "Sub category name": watch("subname"),
                            "Sub category code": watch("subcode"),
                            "Sub category description": watch("subdescription"),
                            "Sub Category Unit Of Measure": watch("subunitofmeasure")
                        }
                    ]
                }
                addNewItemCategoryAPI(companyId, payload);
            } else if (subRecID !== null) {
                let payload = {
                    'CategoryDetails':
                    {
                        "CategoryName": watch("subname"),
                        "CategoryCode": watch("subcode"),
                        "CategoryUnitOfMeasureName": watch("subunitofmeasure"),
                        "CategoryDescription": watch("subdescription"),
                    }
                }
                updateAssetCategoryData(subRecID, companyId, payload)
            }
        }
    }

    //getAssetCategory by id
    const getItemCategoryByID = async (recordToEditId, companyId, isMainEdit) => {
        dispatch(setLoading(true))
        await getItemtCatByID(recordToEditId, companyId).then(res => {
            if (res.data.CategoryDetails && res.data.CategoryDetails) {
                settingSubdata(res.data.CategoryDetails.CategoryId)
                setSelectedParentData(res.data.CategoryDetails);
            } else {
                setSelectedParentData({ CategoryId: 0, CategoryName: '', CategoryCode: '', CategoryDescription: '', CategoryUnitOfMeasureName: '' });
                msg.warning('no data found')
            }
        }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
    }

    //Deleting main
    const handleMainDelete = async (ID, companyId, data) => {
        dispatch(setLoading(true));
        await deleteItemCat(ID, companyId, data)
            .then((res) => {
                if (res.data) {
                    if (res.data.status === true) {
                        msg.success(res.data.message);
                        getItemCategoryDetails(companyId);
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
                // TracetMessage("error","1vh","Failed to Delete Asset Category","assetcategorydelete");   
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    function handleCancel() {
        // setRecordToEditId(null);
        handleReset();
        setIsMainDialogOpen(false);
        setIsSubDialogOpen(false);
        setIsMainDelOpen(false);
        setIsSubDelOpen(false);
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
            unitofmeasure: '',
            description: '',
            mainCatdropdown: selectedParentData.CategoryId,
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
                setSubRecord({ CategoryName: '', CategoryId: 0 });
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
            // ...watch(),
            name: data.CategoryName,
            code: data.CategoryCode,
            unitofmeasure: data.CategoryUnitOfMeasureName,
            description: data.CategoryDescription
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
                        <span>Consumables</span>
                        <span>/</span>
                        <span className="text-foreground font-medium">Item Category</span>
                    </div>
                </div>
            </header>
            <div className="p-4 space-y-4">
                <div className='ps-3'>
                    <h1 className="text-3xl font-bold text-gray-900">Item Category</h1>
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
                                        columns={subItemCategoryColumns}
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
                            onOpenChange={
                                (open) => {
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
                                    {getFieldsByNames(['name', 'code', 'unitofmeasure', 'description']).map((field) => {
                                        return <div className="flex items-center space-x-2">
                                            {renderField(field)}
                                        </div>;
                                    })}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <ReusableButton
                                        variant="default"
                                        onClick={() => { setIsMainDialogOpen(false); setSubRecID(null); handleCancel() }}
                                    >
                                        Cancel
                                    </ReusableButton>
                                    <ReusableButton
                                        htmlType="submit"
                                        variant="primary"
                                        className="bg-orange-500 hover:bg-orange-600 border-orange-500"
                                        onClick={(e) => { handleSubmit(() => submit(e, true))(e) }}
                                    >
                                        {recordToEditId !== null ? "Update" : "Save"}
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
                                <h4>{`Are you sure want to delete ${mainDelRec?.CategoryName} MainCategory`}</h4>
                                <div className="flex justify-end gap-2">
                                    <ReusableButton onClick={() => setIsMainDelOpen(false)}>
                                        Cancel
                                    </ReusableButton>
                                    <ReusableButton variant="primary" onClick={() => handleMainDelete(recordToEditId, companyId, '')}>
                                        Delete
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
                                {getFieldsByNames(['subunitofmeasure', 'subname', 'subcode', 'subdescription']).map(renderField)}
                            </div>
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
                                <h4>{`Are you sure want to delete ${subRecord?.CategoryName} SubCategory`}</h4>
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
    );
};

export default ItemCategory;

