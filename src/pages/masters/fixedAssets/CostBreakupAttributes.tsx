import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, Search, X, Save, Trash2, Edit } from 'lucide-react';
import { ReusableButton } from '@/components/ui/reusable-button';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLoading } from '@/store/slices/projectsSlice';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Controller, useForm } from 'react-hook-form';
import { BaseField, GenericObject, UploadFileInput } from '@/Local_DB/types/types';
import { ReusableInput } from '@/components/ui/reusable-input';
import { useMessage } from '@/components/ui/reusable-message';
import { fileToByteArray } from '@/_Helper_Functions/HelperFunctions';
import axios from 'axios';
import { deleteCostBreakup, editCostBreakup, getCostBreakUpList, postCostBreakup, UpdateCostBreakup } from '@/services/costBreakupAttributesServices';
import { ColumnDef } from '@tanstack/react-table';
import ReusableTable, { TableAction, TablePermissions } from '@/components/ui/reusable-table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FaAngleRight } from 'react-icons/fa';
interface CostBreakupData {
    GroupId: number,
    GroupName: string
}

interface Attributes {
    key: number,
    addOrDeduct: string,
    isMandatory: string,
    attributeName: string,
}

const COST_BREAKUP_DB: BaseField[] = [
    {
        name: 'GroupName',
        label: 'Group Name',
        fieldType: 'text',
        placeholder: 'Enter Group Name',
        isRequired: true,
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    },
]

const defaultRow = {
    key: 1,
    addOrDeduct: 'Add',
    isMandatory: 'Yes',
    attributeName: '',
};



const CostBreakupAttributes = () => {
    const dispatch = useAppDispatch();
    const msg = useMessage();
    const companyId = useAppSelector(state => state.projects.companyId)
    const [dataSource, setDataSource] = useState<CostBreakupData[]>([]);
    const [fields, setFields] = useState<BaseField[]>(COST_BREAKUP_DB);
    const [tableData, setTableData] = useState([defaultRow]);
    const [recordData, setRecordData] = useState(null);
    const [isDelModalOpen, setIsDelModalOpen] = useState(false);
    const [tableRow, setTableRow] = useState(null);
    const [isUsed, setIsUsed] = useState(false);
    const form = useForm<GenericObject>({
        defaultValues: fields.reduce((acc, f) => {
            acc[f.name!] = f.defaultValue ?? '';
            return acc;
        }, {} as GenericObject),
        mode: 'onChange'
    });
    const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrgs = dataSource?.filter(group => {
        const matchesSearch = group?.GroupName.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch;
    });
    const [isInboxCollapsed, setIsInboxCollapsed] = useState(false);

    const fetchCostBreakupList = async (compid) => {
        dispatch(setLoading(true));
        await getCostBreakUpList(compid).then(res => {
            if (res.data && res.success) {
                if (res.data?.length > 0) {
                    setDataSource(res.data)
                }
                else {
                    setDataSource([])
                }
            }
            else {
            }
        }).catch(err => {}).finally(() => {
            dispatch(setLoading(false));
        });
    }
    useEffect(() => {
        if (companyId) {
            fetchCostBreakupList(companyId)
        }
    }, [companyId])

    const handleReset = () => {
        form.reset({ GroupName: '' });
        setTableData([defaultRow]);
        setRecordData(null);
        setIsUsed(false);
    };

    const renderField = (field: BaseField) => {
        const { name, label, fieldType, isRequired, show = true } = field;
        if (!name) {
            return null;
        }
        const validationRules = {
            required: isRequired ? `${label} is Required` : false,
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

    // Define table permissions
    const tablePermissions: TablePermissions = {
        canEdit: true,
        canDelete: true,
        canView: true,
        canExport: true,
        canAdd: true,
        canManageColumns: false,
    };

    function handleChange(val, id, accessorKey) {
        let data = tableData
        data[parseInt(id)][accessorKey] = val
        setTableData(data)
    }

    const handleDelete = (delKey) => {
        if (delKey?.original?.key) {
            const changedTable = tableData.filter(record => record.key !== delKey.original.key);
            setTableData(changedTable.map((item, index) => ({ ...item, key: index + 1 })));
            setIsDelModalOpen(false);
            setTableRow(null);
        }
    };

    const columns: ColumnDef<Attributes>[] = [
        {
            accessorKey: 'key',
            header: 'S. No',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900 text-sm">{row.getValue("key")}</span>
            ),
        },
        {
            accessorKey: 'attributeName',
            header: 'Attribute Name',
            cell: ({ row }) => {
                if (row.original.key === 1) {
                    return (
                        <span className="font-medium text-gray-900 text-sm">Base Purchase Price
                        </span>
                    )
                }
                return (
                    <span>
                        <ReusableInput
                            value={row.original.attributeName}
                            onChange={(e) => handleChange(e.target.value, row.id, "attributeName")}
                            name='attributeName'
                            isRequired={false}
                            className='m-2 me-2  mt-0 bg-white border-2'
                            size='small'
                        ></ReusableInput>

                    </span>
                )

            }
        },

        {
            accessorKey: 'addorDeduct',
            header: 'Add/Deduct',
            cell: ({ row }) => {
                if (row.original.key === 1) {
                    return (
                        <span className="font-medium text-gray-900 text-sm">Add
                        </span>
                    )

                }
                return (
                    <span>
                        <ReusableDropdown
                            containerClassName=" p-2"
                            className='h-8 border-2 '
                            placeholder=" "
                            options={[
                                { label: "Add", value: "Add" }, { label: "Deduct", value: "Deduct" },
                            ]}
                            allowClear={false}
                            defaultValue={row.original.addOrDeduct}
                            onChange={(e) => handleChange(e, row.id, "addOrDeduct")}
                            backgroundColor="white"
                            size={"small"}

                        >

                        </ReusableDropdown>

                    </span>

                )

            }
        },

        {
            accessorKey: 'isMandatory',
            header: 'Is Mandatory',
            cell: ({ row }) => {
                if (row.original.key === 1) {
                    return (
                        <span className="font-medium text-gray-900 text-sm">Yes
                        </span>
                    )
                }
                return (
                    <span>
                        <ReusableDropdown
                            containerClassName=" p-2"
                            className='h-8 border-2 '
                            placeholder=" "
                            options={[
                                { label: "Yes", value: "Yes" }, { label: "No", value: "No" },
                            ]}
                            allowClear={false}
                            defaultValue={row.original.isMandatory}
                            onChange={(e) => handleChange(e, row.id, "isMandatory")}
                            backgroundColor="white"
                            size={"small"}
                        >
                        </ReusableDropdown>
                    </span>
                )
            }
        },

        {
            id: 'actions',
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }: any) => {
                if (row.original.key === 1) {
                    return (
                        <span></span>
                    )
                }
                return (
                    <div className="flex" title='Actions'>
                        {!isUsed && <ReusableButton
                            variant="text"
                            size="small"
                            title='Delete'
                            danger
                            onClick={() => { row?.original.attributeName === "" ? handleDelete(row) : setIsDelModalOpen(true); setTableRow(row) }}
                        >
                            <Trash2 height={18} className='text-red-400'></Trash2>
                        </ReusableButton>}
                    </div>
                )

            },
        },

    ];

    const addRow = () => {
        setTableData([...tableData, { ...defaultRow, key: tableData.length + 1 }]);
    };

    const displayMsg = () => {
        msg.warning('Please Enter Group Name')
    }

    const handleDialog = () => {
    }

    const handleSave = async (data) => {
        const costBreakupItems = tableData.map((record, ind) => {
            if (ind !== 0) {
                return {
                    "AttributeName": record.attributeName,
                    "Addition": record.addOrDeduct,
                    "IsMandatory": record.isMandatory
                }
            }
            else {
                return {
                    "AttributeName": "Base Purchase Price",
                    "Addition": "Add",
                    "IsMandatory": "Yes"
                }
            }
        })
        let payload = {
            "GroupName": data?.GroupName,
            "CostBreakupItems": costBreakupItems
        }

        if (recordData === null) {
            dispatch(setLoading(true));
            await postCostBreakup(companyId, payload).then((res) => {
                if (res.data && res.success) {
                    if (res.data.status === true) {
                        fetchCostBreakupList(companyId)
                        msg.success(res.data.message)
                        handleReset();
                    }
                    else {
                        msg.warning(res.data.message)
                    }

                }
                else {
                }
            }).catch(err => {}).finally(() => {
                dispatch(setLoading(false));
            });
        }
        else {
            dispatch(setLoading(true));
            await UpdateCostBreakup(recordData, payload, companyId).then((res) => {
                if (res.data && res.success) {
                    if (res.data.status === true) {
                        msg.success(res.data.message)
                        fetchCostBreakupList(companyId);
                        handleReset();
                    }
                    else {
                        msg.warning(res.data.message)
                    }
                }
                else {
                    msg.warning('failed to update costbreakup')
                }
            }).catch(err => {}).finally(() => {
                dispatch(setLoading(false));
            });
        }
    }

    const handleEditCostBreakupById = async (groupid, compid) => {
        dispatch(setLoading(true))
        await editCostBreakup(groupid, compid).then((res) => {
            if (res.data && res.success) {
                setIsUsed(res.data[0].IsUsed)
                const attributes = res.data[0]?.CostBreakupAttributes || [];
                if (attributes.length > 0) {
                    const formattedData = attributes.map((item, index) => ({
                        key: index + 1,
                        attributeName: item.AttributeName,
                        addOrDeduct: item.Addition,
                        isMandatory: item.IsMandatory,
                    }));
                    setTableData(formattedData)
                }
                reset({
                    GroupName: res.data[0]?.GroupName
                })
            }
            else {
                msg.warning('failed to fetch details')
            }
        }).catch(err => {}).finally(() => {
            dispatch(setLoading(false));
        });
    }

    useEffect(() => {
        if (recordData && companyId) {
            handleEditCostBreakupById(recordData, companyId)
        }
    }, [recordData, companyId])

    const handleDeleteByApi = async (id, compid) => {
        dispatch(setLoading(true));
        await deleteCostBreakup(id, compid).then((res) => {
            if (res.data && res.success) {
                if (res.data.Status === true) {
                    setIsDelModalOpen(false);
                    msg.success(res.data.Message);
                    fetchCostBreakupList(companyId);
                    handleReset();
                }
                else {
                    msg.warning(res.data.Message)
                }
            }
        }).catch(err => {}).finally(() => {
            dispatch(setLoading(false));
        });
    }

    return (
        <div className="h-full overflow-y-auto  bg-gray-50 flex flex-col ">
            <div className="flex flex-1 overflow-hidden   ">
                {dataSource.length !== 0 && <div className={`
    ${isInboxCollapsed ? 'w-6 p-1' : 'w-64 p-2 mb-2 rounded-b-[5px]'}
   bg-white border border-gray-200 border-t-0 border-t-transparent shadow-xl flex flex-col pb-3 transition-all duration-300 shrink-0
    md:relative
    ${isInboxCollapsed ? 'relative' : 'fixed md:relative'}
    ${isInboxCollapsed ? '' : 'top-15 left-0 h-full z-50 md:top-auto md:left-auto md:h-auto'}
  `}>
                    <div className="pt-1 shrink-0">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className={`font-semibold text-gray-900 ${isInboxCollapsed ? 'hidden' : ''}`}>
                                Cost Breakup Groups ({dataSource.length})
                            </h3>
                            <div onClick={() => setIsInboxCollapsed(!isInboxCollapsed)} className={`cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground  ${isInboxCollapsed ? 'me-2  py-1 ' : 'p-1'}`}>
                                {isInboxCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                            </div>
                        </div>
                        {!isInboxCollapsed && (
                            <div className="space-y-2 pb-1">

                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search Cost Breakup Groups..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {!isInboxCollapsed && (
                        <ScrollArea hideScrollbar={true} className="flex-1 min-h-0 mb-2 truncate max-w-[250px] block">
                            <div className="py-2">
                                {filteredOrgs.map((group) => (
                                    <div
                                        key={group.GroupId}
                                        className={`p-2.5 py-2 rounded-lg mb-2 cursor-pointer transition-all hover:bg-gray-50 
                                       border border-gray-200
                                      `
                                        }
                                        onClick={() => { setRecordData(group.GroupId) }}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs font-medium text-blue-600 me-2 ms-1">{group.GroupName}</span>
                                            <Trash2 height={18} className='text-red-400' onClick={() => { setIsDelModalOpen(true) }}></Trash2>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                    )}
                </div>}

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 ">
                    {/* Navigation and Action Bar */}
                    <div className="px-4 lg:px-6 py-3 flex flex-row xxs:flex-col xs2:flex-row lg:flex-row lg:items-center justify-between gap-4 shrink-0">
                        <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>Masters</span>
                                    <FaAngleRight />
                                    <span>Fixed Assets</span>
                                    <FaAngleRight />
                                    <span className="text-gray-900 font-medium">Cost Breakup Attributes</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <ReusableButton
                                variant="text"
                                size="small"
                                onClick={handleReset}
                                icon={<X className="h-4 w-4" />}
                            >
                                Reset
                            </ReusableButton>
                            <ReusableButton
                                size="small"
                                variant="primary"
                                onClick={() => { handleSubmit(handleSave)() }}
                                icon={<Save className="h-4 w-4" />}
                            >
                                {recordData ? 'Update' : 'Save'}
                            </ReusableButton>
                        </div>
                    </div>

                    {/* Content Grid with Individual Scroll Areas */}
                    <div className="flex-1 p-3 pt-0 overflow-hidden min-h-0  ">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 h-full">
                            {/* Left Column - Main Content */}
                            <div className="lg:col-span-12 flex flex-col  min-h-0 ">
                                <ScrollArea className="flex-1  ">
                                    <div className="space-y-6 pr-1">
                                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                            <CardContent className="pt-6">
                                                <div className="space-y-6">
                                                    <div className='grid md:grid-cols-2 sm:grid-cols-1 gap-x-3 gap-y-3 '>
                                                        {
                                                            fields.map(obj => {
                                                                return (
                                                                    <div key={obj.name}>
                                                                        {renderField(obj)}
                                                                    </div>
                                                                )
                                                            })
                                                        }

                                                    </div>
                                                    <div className='flex justify-end mb-0 mr-2'>
                                                        <ReusableButton
                                                            size="small"
                                                            variant="primary"
                                                            onClick={() => { watch('GroupName') !== "" ? addRow() : displayMsg() }}>
                                                            Add
                                                        </ReusableButton>
                                                    </div>
                                                    <div className='mt-0 p-2'>
                                                        <ReusableTable
                                                            data={tableData}
                                                            columns={columns}
                                                            permissions={tablePermissions}
                                                            title=""
                                                            //    onRefresh={handleRefresh}
                                                            enableSearch={false}
                                                            enableSelection={false}
                                                            enableExport={false}
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
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Delete Confirmation Modal */}
                <Dialog open={isDelModalOpen} onOpenChange={(open) => {
                    if (!open) {
                        handleReset();
                    }
                    setIsDelModalOpen(open);
                }}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Confirm the action</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete {!tableRow ? "Cost Breakup Group" : tableRow?.original?.attributeName}?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <ReusableButton
                                variant="default"
                                onClick={() => { }}
                            >
                                Cancel
                            </ReusableButton>
                            <ReusableButton
                                variant="primary"
                                danger={true}
                                onClick={() => { tableRow !== null ? handleDelete(tableRow) : handleDeleteByApi(recordData, companyId) }}
                            >
                                Delete
                            </ReusableButton>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>

        </div>
    );
};

export default CostBreakupAttributes;