import { Card, CardContent } from '@/components/ui/card';
import ReusableTable, { TableAction, TablePermissions } from '@/components/ui/reusable-table';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';
import { SOFTWARE_DB } from '@/Local_DB/Form_JSON_Data/LicenseAssignmentDB';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { Controller, useForm } from 'react-hook-form';
import ReusableSingleCheckbox from '@/components/ui/reusable-single-checkbox';
import { ReusableMultiSelect } from '@/components/ui/reusable-multi-select';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableInput } from '@/components/ui/reusable-input';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import { addOrUpdateLicenseAssignment, deleteLicenseAssignmentById, getLicenseAssigmentsList } from '@/services/licenseAssignmentServices';
import { useAppDispatch, useAppSelector } from '@/store';
import { GetServiceRequestAssignToLookups } from '@/services/ticketServices';
import { getDepartment } from '@/services/servicedeskReportsServices';
import { getSoftwaresList } from '@/services/assetRegistryServices';
import { setLoading } from '@/store/slices/projectsSlice';
import { useMessage } from '@/components/ui/reusable-message';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { formatDate, formatDateToDDMMYYYY } from '@/_Helper_Functions/HelperFunctions';

interface SoftwareData {
    LicenseAssignmentId: Number,
    EmployeeName: string,
    DepartmentName: string,
    DepartmentId?: string,
    SoftwareName: string,
    LicenseKey: string,
    LicenseKeyId?: string,
    AssignmentDate: string,
    ExpiryDate: string,
    Status: string
}

const LicenseAssignment = () => {
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    const msg = useMessage();
    const companyId = useAppSelector(state => state.projects.companyId);
    const branch = useAppSelector(state => state.projects.branch);
    const lastLevelsData = useAppSelector(state => state.projects.lastLevelsData);
    const [columns, setColumns] = useState<ColumnDef<SoftwareData>[]>([
        { id: 'AssignmentId', accessorKey: "LicenseAssignmentId", header: "Assignment ID" },
        { id: 'Employee', accessorKey: "EmployeeName", header: "Employee" },
        { id: 'Department', accessorKey: "DepartmentName", header: "Department" },
        { id: 'Software', accessorKey: "SoftwareName", header: "Software" },
        { id: 'Licensekey', accessorKey: "LicenseKey", header: "License Key" },
        { id: 'AssignmentDate', accessorKey: "AssignmentDate", header: "Assignment Date" },
        { id: 'ExpiryDate', accessorKey: "ExpiryDate", header: "License Expiry Date" },
        { id: 'Status', accessorKey: 'Status', header: 'Status' }
    ]);
    const [fields, setFields] = useState<BaseField[]>(SOFTWARE_DB);
    const [isOpenLicenseCard, setIsOpenLicenseCard] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [softwaresData, setSoftwaresData] = useState([])
    const [editingRecord, setEditingRecord] = useState<SoftwareData | null>(null);
    const [deletingRecord, setDeletingRecord] = useState<SoftwareData | null>(null);
    const [isDelModalOpen, setIsDelModalOpen] = useState(false);

    const form = useForm<GenericObject>({
        defaultValues: fields.reduce((acc, f) => {
            acc[f.name!] = f.defaultValue ?? '';
            return acc;
        }, {} as GenericObject),
    });

    const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;


    useEffect(() => {
        if (companyId && branch) {
            fetchAllLookups()
            fetchAllLicenseAssignments()
        }
    }, [companyId, branch])

    useEffect(() => {
        if (watch('SoftwareId') && companyId) {
            async function fetchSoftwareLicenses() {
                const softwareId = watch('SoftwareId');
                dispatch(setLoading(true));
                await getSoftwaresList(companyId, softwareId).then(res => {
                    let licenseOptions = []
                    if (res.success && Array.isArray(res.data) && res.data?.length > 0) {
                        if (res.data[0].LicenseDetails && Array.isArray(res.data[0].LicenseDetails) && res.data[0].LicenseDetails?.length > 0) {
                            licenseOptions = res.data[0].LicenseDetails.filter(k => !k.LicenseAssignToId && k.Status === "Active").map(ele => ({ label: ele.LicenseKey, value: ele.LicenseDetailId }));
                            setLookupsDataInJson({ LicenseKeyId: licenseOptions })
                        }
                    }
                    setLookupsDataInJson({ LicenseKeyId: licenseOptions })
                }).catch(err => { }).finally(() => { dispatch(setLoading(false)); })
            }
            fetchSoftwareLicenses();
        } else {
            setLookupsDataInJson({ LicenseKeyId: [] })
        }
    }, [watch('SoftwareId'), companyId])
    //store lookup data in json
    function setLookupsDataInJson(lookupData: any) {
        let keys = Object.keys(lookupData);
        let fieldsCopy = structuredClone(fields);
        keys.forEach(key => {
            let index = fieldsCopy.findIndex(f => f.name === key);
            if (index !== -1) {
                fieldsCopy[index].options = lookupData[key]
            }
        })
        setFields(fieldsCopy);
    }
    // fetch all lookups
    async function fetchAllLookups() {
        dispatch(setLoading(true));
        try {
            const [users, departments, softwares] = await Promise.allSettled([
                GetServiceRequestAssignToLookups(companyId, branch),
                getDepartment(companyId), getSoftwaresList(companyId)
            ]);
            let responses = {
                EmployeeId: users.status === 'fulfilled' && users.value.success ? users.value.data?.ServiceRequestAssignToUsersLookup.map((user: any) => ({ label: user.UserName, value: user.UserId })) : [],
                DepartmentId: departments.status === 'fulfilled' && departments.value.success ? departments.value.data?.filter(ele => ele.type == lastLevelsData?.DepartmentId).map((dept: any) => ({ label: dept.text, value: dept.id })) : [],
                SoftwareId: softwares.status === 'fulfilled' && softwares.value.success && softwares.value.data.status === undefined ? softwares.value.data?.map((soft: any) => ({ label: soft.SoftwareName, value: soft.SoftwareId })) : [],
            }
            let licensesData = softwares.status === 'fulfilled' && softwares.value.success && softwares.value.data.status === undefined ? softwares.value.data : [];
            setSoftwaresData(licensesData);
            setLookupsDataInJson(responses);
        } catch (err) { } finally { dispatch(setLoading(false)); }
    }
    // fetch all license assignments
    async function fetchAllLicenseAssignments() {
        dispatch(setLoading(true));
        await getLicenseAssigmentsList(companyId).then(res => {
            if (res.success && res.data.status === undefined) {
                setDataSource(res.data.reverse());
            } else {
                setDataSource([]);
                msg.warning('No License Assignments Data Found !!')
            }
        }).catch(err => { }).finally(() => { dispatch(setLoading(false)); })
    }
    // handle save
    const handleSave = async (data: GenericObject) => {
        try {
            dispatch(setLoading(true));
            const licenseKey = fields.find(f => f.name === 'LicenseKeyId')?.options?.find(opt => opt.value == data.LicenseKeyId)?.label || '';
            const selectedLicenseData = softwaresData.find(s => s.SoftwareId === data.SoftwareId)?.LicenseDetails?.find(l => l.LicenseDetailId === data.LicenseKeyId);
            const payload = {
                LicenseAssignment: [
                    {
                        Id: editingRecord?.LicenseAssignmentId ?? '',
                        EmployeeId: data.EmployeeId,
                        EmployeeName: '',
                        DepartmentId: data.DepartmentId,
                        DepartmentName: '',
                        SoftwareId: data.SoftwareId,
                        SoftwareName: '',
                        LicenseKeyId: data.LicenseKeyId,
                        LicenseKey: licenseKey || data.LicenseKey,
                        AssignmentDate: formatDate(data.AssignmentDate, 'DD/MM/YYYY'),
                        ExpiryDate: "12/12/2025",// selectedLicenseData?.LicenseExpiryDate || '12/12/2025',
                        Status: selectedLicenseData?.Status || '',
                        Notes: data.Notes || '',
                    },
                ],
            };
            const res = await addOrUpdateLicenseAssignment(companyId, payload);
            if (res.success && res.data?.status) {
                msg.success(res.data.message || 'License Assignment Successful');
                fetchAllLicenseAssignments();
                form.reset()
            } else {
                msg.warning(res.data?.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('License assignment error:', error);
            msg.error('Failed to assign license.');
        } finally {
            dispatch(setLoading(false));
        }
    };
    // handle refresh
    const handleRefresh = useCallback(() => {
        toast({ title: "Data Refreshed", description: "All License Assignments data has been updated", });
        if(companyId) fetchAllLicenseAssignments();
    }, [toast,companyId]);

    const handleReset = () => {
        form.reset();
        setEditingRecord(null);
        setDeletingRecord(null)
    }
    const handleDelete = (data: SoftwareData): void => {
        setDeletingRecord(data);
        setIsDelModalOpen(true);
    }
    const handleEdit = (data: SoftwareData): void => {
        console.log("first", data)
        setEditingRecord(data);
        let selectedData = { ...data, DepartmentId: data.DepartmentId ? `${data.DepartmentId}` : '' }
        setIsOpenLicenseCard(true);
        Object.keys(selectedData).forEach(key => {
            form.setValue(key, (selectedData as any)[key]);
        });
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
    const tablePermissions: TablePermissions = {
        canEdit: true,
        canDelete: true,
        canView: true,
        canExport: false,
        canAdd: true,
        canManageColumns: true,
    };
    const getFieldsByNames = (names: string[]) => fields.filter(f => names.includes(f.name!))
    const renderField = (field: BaseField) => {
        const { name, label, fieldType, isRequired, validationPattern, patternErrorMessage, show = true } = field;
        let isdisable = editingRecord ? true : false
        if (name === "LicenseKeyId" && editingRecord) {
            return null
        }
        const validationRules = {
            required: isRequired ? `${label} is Required` : false,
            ...(validationPattern && {
                pattern: {
                    value: new RegExp(validationPattern),
                    message: patternErrorMessage || 'Invalid input format'
                }
            }),
        };
        let depLabel = lastLevelsData?.Department

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
                                disabled={isdisable}
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
                                disabled={isdisable}
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
                                disabled={isdisable}
                                onChange={ctrl.onChange}
                                error={errors[name]?.message as string}
                                allowClear
                                {...(name === 'DepartmentId' ? { label: depLabel || label, placeholder: `Select ${depLabel || label}` } : {})}

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
                                    disabled={isdisable}
                                    value={ctrl.value}
                                    onChange={ctrl.onChange}
                                    error={errors[name]?.message as string}
                                />
                            )}
                        />
                    </div>
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
            default:
                return null;
        }
    };
    const callDeleteAPI = async () => {

        setIsDelModalOpen(false)
        try {
            dispatch(setLoading(true))
            const res = await deleteLicenseAssignmentById(companyId, String(deletingRecord?.LicenseAssignmentId))
            if (res.success && res.data.status) {
                msg.success(res.data.message)
                fetchAllLicenseAssignments()
                handleReset()
            } else {
                msg.warning(res?.data?.message || "Unable to Delete")
            }

        } catch {

        } finally {
            dispatch(setLoading(false))
        }

    }
    return (
        <div className="h-full overflow-y-scroll bg-gray-50/30">
            <div className="p-4 sm:p-4 space-y-4 sm:space-y-4">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <ReusableButton
                            size="small"
                            // variant="primary"
                            className=' flex-1 sm:flex-none bg-primary h-[2.38rem] text-white p-4'
                            onClick={() => setIsOpenLicenseCard((prev) => !prev)}>
                            <span className="">
                                {isOpenLicenseCard ? (
                                    <div className='flex items-center gap-2'>
                                        <ArrowLeft className="h-4 w-4 text-current stroke-[3]" /> Grid View
                                    </div>
                                ) : (
                                    'Assign License'
                                )}
                            </span>
                        </ReusableButton>
                    </div>
                </div>
                {isOpenLicenseCard &&
                    <Card>
                        <CardContent className="pt-6">
                            <div className="">
                                <div className="space-y-4">
                                    <span className='text-2xl'>Assign License To Employee</span>
                                    <div className={`grid xxs:grid-cols-1 xs2:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6`}>
                                        {getFieldsByNames(['EmployeeId', 'DepartmentId', 'SoftwareId', 'LicenseKeyId', 'AssignmentDate']).map((field) => {
                                            return (renderField(field))

                                        })}
                                    </div>
                                    <div className={`grid xxs:grid-cols-1 xs2:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-6`}>
                                        {getFieldsByNames(['Notes']).map((field) => {
                                            return <div className="flex-1 items-center space-x-2">
                                                {renderField(field)}
                                            </div>;
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-6">
                                <ReusableButton
                                    htmlType="button"
                                    variant="default"
                                    onClick={handleSubmit((data) => handleSave(data))}
                                    iconPosition="left"
                                    size="middle"
                                    className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                                >
                                    {editingRecord ? 'Update' : 'Save'}
                                </ReusableButton>
                                <ReusableButton
                                    htmlType="button"
                                    variant="default"
                                    onClick={handleReset}
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
                            data={dataSource}
                            columns={columns}
                            permissions={tablePermissions}
                            title="License Assignments"
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
                            rowHeight="normal"
                            storageKey="service-request-type-list-table"
                            actions={tableActions}
                            enableColumnPinning
                        />
                    </ScrollArea>
                </div>
                <Dialog open={isDelModalOpen} onOpenChange={setIsDelModalOpen}>
                    <DialogContent className="sm:max-w-[450px]">
                        <DialogHeader>
                            <DialogTitle>Confirm the action</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this License Assignment to {deletingRecord?.EmployeeName}?

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
                                onClick={callDeleteAPI}
                            >
                                Delete
                            </ReusableButton>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
export default LicenseAssignment;