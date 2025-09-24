import { Card, CardContent, CardTitle } from '@/components/ui/card';
import ReusableTable, { TableAction, TablePermissions } from '@/components/ui/reusable-table';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Button } from '@/components/ui/button';
import { Activity, CheckCircle, Clock4, Edit, Monitor, Package, Plus, Search, Trash2, Users } from 'lucide-react';
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
import { USAGE_TRACKING_DB } from '@/Local_DB/Form_JSON_Data/UsageTrackingDB';
import ReusableRangePicker from '@/components/ui/reusable-range-picker';
import { Badge } from '@/components/ui/badge';

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

const SoftwareDataColumns = [
  { id: 'Employee', accessorKey: "Employee", header: "Employee" },
  { id: 'DeviceId', accessorKey: "DeviceId", header: "device Id" },
  { id: 'UsageDuration', accessorKey: "UsageDuration", header: "Usage Duration" },
  { id: 'Status', accessorKey: "Status", header: "Status" },
  { id: 'DailyUsage', accessorKey: "Daily Usage", header: "Daily Usage" },
  { id: 'LastUsed', accessorKey: "LastUsed", header: "Last Used" },
  { id: 'Compliance', accessorKey: "Compliance", header: "Compliance" },
]
const cardData = [
  {
    label: 'Total Sessions',
    value: "1,234",
  },
  {
    label: 'Avg Daily Usage',
    value: "6.2h",
  },
  {
    label: 'Active Users',
    value: "87",
  },
  {
    label: 'Compliance Rate',
    value: "94%",
  },
]

const icons = [<Activity className="h-4 w-4 sm:h-5 sm:w-5 lg:h-8 lg:w-8 text-[#435dad]" strokeWidth={3} />,
<Clock4 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-8 lg:w-8 text-[#22c55e]" strokeWidth={3} />,
<Monitor className="h-4 w-4 sm:h-5 sm:w-5 lg:h-8 lg:w-8 text-[#3b82f6]" strokeWidth={3} />]

const UsageTracking = () => {
  const [columns, setColumns] = useState<ColumnDef<SoftwareData>[]>(SoftwareDataColumns);
  const [fields, setFields] = useState<BaseField[]>(USAGE_TRACKING_DB);
  const { toast } = useToast();
  const [cardNamesArray, setCardNamesArray] = useState(cardData)

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
      case 'rangepicker':
        return (
          <Controller
            key={name}
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: ctrl }) => (
              <ReusableRangePicker
                {...field}
                placeholder={['Start Date', 'End Date']}
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
    canExport: true,
    canAdd: true,
    canManageColumns: true,
  };
  // handle refresh
  const handleRefresh = useCallback(() => {
    toast({ title: "Data Refreshed", description: "All Usage Tracking data has been updated", });
    // fetchAllCustomerList();
  }, [toast]);
  return (
    <div className="h-full overflow-y-scroll bg-gray-50/30">
      <div className="p-4 sm:p-4 space-y-4 sm:space-y-4">
        {/* Header Section */}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {cardNamesArray.map((card, i) => {
            return (
              <Card className="border-0 shadow-sm bg-gradient-to-br">
                <CardContent className="p-3 sm:p-4 lg:p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium  mb-1 text-[#64748b]">{card.label}</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold ">{card.value}</p>
                    </div>
                    <div className="p-2 sm:p-0">
                      {card.label === "Compliance Rate" ? (
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
        <Card>
          <CardContent className="pt-6">
            <div className="">
              <div className="space-y-4">
                <span className='text-2xl font-bold'>Filters</span>
                <div className={`grid xxs:grid-cols-1 xs2:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6`}>
                  {getFieldsByNames(['Software', 'Employee', 'Compliance', 'DateRange']).map((field) => {
                    return <div className="flex-1 items-center space-x-2">
                      {renderField(field)}
                    </div>;
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="bg-white p-6 rounded-lg">
          <ScrollArea className=" w-full ">
            <ReusableTable
              data={[]}
              columns={columns}
              // permissions={""}
              permissions={tablePermissions}
              title="Usage Records"
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

            />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
export default UsageTracking;