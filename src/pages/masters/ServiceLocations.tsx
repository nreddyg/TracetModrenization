import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReusableButton } from '@/components/ui/reusable-button';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableTable, TableAction, TablePermissions } from '@/components/ui/reusable-table';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ColumnDef } from '@tanstack/react-table';
import { getServiceLocationData, postServiceLocationData } from '@/services/serviceLocationServices';
import { useAppSelector } from '@/store';
import { setLoading } from '@/store/slices/projectsSlice';
import { useDispatch } from 'react-redux';
import {SERVICE_LOCATION_DB } from '@/Local_DB/Form_JSON_Data/serviceLocationsDB';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { Controller, useForm } from 'react-hook-form';
import { Form, } from '@/components/ui/form';
import { useMessage } from '@/components/ui/reusable-message';

interface MainLocation {
    name: string;
}

interface SubLocation {
    id: string;
    name: string;
    mainLocationId: string;
}

const ServiceLocations = () => {
    const [activeTab, setActiveTab] = useState('main');
    console.log(activeTab,"35")
    const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
    const [isSubDialogOpen, setIsSubDialogOpen] = useState(false);
    const [subLocationName, setSubLocationName] = useState('');
    const companyId = useAppSelector(state => state.projects.companyId);
    const [mainLocations, setMainLocations] = useState([]);
    const [subLocations, setSubLocations] = useState([]);
    const [fields, setFields] = useState<BaseField[]>(SERVICE_LOCATION_DB);
    // const [mainDrop, setMainDrop] = useState(MAIN_LOCATION_DROPDOWN);
    const dispatch = useDispatch();
    const [isEditMode, setIsEditMode] = useState(false);
    const message = useMessage();

    const form = useForm<GenericObject>({
        defaultValues: fields.reduce((acc, f) => {
            acc[f.name!] = f.defaultValue ?? ''
            return acc;
        }, {} as GenericObject),

    });


    const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;
    

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

            default:
                return null;
        }
    };

    // Helper function to get fields by names (similar to TicketView)
    const getFieldsByNames = (names: string[]) => fields.filter(f => names.includes(f.name!));


    const mainLocationColumns: ColumnDef<MainLocation>[] = [
        {
            accessorKey: 'LocationName',
            header: 'Name',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue('LocationName')}</span>
            ),
        }
    ]

    const subLocationColumns: ColumnDef<SubLocation>[] = [
        {
            accessorKey: 'LocationName',
            header: 'Name',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue('LocationName')}</span>
            ),
        }
    ];

    const handleEdit = () => {
        setIsMainDialogOpen(true);
        setIsEditMode(true);
    }

    // Define table permissions
    const tablePermissions: TablePermissions = {
        canEdit: true,
        canDelete: true,
        canView: true,
        canExport: true,
        canAdd: true,
        canManageColumns: false,
    };

    // Define table actions
    const tableActions: TableAction<MainLocation>[] = [
        {
            label: 'Edit',
            icon: Edit,
            onClick: handleEdit,
            variant: 'default',
        },
        {
            label: 'Delete',
            icon: Trash2,
            onClick: () => { },
            variant: 'destructive',
        },
    ];

    const tableActions2: TableAction<SubLocation>[] = [
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

    const getServiceLocationList = (compid) => {
        dispatch(setLoading(true));
        getServiceLocationData(compid).then((res) => {
            if (res.data && res.data?.length > 0) {
                const mainList = res.data.filter((rec) => rec.Parent === '#')
                const sublist = res.data.filter((rec) => rec.Parent !== '#')
                setMainLocations(mainList)
                setSubLocations(sublist);
                if (mainList.length > 0) {
                    const options = mainList.map((main: any) => ({
                        label: main?.LocationName,
                        value: main?.id,
                    }));
                    setFields((prev) =>
                        prev.map((f) =>
                            f.name === "SelectMainLocation" ? { ...f, options } : f
                        )
                    );
                }
            }
            else {
                setMainLocations([])
            }
        }).catch(err => {
        }).finally(() => {
            dispatch(setLoading(false))
        })
    }

    useEffect(() => {
        if (companyId) {
            getServiceLocationList(companyId)
        }
    }, [companyId])

    const handleSubmitForm = async (data: GenericObject): Promise<void> => {
        dispatch(setLoading(true));
        try {
            const payload = [
                {
                    "MainLocationName": data.LocationName,
                    "SubLocationName": ""
                }
            ]
            const pay = { ServiceMaintenanceLocationsDetails: payload };
            let res;

            if (!isEditMode) {
                res = await postServiceLocationData(companyId, pay)
            }
            else {
                console.log("update")
            }
            if (res?.success && res.data?.Status) {
                getServiceLocationList(companyId)
                setIsMainDialogOpen(false);
                message.success(res.data.Message);

            } else {
                // console.log(res.data.ErrorDetails[0]["Error Message"],"res")
                message.error(res.data.ErrorDetails[0]["Error Message"]);
            }
        } catch (error) {
            message.error("Failed to save user group");
        } finally {
            dispatch(setLoading(false))
        }
    };

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
                        <span className="text-foreground font-medium">Service Locations</span>
                    </div>
                </div>
            </header>
            <div className="p-4 space-y-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Service Maintenance Locations</h1>
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
                                    <ReusableButton
                                        variant="primary"
                                        icon={<Plus className="h-4 w-4" />}
                                        onClick={()=> setIsMainDialogOpen(true)}
                                    >
                                        Add
                                    </ReusableButton>
                                </div>
                                <TabsContent value="main" className="space-y-4">
                                    <ReusableTable
                                        data={mainLocations}
                                        columns={mainLocationColumns}
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
                                </TabsContent>

                                <TabsContent value="sub" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                                        {getFieldsByNames(['SelectMainLocation']).map((field) => (
                                            <div key={field.name} className='flex items-center'>
                                                <Label className={"text-sm font-medium text-slate-700 mt-1 w-[300px]"}>Select Main locations</Label>
                                                {renderField(field)}
                                            </div>
                                        ))}

                                    </div>
                                    <ReusableTable
                                        data={subLocations}
                                        columns={subLocationColumns}
                                        actions={tableActions2}
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
                                </TabsContent>
                            </Tabs>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                    </CardContent>
                </Card>

                {/* Main Location Dialog */}
                <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{activeTab==='main'?'Add Main Location':'Add Sub Location'}</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {getFieldsByNames(['LocationName']).map((field) => (
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
                                        Save
                                    </ReusableButton>
                                    <ReusableButton
                                        htmlType="button"
                                        variant="default"
                                        onClick={() => { }}
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
                {/* Sub Location Dialog */}
                {/* <Dialog open={isSubDialogOpen} onOpenChange={setIsSubDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Sub Location</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                           {getFieldsByNames(['LocationName']).map((field) => (
                                        <div key={field.name}>
                                            {renderField(field)}
                                        </div>
                                    ))}
                            <div className="flex justify-end gap-2">
                                <ReusableButton onClick={() => setIsSubDialogOpen(false)}>
                                    Cancel
                                </ReusableButton>
                                <ReusableButton variant="primary" onClick={() => { }}>
                                    Save
                                </ReusableButton>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog> */}
            </div>
        </div>
    );
};
export default ServiceLocations;
