import { ReusableButton } from '@/components/ui/reusable-button';
import { ReusableInput } from '@/components/ui/reusable-input';
import { CHANGE_PASSWORD_DB } from '@/Local_DB/Form_JSON_Data/ChangePasswordDB';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { LockKeyhole } from 'lucide-react';
import React, { useState } from 'react'
import { useForm, Controller, RegisterOptions } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { useDispatch } from 'react-redux';
import { useMessage } from '@/components/ui/reusable-message';
import { setLoading } from '@/store/slices/projectsSlice';
import { postLatestPassword } from '@/services/changePassword';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [fields] = useState<BaseField[]>(CHANGE_PASSWORD_DB);
    const dispatch = useDispatch();
    const message = useMessage();
    const navigate = useNavigate();

    const icons = [
        <LockKeyhole key="b" className="h-4 w-4" color="#808080" strokeWidth={2} size={'36px'} />,
        <LockKeyhole key="u" className="h-4 w-4" color="#808080" strokeWidth={2} size={'36px'} />,
        <LockKeyhole key="u" className="h-4 w-4" color="#808080" strokeWidth={2} size={'36px'} />,
    ];

    const form = useForm<GenericObject>({
        defaultValues: fields.reduce((acc, f) => {
            acc[f.name!] = f.defaultValue ?? ''
            return acc;
        }, {} as GenericObject),
        mode: "onChange",

    });
    const getFieldsByNames = (names: string[]) => fields.filter(f => names.includes(f.name!));

    const { control, handleSubmit, watch, formState: { errors } } = form;


    const renderField = (field: BaseField, icon: React.ReactNode) => {
        const { name, label, fieldType, isRequired, show = true } = field;
        if (!name || !show) return null;
        switch (fieldType) {
            case 'text':
            case 'password':
                return (
                    <Controller
                        key={name}
                        name={name}
                        control={control}
                        // rules={validationRules}/
                        rules={{
                            ...(name === "confirmpassword" && {
                                validate: (value: string) =>
                                    value === watch("newpassword") || "Passwords do not match",
                            }),
                            required: isRequired ? `${label} is required` : false,
                        }}
                        render={({ field: ctrl }) => (
                            <ReusableInput
                                {...field}
                                value={ctrl.value}
                                onChange={ctrl.onChange}
                                error={errors[name]?.message as string}
                                suffixIcon={icon}
                            />
                        )}
                    />
                );
        }
    };

    async function postChangePassword(data) {
        dispatch(setLoading(true))
        await postLatestPassword(data).then(res => {
            console.log(res);
            if (res.data.status && res.data.status === true) {
                console.log("success")
                message.success(`${res.data.message}`);
                localStorage.removeItem('Token');
                navigate('/login');
            } else {
                console.log("no")
                message.warning(`${res.data.message}`);
            }
        }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
    }

    const handleChangePW = async (data: GenericObject): Promise<void> => {
        const payload = {
            "ConfirmPassword": watch('confirmpassword'),
            "NewPassword": watch('newpassword'),
            "OldPassword": watch('currentpassword'),
        };
        postChangePassword(payload);
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800">Change Password</h3>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleChangePW)} className="space-y-6">
                        {/* Customer Information */}
                        <div>
                            {getFieldsByNames(['currentpassword', 'newpassword', 'confirmpassword']).map((field, ind) => (
                                <div key={field.name} className='mb-2'>
                                    {renderField(field, icons[ind])}
                                </div>
                            ))}
                        </div>
                        <ReusableButton
                            htmlType="submit"
                            className="w-full mb-2"
                        >
                            Login
                        </ReusableButton>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default ChangePassword;
