import { treefunWithParent } from '@/_Helper_Functions/HelperFunctions'
import { Card, CardContent } from '@/components/ui/card'
import { ReusableButton } from '@/components/ui/reusable-button'
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker'
import { ReusableDropdown } from '@/components/ui/reusable-dropdown'
import { ReusableInput } from '@/components/ui/reusable-input'
import { useMessage } from '@/components/ui/reusable-message'
import ReusableMultiSelect from '@/components/ui/reusable-multi-select'
import ReusableSingleCheckbox from '@/components/ui/reusable-single-checkbox'
import { ReusableTextarea } from '@/components/ui/reusable-textarea'
import { TracetTreeSelect } from '@/components/ui/reusable-treeSelect'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ADD_ASSET_DB } from '@/Local_DB/Form_JSON_Data/AddAssetDB'
import { BaseField, GenericObject, Options } from '@/Local_DB/types/types'
import { getAssetAcquistionTypeLookupData, getAssetOwnerLookupData, getAssetTaggableLookupData, getAssignedToUserLookupData, getDepartmentLookupByUser, getDependencyLookupData, getManufacturerLookupData, getSellerLookupData, getWorkingConditionLookupData } from '@/services/assetDetailsServices'
import { getAssetLocationDetals } from '@/services/assetLocationServices'
import { getCostCenterData } from '@/services/costCenterServices'
import { getCategoryList } from '@/services/userServices'
import { useAppDispatch, useAppSelector } from '@/store/reduxStore'
import { setLoading } from '@/store/slices/projectsSlice'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FaAngleRight } from 'react-icons/fa'
import { MultiSelectConfig } from '../masters/ReportsMasters'

function AssetAcquisition() {
    const dispatch = useAppDispatch();
    const msg = useMessage();
    const companyId=useAppSelector(state=>state.projects.companyId);
    const branchName=useAppSelector(state=>state.projects.branch);
    const loggedInUserId=JSON.parse(localStorage.getItem('LoggedInUser'))['UserId'];
    const [fields, setFields] = useState<BaseField[]>(ADD_ASSET_DB);
    const form = useForm<GenericObject>({
        defaultValues: fields.reduce((acc, f) => {
            acc[f.name!] = f.defaultValue ?? f.defaultChecked ?? '';
            return acc;
        }, {} as GenericObject),
        mode: 'onChange'
    });
    const { control, register, handleSubmit, trigger, watch, setValue, getValues, reset, formState: { errors } } = form;

    useEffect(()=>{
        if(companyId && branchName && loggedInUserId) fetchAllLookupsData();
    },[companyId,branchName,loggedInUserId])

    const setLookupsDataInJson = async (dataset: any) => {
        let keys = Object.keys(dataset);
        const updatedFields = fields.map(field => {
            if (keys.includes(field.name)) {
                let { data, isTree, id, idName, assetLocationUnique } = dataset[field.name];
                if (isTree) {
                    let treeData = treefunWithParent(data, id, idName, assetLocationUnique);
                    return { ...field, treeData };
                } else {
                    let isUser=field.name==='EmpId';
                    let isAssetOwner=field.name==='AssetOwner';
                    let options = Array.from(
                        new Map(
                            dataset[field.name].data.map((item: any) => [
                                item[dataset[field.name].value],
                                {
                                    label:isUser || isAssetOwner? `${item.Text} ( ${item.EmpId} )`:item[dataset[field.name].label],
                                    value:isUser? item.EmpId:isAssetOwner?`${item.Text} ( ${item.EmpId} )`:item[dataset[field.name].value],
                                },
                            ])
                        ).values()
                    ) as Options[];
                    return { ...field, options };
                }
            }
            return field;
        });
        setFields(updatedFields);
    }
    // Fetch All Lookups Data
    const fetchAllLookupsData=async()=>{
        dispatch(setLoading(true));
        try{
            const [acqList,wcList,depList,atList,mcList,sellerList,manufacturerList,usersList,aoList,alList,deptList,ccList] = await Promise.allSettled(
                [
                    getAssetAcquistionTypeLookupData(companyId),getWorkingConditionLookupData(companyId),
                    getDependencyLookupData(companyId),getAssetTaggableLookupData(companyId),
                    getCategoryList(companyId),getSellerLookupData(companyId),
                    getManufacturerLookupData(companyId),getAssignedToUserLookupData(companyId),
                    getAssetOwnerLookupData(companyId),getAssetLocationDetals(companyId, branchName),
                    getDepartmentLookupByUser(companyId,loggedInUserId),getCostCenterData(companyId)
                ]
            )
            const allResponses={
                AcquisitionType:{data:acqList.status==='fulfilled' && acqList.value.data && acqList.value.data.AcqusitionTypeLookup && acqList.value.data.AcqusitionTypeLookup.length>0 ? acqList.value.data.AcqusitionTypeLookup : [],label:'Name',value:'Name',isTree:false},
                WorkingStatus:{data:wcList.status==='fulfilled' && wcList.value.data && wcList.value.data.WorkingConditionLookup && wcList.value.data.WorkingConditionLookup.length>0 ? wcList.value.data.WorkingConditionLookup : [],label:'Name',value:'Name',isTree:false},
                DependencyType:{data:depList.status==='fulfilled' && depList.value.data && depList.value.data.DepandencyTypeLookup && depList.value.data.DepandencyTypeLookup.length>0 ? depList.value.data.DepandencyTypeLookup : [],label:'Name',value:'Name',isTree:false},
                IsAssetTagable:{data:atList.status==='fulfilled' && atList.value.data && atList.value.data.IsAssetTaggableLookup && atList.value.data.IsAssetTaggableLookup.length>0 ? atList.value.data.IsAssetTaggableLookup : [],label:'Name',value:'Name',isTree:false},
                MainCategory:{data:mcList.status==='fulfilled' && mcList.value.data && mcList.value.data.CategoriesLookup && mcList.value.data.CategoriesLookup.length>0 ? mcList.value.data.CategoriesLookup : [],label:'CategoryName',value:'CategoryId',isTree:false},
                Seller:{data:sellerList.status==='fulfilled' && sellerList.value.data && sellerList.value.data.SellerDetails && sellerList.value.data.SellerDetails.length>0 ? sellerList.value.data.SellerDetails : [],label:'Seller',value:'Seller',isTree:false},
                Manufacture:{data:manufacturerList.status==='fulfilled' && manufacturerList.value.data && manufacturerList.value.data.ManufacturerDetails && manufacturerList.value.data.ManufacturerDetails.length>0 ? manufacturerList.value.data.ManufacturerDetails : [],label:'Manufacturer',value:'Manufacturer',isTree:false},
                EmpId:{data:usersList.status==='fulfilled' && usersList.value.data && usersList.value.data.AssignedUserDetails && usersList.value.data.AssignedUserDetails.length>0 ? usersList.value.data.AssignedUserDetails : [],label:`Text`,value:'EmpId',isTree:false},
                AssetOwner:{data:aoList.status==='fulfilled' && aoList.value.data && aoList.value.data.AssetOwnerDetails && aoList.value.data.AssetOwnerDetails.length>0 ? aoList.value.data.AssetOwnerDetails : [],label:'Text',value:'EmpId',isTree:false},
                AssetLocation:{data:alList.status==='fulfilled' && alList.value.data && alList.value.data.length>0 && alList.value.data.status===undefined ? alList.value.data : [],isTree:true,id:"#",idName:'',assetLocationUnique:'orginalId'},
                Department:{data:deptList.status==='fulfilled' && deptList.value.data && deptList.value.data.length>0 && deptList.value.data.status===undefined ? deptList.value.data : [],isTree:true,id:'#'},
                CostCenter:{data:ccList.status==='fulfilled' && ccList.value.data && ccList.value.data.length>0 && ccList.value.data.status===undefined ? ccList.value.data : [],id:'#',isTree:true},
            }
            setLookupsDataInJson(allResponses);
        }catch{}finally{dispatch(setLoading(false))}
    }
    const multiSelectConfig: MultiSelectConfig = {
        isHierarchy: true,
        treeCheckable: false,
        multiple: false,
        maxTagsCount: 2,
        maxTagTextLen: 15,
        labelClassName: 'font-semibold',
        className: 'custom-tree-select',
        showSearch: true,
        onSelect: (selectedKeys, info, treeData) => {
            const getSelectedTitles = (nodes, selectedValues) => {
                let titles: string[] = [];
                nodes.forEach(node => {
                    if (selectedValues.includes(node.value)) {
                        titles.push(node.title);
                    }
                    if (node.children) {
                        titles = titles.concat(getSelectedTitles(node.children, selectedValues));
                    }
                });
                return titles;
            };
            const selectedTitles = getSelectedTitles(treeData, selectedKeys);
        }
    };
    const renderField = (field: BaseField) => {
        const { name, label, fieldType, isRequired, dependsOn, show = true } = field;
        const validationRules = { required: isRequired ? `${label} is required` : false }
        switch (fieldType) {
            case "text":
            case 'number':
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
                                autoComplete="new-password"
                            />
                        )}
                    />
                );
            case "dropdown":
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
                                allowClear
                                dropdownClassName="z-[10001]"
                            />
                        )}
                    />
                );
            case "date":
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
            case "multiselect":
                return (
                    <Controller
                        key={name}
                        name={name}
                        control={control}
                        rules={validationRules}
                        render={({ field: ctrl }) => (
                            <ReusableMultiSelect
                                {...field}
                                label={label!}
                                value={ctrl.value}
                                onChange={ctrl.onChange}
                                error={errors[name]?.message as string}
                            />
                        )}
                    />
                );
            case "checkbox":
                return (
                    <Controller
                        key={name}
                        name={name}
                        control={control}
                        rules={validationRules}
                        render={({ field: ctrl }) => (
                            <ReusableSingleCheckbox
                                {...field}
                                value={ctrl.value}
                                onChange={ctrl.onChange}
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
            case 'treeselect':
                return (
                    <div>
                        <Controller
                            key={name}
                            name={name}
                            control={control}
                            rules={validationRules}
                            render={({ field: ctrl }) => (
                                <TracetTreeSelect
                                    label={label!}
                                    {...field}
                                    value={ctrl.value}
                                    onChange={ctrl.onChange}
                                    treeData={field.treeData}
                                    errorMessage={errors[name]?.message as string}
                                    multiSelectConfig={multiSelectConfig}
                                />
                            )}
                        />
                    </div>
                );
            default:
                return null;
        }
    };
    return (
        <div className="h-full overflow-y-auto bg-gray-50 flex flex-col ">
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 flex flex-col min-w-0 ">
                    <header className="px-6 py-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Fixed Assets</span>
                                <FaAngleRight />
                                <span className="text-gray-900 font-medium">Add Asset</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <ReusableButton
                                    variant="text"
                                    onClick={null}
                                    className='btn-reset-clear-style'
                                >
                                    Reset
                                </ReusableButton>
                                <ReusableButton
                                    variant="primary"
                                    onClick={null}
                                    className='btn-submit-style'
                                >
                                    Save
                                </ReusableButton>
                            </div>
                        </div>
                    </header>
                    <div className="flex-1 p-3 pt-0 min-h-0  ">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 h-full">
                            <div className="lg:col-span-12 flex flex-col  min-h-0 ">
                                <ScrollArea className="flex-1">
                                    <div className="space-y-2 pr-1">
                                        <Card className="bg-white backdrop-blur-sm border-0 shadow-lg min-h-[77vh]">
                                            <CardContent className="p-2">
                                                <div className="p-3">
                                                    <div className="">
                                                        <Tabs defaultValue="assetdetails">
                                                            <TabsList>
                                                                <TabsTrigger value="assetdetails">Asset Details</TabsTrigger>
                                                                <TabsTrigger value="purchase">Purchase Details</TabsTrigger>
                                                                <TabsTrigger value="allocation">Allocation Details</TabsTrigger>
                                                                <TabsTrigger value="depreciation">Depreciation Details</TabsTrigger>

                                                            </TabsList>
                                                            <TabsContent value="assetdetails" className="mt-6">
                                                                <div className="grid grid-cols-3 gap-6">
                                                                    {fields.filter(f => f.jsontype === 'assetdetails').map(renderField)}
                                                                </div>
                                                            </TabsContent>
                                                            <TabsContent value="purchase" className="mt-6">
                                                                <div className="grid grid-cols-3 gap-6">
                                                                    {fields.filter(f => f.jsontype === 'purchase').map(renderField)}
                                                                </div>
                                                            </TabsContent>
                                                            <TabsContent value="allocation" className="mt-6">
                                                                <div className="grid grid-cols-3 gap-6">
                                                                    {fields.filter(f => f.jsontype === 'allocation').map(renderField)}
                                                                </div>
                                                            </TabsContent>
                                                            <TabsContent value="depreciation" className="mt-6">
                                                                <div className="grid grid-cols-3 gap-6">
                                                                    {fields.filter(f => f.jsontype === 'depreciation').map(renderField)}
                                                                </div>
                                                            </TabsContent>
                                                        </Tabs>
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
            </div>
        </div>
    )
}

export default AssetAcquisition