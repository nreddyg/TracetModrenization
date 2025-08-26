
import { useEffect, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Controller, useForm } from 'react-hook-form';
import { Settings, Save,Trash2,Edit} from 'lucide-react';
import { ReusableInput } from '@/components/ui/reusable-input';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { CONFIGURATION_DB } from '@/Local_DB/Form_JSON_Data/ConfigurationDB';
import { ReusableMultiSelect } from '@/components/ui/reusable-multi-select';
import ReusableSingleCheckbox from '@/components/ui/reusable-single-checkbox';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { GetNotifyTypeLookup, GetServiceRequestAssignToLookups, getSRConfigList, getStatusLookups, getVendorDetails, postServiceRequestConfiguration } from '@/services/configurationServices';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/store/slices/projectsSlice';
import { useMessage } from '@/components/ui/reusable-message';
interface OptType {
  data:  {[key: string]: any}[];
  label: string;
  value: string;
  defaultValues?: string | string[];
}
interface allResponsesType {
  NotifyUserTypes: OptType
  DefaultSLAStatusDataList: OptType

}
const Configuration = () => {
  const [fields,setFields] = useState<BaseField[]>(CONFIGURATION_DB);
  const dispatch=useDispatch()
    const msg = useMessage()
  const form = useForm<GenericObject>({
      defaultValues: fields.reduce((acc, f) => {
        acc[f.name!] = f.defaultChecked ?? '';
        return acc;
      }, {} as GenericObject),
      mode: 'onChange',
      reValidateMode: "onChange" 
  });
 const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;

 useEffect(()=>{
 const init = async () => {
    try {
      await fetchLookupsandGetAPIs();
    } catch (err) {
      console.error('Error fetching lookups:', err);
    } finally {
      getSRConfiguration(111,"All");
    }
  };

  init();
 },[])

 const handleSave=(data,type)=>{
  if(type==="configuration"){
 console.log(data,"config")
 
     let newList = []
        let Payload = {
          "IsWorkorderAllowed": data["AllowWorkOrderCreation"],
          "IsSerReqAllowedForMultipleAsset": "true",
          "DisplayMyRequestAssignedTo": "true",
          "DisplayMyWorkBenchAssignedTo": "true",
          "DisplayMyRequestCustomer": data["CustomerFieldinMyRequest"],
          "DisplayMyWorkbenchCustomer":data["CustomerFieldinMyRequest"],
          "DisplayMyRequestSLATimer": "true",
          "DisplayMyWorkbenchSLATimer": "true",
          "DisplayAsset":data["AssetFieldinCreateEditServiceRequest"],
          "IsDefaultNotifyUsers": data["IsDefaultNotifyUsers"],
          "NotifyUserTypes":data["NotifyUserTypes"]?data["NotifyUserTypes"]?.join():data["NotifyUserTypes"],
          "PauseSLAByDefault": data["PauseSLAcalculation"],
          "DefaultSLAStatusDataList": data["DefaultSLAStatusDataList"]?data["DefaultSLAStatusDataList"]?.join():"",
        }
        newList.push(Payload);
        var NewCategoryObj = { "ServiceRequestConfigDetails": newList };
        
        updateSRConfigAPI(NewCategoryObj,111,data["ServiceReqConfigurationId"],)

  }
 }
  const setLookupsDataInJson = (lookupsData:allResponsesType,shouldSetData?:boolean, getData?:any): void => {
    const arr = Object.keys(lookupsData)
    const groupNames: string[] = []
    const opts: { [key: string]: any } = {}
    arr.forEach((obj) => {
      let ret = []
      if (lookupsData[obj].isGrouping) {
        groupNames.push(obj)
        let groupOpts = []
        ret = lookupsData[obj].groupData.map((element) => {
          groupOpts = element.data.map((ele) => {
            let opt = {}
            opt["label"] = ele[element.label]
            opt["value"] = ele[element.value]
            return opt
          });
          return {
            "label": element.groupLabel,
            "options": groupOpts
          }
        })

      } else {
        ret = lookupsData[obj].data.map((element) => {
          let opt = {}
          opt["label"] = element[lookupsData[obj].label]
          opt["value"] = element[lookupsData[obj].value]?.toString()
          return opt
        });
      }

      opts[obj] = ret

    })
    const data = structuredClone(fields);
    data.forEach((obj) => {
      if (arr.includes(obj.name)) {
        if (groupNames.includes(obj.name)) {
          obj.groupedOptions = opts[obj.name]
        }
        obj.options = opts[obj.name]
      }
    });
    setFields(data);
  }

  const settingGetValuesInForm=(dataObj:any)=>{
  // console.log("dATA",dataObj)
    Object.keys(dataObj).forEach((key)=>{
  

      if(key=="DefaultSLAStatusDataList" || key=="NotifyUserTypes"){
        console.log("dataObj[key]",dataObj[key])
      form.setValue(key,dataObj[key]?dataObj[key].split(","):"")
      }else{
        form.setValue(key,dataObj[key])
      }
      
      // form.reset(dataObj)
    })
    console.log(form.getValues())

  }

 //api calls
const fetchLookupsandGetAPIs=async ()=>{
  dispatch(setLoading(true));
try{
let [NotifyLookup,SRStatusLookup,getVendors,SRTAssignToLookup]=await Promise.allSettled([GetNotifyTypeLookup(),getStatusLookups(111),getVendorDetails(111),GetServiceRequestAssignToLookups(111,"All")]);

  const allResponses = {
        NotifyUserTypes: { data: NotifyLookup.status === 'fulfilled' && NotifyLookup.value.success && NotifyLookup.value.data.ServiceRequestNotifyTypeLookup ? NotifyLookup.value.data.ServiceRequestNotifyTypeLookup : [], label: 'NotifyTypeName', value: 'NotifyTypeId' },
        DefaultSLAStatusDataList: { data: SRStatusLookup.status === 'fulfilled' && SRStatusLookup.value.success && SRStatusLookup.value.data.ServiceRequestStatusLookup ? SRStatusLookup.value.data.ServiceRequestStatusLookup : [], label: 'ServiceRequestStatusName', value: 'ServiceRequestStatusId' },
        Vendors: { data: getVendors.status === 'fulfilled' && getVendors.value.success && getVendors.value.data.Vendors ? getVendors.value.data.Vendors : [], label: 'VendorName', value: 'VendorID' },
        ServiceRequestTypeAdmin: {
          data: [], label: 'UserName', value: 'UserName', isGrouping: true, groupData: [{ label: "UserGroupName", value: "UserGroupId", data: SRTAssignToLookup.status === 'fulfilled' && SRTAssignToLookup.value.success && SRTAssignToLookup.value.data.ServiceRequestAssignToUserGroupLookup ? SRTAssignToLookup.value.data.ServiceRequestAssignToUserGroupLookup : [], groupLabel: "User Group" },
          { label: "UserName", value: "UserId", data: SRTAssignToLookup.status === 'fulfilled' && SRTAssignToLookup.value.success && SRTAssignToLookup.value.data.ServiceRequestAssignToUsersLookup ? SRTAssignToLookup.value.data.ServiceRequestAssignToUsersLookup : [], groupLabel: "Users" },]
        },
        UserGroups:{ data: SRTAssignToLookup.status === 'fulfilled' && SRTAssignToLookup.value.success && SRTAssignToLookup.value.data.ServiceRequestAssignToUserGroupLookup ? SRTAssignToLookup.value.data.ServiceRequestAssignToUserGroupLookup : [], label: 'UserGroupName', value: 'UserGroupId' },
        EscalationTo:{ data: SRTAssignToLookup.status === 'fulfilled' && SRTAssignToLookup.value.success && SRTAssignToLookup.value.data.ServiceRequestAssignToUsersLookup ? SRTAssignToLookup.value.data.ServiceRequestAssignToUsersLookup : [], label: 'UserName', value: 'UserId' }
  } 

  setLookupsDataInJson(allResponses)

}catch{

}finally{
    dispatch(setLoading(false));
}


}

  const updateSRConfigAPI = async (data, CompId, id) => {
   dispatch(setLoading(true))
   await postServiceRequestConfiguration( CompId,id,data).then((res) => {
      if (res.data.status !== undefined) {
        if (res.data.status === true) {
           msg.success(res.data.message);
          getSRConfiguration(111, "All")
        } else {
          msg.warning(res.data.message)
        }
      }
      else {
       msg.warning(res.data.ErrorDetails[0]["Error Message"]);
      }

    })
      .catch((err) => {
      }).finally(() => {
      dispatch(setLoading(false))
      })
  }
const getSRConfiguration=(compId,branch)=>{
getSRConfigList(compId,branch).then((res)=>{
   if (res.data !== undefined) {
          if (res.data.status == undefined) {
  settingGetValuesInForm(res.data.ServiceRequestConfiguration)
          }
        }
}).catch(()=>{}).finally(()=>{})
}



  const getFieldsByNames = (names: string[]) => fields.filter(f => names.includes(f.name!));

  const timeToMinutes = (timeString: string): number => {
    if (!timeString || !timeString.includes(':')) return 0;
    const [hours, minutes] = timeString.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return 0;
    return hours * 60 + minutes;
  };

  const renderField = (field: BaseField) => {
      const { name, label, fieldType, isRequired,validationPattern,patternErrorMessage, dependsOn, show = true } = field;
      if (!show && dependsOn && !watch(dependsOn)) {
        return null;
      }
      const validationRules = {
        required: isRequired ? `${label} is Required` : false,
        ...(validationPattern && {
          pattern: {
            value: new RegExp(validationPattern),
            message: patternErrorMessage || 'Invalid input format'
          }
        }),
        ...(name === 'ReminderForSLA' && {
          validate: {
            lessThanSLA: (value: string) => {
              if (!value) return true;
              const slaValue = watch('ReminderForSLAHoursMinutes');
              if (!slaValue) return true;
              const reminderMinutes = timeToMinutes(value);
              const slaMinutes = timeToMinutes(slaValue);
              return reminderMinutes < slaMinutes || 'Reminder time must be less than SLA time';
            }
          }
        })
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
        case 'multiselect':
          return (
            <div>
              <Controller
                key={name}
                name={name}
                control={control}
                rules={validationRules}
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
    <div className="h-full bg-gray-50 overflow-y-scroll">
      <header className="bg-white border-b px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <Button 
            size="sm" 
            className="bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm px-2 sm:px-3 py-1.5"
          >
            <span className="hidden sm:inline">New Service Request</span>
            <span className="sm:hidden">New Request</span>
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-gray-900">Service Desk Configuration</h1>
        </div>

        <Tabs defaultValue="service-request-config" className="space-y-4">
          <div className="hidden sm:block">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="service-request-config" className="text-sm">Service Request Configuration</TabsTrigger>
              <TabsTrigger value="service-request-type" className="text-sm">Service Request Type</TabsTrigger>
              <TabsTrigger value="service-request-status" className="text-sm">Service Request Status</TabsTrigger>
            </TabsList>
          </div>
          <div className="sm:hidden">
            <TabsList className="flex flex-col gap-1 h-auto p-1">
              <TabsTrigger value="service-request-config" className="text-xs w-full">Configuration</TabsTrigger>
              <TabsTrigger value="service-request-type" className="text-xs w-full">Request Type</TabsTrigger>
              <TabsTrigger value="service-request-status" className="text-xs w-full">Request Status</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="service-request-config" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4 ">
                    {getFieldsByNames(['CustomerFieldinMyRequest', 'AssetFieldinCreateEditServiceRequest', 'IsDefaultNotifyUsers','NotifyUserTypes']).map((field) => {
                      return  <div className="flex-1 items-center space-x-2">
                       {renderField(field)}
                    </div>;
                    })} 
                  </div>
                  <div className="space-y-4">
                    {getFieldsByNames(['AllowWorkOrderCreation', 'PauseSLAcalculation','DefaultSLAStatusDataList']).map((field) => {
                      return  <div className="flex-1 items-center space-x-2">
                       {renderField(field)}
                    </div>;
                    })} 
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-sm px-4 py-2" onClick={handleSubmit((data)=>{handleSave(data,"configuration")})}>
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="service-request-type" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="space-y-2 ">
                      {getFieldsByNames(['ServiceRequestType','UserGroups','Vendors','SLAHoursMinutes','ReminderForSLAHoursMinutes']).map((field) => {
                        return  <div className="flex-1 items-center space-x-2">
                        {renderField(field)}
                      </div>;
                      })} 
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {getFieldsByNames(['EscalationTo','StatusToCalculate','ServiceRequestTypeAdmin','Description']).map((field) => {
                        return  <div className="flex-1 items-center space-x-2">
                        {renderField(field)}
                      </div>;
                      })} 
                    </div>
                  </div>
                </div>    
                <div className="flex gap-2 mb-6">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-sm px-4 py-2" onClick={handleSubmit(onsubmit)}>Save</Button>
                  <Button variant="outline" className="text-sm px-4 py-2" onClick={reset}>Cancel</Button>
                </div>

                <div className="mt-8">
                  <h3 className="text-base font-semibold mb-4">Service Request Type List</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* table here */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="service-request-status" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  {getFieldsByNames(['Status']).map((field) => {
                        return  <div className="flex-1 items-center space-x-2">
                        {renderField(field)}
                      </div>;
                      })} 
                </div>
                <div className="flex gap-2 mb-8">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-sm px-4 py-2" onClick={handleSubmit(onsubmit)}>Save</Button>
                  <Button variant="outline" className="text-sm px-4 py-2" onClick={reset}>Clear</Button>
                </div>

                <div>
                  <h3 className="text-base font-semibold mb-4">Service Request Status List</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* table here */}
                  </div>
                  <div className="mt-4">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-sm px-4 py-2">
                      Update Index Sequence
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Configuration;
