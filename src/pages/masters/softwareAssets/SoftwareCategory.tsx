import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ReusableInput } from '@/components/ui/reusable-input';
import { useMessage } from '@/components/ui/reusable-message';
import ReusableTable, { TablePermissions } from '@/components/ui/reusable-table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GenericObject } from '@/Local_DB/types/types';
import { addOrUpdateSoftwareCategory, deleteCategoryById, getCategoriesList } from '@/services/softwareAssetCategoryServices';
import { useAppSelector } from '@/store';
import { setLoading } from '@/store/slices/projectsSlice';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { FaAngleRight } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

interface Category {
    id: string;
}
const SoftwareCategory = () => {
    const message = useMessage();
    const dispatch = useDispatch();
    const [dataSource, setDataSource] = useState([]);
    const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
    const [isDelModalOpen, setIsDelModalOpen] = useState(false);
    const companyId = useAppSelector(state => state.projects.companyId);
    const [editingRec, setEditingRec] = useState(null);
    const [deleteRec, setDeleteRec] = useState(null);
    const form = useForm<GenericObject>({
        defaultValues: {
            CategoryName: ''
        }
    });
    const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = form;
    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: 'CategoryName',
            header: 'Category Name',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue('CategoryName')}</span>
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
                        onClick={() => { handleEdit(row?.original) }}
                    >
                        <Edit className="h-4 w-4 text-blue-600" />
                    </ReusableButton>
                    <ReusableButton
                        variant="text"
                        size="small"
                        title='Delete'
                        danger
                        onClick={() => { handleDelete(row?.original) }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </ReusableButton>
                </div>
            ),
        },
    ];
    useEffect(() => {
        if (companyId) {
            getCategoriesData()
        }
    }, [companyId])
    useEffect(() => {
        if (editingRec && companyId) {
            getCategoriesData(editingRec?.CategoryId)
        }
    }, [editingRec, companyId])
    const handleSubmitForm = async (data: GenericObject): Promise<void> => {
        dispatch(setLoading(true));
        try {
            const payload = [
                {
                    CategoryName: data?.CategoryName,
                    CategoryId: editingRec ? editingRec?.CategoryId : ''
                }
            ]
            const pay = { Categories: payload };
            const res = await addOrUpdateSoftwareCategory(companyId, pay);
            if (res?.success && res.data?.status) {
                message.success(res.data.message);
                getCategoriesData()
                setIsMainDialogOpen(false);
                setEditingRec(null);
                setValue('CategoryName', '')
            } else {
                message.error(res.data.ErrorDetails[0]["Error Message"]);
            }
        } catch (error) { } finally {
            dispatch(setLoading(false))
        }
    };
    const handleEdit = (record: Category) => {
        setEditingRec(record)
        setIsMainDialogOpen(true);
    }
    const handleDelete = (delRec: Category) => {
        setDeleteRec(delRec)
        setIsDelModalOpen(true);
    }
    const getCategoriesData = async (id?: number) => {
        dispatch(setLoading(true));
        try {
            const res = await getCategoriesList(companyId, id);
            if (res.data && Array.isArray(res.data) && res.data?.length > 0) {
                if (id) setValue('CategoryName', res.data[0]?.CategoryName || '')
                else setDataSource(res.data?.reverse())
            } else {
                if (id) setValue('CategoryName', '')
                else setDataSource([])
            }
        } catch { } finally {
            dispatch(setLoading(false))
        }
    }
    const deleteCategory = async () => {
        dispatch(setLoading(true))
        try {
            const res = await deleteCategoryById(companyId, deleteRec?.CategoryId);
            console.log('res', res)
            if (res.data && res.success) {
                if (res.data.status === true) {
                    setIsDelModalOpen(false);
                    message.success(res.data.message);
                    getCategoriesData()
                }
                else {
                    message.warning(res.data.message);
                }
            }
        } catch { } finally { dispatch(setLoading(false)) }
    }
    const handleDialogToggle = (open: boolean) => {
        setIsMainDialogOpen(open);
        if (!open) {
            setEditingRec(null);
            form.reset();
        }
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
    return (
        <ScrollArea>
            <div className="h-full">
                <div className="p-4 sm:p-4 space-y-4 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Masters</span>
                                <FaAngleRight />
                                <span>Software Assets</span>
                                <FaAngleRight />
                                <span className="text-gray-900 font-medium">Software Category</span>
                            </div>
                        </div>
                        <ReusableButton
                            variant="primary"
                            icon={<Plus className="h-4 w-4" />}
                            onClick={() => { setIsMainDialogOpen(true); }}
                            className='btn-submit-style  mt-2 me-2'
                        >
                            Add
                        </ReusableButton>
                    </div>
                    <div className='border bg-white rounded-lg pb-5 pt-2'>
                        <ReusableTable
                            data={dataSource}
                            columns={columns}
                            permissions={tablePermissions}
                            title="Software Category"
                            enableSearch={false}
                            enableSelection={false}
                            enableExport={true}
                            enableColumnVisibility={true}
                            enablePagination={true}
                            enableSorting={true}
                            enableFiltering={true}
                            pageSize={10}
                            emptyMessage="No Software Categories Found !!"
                            rowHeight="normal"
                            storageKey="software-category-table"
                        />
                    </div>
                    <Dialog open={isMainDialogOpen} onOpenChange={handleDialogToggle}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingRec ? 'Update' : 'Add New'} Category</DialogTitle>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Controller
                                            key={'CategoryName'}
                                            name={'CategoryName'}
                                            control={control}
                                            rules={{ required: 'Category Name is required' }}
                                            render={({ field: ctrl }) => (
                                                <ReusableInput
                                                    label='Category Name'
                                                    value={ctrl.value}
                                                    onChange={ctrl.onChange}
                                                    error={errors['CategoryName']?.message as string}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                    
                                        <ReusableButton
                                            htmlType="button"
                                            variant="text"
                                            className='btn-reset-clear-style'
                                            onClick={() => { setIsMainDialogOpen(false); reset(); setEditingRec(null) }}
                                            iconPosition="left"
                                            size="middle"
                                        >
                                            Cancel
                                        </ReusableButton>
                                            <ReusableButton
                                            htmlType="submit"
                                            variant="primary"
                                            className='btn-submit-style'
                                            iconPosition="left"
                                            size="middle"
                                        >
                                            {editingRec ? 'Update' : 'Save'}
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
                                    Are you sure you want to delete this Category ?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <ReusableButton
                                    variant="text"
                                    className='btn-reset-clear-style'
                                    onClick={() => setIsDelModalOpen(false)}
                                >
                                    Cancel
                                </ReusableButton>
                                <ReusableButton
                                    variant="primary"
                                    danger={true}
                                    onClick={deleteCategory}
                                >
                                    Delete
                                </ReusableButton>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </ScrollArea>
    )
}
export default SoftwareCategory