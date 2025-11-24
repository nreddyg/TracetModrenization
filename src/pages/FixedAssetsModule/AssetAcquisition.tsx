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
import { getSubCategoryLookUp } from '@/services/servicedeskReportsServices'
import { getAssetCatByID } from '@/services/assetCategoryServices'

function AssetAcquisition() {
    const dispatch = useAppDispatch();
    const msg = useMessage();
    const companyId = useAppSelector(state => state.projects.companyId);
    const branchName = useAppSelector(state => state.projects.branch);
    const loggedInUserId = JSON.parse(localStorage.getItem('LoggedInUser'))['UserId'];
    const [fields, setFields] = useState<BaseField[]>(ADD_ASSET_DB);
    const form = useForm<GenericObject>({
        defaultValues: fields.reduce((acc, f) => {
            acc[f.name!] = f.defaultValue ?? f.defaultChecked ?? '';
            return acc;
        }, {} as GenericObject),
        mode: 'onChange'
    });
    const { control, register, handleSubmit, trigger, watch, setValue, getValues, reset, formState: { errors } } = form;
    useEffect(() => {
        if (companyId && branchName && loggedInUserId) fetchAllLookupsData();
    }, [companyId, branchName, loggedInUserId])

    const isEmptyValue = (v: any) => v === '' || v === null || v === undefined || (Array.isArray(v) && v.length === 0);
    const runRuleAndApply = async (name: string, newValue: any) => {
        const ruleFn = (fieldRules as any)[name];
        if (!ruleFn) return;
        try {
            let resultOrPromise: any;
            let snapshot: BaseField[] = [];
            setFields(prev => {
                snapshot = prev;
                return prev;
            });
            resultOrPromise = ruleFn(newValue, snapshot);
            const updatedFields = resultOrPromise && typeof resultOrPromise.then === 'function' ? await resultOrPromise : resultOrPromise;
            if (!updatedFields) return;
            if (Array.isArray(updatedFields)) {
                setFields(prev => {
                    return updatedFields;
                });
                return;
            }
            const { updates = [], options = [], setValues = [] } = updatedFields as any;
            if (updates.length > 0 || options.length > 0) {
                setFields(prev => {
                    const next = prev.map(f => ({ ...f }));
                    updates.forEach((u: any) => {
                        const idx = next.findIndex(x => x.name === u.name);
                        if (idx >= 0) next[idx] = { ...next[idx], ...(u.props || {}) };
                    });
                    options.forEach((o: any) => {
                        const idx = next.findIndex(x => x.name === o.name);
                        if (idx >= 0) next[idx] = { ...next[idx], options: o.options ?? [] };
                    });
                    return next;
                });
            }
            if (setValues.length > 0) {
                setValues.forEach((s: any) => {
                    setValue(s.name, s.value, { shouldValidate: false, shouldDirty: true });
                });
            }
        } catch (err) {
            console.error('rule execution error for', name, err);
        }
    };
    useEffect(() => {
        const subscription = watch((allValues, { name }) => {
            if (!name) return;
            const newValue = allValues[name];
            void runRuleAndApply(name, newValue);
        });
        return () => subscription.unsubscribe();
    }, [watch]);
    // Reusable helpers
    const cloneFields = (fields: BaseField[]) => fields.map(f => ({ ...f }));
    const bulkUpdateProps = (names: string[], props: any) => names.map(name => ({ name, props }));
    const bulkSetValues = (names: string[], valueMap: Record<string, any>) => names.map(name => ({ name, value: valueMap[name] ?? '' }));
    const accountFields = ['AssetAcquisitionAccount','AssetDepreciationAccount','DepreciationAccount'];
    const fieldRules: Record<string, any> = {
        BarcodeOption: (value, fieldsSnapshot) => {
            const newFields = cloneFields(fieldsSnapshot);
            const barcodeNo = newFields.find(f => f.name === 'BarcodeNo');
            const custAsset = newFields.find(f => f.name === 'CustomerAssetNo');
            const isOther = value === 'Other';
            if (barcodeNo) {
                barcodeNo.show = isOther;
                barcodeNo.isRequired = isOther;
                if (!isOther) setValue('BarcodeNo', '');
            }
            if (custAsset) {
                custAsset.isRequired = value === 'Customer Asset No';
            }
            return newFields;
        },
        MainCategory: async (value, fieldsSnapshot) => {
            if (isEmptyValue(value)) {
                return {
                    updates: [{ name: 'SubCategory', props: { disabled: true } },...bulkUpdateProps(accountFields, { show: false })],
                    options: [{ name: 'SubCategory', options: [] }],
                    setValues: bulkSetValues(['SubCategory', ...accountFields],{})
                };
            }
            dispatch(setLoading(true));
            try {
                const subCatRes = await getSubCategoryLookUp(companyId, value);
                const subOptions = Array.isArray(subCatRes?.data?.SubCategoriesLookup) ? subCatRes.data.SubCategoriesLookup.map(ele => ({label: ele.CategoryName,value: ele.CategoryId})) : [];
                const mainCatRes = await getAssetCatByID(value, companyId);
                const mainCat = Array.isArray(mainCatRes.data) && mainCatRes.data.length ? mainCatRes.data[0] : {};
                const showAccounts =!!(mainCat.AssetAcquisitionAccount || mainCat.AssetDepreciationAccount || mainCat.DepreciationAccount);
                return {
                    updates: [{ name: 'SubCategory', props: { disabled: false } },...bulkUpdateProps(accountFields, { show: showAccounts })],
                    options: [{ name: 'SubCategory', options: subOptions }],
                    setValues: bulkSetValues(
                        [...accountFields, 'SubCategory'],
                        { AssetAcquisitionAccount: mainCat.AssetAcquisitionAccount,AssetDepreciationAccount: mainCat.AssetDepreciationAccount,
                            DepreciationAccount: mainCat.DepreciationAccount,SubCategory: ''
                        }
                    )
                };
            } finally {
                dispatch(setLoading(false));
            }
        },
        DepreciationApplicable: (value, fieldsSnapshot) => {
            const newFields = cloneFields(fieldsSnapshot);
            const assetLife = newFields.find(f => f.name === 'AssetUsefulLife');
            const expLife = newFields.find(f => f.name === 'ExpectedLifeEndDate');
            if (assetLife) assetLife.isRequired = value;
            if (expLife) expLife.isRequired = value;
            return newFields;
        },
        PurchasedDate: (value, fieldsSnapshot) => {
            const newFields = cloneFields(fieldsSnapshot);
            setValue('CapitalizationDate', value);
            setValue('PlacedInServiceDate', value);
            return newFields;
        }
    };
    const handleSave=(data)=>{
        console.log('data',data)

    }
    const setLookupsDataInJson = async (dataset: any) => {
        let keys = Object.keys(dataset);
        const updatedFields = fields.map(field => {
            if (keys.includes(field.name)) {
                let { data, isTree, id, idName, assetLocationUnique } = dataset[field.name];
                if (isTree) {
                    let treeData = treefunWithParent(data, id, idName, assetLocationUnique);
                    return { ...field, treeData };
                } else {
                    let isUser = field.name === 'EmpId';
                    let isAssetOwner = field.name === 'AssetOwner';
                    let options = Array.from(
                        new Map(
                            dataset[field.name].data.map((item: any) => [
                                item[dataset[field.name].value],
                                {
                                    label: isUser || isAssetOwner ? `${item.Text} ( ${item.EmpId} )` : item[dataset[field.name].label],
                                    value: isUser ? item.EmpId : isAssetOwner ? `${item.Text} ( ${item.EmpId} )` : item[dataset[field.name].value],
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
    type LookupResult<T = any> = | { status: "fulfilled"; value: { data: T } } | { status: "rejected"; reason: any };
    const getSafe = <T = any>(res: LookupResult, path: string, fallback: T = [] as unknown as T): T => {
        if (res.status !== "fulfilled") return fallback;
        const parts = path.split(".");
        let current: any = res.value?.data;
        for (const p of parts) {
            if (!current?.[p]) return fallback;
            current = current[p];
        }
        return current || fallback;
    };
    interface LookupConfig {
        res: LookupResult;
        path?: string;
        label?: string;
        value?: string;
        isTree?: boolean;
        id?: string;
        assetLocationUnique?: string;
    }
    const fetchAllLookupsData = async () => {
        dispatch(setLoading(true));
        try {
            const promises = [getAssetAcquistionTypeLookupData(companyId),getWorkingConditionLookupData(companyId),
                getDependencyLookupData(companyId),getAssetTaggableLookupData(companyId),
                getCategoryList(companyId),getSellerLookupData(companyId),
                getManufacturerLookupData(companyId),getAssignedToUserLookupData(companyId),
                getAssetOwnerLookupData(companyId),getAssetLocationDetals(companyId, branchName),
                getDepartmentLookupByUser(companyId, loggedInUserId),getCostCenterData(companyId)
            ];
            const results = await Promise.allSettled(promises) as LookupResult[];
            const [acqList, wcList, depList, atList, mcList,sellerList, manufacturerList, usersList,aoList, alList, deptList, ccList] = results;
            const config: Record<string, LookupConfig> = {
                AcquisitionType: { res: acqList, path: "AcqusitionTypeLookup", label: "Name", value: "Name" },
                WorkingStatus: { res: wcList, path: "WorkingConditionLookup", label: "Name", value: "Name" },
                DependencyType: { res: depList, path: "DepandencyTypeLookup", label: "Name", value: "Name" },
                IsAssetTagable: { res: atList, path: "IsAssetTaggableLookup", label: "Name", value: "Name" },
                MainCategory: { res: mcList, path: "CategoriesLookup", label: "CategoryName", value: "CategoryId" },
                Seller: { res: sellerList, path: "SellerDetails", label: "Seller", value: "Seller" },
                Manufacture: { res: manufacturerList, path: "ManufacturerDetails", label: "Manufacturer", value: "Manufacturer" },
                EmpId: { res: usersList, path: "AssignedUserDetails", label: "Text", value: "EmpId" },
                AssetOwner: { res: aoList, path: "AssetOwnerDetails", label: "Text", value: "EmpId" },
                AssetLocation: { res: alList, isTree: true, id: "#", assetLocationUnique: "orginalId" },
                Department: { res: deptList, isTree: true, id: "#" },
                CostCenter: { res: ccList, isTree: true, id: "#" }
            };
            const allResponses = Object.fromEntries(
                Object.entries(config).map(([key, cfg]) => {
                    const data =cfg.path ? getSafe(cfg.res, cfg.path) : cfg.res.status === "fulfilled" && Array.isArray(cfg.res.value?.data) &&
                                cfg.res.value.data[0]?.status === undefined ? cfg.res.value.data : [];
                    return [ key,{data,label: cfg.label,value: cfg.value,isTree: cfg.isTree || false,id: cfg.id,assetLocationUnique: cfg.assetLocationUnique}];
                })
            );
            setLookupsDataInJson(allResponses);
        } finally {
            dispatch(setLoading(false));
        }
    };
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
    const getFieldsByNames = (names: string[], type: string) => fields.filter(f => names.includes(f.name!) && f.jsontype === type);
    const renderField = (field: BaseField) => {
        const { name, label, fieldType, isRequired, show = true } = field;
        const validationRules = { required: isRequired ? `${label} is required` : false }
        if (!show) return null;
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
                                min={1}
                                error={errors[name]?.message as string}
                                autoComplete="new-password"
                                {...(name === 'Quantity' && { min: 1 })}
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
                                    onClick={reset}
                                    className='btn-reset-clear-style'
                                >
                                    Reset
                                </ReusableButton>
                                <ReusableButton
                                    variant="primary"
                                    onClick={handleSubmit((data) => { handleSave(data) })}
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
                                                            <TabsList className='w-full overflow-auto'>
                                                                <TabsTrigger value="assetdetails">Asset Details</TabsTrigger>
                                                                <TabsTrigger value="purchase">Purchase Details</TabsTrigger>
                                                                <TabsTrigger value="allocation">Allocation Details</TabsTrigger>
                                                                <TabsTrigger value="depreciation">Depreciation Details</TabsTrigger>
                                                            </TabsList>
                                                            <TabsContent value="assetdetails" className="mt-6">
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                                                    {getFieldsByNames(['AssetName', 'AcquisitionType', 'WorkingStatus'], 'assetdetails').map(renderField)}
                                                                    {getFieldsByNames(['Quantity'], 'assetdetails').map(field => {
                                                                        const splitField = fields.find(f => f.name === 'SplitQuantity');
                                                                        return (
                                                                            <div key="qty-group" className="col-span-1 relative">
                                                                                <div className="absolute right-0 top-0 z-20 flex items-center gap-2 text-sm font-medium text-[#485585]">
                                                                                    {renderField(splitField)}
                                                                                </div>
                                                                                {renderField(field)}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                    {getFieldsByNames(['DependencyType', 'ParentAssetCode', 'MainCategory', 'SubCategory', 'IsAssetTagable', 'BarcodeOption', 'CustomerAssetNo', 'BarcodeNo',], 'assetdetails').map(renderField)}
                                                                </div>
                                                                <div className='grid grid-cols-1 mt-6'>{getFieldsByNames(['AssetDescription'], 'assetdetails').map(renderField)}</div>
                                                            </TabsContent>
                                                            <TabsContent value="purchase" className="mt-6">
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                                                    {fields.filter(f => f.jsontype === 'purchase').map(renderField)}
                                                                </div>
                                                            </TabsContent>
                                                            <TabsContent value="allocation" className="mt-6">
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                                                    {fields.filter(f => f.jsontype === 'allocation').map(renderField)}
                                                                </div>
                                                            </TabsContent>
                                                            <TabsContent value="depreciation" className="mt-6">
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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