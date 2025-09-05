
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReusableInput } from '@/components/ui/reusable-input';
import { ReusableButton } from '@/components/ui/reusable-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, Lock, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LOGIN_PAGE_DB } from '@/Local_DB/Form_JSON_Data/LoginDB';
import { Controller, useForm } from 'react-hook-form';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { Form, } from '@/components/ui/form';
import { useMessage } from '@/components/ui/reusable-message';
import { setLoading } from '@/store/slices/projectsSlice';
import { getToken } from '@/services/loginServices';
import { useAppDispatch } from '@/store/reduxStore';


const Login = () => {
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState(LOGIN_PAGE_DB);
  const message=useMessage();
  const dispatch=useAppDispatch();

  const form = useForm<GenericObject>({
    defaultValues: loginDetails.reduce((acc, f) => {
      acc[f.name!] = f.defaultValue ?? ''
      return acc;
    }, {} as GenericObject),

  });
  const { control, register, handleSubmit, trigger, watch, setValue, getValues, reset, formState: { errors } } = form;

  const icons = [
    <Building2 className="h-4 w-4" />,
    <User className="h-4 w-4" />,
    // <Lock className="h-4 w-4" />
  ]


  const renderField = (field: BaseField, icon) => {
    const { name, label, fieldType, isRequired, show = true } = field;
    if (!name || !show) return null;
    const validationRules = {
      required: isRequired ? `${label} is required` : false,
    };
    switch (fieldType) {
      case 'text':
      case 'password':
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
                suffixIcon={icon}
              />
            )}
          />
        );
    };
  }
  // Helper function to get fields by names (similar to TicketView)
  const getFieldsByNames = (names: string[]) => loginDetails.filter(f => names.includes(f.name!));

  // Dummy credentials for testing
  

  const handleLogin = async (data: GenericObject): Promise<void> => {
    const payload = {
      "UserName": watch('Username'),"Password": watch('password'),
      "CompanyCode": watch('CompanyCode'),"grant_type": "password",
    };
    dispatch(setLoading(true));
    await getToken(payload).then((res)=>{
      if(res.success){
        if(res.data.access_token)
        localStorage.setItem('Token',JSON.stringify(res.data.access_token));
        navigate('/dashboard')
      }
      else{
        message.error('Please Enter Valid Credentials')
      }
    }).catch(err=>{message.error('Please Enter Valid Credentials')
    }).finally(()=>{dispatch(setLoading(false))})
   }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          {/* <div className="flex justify-center">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <Building2 className="h-12 w-12 text-primary" />
            </div>
          </div> */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tracet</h1>
            <p className="text-muted-foreground mt-1">Asset Management System</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Welcome Back</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Enter your credentials to access your account
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* <form onSubmit={handleLogin} className="space-y-4">
              <ReusableInput
                label="User ID"
                type="text"
                value={credentials.userId}
                onChange={(e) => setCredentials({ ...credentials, userId: e.target.value })}
                prefixIcon={<User className="h-4 w-4" />}
                placeholder="Enter your User ID"
                required
              />
              
              <ReusableInput
                label="Password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                prefixIcon={<Lock className="h-4 w-4" />}
                placeholder="Enter your password"
                showPasswordToggle
                required
              />

              <ReusableButton
                htmlType="submit"
                className="w-full"
                loading={loading}
              >
                Sign In
              </ReusableButton>
            </form> */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
                {/* Customer Information */}
                <div>
                  {getFieldsByNames(['CompanyCode', 'Username', 'password']).map((field, ind) => (
                    <div key={field.name} className='mb-2'>
                      {renderField(field,icons[ind])}
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

            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <ReusableButton
              variant="default"
              className="w-full"
              onClick={handleSSO}
            >
              <Building2 className="h-4 w-4 mr-2" />
              SSO Login
            </ReusableButton> */}
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        {/* <Card className="bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Demo Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {DUMMY_CREDENTIALS.map((cred, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="font-mono">{cred.userId} / {cred.password}</span>
                <Badge variant="outline" className="text-xs">
                  {cred.role}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card> */}

        <p className="text-center text-xs text-muted-foreground">
          © 2024 Tracet. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
