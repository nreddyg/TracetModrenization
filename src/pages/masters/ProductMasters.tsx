import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ReusableInput } from '@/components/ui/reusable-input';
import { useMessage } from '@/components/ui/reusable-message';
import ReusableTable, { TableAction, TablePermissions } from '@/components/ui/reusable-table';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs } from '@/components/ui/tabs';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { addProducts, deleteProducts, editProducts, getProducts, updateProducts } from '@/services/productMasterServices';
import { useAppSelector } from '@/store';
import { setLoading } from '@/store/slices/projectsSlice';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

interface Products {
    id: string;
}

const PRODUCT_DB: BaseField[] = [
    {
        name: 'ProductName',
        label: 'Product Name',
        fieldType: 'text',
        placeholder: 'Enter Product Name',
        isRequired: true,
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    },
]

const ProductMasters = () => {
    const [productList, setProductList] = useState([]);
    const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
    const [fields, setFields] = useState<BaseField[]>(PRODUCT_DB);
    const [isDelModalOpen, setIsDelModalOpen] = useState(false);
    const companyId = useAppSelector(state => state.projects.companyId);
    // const [isEditMode,setIsEditMode]=useState(false);
    const [editingRec,setEditingRec]=useState(null);
    const [deleteRec,setDeleteRec]=useState(null);
    const message=useMessage();
    const dispatch = useDispatch();

    const form = useForm<GenericObject>({
        defaultValues: fields.reduce((acc, f) => {
            acc[f.name!] = f.defaultValue ?? ''
            return acc;
        }, {} as GenericObject),

    });

    const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;


    const handleSubmitForm = async (data: GenericObject): Promise<void> => {
        dispatch(setLoading(true));
        try {
            const payload = [
                {
                  ProductName:data?.ProductName
                }
            ]
            const pay = { ProductMasterDetails: payload };
            let res;

            if (editingRec===null) {
                res = await addProducts(companyId, pay)
            }
            else {
                res=await updateProducts(editingRec?.ProductId,companyId,pay)
            }
            if (res?.success && res.data?.status) {
                message.success(res.data.message);
                getProductMasterList(companyId)
                setIsMainDialogOpen(false);
                setEditingRec(null);
                form.reset();

            } else {
                // console.log(res.data.ErrorDetails[0]["Error Message"],"res")
                message.error(res.data.ErrorDetails[0]["Error Message"]);
            }
        } catch (error) {
            // message.error("Failed to save user group");
        } finally {
            dispatch(setLoading(false))
        }
    };

    const columns: ColumnDef<Products>[] = [
        {
            accessorKey: 'ProductName',
            header: 'Product Name',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue('ProductName')}</span>
            ),
        }
    ];

    const handleEdit=(record:Products)=>{
        setEditingRec(record)
        // setIsEditMode(true);
        setIsMainDialogOpen(true);
    }

    const handleDelete=(delRec:Products)=>{
        setDeleteRec(delRec)
        setIsDelModalOpen(true);
    }

    // Define table actions
    const tableActions: TableAction<Products>[] = [
        {
            label: 'Edit',
            icon: Edit,
            onClick:handleEdit,
            variant: 'default',
        },
        {
            label: 'Delete',
            icon: Trash2,
            onClick: handleDelete,
            variant: 'destructive',
        },
    ];

    // Define table permissions
    const tablePermissions: TablePermissions = {
        canEdit: true,
        canDelete: true,
        canView: true,
        canExport: true,
        canAdd: true,
        canManageColumns: false,
    };


    const renderField = (field: BaseField) => {
        const { name, label, fieldType, isRequired, show = true } = field;
        if (!name || !show) return null;

        const validationRules = {
            required: isRequired ? `${label} is required` : false,
        };

        switch (fieldType) {
            case 'text':
                return (
                    <Controller
                        key={name}
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
            default:
                return null;
        }
    };

    // Helper function to get fields by names (similar to TicketView)
    const getFieldsByNames = (names: string[]) => fields.filter(f => names.includes(f.name!));

    const getProductMasterList = (compid) => {
        dispatch(setLoading(true));
        getProducts(compid).then((res) => {
            if (res.data && res.data?.length > 0) {
                console.log(res.data, "res")
                setProductList(res.data?.reverse())
            }
            else {
                setProductList([])
            }
        }).catch(err => {
        }).finally(() => {
            dispatch(setLoading(false))
        })
    }

    useEffect(() => {
        if (companyId) {
            getProductMasterList(companyId)
        }
    }, [companyId])

    const getProductById=(id,compid)=>{
        dispatch(setLoading(true))
        editProducts(id,compid).then((res)=>{
            if(res.data && res.success){
                 const details = res.data[0];   
        if (details) {
          reset({
            ProductName: details.ProductName,
          }); 
            }
        }
    }).catch(err => {
        }).finally(() => {
            dispatch(setLoading(false))
        })
    }

    useEffect(()=>{
        if(editingRec!==null && companyId){
            getProductById(editingRec?.ProductId,companyId)
        }
    },[editingRec,companyId])

    const deleteMasterProducts=(id,compid)=>{
        dispatch(setLoading(true))
        deleteProducts(id,compid).then((res)=>{
            if(res.data && res.success){
                if(res.data.status===true){
                    setIsDelModalOpen(false);
                    message.success(res.data.message);
                    getProductMasterList(companyId)
                }
                else{
                    message.warning(res.data.message);
                }

            }
        }).catch(err => {
        }).finally(() => {
            dispatch(setLoading(false))
        })
    }

    return (
        <div className="h-full overflow-y-scroll bg-gray-50/30">
            <header className="bg-card flex justify-between border-b px-6 py-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Masters</span>
                        <span>/</span>
                        <span>Service Maintenance</span>
                        <span>/</span>
                        <span className="text-foreground font-medium">Product Master</span>
                    </div>
                </div>
            </header>
            <div className="p-4 space-y-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Product Master</h1>
                </div>
                <Card className="border-0 shadow-sm mt-2">
                    <CardContent className="pb-2 pt-2">
                        <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 mb-6 pt-2">

                            <ReusableButton
                                variant="primary"
                                icon={<Plus className="h-4 w-4" />}
                                onClick={() => setIsMainDialogOpen(true)}
                            >
                                Add
                            </ReusableButton>
                        </div>
                        <div className='mt-2 p-2'>
                            <ReusableTable
                                data={productList}
                                columns={columns}
                                actions={tableActions}
                                permissions={tablePermissions}
                                title=""
                                //    onRefresh={handleRefresh}
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
                        </div>
                    </CardContent>
                </Card>

                {/* Main Location Dialog */}
                <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingRec===null?'Add':'Update'} New Product</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {getFieldsByNames(['ProductName']).map((field) => (
                                        <div key={field.name}>
                                            {renderField(field)}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <ReusableButton
                                        htmlType="submit"
                                        variant="primary"
                                        // icon={<Save className="h-3 w-3" />}
                                        iconPosition="left"
                                        size="middle"
                                    >
                                        {editingRec===null?'Save':'Update'}
                                    </ReusableButton>
                                    <ReusableButton
                                        htmlType="button"
                                        variant="default"
                                        onClick={() => {setIsMainDialogOpen(false);form.reset() }}
                                        // icon={<X className="h-3 w-3" />}
                                        iconPosition="left"
                                        size="middle"
                                    >
                                        Cancel
                                    </ReusableButton>
                                </div>
                            </form>
                        </Form>

                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <Dialog open={isDelModalOpen} onOpenChange={setIsDelModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Confirm the action</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete Service Locations
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
                                onClick={() => {deleteMasterProducts(deleteRec?.ProductId,companyId)}}
                            >
                                Delete
                            </ReusableButton>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default ProductMasters