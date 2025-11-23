import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, Search, X, Save, Trash2, Edit, Plus, Cross, CopyX } from 'lucide-react';
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
import { getUserAttributes } from '@/services/assetCategoryServices';
import ReusableSingleCheckbox from '@/components/ui/reusable-single-checkbox';
import { addNewUserAttribute, deleteUserAttribute, getEditUserAttributeData, updateUserAttribute } from '@/services/userAttributesServices';
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

const USER_ATTRIBUTES_DB: BaseField[] = [
    {
        name: 'GroupName',
        label: 'Group Name',
        fieldType: 'text',
        placeholder: 'Enter Group Name',
        isRequired: true,
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    },
    {
        name: 'AttributeName',
        label: 'Attribute Name',
        fieldType: 'text',
        placeholder: 'Enter AttributeName',
        isRequired: true,
        className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
    },
    {
        label: 'Attribute Type',
        fieldType: 'dropdown',
        name: 'AttributeType',
        placeholder: 'Select AttributeType',
        isRequired: true,
        options: [
            {
                label: "Text",
                value: "Text",
            },
            {
                label: "Date",
                value: "Date",
            },
            {
                label: "Numeric",
                value: "Numeric",
            },
            {
                label: "Dropdown",
                value: "Dropdown"
            },
            {
                label: "CheckBox",
                value: "CheckBox"
            },
            {
                label: "RadioButton",
                value: "RadioButton"
            }
        ],
        allowClear: true,
        defaultValue: '',
    },
    {
        name: 'IsMandatory',
        fieldType: 'checkbox',
        label: 'Is Mandatory',
        defaultChecked: false,
    },
    {
        name: 'xmlAttributes',
        label: 'Enter Field',
        fieldType: 'text',
        placeholder: 'Enter AttributeName',
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



const UserAttributes = () => {
    const dispatch = useAppDispatch();
    const msg = useMessage();
    const companyId = useAppSelector(state => state.projects.companyId)
    const [dataSource, setDataSource] = useState([]);
    const [listData, setListData] = useState([]);
    const [attributeList, setAttributeList] = useState([]);
    const [attributeType, setAttributeType] = useState("");
    const [groupName, setGroupName] = useState("")
    const [fields, setFields] = useState<BaseField[]>(USER_ATTRIBUTES_DB);
    const [recordData, setRecordData] = useState(null);
    const [isDelModalOpen, setIsDelModalOpen] = useState(false)
    const [isUsed, setIsUsed] = useState(false);
    const [rec, setRec] = useState(null);
    const [tableDelete,setTableDelete]=useState(null)

    const form = useForm<GenericObject>({
        defaultValues: fields.reduce((acc, f) => {
            acc[f.name!] = f.defaultValue ?? f.defaultChecked ?? '';
            return acc;
        }, {} as GenericObject),
        mode: 'onChange'
    });
    const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrgs = listData?.filter(group => {
        const matchesSearch = group?.GroupName.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch;
    });
    const [isInboxCollapsed, setIsInboxCollapsed] = useState(false);


    const fetchUserAttributesList = async (compid) => {
        dispatch(setLoading(true));
        await getUserAttributes(compid).then(res => {
            if (res.data && res.success) {
                if (res.data?.length > 0) {
                    setListData(res.data)
                }
                else {
                    setListData([])
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
            fetchUserAttributesList(companyId)
        }
    }, [companyId])

    const handleReset = () => {
        form.reset({ GroupName: '' });
        setDataSource([])
        setRec(null)
        setRecordData(null);
        setIsUsed(false);
    };
    const handleDelete = (attributeNameToDelete) => {
        const filteredData = dataSource.filter(
    item =>
      item.AdditionalFieldName !==
      attributeNameToDelete
  );
    setDataSource(filteredData);
                    setIsDelModalOpen(false);
setRec(null)
  msg.success(`${attributeNameToDelete} deleted successfully`);


    }
    const handlePlus = () => {
        const value = watch("xmlAttributes");
         if (!value) {
    msg.warning(`Please enter ${attributeType || "field"} value`);
    return;
  }
        let fieldOptionInd = attributeList.findIndex((o) => o === value)
        if (value !== '' && fieldOptionInd === -1) {
            if (value?.trim().length !== 0) {
                setAttributeList([...attributeList, value?.trimStart().trimEnd()])
                reset({
                    ...form.getValues(),
                    xmlAttributes: ""
                })
            }
            else {
                msg.warning(`Only space is not allowed`);
            }
        } else {
            if (value?.trim().length==0 && (attributeType === "Dropdown" || attributeType === "CheckBox" || attributeType === "RadioButton")) {
                msg.warning(`Please enter ${attributeType} field value`);
            }
            else if (fieldOptionInd !== -1) {
                msg.warning("Field value already exits");

            }
        }



    }
    const getFieldsByNames = (names: string[]) => fields.filter(f => names.includes(f.name!));


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
                                label={((attributeType === "Dropdown" || attributeType === "CheckBox" || attributeType === "RadioButton") && name === "xmlAttributes") ? `Enter ${attributeType} Field ` : label}
                                suffixIcon={((attributeType === "Dropdown" || attributeType === "CheckBox" || attributeType === "RadioButton") && name === "xmlAttributes") ? <Plus className="h-4 w-4" onClick={() => handlePlus()} /> : ""}
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
            case 'checkbox':
                return (
                    <Controller
                        name={name}
                        control={control}
                        render={({ field: ctrl }) => (
                            <div className='flex pt-6'>
                                <ReusableSingleCheckbox
                                    label={label}
                                    onChange={ctrl.onChange}
                                    value={ctrl.value}
                                    className="text-orange-500"
                                    {...field}
                                />
                            </div>
                        )}
                    />
                );
            default:
                return null;
        }
    };

    // Define table permissions
    const tablePermissions: TablePermissions = {
        canEdit: false,
        canDelete: true,
        canView: true,
        canExport: true,
        canAdd: true,
        canManageColumns: false,
    };

    function handleChange(val, id, accessorKey) {

    }
    const handleEdit = (data) => {


        reset({
            ...form.getValues(),
            // GroupName:groupName,
            AttributeName: data.AdditionalFieldName,
            AttributeType: data.ControlName,
            IsMandatory: (data.IsMandatory == "true" || data.IsMandatory == true) ? true : false
        })
        setAttributeList(ConvertStringToArray(data.XmlFieldData))



    }



    const columns: ColumnDef<Attributes>[] = [
        {
            id: "AdditionalFieldName",
            accessorKey: 'AdditionalFieldName',
            header: 'Attribute Name',

        },
        {
            id: "ControlName",
            accessorKey: 'ControlName',
            header: 'Attribute Type',

        },


        {
            id: "IsMandatory",
            accessorKey: 'IsMandatory',
            header: 'Is Mandatory',

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
                        onClick={() => { handleEdit(row.original); setRec(row.original) }}
                    >
                        <Edit className="h-4 w-4 text-blue-600" />
                    </ReusableButton>
                    <ReusableButton
                        variant="text"
                        size="small"
                        danger
                        title='Delete'
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => { setIsDelModalOpen(true);setTableDelete(true) ;setRec(row.original)}}
                    >
                        <Trash2 className="h-4 w-4" />
                    </ReusableButton>
                </div>
            ),
        },

    ];



    const displayMsg = () => {
        msg.warning('Please Enter Group Name')
    }

    const handleDialog = () => {
    }

    const handleSave = async () => {
        if (!watch("GroupName")) {
            msg.warning("Group Name is Required")
            return
        }
        if (watch("GroupName") && dataSource.length == 0) {
            msg.warning("Please Add Atleast One Attribute")
            return
        }

        if (!recordData) {
            const updatedDataSource = dataSource.map(({ ["AdditionalFieldId"]: a, ["ControlTypeId"]: b, ...rest }) => ({ ...rest }));
            var pay = {
                GroupName: watch("GroupName"),
                ListOfUserAttributes: updatedDataSource
            };
            //   setIsRender(false);
            if (dataSource.length > 0) {
                dispatch(setLoading(true));
                await addNewUserAttribute(companyId, pay)
                    .then((res) => {
                        if (res.data.status !== undefined) {
                            if (res.data.status === true) {
                                msg.success(res.data.message);
                                //   getList();
                                handleReset();
                            }
                            else {
                                msg.warning(res.data.message);
                            }
                        } else {
                            msg.warning(res.data.message);

                        }
                    })
                    .catch((err) => {
                        // TracetMessage("error", "65vh", "Failed to Delete Asset Category", "assetcategoryadd");
                    })
                    .finally(() => {
                        dispatch(setLoading(false));
                        //   setIsRender(true);
                    });
            }
            else {
                //  setIsRender(true);
                // getList();
                msg.warning("Group should contain atleast one Attribute")
            }
        }

        if (recordData && companyId) {
            const updatedDataSource = dataSource.map(({ ["AdditionalFieldId"]: a, ["ControlTypeId"]: b, ...rest }) => ({ ...rest }));
            var updatePay = {
                GroupId: recordData,
                GroupName: watch("GroupName"),
                ListOfUserAttributes: updatedDataSource
            };
            //   setIsRender(false);
            dispatch(setLoading(true));
            await updateUserAttribute(companyId, recordData, updatePay)
                .then((res) => {
                    if (res.data.status !== undefined) {
                        if (res.data.status === true) {
                            msg.success(res.data.message);
                            //   getList()
                            handleReset();
                            setAttributeType(null)
                        }
                        else {
                            msg.warning(res.data.message);
                        }
                    } else {
                        msg.warning(res.data.message);

                    }
                })
                .catch((err) => {
                    // TracetMessage("warning", "65vh", "Failed to Update User Attributes", "assetcategoryupdate")
                })
                .finally(() => {
                    dispatch(setLoading(false));
                    //   setIsRender(true);
                });

        }

    }

    const handleEditCostBreakupById = async (compid, groupid) => {
        dispatch(setLoading(true))
        await getEditUserAttributeData(compid, groupid).then((res) => {
            if (res.data && res.success) {
                // setIsUsed(res.data[0].IsUsed)
                const attributes = res.data[0]?.ListOfUserAttributes || [];
                if (attributes.length > 0) {
                    setDataSource(attributes)
                }
                setGroupName(res.data[0]?.GroupName)
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
            handleEditCostBreakupById(companyId, recordData)
        }
    }, [recordData, companyId])
    useEffect(() => {

        setAttributeType(watch("AttributeType"))
    }, [watch("AttributeType")])
    const ConvertStringToArray = (str) => {
        let strArray = []
        if (str) {
            strArray = str.split(',');
        }
        return strArray
    };
    const ConvertArrayToString = (arr) => {
        let str = ""
        if (arr.length > 0) {
            str = arr.join(',');
        }
        return str
    };
    const handleAdd = () => {
        const attributeName = watch("AttributeName")?.trim();
        const attributeType = watch("AttributeType");
        const isMandatory = watch("IsMandatory");

        // Validation
        if (!attributeName) {
            msg.warning("Enter Attribute Name");
            return;
        }
        if (!attributeType) {
            msg.warning("Enter Attribute Type");
            return;
        }


        const attributeNames = dataSource.map(ele => ele.AdditionalFieldName);
        const obj = {
            AdditionalFieldName: attributeName,
            ControlName: attributeType,
            IsMandatory: isMandatory,
            XmlFieldData: ConvertArrayToString(attributeList),
        };

        const resetForm = () => {
            reset({
                ...form.getValues(),
                AttributeName: "",
                AttributeType: "",
                IsMandatory: false,
            });
        };

        // --- UPDATE EXISTING RECORD ---
        if (rec) {
            const newData = dataSource.map(data => {
                const isSameRecord = data.AdditionalFieldId
                    ? data.AdditionalFieldId === rec.AdditionalFieldId
                    : data.key === rec.key;

                if (isSameRecord) {
                    // Check for duplicate in other rows (exclude current)
                    const duplicateExists = dataSource.some(
                        d =>
                            d.AdditionalFieldName.toLowerCase() ===
                            obj.AdditionalFieldName.toLowerCase() &&
                            (d.AdditionalFieldId
                                ? d.AdditionalFieldId !== rec.AdditionalFieldId
                                : d.key !== rec.key)
                    );

                    if (duplicateExists) {
                        msg.warning("Asset Attribute Name already exists");
                        return data; // Don't update
                    }

                    // If attributeType needs attributeList
                    const listRequiredTypes = ["Dropdown", "CheckBox", "RadioButton"];
                    if (
                        listRequiredTypes.includes(obj.ControlName) &&
                        (!attributeList || attributeList.length === 0)
                    ) {
                        msg.warning(`Please enter ${obj.ControlName} Field`);
                        return data;
                    }

                    return { ...data, ...obj };
                }

                return data;
            });

            setDataSource(newData);
            resetForm();
            setRec(null)
            return;
        }

        // --- ADD NEW RECORD ---
        const duplicateExists = attributeNames.some(
            name => name.toLowerCase() === attributeName.toLowerCase()
        );
        if (duplicateExists) {
            msg.warning("Asset Attribute Name already exists");
            return;
        }

        const listRequiredTypes = ["Dropdown", "CheckBox", "RadioButton"];
        if (listRequiredTypes.includes(attributeType)) {
            if (!attributeList || attributeList.length === 0) {
                msg.warning(`Please enter ${attributeType} Field`);
                return;
            }
        }

        // Add to table
        setDataSource([...dataSource, { ...obj, key: dataSource.length }]);
        resetForm();
    };



    const handleRemove = (attrInd) => {
        const newAttributeList = attributeList.filter((att, ind) => ind !== attrInd)
        setAttributeList(newAttributeList)
    }
    const handleDeleteByApi = async (id, compid) => {
        dispatch(setLoading(true));
        await deleteUserAttribute(compid,id,"" ).then((res) => {
            if (res.data && res.success) {
                if (res.data.Status === true) {
                    setIsDelModalOpen(false);
                    msg.success(res.data.Message);
                    fetchUserAttributesList(companyId);
                    handleReset();
                }
                else {
                    msg.warning(res.data.message)
                }
            }
        }).catch(err => {}).finally(() => {
            dispatch(setLoading(false));
        });
    }

    return (
        <div className="h-full overflow-y-auto   bg-gray-50 flex flex-col ">
            <div className="flex flex-1 overflow-hidden   ">
                {/* Left Sidebar - Ticket Inbox */}
                {listData.length !== 0 && <div className={`
    ${isInboxCollapsed ? 'w-6 p-1' : 'w-64 p-2 mb-2 rounded-b-[5px]'}
   bg-white border border-gray-200 border-t-0 border-t-transparent shadow-xl flex flex-col pb-3 transition-all duration-300 shrink-0
    md:relative
    ${isInboxCollapsed ? 'relative' : 'fixed md:relative'}
    ${isInboxCollapsed ? '' : 'top-15 left-0 h-full z-50 md:top-auto md:left-auto md:h-auto'}
  `}>
                    <div className="pt-1 shrink-0">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className={`font-semibold text-gray-900 ${isInboxCollapsed ? 'hidden' : ''}`}>
                                User Attributes ({listData.length})
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
                                        placeholder="Search User Attributes Groups..."
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
                                        onClick={() => { setRecordData(group.GroupId); }}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs font-medium text-blue-600 me-2 ms-1">{group.GroupName}</span>
                                            <Trash2 height={18} className='text-red-400' onClick={() => { setIsDelModalOpen(true);setTableDelete(false) }}></Trash2>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                    )}
                </div>}

                {/* Main Content Area */}
                <ScrollArea className='flex-1 flex flex-col min-w-0 '>
                <div className="">
                    {/* Navigation and Action Bar */}
                    <div className="px-4 lg:px-6 py-3 flex flex-row xxs:flex-col xs2:flex-row lg:flex-row lg:items-center justify-between gap-4 shrink-0">
                        <div className="flex items-start sm:items-center gap-4 lg:gap-6 flex-1 min-w-0">
                             <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                                                              <span>Masters</span>
                                                                <FaAngleRight />
                                                                <span>Fixed Assets</span>
                                                                <FaAngleRight />
                                                                <span className="text-gray-900 font-medium">User Attributes</span>
                                                                </div>
                                                              </div>
                                                    <div className="flex items-center gap-2 self-start sm:self-auto">
                                                             <ReusableButton
                                variant="text"
                                  className='btn-reset-clear-style'
                                // size="small"
                                onClick={handleReset}
                                icon={<X className="h-4 w-4" />}
                                
                            >
                                Reset
                            </ReusableButton>
                            <ReusableButton
                                // size="small"
                                variant="primary"
                                onClick={() => { handleSave() }}
                                icon={<Save className="h-4 w-4" />}
                                 className='btn-submit-style'
                            >
                                {recordData ? 'Update' : 'Save'}
                            </ReusableButton>
                                                    </div>
                       
                    </div>

                    {/* Content Grid with Individual Scroll Areas */}

                    <div className="flex-1 p-3 pt-0 overflow-hidden min-h-0  ">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 h-full">
                            {/* Left Column - Main Content */}
                            <div className="lg:col-span-12 flex flex-col  min-h-0 text-card-foreground bg-card rounded-lg border border-border overflow-hidden  pt-2 ">
                                <ScrollArea scrollStyle={'flex-[0.8] '} className="flex-1  ">
                                    <div className="space-y-6 ">
                                        <Card className="pt-1 p-0 border-0">
                                            <CardContent className="p-0">
                                                <div className=" space-y-2">
                                                    <div className=' px-6 pt-6 grid md:grid-cols-2 sm:grid-cols-1 gap-x-3 gap-y-3 '>
                                                        {getFieldsByNames(['GroupName', 'AttributeName', "AttributeType", "IsMandatory"]).map((field) => {
                                                            return <div className="flex items-center space-x-2">
                                                                {renderField(field)}
                                                            </div>;
                                                        })}
                                                        {(attributeType === "Dropdown" || attributeType === "CheckBox" || attributeType === "RadioButton") && getFieldsByNames(["xmlAttributes"]).map((field) => {
                                                            return <div className="flex items-center space-x-2">
                                                                {renderField(field)}
                                                            </div>;
                                                        })
                                                        }
                                                    </div>
                                                    <div className=" flex gap-1 masterscroll row col-12 ps-3 field-option-block " style={{ maxHeight: "55px", overflowY: "auto" }}>
                                                        {
                                                            (attributeType === "Dropdown" || attributeType === "CheckBox" || attributeType === "RadioButton") && attributeList.map((attr, AttrInd) => {
                                                                return (
                                                                    <span className="flex items-center p-1 col-auto rounded-xl ps-2 pe-1 " style={{ fontSize: "12px", backgroundColor: "#f1f5fa" }} >{attr}<span> <X className="ms-1 fs-6" size={14} style={{ cursor: "pointer" }} onClick={() => { handleRemove(AttrInd) }} /></span></span>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <div className=' flex justify-end mb-0 mr-2'>
                                                        <ReusableButton
                                                            size="small"
                                                            variant="primary"
                                                            className='bg-[#3F50A0] text-white hover:bg-[#3F50A0] hover:text-white'
                                                            onClick={() => { watch('GroupName') !== "" ? handleAdd() : displayMsg() }}>
                                                            Add
                                                        </ReusableButton>
                                                    </div>
                                                    <div className='mt-0 '>
                                                        <ReusableTable
                                                            data={dataSource}
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
                                                            emptyMessage="No user Attributes found"
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
                </ScrollArea >
                {/* Delete Confirmation Modal */}
                <Dialog open={isDelModalOpen} onOpenChange={setIsDelModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Confirm the action</DialogTitle>
                            <DialogDescription>
                                {tableDelete?"Are you sure want to delete Attribute ?":`Are you sure you want to delete User Attribute Group?`}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <ReusableButton
                                   variant="text"
                                className='btn-reset-clear-style'
                                onClick={() => { }}
                            >
                                Cancel
                            </ReusableButton>
                            <ReusableButton
                                variant="primary"
                                danger={true}
                                onClick={() => { tableDelete? handleDelete(rec.AdditionalFieldName) : handleDeleteByApi(recordData, companyId) }}
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

export default UserAttributes;