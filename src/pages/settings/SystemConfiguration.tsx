
import { useEffect, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Save, Server, Mail, Settings2, Lock } from 'lucide-react';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import ReusableSingleCheckbox from '@/components/ui/reusable-single-checkbox';
import { Controller, useForm } from 'react-hook-form';
import { ReusableMultiSelect } from '@/components/ui/reusable-multi-select';
import { ReusableInput } from '@/components/ui/reusable-input';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { SMTP_DB } from '@/Local_DB/Form_JSON_Data/SMTPDB';
import { useAppDispatch, useAppSelector } from '@/store';
import { getSMTPConfig, postSMTPconfiguration } from '@/services/smtpServices';
import { setLoading } from '@/store/slices/projectsSlice';
import { useMessage } from '@/components/ui/reusable-message';
import { ReusableButton } from '@/components/ui/reusable-button';

const SystemConfiguration = () => {
  const dispatch = useAppDispatch();
  const companyId = useAppSelector((state) => state.projects.companyId);
  const message = useMessage();
  const [smtpFields, setSmtpFields] = useState(SMTP_DB);
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90
  });

  const form = useForm<GenericObject>({
    defaultValues: smtpFields.reduce((acc, f) => {
      acc[f.name!] = f.defaultChecked ?? '';
      return acc;
    }, {} as GenericObject),
    mode: 'onChange',
    reValidateMode: "onChange"
  });
  const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;


  useEffect(() => {
    if (companyId) fetchSMTPSettings();
  }, [companyId])
  //fetch SMTP settings
  const fetchSMTPSettings = async () => {
    dispatch(setLoading(true))
    await getSMTPConfig(companyId).then(res => {
      if (res.success && res.data && res.data.SMTPConfigurationDetails) {
        form.reset({ ...res.data.SMTPConfigurationDetails });
      } else {
        message.warning(res.data.message || 'No SMTP configuration found');
      }
    }).catch(err => { }).finally(() => { dispatch(setLoading(false)) });
  }
  //save smtp settings
  const handleSave = async (data: GenericObject, configType: string) => {
    if (configType === "SMTPSettings") {
      const payload = {
        "SMTPDetails": [
          {
            "SMTPHost": watch('SMTPHost'), "SMTPPort": watch('SMTPPort'),
            "SMTPFromMail": watch('SMTPFromMail'), "SMTPFromPassword": watch('SMTPFromPassword'),
            "IsSSL": watch('SSLApplicable').toString(),
          }
        ]
      }
      dispatch(setLoading(true));
      await postSMTPconfiguration(companyId, payload).then(res => {
        if (res.success && res.data.status) {
          message.success(res.data.message)
        } else {
          message.warning(res.data.message || 'Invalid SMTP configuration');
        }
      }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
    }
  }

  const renderField = (field: BaseField) => {
    const { name, label, fieldType, isRequired, validationPattern, patternErrorMessage, dependsOn, show = true } = field;
    if (!show && dependsOn) {
      return null;
    }

    const validationRules = {
      required: isRequired ? `${label} is Required` : false,
    };
    switch (fieldType) {
      case 'text':
        case 'password':
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
      case 'multiselect':
        return (
          <div>
            <Controller
              key={name}
              name={name}
              control={control}
              // rules={validationRules}
              render={({ field: ctrl }) => (
                <ReusableMultiSelect
                  label={label!}
                  {...field}
                  value={ctrl.value}
                  onChange={ctrl.onChange}
                  error={errors[name]?.message as string}
                />
              )}
            />
          </div>
        );
      case 'checkbox':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field: ctrl }) => (
              <ReusableSingleCheckbox
                label={label}
                onChange={ctrl.onChange}
                value={ctrl.value}
                className="text-orange-500"
                {...field}
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
            // rules={validationRules}
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
  const getFieldsByNames = (names: string[]) => smtpFields.filter(f => names.includes(f.name!));
  return (
    <div className="overflow-y-scroll h-full bg-gray-50 transition-all duration-300 ease-in-out">
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Settings</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">System Configuration</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>

        <Tabs defaultValue="hierarchy" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hierarchy" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Hierarchy
            </TabsTrigger>
            <TabsTrigger value="smtp" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              SMTP
            </TabsTrigger>
            <TabsTrigger value="parameters" className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Parameters
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password Policy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hierarchy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hierarchy Configuration</CardTitle>
                <CardDescription>Configure organizational hierarchy and reporting structure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxLevels">Maximum Hierarchy Levels</Label>
                    <Input id="maxLevels" type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultLevel">Default Starting Level</Label>
                    <Input id="defaultLevel" type="number" defaultValue="1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hierarchyNames">Level Names (comma-separated)</Label>
                  <Input id="hierarchyNames" defaultValue="Company, Division, Department, Team, Individual" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoAssign"
                    checkedClassName="data-[state=checked]:bg-blue-600"
                    uncheckedClassName="data-[state=unchecked]:bg-gray-200"
                  />
                  <Label htmlFor="autoAssign">Auto-assign hierarchy on user creation</Label>
                </div>
                <ReusableButton
                  htmlType="button"
                  variant="default"
                  onClick={handleSubmit((data) => { handleSave(data, "HierarchyConfiguration") })}
                  iconPosition="left"
                  size="middle"
                  className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white w-full"
                >
                  Save Hierarchy Configuration
                </ReusableButton>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="smtp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SMTP Configuration</CardTitle>
                <CardDescription>Configure email server settings for system notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {getFieldsByNames(['SMTPHost', 'SMTPPort']).map((field) => {
                    return <>
                      {renderField(field)}
                    </>;
                  })}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {getFieldsByNames(['SMTPFromMail', 'SMTPFromPassword', "SSLApplicable"]).map((field) => {
                    return <>
                      {renderField(field)}
                    </>;
                  })}
                </div>
                <div className="flex gap-2">
                  <ReusableButton
                    htmlType="button"
                    variant="default"
                    onClick={handleSubmit((data) => { handleSave(data, "SMTPSettings") })}
                    iconPosition="left"
                    size="middle"
                    className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white w-full"
                  >
                    Save SMTP Settings
                  </ReusableButton>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parameters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Parameters</CardTitle>
                <CardDescription>Configure global system parameters and default values</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input id="sessionTimeout" type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Max File Upload Size (MB)</Label>
                    <Input id="maxFileSize" type="number" defaultValue="10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <ReusableDropdown
                    defaultValue="usd"
                    options={[
                      { value: 'usd', label: 'USD - US Dollar' },
                      { value: 'eur', label: 'EUR - Euro' },
                      { value: 'inr', label: 'INR - Indian Rupee' }
                    ]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemMessage">System Maintenance Message</Label>
                  <Textarea id="systemMessage" placeholder="Enter message to display during maintenance..." />
                </div>
                <ReusableButton
                  htmlType="button"
                  variant="default"
                  onClick={handleSubmit((data) => { handleSave(data, "Parameters") })}
                  iconPosition="left"
                  size="middle"
                  className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white w-full"
                >
                  Save Parameters
                </ReusableButton>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password Policy</CardTitle>
                <CardDescription>Configure password requirements and security policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="minLength">Minimum Password Length</Label>
                  <Input
                    id="minLength"
                    type="number"
                    value={passwordPolicy.minLength}
                    onChange={(e) => setPasswordPolicy({ ...passwordPolicy, minLength: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireUppercase"
                      checked={passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, requireUppercase: checked })}
                      checkedClassName="data-[state=checked]:bg-blue-600"
                      uncheckedClassName="data-[state=unchecked]:bg-gray-200"
                    />
                    <Label htmlFor="requireUppercase">Require uppercase letters</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireLowercase"
                      checked={passwordPolicy.requireLowercase}
                      onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, requireLowercase: checked })}
                      checkedClassName="data-[state=checked]:bg-blue-600"
                      uncheckedClassName="data-[state=unchecked]:bg-gray-200"
                    />
                    <Label htmlFor="requireLowercase">Require lowercase letters</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireNumbers"
                      checked={passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, requireNumbers: checked })}
                      checkedClassName="data-[state=checked]:bg-blue-600"
                      uncheckedClassName="data-[state=unchecked]:bg-gray-200"
                    />
                    <Label htmlFor="requireNumbers">Require numbers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireSpecialChars"
                      checked={passwordPolicy.requireSpecialChars}
                      onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, requireSpecialChars: checked })}
                      checkedClassName="data-[state=checked]:bg-blue-600"
                      uncheckedClassName="data-[state=unchecked]:bg-gray-200"
                    />
                    <Label htmlFor="requireSpecialChars">Require special characters</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDays">Password Expiry (days)</Label>
                  <Input
                    id="expiryDays"
                    type="number"
                    value={passwordPolicy.expiryDays}
                    onChange={(e) => setPasswordPolicy({ ...passwordPolicy, expiryDays: parseInt(e.target.value) })}
                  />
                </div>
                <ReusableButton
                  htmlType="button"
                  variant="default"
                  onClick={handleSubmit((data) => { handleSave(data, "PasswordPolicy") })}
                  iconPosition="left"
                  size="middle"
                  className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white w-full"
                >
                  Save Password Policy
                </ReusableButton>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemConfiguration;
