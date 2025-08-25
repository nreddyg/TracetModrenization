
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
import { GetNotifyTypeLookup, getSRConfigList, getStatusLookups } from '@/services/configurationServices';
interface OptType {
  data:  {[key: string]: any}[];
  label: string;
  value: string;
  defaultValues?: string | string[];
}
    //  let newList = []
    //     let Payload = {
    //       "IsWorkorderAllowed": getMethod("AllowWorkOrderCreation", srConfigJson),
    //       "IsSerReqAllowedForMultipleAsset": "true",
    //       "DisplayMyRequestAssignedTo": "true",
    //       "DisplayMyWorkBenchAssignedTo": "true",
    //       "DisplayMyRequestCustomer": getMethod("CustomerFieldinMyRequest", srConfigJson),
    //       "DisplayMyWorkbenchCustomer": getMethod("CustomerFieldinMyRequest", srConfigJson),
    //       "DisplayMyRequestSLATimer": "true",
    //       "DisplayMyWorkbenchSLATimer": "true",
    //       "DisplayAsset": getMethod("AssetFieldinCreateEditServiceRequest", srConfigJson),
    //       "IsDefaultNotifyUsers": getMethod("IsDefaultNotifyUsers", srConfigJson),
    //       "NotifyUserTypes": getMethod("NotifyUserTypes", srConfigJson).join(),
    //       "PauseSLAByDefault": getMethod("PauseSLAcalculation", srConfigJson),
    //       "DefaultSLAStatusDataList": getMethod("DefaultSLAStatusDataList", srConfigJson).join(),
    //     }
    //     newList.push(Payload);
    //     var NewCategoryObj = { "ServiceRequestConfigDetails": newList };
interface allResponsesType {
  NotifyUserTypes: OptType
  DefaultSLAStatusDataList: OptType

}
const Configuration = () => {
  const [fields,setFields] = useState<BaseField[]>(CONFIGURATION_DB);
  const form = useForm<GenericObject>({
      defaultValues: fields.reduce((acc, f) => {
        acc[f.name!] = f.defaultChecked ?? '';
        return acc;
      }, {} as GenericObject),
      mode: 'onChange'
  });
 const { control, register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = form;

 useEffect(()=>{
 const init = async () => {
    try {
      await fetchLookupsandGetAPIs();
    } catch (err) {
      console.error('Error fetching lookups:', err);
    } finally {
      getSRConfiguration();
    }
  };

  init();
 },[])

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
          opt["value"] = element[lookupsData[obj].value]
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
  
      // form.setValue(key,dataObj[key])
      // form.reset(dataObj)
    })
    console.log(form.getValues())

  }

 //api calls
const fetchLookupsandGetAPIs=async ()=>{

try{
let [NotifyLookup,SRStatusLookup]=await Promise.allSettled([GetNotifyTypeLookup(),getStatusLookups(111)]);

  const allResponses = {
        NotifyUserTypes: { data: NotifyLookup.status === 'fulfilled' && NotifyLookup.value.success && NotifyLookup.value.data.ServiceRequestNotifyTypeLookup ? NotifyLookup.value.data.ServiceRequestNotifyTypeLookup : [], label: 'NotifyTypeName', value: 'NotifyTypeId' },
        DefaultSLAStatusDataList: { data: SRStatusLookup.status === 'fulfilled' && SRStatusLookup.value.success && SRStatusLookup.value.data.ServiceRequestStatusLookup ? SRStatusLookup.value.data.ServiceRequestStatusLookup : [], label: 'ServiceRequestStatusName', value: 'ServiceRequestStatusId' },
  } 

  setLookupsDataInJson(allResponses)

}catch{

}finally{
}


}

useEffect(()=>{
console.log("AllowWorkOrderCreation",watch("AllowWorkOrderCreation"))
},[watch("AllowWorkOrderCreation")])

const getSRConfiguration=()=>{
  console.log("called")
getSRConfigList(111,"All").then((res)=>{
  settingGetValuesInForm(res.data.ServiceRequestConfiguration)
}).catch(()=>{}).finally(()=>{})
}



  const getFieldsByNames = (names: string[]) => fields.filter(f => names.includes(f.name!));
  const renderField = (field: BaseField) => {
    console.log("render",field)
      const { name, label, fieldType, isRequired, dependsOn, show = true } = field;
      if (!show && dependsOn && !watch(dependsOn)) {
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
                  <Button className="bg-orange-500 hover:bg-orange-600 text-sm px-4 py-2" onClick={handleSubmit(onsubmit)}>
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
                      {getFieldsByNames(['ServiceRequestType','UserGroup','Vendor','SLAHoursMinutes','ReminderForSLA']).map((field) => {
                        return  <div className="flex-1 items-center space-x-2">
                        {renderField(field)}
                      </div>;
                      })} 
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {getFieldsByNames(['EscalationTo','SetStatusToCalculateSLA','ServiceRequestTypeAdmin','Description']).map((field) => {
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
