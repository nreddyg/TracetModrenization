import { Card, CardContent, CardTitle } from '@/components/ui/card';
import ReusableTable, { TableAction, TablePermissions } from '@/components/ui/reusable-table';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReusableButton } from '@/components/ui/reusable-button';
import { Input } from '@/components/ui/input';
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

interface SoftwareData {
    SoftwareID: Number,
    AssignmentID: string,
    Employee: string,
    Department: string,
    Software: string,
    LicenseKey: string,
    AssignmentDate: string,
    ExpiryDate: string
}

const SoftwareDataColumns = [
    { id: 'AssignmentId', accessorKey: "AssignmentID", header: "Assignment ID" },
    { id: 'Employee', accessorKey: "Employee", header: "Employee" },
    { id: 'Department', accessorKey: "Department", header: "Department" },
    { id: 'Software', accessorKey: "Software", header: "Software" },
    { id: 'Licensekey', accessorKey: "LicenseKey", header: "License Key" },
    { id: 'AssignmentDate', accessorKey: "AssignmentDate", header: "Assignment Date" },
    { id: 'ExpiryDate', accessorKey: "ExpiryDate", header: "Expiry Date" },
]

const data = [
    {
        SoftwareID: 987,
        AssignmentID: "23",
        Employee: "Rohit",
        Department: "Security",
        Software: "Microsoft",
        LicenseKey: "uytghj",
        AssignmentDate: "21-09-2025",
        ExpiryDate: "31-09-2025"
    }
]
const LicenseAssignment = () => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const [columns, setColumns] = useState<ColumnDef<SoftwareData>[]>(SoftwareDataColumns);
    const [fields, setFields] = useState<BaseField[]>(SOFTWARE_DB);
    const [isOpenLicenseCard, setIsOpenLicenseCard] = useState(false);
    const [dataSource, setDataSource] = useState(data);
    const { toast } = useToast();


    const getFieldsByNames = (names: string[]) => {
        return fields.filter(f => names.includes(f.name!));
    }

    const form = useForm<GenericObject>({
        defaultValues: fields.reduce((acc, f) => {
            acc[f.name!] = f.defaultValue ?? '';
            return acc;
        }, {} as GenericObject),
        mode: 'onChange'
    });
    const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;

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
            default:
                return null;
        }
    };
    const handleDelete = (data: SoftwareData): void => {
    }
    const handleEdit = (data: SoftwareData): void => {
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
    // handle refresh
    const handleRefresh = useCallback(() => {
        toast({ title: "Data Refreshed", description: "All users data has been updated", });
        // fetchAllCustomerList();
    }, [toast]);
    return (
        <div className="h-full overflow-y-scroll bg-gray-50/30">
            <div className="p-4 sm:p-4 space-y-4 sm:space-y-4">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search tickets..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-hsl(214.3 31.8% 91.4%)"
                        />
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <ReusableButton
                            size="small"
                            // variant="primary"
                            className=' flex-1 sm:flex-none bg-primary h-[2.38rem] text-white p-4'
                            onClick={() => setIsOpenLicenseCard((prev) => !prev)}>
                            <span className="">Assign License</span>
                        </ReusableButton>
                    </div>
                </div>
                { isOpenLicenseCard &&
                <Card>
                    <CardContent className="pt-6">
                        <div className="">
                            <div className="space-y-4">
                                <span className='text-2xl'>Assign License To Employee</span>
                                <div className={`grid xxs:grid-cols-1 xs2:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6`}>
                                    {getFieldsByNames(['employeeID', 'department', 'software', 'assignmentDate']).map((field) => {
                                        return <div className="flex-1 items-center space-x-2">
                                            {renderField(field)}
                                        </div>;
                                    })}
                                </div>
                                <div className={`grid xxs:grid-cols-1 xs2:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-6`}>
                                    {getFieldsByNames(['description']).map((field) => {
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
                                onClick={null}
                                iconPosition="left"
                                size="middle"
                                className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                            >
                                {'Save'}
                            </ReusableButton>
                            <ReusableButton
                                htmlType="button"
                                variant="default"
                                // onClick={() => handleReset('')}
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
            </div>
        </div>
    );
}
export default LicenseAssignment;