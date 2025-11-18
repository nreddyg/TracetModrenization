import { Card, CardContent } from '@/components/ui/card'
import { ReusableButton } from '@/components/ui/reusable-button'
import { ReusableDatePicker } from '@/components/ui/reusable-datepicker'
import { ReusableDropdown } from '@/components/ui/reusable-dropdown'
import { ReusableInput } from '@/components/ui/reusable-input'
import { useMessage } from '@/components/ui/reusable-message'
import ReusableMultiSelect from '@/components/ui/reusable-multi-select'
import ReusableSingleCheckbox from '@/components/ui/reusable-single-checkbox'
import { ReusableTextarea } from '@/components/ui/reusable-textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ADD_ASSET_DB } from '@/Local_DB/Form_JSON_Data/AddAssetDB'
import { BaseField, GenericObject } from '@/Local_DB/types/types'
import { useAppDispatch } from '@/store/reduxStore'
import { setLoading } from '@/store/slices/projectsSlice'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FaAngleRight } from 'react-icons/fa'

function AssetAcquisition() {
    const dispatch = useAppDispatch();
    const msg = useMessage();
    const [fields, setFields] = useState<BaseField[]>(ADD_ASSET_DB);
    const form = useForm<GenericObject>({
        defaultValues: fields.reduce((acc, f) => {
            acc[f.name!] = f.defaultValue ?? '';
            return acc;
        }, {} as GenericObject),
        mode: 'onChange'
    });
    const { control, register, handleSubmit, trigger, watch, setValue, getValues, reset, formState: { errors } } = form;

    //Fetch All Lookups Data
    const fetchAllLookupsData=async()=>{
        dispatch(setLoading(true));
        try{
            const res = Promise.allSettled([])

        }catch{}finally{dispatch(setLoading(false))}
    }
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