import { Card, CardContent, CardTitle } from '@/components/ui/card';
import ReusableTable, { TableAction, TablePermissions } from '@/components/ui/reusable-table';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Button } from '@/components/ui/button';
import { Activity, CircleCheckBig, Clock4, Edit, Monitor, Plus, Search, Shield, Trash2, TriangleAlert } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReusableButton } from '@/components/ui/reusable-button';
import { Input } from '@/components/ui/input';
import { ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { Controller, useForm } from 'react-hook-form';
import ReusableSingleCheckbox from '@/components/ui/reusable-single-checkbox';
import { ReusableMultiSelect } from '@/components/ui/reusable-multi-select';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { ReusableInput } from '@/components/ui/reusable-input';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker';
import { AUDIT_AND_COMPLIANCE_DB } from '@/Local_DB/Form_JSON_Data/ComplianceAndAuditDB';
import { ReusableUpload } from '@/components/ui/reusable-upload';
import { Badge } from '@/components/ui/badge';

interface AuditsComp {
    AuditID: string,
    Auditor: string,
    AuditDate: string,
    Software: string,
    Purchased: string,
    InUse: string,
    Compliance: string
}

const cardData = [
    {
        label: 'Total Audits',
        value: "3",
    },
    {
        label: 'Complaint',
        value: "1h",
    },
    {
        label: 'Non Complaint',
        value: "2",
    },
    {
        label: 'Avg Compliance',
        value: "74%",
    },
]
const icons = [<Shield color="#29279b" strokeWidth={2} size={'48px'} />,
<CircleCheckBig color='#058a14' strokeWidth={2} size={'48px'} />,
<TriangleAlert color='#cf0707' strokeWidth={2} size={'48px'} />
]

const AuditRecordsCols = [
    { id: 'AuditID', accessorKey: "AuditID", header: "Audit ID" },
    { id: 'Auditor', accessorKey: "Auditor", header: "Auditor" },
    { id: 'AuditDate', accessorKey: "AuditDate", header: "AuditDate" },
    { id: 'Software', accessorKey: "Software", header: "Software" },
    { id: 'Purchased', accessorKey: "Purchased", header: "Purchased" },
    { id: 'InUse', accessorKey: "InUse", header: "In Use" },
    { id: 'Compliance', accessorKey: 'Compliance', header: 'Compliance' }
]

const AuditData = [
    {
        AuditID: "987",
        Auditor: "23",
        AuditDate: "Rohit",
        Software: "Security",
        Purchased: "uytghj",
        InUse: "21-09-2025",
        Compliance: "kjuyhtgf"
    }
]
const ComplianceAndAudit = () => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const [columns, setColumns] = useState<ColumnDef<AuditsComp>[]>(AuditRecordsCols);
    const [fields, setFields] = useState<BaseField[]>(AUDIT_AND_COMPLIANCE_DB);
    const [isOpenLicenseCard, setIsOpenLicenseCard] = useState(false);
    const [dataSource, setDataSource] = useState(AuditData);
    const [cardNamesArray, setCardNamesArray] = useState(cardData)

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
            case 'upload':
                return (
                    <Controller
                        key={name}
                        name={name}
                        control={control}
                        rules={validationRules}
                        render={({ field: ctrl }) => (
                            <ReusableUpload
                                {...field}
                                value={ctrl.value}
                                onChange={ctrl.onChange}
                                error={errors[name]?.message as string}
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
    const handleDelete = (data: AuditsComp): void => {
    }
    const handleEdit = (data: AuditsComp): void => {
    }
    const tableActions: TableAction<AuditsComp>[] = [
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
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {cardNamesArray.map((card, i) => {
                        console.log(card);
                        return (
                            <Card className="border-0 shadow-sm bg-gradient-to-br">
                                <CardContent className="p-3 sm:p-4 lg:p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs md:text-sm font-medium  mb-1 text-[#64748b]">{card.label}</p>
                                            <p className="text-lg sm:text-xl lg:text-2xl font-bold ">{card.value}</p>
                                        </div>
                                        <div className="p-2 sm:p-0">
                                            {card.label === "Avg Compliance" ? (
                                                <Badge className='text-[#166534] bg-[#dcfce7]'>Good</Badge>
                                            ) : (
                                                icons[i]
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                        )
                    })}

                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search audit records..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-hsl(214.3 31.8% 91.4%)"
                        />
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <ReusableButton
                            size="small"
                            // variant="primary"
                            className=' flex-1 sm:flex-none bg-primary h-[2.38rem] hover:bg-blue-700 hover:text-white text-white p-4'
                            onClick={() => setIsOpenLicenseCard((prev) => !prev)}>
                            <span className="">New Audit</span>
                        </ReusableButton>
                    </div>
                </div>
                {isOpenLicenseCard &&
                    <Card>
                        <CardContent className="pt-6">
                            <div className="">
                                <div className="space-y-4">
                                    <span className='text-2xl'>Create New Audit Record</span>
                                    <div className={`grid xxs:grid-cols-1 xs2:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6`}>
                                        {getFieldsByNames(['softwarename', 'auditorname', 'auditDate', 'licensepurchased', 'licensesinuse', 'ckbox', 'noncomplianceissues', 'actionstaken']).map((field) => {
                                            return <div className="flex-1 items-center space-x-2">
                                                {renderField(field)}
                                            </div>;
                                        })}
                                    </div>
                                    <div className={`grid xxs:grid-cols-1 xs2:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-6`}>
                                        {getFieldsByNames(['FileUploadURLs']).map((field) => {
                                            return <div className="flex-1 items-center space-x-2">
                                                {renderField(field)}
                                            </div>;
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end mt-6">
                                <ReusableButton
                                    htmlType="button"
                                    variant="default"
                                    // onClick={() => handleReset('')}
                                    iconPosition="left"
                                    size="middle"
                                >
                                    Cancel
                                </ReusableButton>
                                <ReusableButton
                                    htmlType="button"
                                    variant="default"
                                    onClick={null}
                                    iconPosition="left"
                                    size="middle"
                                    className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                                >
                                    Create Audit Record
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
                            title="Audit Records"
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
export default ComplianceAndAudit;