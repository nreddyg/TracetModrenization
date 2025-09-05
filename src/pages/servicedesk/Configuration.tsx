
import { useEffect, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReusableDropdown } from '@/components/ui/reusable-dropdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Controller, useForm } from 'react-hook-form';
import {Save,Trash2,Edit, Search} from 'lucide-react';
import { ReusableInput } from '@/components/ui/reusable-input';
import { BaseField, GenericObject } from '@/Local_DB/types/types';
import { CONFIGURATION_DB } from '@/Local_DB/Form_JSON_Data/ConfigurationDB';
import { ReusableMultiSelect } from '@/components/ui/reusable-multi-select';
import ReusableSingleCheckbox from '@/components/ui/reusable-single-checkbox';
import { ReusableTextarea } from '@/components/ui/reusable-textarea';
import { deleteSRType, GetNotifyTypeLookup, GetServiceRequestAssignToLookups, GetServiceRequestStatus, getServiceRequestTypes, getSRConfigList, getSRTypesById, getStatusLookups, getVendorDetails, postDeleteServiceRequestStatus, postServiceRequestConfiguration, postServiceRequestStatus, postServiceRequestType, postUpdateServiceRequestStatus, postUpdateServiceRequesttype, postUpdateStatusSequence } from '@/services/configurationServices';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/store/slices/projectsSlice';
import { useMessage } from '@/components/ui/reusable-message';
import { ColumnDef } from '@tanstack/react-table';
import ReusableTable, { TableAction, TablePermissions } from '@/components/ui/reusable-table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { ReusableButton } from '@/components/ui/reusable-button';
import { useAppSelector } from '@/store';
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
interface serviceRequestType{
  "Id": number,
  "ServiceRequestType":string,
  "UserGroups": string,
  "Vendors": any,
  "SLAHoursMinutes": string,
  "ReminderForSLAHoursMinutes": string,
  "EscalationTo": any,
  "StatusToCalculate": any,
  "Description":string,
  "ServiceRequestTypeAdmin":string
}
interface Status{
  "Id": number,
  "StatusType":string,
  "Index": number
}
// Define table permissions
const tablePermissions: TablePermissions = {
  canEdit: true,
  canDelete: true,
  canView: true,
  canExport: false,
  canAdd: true,
  canManageColumns: true, 
};

const Configuration = () => {
  const companyId=useAppSelector(state=>state.projects.companyId);
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
  const [columns,setColumns]=useState<ColumnDef<serviceRequestType>[]>([
    {id:'ServiceRequestType',accessorKey: "ServiceRequestType", header: "Service Request Type",},
    {id:'UserGroups',accessorKey: "UserGroups", header: "User Groups"},
    {id:'Vendors',accessorKey: "Vendors", header: "Vendors",},
    {id:'SLAHoursMinutes',accessorKey: "SLAHoursMinutes", header: "SLA Hours/Minutes",},
    {id:'ReminderForSLAHoursMinutes',accessorKey: "ReminderForSLAHoursMinutes", header: "Reminder For SLAHours/Minutes"},
    {id:'EscalationTo',accessorKey: "EscalationTo", header: "Escalation To"},
    {id:'StatusToCalculate',accessorKey: "StatusToCalculate", header: "Status To Calculate SLA"},
    {id:'Description',accessorKey: "Description", header: "Description"},
    {id:'ServiceRequestTypeAdmin',accessorKey: "ServiceRequestTypeAdmin", header: "Service Request Type Admin",},
  ]);
  const [statusColumns,setStatusColumns]=useState<ColumnDef<Status>[]>([
    {id:'StatusType',accessorKey: "StatusType", header: "Status Type"},
    {id:'Index',accessorKey: "Index", header: "Index"},
  ])
  const [statusTableData,setStatusTableData]=useState<Status[]>([]);
  const [serviceRequestTypeData,setServiceRequestTypeData]=useState<serviceRequestType[]>([]);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<serviceRequestType | null>(null);
  const [selectedStatusRec,setSelectedStatusRec]=useState<Status | null>(null);
  const [isEditMode,setIsEditMode]=useState(false);
  const [isEditStatusMode,setIsEditStatusMode]=useState(false);
  const [currentTab,setCurrentTab]=useState('service-request-config')
  const handleEdit = (data:serviceRequestType): void => {
    setSelectedRecord(data);
    setIsEditMode(true);
    fetchServiceRequestTypeById(data.Id)
  };
  const handleDelete = (data:serviceRequestType): void => {
    setIsDelModalOpen(true);
    setSelectedRecord(data);
  };
  const handleDeleteStatus=(data:Status):void=>{
    setIsDelModalOpen(true);
    setSelectedStatusRec(data);
  }
  const handleEditStatus=(data:Status):void=>{
    dispatch(setLoading(true));
    setSelectedStatusRec(data);
    setIsEditStatusMode(true);
    form.reset({...form.getValues(),Status:data.StatusType})
    setTimeout(()=>{
      dispatch(setLoading(false));
    },1000)
  }
  const tableActions: TableAction<serviceRequestType>[] = [
    {
      label: 'Edit',
      icon: Edit,
      onClick: handleEdit,
      variant: 'default',
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick:handleDelete,
      variant: 'destructive',
    },
  ]; 
   const statusTableActions: TableAction<Status>[] = [
    {
      label: 'Edit',
      icon: Edit,
      onClick: handleEditStatus,
      variant: 'default',
      hidden:row=>row.StatusType==='Open' || row.StatusType==='Closed'
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick:handleDeleteStatus,
      variant: 'destructive',
      hidden:row=>row.StatusType==='Open' || row.StatusType==='Closed'
    },
  ]; 
  useEffect(()=>{
    const init = async () => {
      try {
        await fetchLookupsandGetAPIs();
      } catch (err) {
        console.error('Error fetching lookups:', err);
      } finally {
        if(companyId){
          getSRConfiguration(companyId,"All");
          fetchAllServiceRequests();
          fetchAllStatusList();
        }
      }
    };
    if(companyId){
      init();
    }
  },[companyId])
  const fetchAllServiceRequests=async()=>{
    dispatch(setLoading(true));
    await getServiceRequestTypes(companyId).then(res=>{
      if(res.success && res.data){
        setServiceRequestTypeData(res.data)
      }else{
        setServiceRequestTypeData([])
      }
    }).catch(err=>{}).finally(()=>{dispatch(setLoading(false))})
  }
  //all status list
  const fetchAllStatusList=async()=>{
    dispatch(setLoading(true));
    await GetServiceRequestStatus(companyId).then(res=>{
      if(res.success && res.data){
        setStatusTableData(res.data);
      }else{
        msg.warning('No Data Found !!')
      }
    }).catch(err=>{}).finally(()=>{dispatch(setLoading(false))})
  }
  const handleSave=async(data:any,type:string)=>{
    if(type==="configuration"){ 
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
          updateSRConfigAPI(NewCategoryObj,companyId,data["ServiceReqConfigurationId"],)

    } else if (type === "ServiceRequestType") {
      let payload = {
        "ServiceRequestTypeDetails": [
          {
            "Name": watch('ServiceRequestType'),
            "UserGroupList": Array.isArray(watch('UserGroups')) ? watch('UserGroups').join() : '', //"142"
            "VendorList": Array.isArray(watch('Vendors')) ? watch('Vendors').join() : '',//"12121"
            "SLAMinutes": watch('SLAHoursMinutes') ? watch('SLAHoursMinutes').split(':')[1] || '' : '',//"56"
            "SLAHours": watch('SLAHoursMinutes') ? watch('SLAHoursMinutes').split(':')[0] || '' : '',//"12",
            "ReminderForSLAMinutes": watch('ReminderForSLAHoursMinutes') ? watch('ReminderForSLAHoursMinutes').split(':')[1] || '' : '',// "45",
            "ReminderForSLAHours": watch('ReminderForSLAHoursMinutes') ? watch('ReminderForSLAHoursMinutes').split(':')[0] || '' : '',//"12",
            "EscalationList": Array.isArray(watch('EscalationTo')) ? watch('EscalationTo').join() : '',//"672",
            "ServiceMaintStatus": watch('StatusToCalculate'),
            "Description": watch('Description'),
            "ResponseReminderHours": watch('ReminderForSLAHoursMinutes') ? watch('ReminderForSLAHoursMinutes').split(':')[0] || '' : '',//"12",
            "ResponseReminderMinutes": watch('ReminderForSLAHoursMinutes') ? watch('ReminderForSLAHoursMinutes').split(':')[1] || '' : '',//"45",
            "serAdminUserGroupList": watch('ServiceRequestTypeAdmin') && watch('ServiceRequestTypeAdmin')['User Group'] ? watch('ServiceRequestTypeAdmin')['User Group']?.join() : '',
            "serAdminUserList":watch('ServiceRequestTypeAdmin') &&  watch('ServiceRequestTypeAdmin')['Users'] ? watch('ServiceRequestTypeAdmin')['Users']?.join() : ''
          }
        ]
      }
      if (isEditMode && selectedRecord) {
        dispatch(setLoading(true));
        await postUpdateServiceRequesttype(companyId,selectedRecord.Id,'All',payload).then(res=>{
          if(res.success){
            if(res.data.status){
              msg.success(res.data.message);
              fetchAllServiceRequests();
              handleReset();
            }else{
              msg.warning(res.data.message || 'Failed to update service request type !!')
            }
          }else{
            msg.warning('Failed to update service request type !!')
          }

        }).catch(err=>{{}}).finally(()=>{dispatch(setLoading(false))})
      } else {
        dispatch(setLoading(true));
        await postServiceRequestType(companyId, 'All', payload).then(res => {
          if (res.success && res.data.status) {
            msg.success(res.data.message);
            fetchAllServiceRequests();
            handleReset();
          } else {
            msg.warning(res?.data?.message || 'Failed to add new service request type')
          }
        }).catch(err => { }).finally(() => { dispatch(setLoading(false)) })
      }
    } else if(type==='AddNewStatus'){
      let payload={"ServiceRequestStatusDetails": [{"Name":watch('Status')}]};
      if(isEditStatusMode && selectedStatusRec){
        dispatch(setLoading(true));
        await postUpdateServiceRequestStatus(companyId,selectedStatusRec?.Id,payload).then(res=>{
          if(res.success){
            if(res.data.status){
              msg.success(res.data.message);
              handleReset('UpdateStatus');
              fetchAllStatusList();
            }else{
              msg.warning(res.data.message)
            }
          }else{
            msg.warning('Failed to update service request status !!')
          }
        }).catch(err=>{}).finally(()=>{dispatch(setLoading(false))})
      }else{
        dispatch(setLoading(true))
        await postServiceRequestStatus(companyId,payload).then(res=>{
          if(res.success){
            if(res.data.status){
              msg.success(res.data.message);
              handleReset('Status');
              fetchAllStatusList();
            }else{
              msg.warning(res.data.message || 'Failed to add new status !!')
            }
          }else{
            msg.warning('Failed to add new status !!')
          }
        }).catch(err=>{}).finally(()=>{dispatch(setLoading(false))})
      }
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
    Object.keys(dataObj).forEach((key)=>{
      if(key=="DefaultSLAStatusDataList" || key=="NotifyUserTypes"){
        form.setValue(key,dataObj[key]?dataObj[key].split(","):"")
      }else{
        form.setValue(key,dataObj[key])
      }
    })
  }
  const segregateOptionsAsGroupsAndUsers = (key: string, selectedIds: any[]) => {
    const data = fields.find(obj => obj.name === key)?.groupedOptions || [];
    return data.reduce(
      (acc, group) => ({
        ...acc,
        [group.label === "User Group" ? "User Group" : "Users"]: [
          ...acc[group.label === "User Group" ? "User Group" : "Users"],
          ...group.options
            .filter((opt: any) => selectedIds.includes(`${opt.value}`))
            .map((opt: any) => opt.value),
        ],
      }),
      { Users: [], "User Group": [] }
    );
  };
  //api calls
  const fetchLookupsandGetAPIs=async ()=>{
    dispatch(setLoading(true));
    try{
      let [NotifyLookup,SRStatusLookup,getVendors,SRTAssignToLookup]=await Promise.allSettled([GetNotifyTypeLookup(),getStatusLookups(companyId),getVendorDetails(companyId),GetServiceRequestAssignToLookups(companyId,"All")]);
      const allResponses = {
            NotifyUserTypes: { data: NotifyLookup.status === 'fulfilled' && NotifyLookup.value.success && NotifyLookup.value.data.ServiceRequestNotifyTypeLookup ? NotifyLookup.value.data.ServiceRequestNotifyTypeLookup : [], label: 'NotifyTypeName', value: 'NotifyTypeId' },
            DefaultSLAStatusDataList: { data: SRStatusLookup.status === 'fulfilled' && SRStatusLookup.value.success && SRStatusLookup.value.data.ServiceRequestStatusLookup ? SRStatusLookup.value.data.ServiceRequestStatusLookup : [], label: 'ServiceRequestStatusName', value: 'ServiceRequestStatusId' },
            Vendors: { data: getVendors.status === 'fulfilled' && getVendors.value.success && getVendors.value.data.Vendors ? getVendors.value.data.Vendors : [], label: 'VendorName', value: 'VendorID' },
            ServiceRequestTypeAdmin: {
              data: [], label: 'UserName', value: 'UserName', isGrouping: true, groupData: [{ label: "UserGroupName", value: "UserGroupId", data: SRTAssignToLookup.status === 'fulfilled' && SRTAssignToLookup.value.success && SRTAssignToLookup.value.data.ServiceRequestAssignToUserGroupLookup ? SRTAssignToLookup.value.data.ServiceRequestAssignToUserGroupLookup : [], groupLabel: "User Group" },
              { label: "UserName", value: "UserId", data: SRTAssignToLookup.status === 'fulfilled' && SRTAssignToLookup.value.success && SRTAssignToLookup.value.data.ServiceRequestAssignToUsersLookup ? SRTAssignToLookup.value.data.ServiceRequestAssignToUsersLookup : [], groupLabel: "Users" },]
            },
            UserGroups:{ data: SRTAssignToLookup.status === 'fulfilled' && SRTAssignToLookup.value.success && SRTAssignToLookup.value.data.ServiceRequestAssignToUserGroupLookup ? SRTAssignToLookup.value.data.ServiceRequestAssignToUserGroupLookup : [], label: 'UserGroupName', value: 'UserGroupId' },
            EscalationTo:{ data: SRTAssignToLookup.status === 'fulfilled' && SRTAssignToLookup.value.success && SRTAssignToLookup.value.data.ServiceRequestAssignToUsersLookup ? SRTAssignToLookup.value.data.ServiceRequestAssignToUsersLookup : [], label: 'UserName', value: 'UserId' },
            StatusToCalculate: { data: SRStatusLookup.status === 'fulfilled' && SRStatusLookup.value.success && SRStatusLookup.value.data.ServiceRequestStatusLookup ? SRStatusLookup.value.data.ServiceRequestStatusLookup.filter((ele:any)=>ele.ServiceRequestStatusId!=704) : [], label: 'ServiceRequestStatusName', value: 'ServiceRequestStatusId' },
      } 
      setLookupsDataInJson(allResponses)
    }catch{}finally{dispatch(setLoading(false));}
  }
  const updateSRConfigAPI = async (data, CompId, id) => {
   dispatch(setLoading(true))
   await postServiceRequestConfiguration( CompId,id,data).then((res) => {
      if (res.data.status !== undefined) {
        if (res.data.status === true) {
           msg.success(res.data.message);
          getSRConfiguration(companyId, "All")
        } else {
          msg.warning(res.data.message)
        }
      }
      else {
       msg.warning(res.data.ErrorDetails[0]["Error Message"]);
      }
    }).catch((err) => {}).finally(() => {dispatch(setLoading(false))})
  }
  const getSRConfiguration=(compId,branch)=>{
    getSRConfigList(compId,branch).then((res)=>{
      if (res.data !== undefined) {
        if (res.data.status == undefined) {
          settingGetValuesInForm(res.data.ServiceRequestConfiguration)
        }
      }}).catch(()=>{}).finally(()=>{})
  }
  //clear fields data
  const handleReset=(type?:string)=>{
    if(type){
      form.reset({...form.getValues(),Status:''});
      setIsEditStatusMode(false);
      setSelectedStatusRec(null)
    }else{
      form.reset({...form.getValues(),ServiceRequestType:'',UserGroups:[],Vendors:[],SLAHoursMinutes:'',ReminderForSLAHoursMinutes:'',EscalationTo:[],StatusToCalculate:'',ServiceRequestTypeAdmin:[],Description:''});
      setIsEditMode(false);
      setSelectedRecord(null);
    }
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
        ...(name === 'ReminderForSLAHoursMinutes' && {
          validate: {
            lessThanSLA: (value: string) => {
              if (!value) return true;
              const slaValue = watch('SLAHoursMinutes');
              if (!slaValue) return true;
              const reminderMinutes = timeToMinutes(value);
              const slaMinutes = timeToMinutes(slaValue);
              return reminderMinutes <= slaMinutes || 'Reminder time must be less than SLA time';
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
   // Handle refresh
  const handleRefresh = (type?:string) => {
    if(type){
      msg.info("Refreshing Service Request Status Data...");
      fetchAllStatusList()
    }else{
      msg.info("Refreshing Service Request Type Data...");
      fetchAllServiceRequests();
    }
  };
  const formatSLAHoursMinutes = (val?: string) => {
    if (!val) return "";
    const [hours, minutes] = val.split("/");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };
  //fetch service request type data by id
  const fetchServiceRequestTypeById = async(id: number) => {
    dispatch(setLoading(true));
    await getSRTypesById(companyId,id).then(res=>{
      if(res.success){
        if(res.data.ServiceRequestType){
          form.reset({...form.getValues(),
            ...res.data.ServiceRequestType,
            EscalationTo:res.data.ServiceRequestType.EscalationTo?res.data.ServiceRequestType.EscalationTo.split(','):[],
            UserGroups:res.data.ServiceRequestType.UserGroups?res.data.ServiceRequestType.UserGroups.split(','):[],
            StatusToCalculate:res.data.ServiceRequestType.StatusToCalculate?`${res.data.ServiceRequestType.StatusToCalculate}`:'',
            Vendors:res.data.ServiceRequestType.Vendors?res.data.ServiceRequestType.Vendors.split(','):[],
            ServiceRequestTypeAdmin:res.data.ServiceRequestType.ServiceRequestTypeAdmin?segregateOptionsAsGroupsAndUsers('ServiceRequestTypeAdmin',res.data.ServiceRequestType.ServiceRequestTypeAdmin.split(',')):[],
            SLAHoursMinutes: res.data.ServiceRequestType.SLAHoursMinutes? formatSLAHoursMinutes(res.data.ServiceRequestType.SLAHoursMinutes): "",
            ReminderForSLAHoursMinutes:res.data.ServiceRequestType.ReminderForSLAHoursMinutes?formatSLAHoursMinutes(res.data.ServiceRequestType.ReminderForSLAHoursMinutes):''
          })
        }
      }
    }).catch(err=>{}).finally(()=>{dispatch(setLoading(false))})
  }
  //delete service request type
  const deleteServiceRequestType = async (id: number) => {
    dispatch(setLoading(true));
    await deleteSRType(id, companyId).then(res => {
      if(res.success){
        if(res.data.status){
          msg.success(res.data.message);
          if(selectedRecord && selectedRecord.Id==id){
            handleReset();
          }
          fetchAllServiceRequests();
        }else{
          msg.warning(res.data.message);
        }
      }else{
        msg.warning('Failed to delete Service Request Type !!');
      }
    }).catch((error) => {
      msg.error("Error deleting Service Request Type");
    }).finally(()=>{
      dispatch(setLoading(false));
    })
  }
  //delete status
  const deleteStatus=async(id:number)=>{
    await postDeleteServiceRequestStatus(companyId,id).then(res=>{
      if(res.success){
        if(res.data.status){
          msg.success(res.data.message);
          if(selectedStatusRec && selectedStatusRec.Id==id){
            handleReset('DeleteStatus');
          }
          fetchAllStatusList();
        }else{
          msg.warning(res.data.message);
        }
      }else{
        msg.warning('Failed to delete status !!')
      }
    }).catch(err=>{}).finally(()=>{

    })
  }
  //update service request status sequence
  const handleUpdateStatusSequence=async()=>{
    dispatch(setLoading(true));
    let updatedSequence = statusTableData.map(item =>item.Id).join()
    await postUpdateStatusSequence(companyId,updatedSequence).then(res=>{
      if(res.success){
        if(res.data.status){
          msg.success(res.data.message);
          fetchAllStatusList();
        }else{
          msg.warning(res.data.message);
        }
      }else{
        msg.warning('Failed to update status sequence !!');
      }
    }).catch(err=>{}).finally(()=>{
      dispatch(setLoading(false));
    })
  }
  return (
    <div className="h-full bg-gray-50 overflow-y-scroll">
      <header className="bg-white border-b px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <Button size="sm" className="bg-primary h-[2.38rem] hover:bg-blue-700  text-white">
            <span className="hidden sm:inline">New Service Request</span>
            <span className="sm:hidden">New Request</span>
          </Button>
        </div>
      </header>
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-gray-900">Service Desk Configuration</h1>
        </div>
        <Tabs value={currentTab} onValueChange={setCurrentTab}  className="space-y-4">
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
                  <Button className="bg-blue-500 hover:bg-blue-600 text-sm px-4 py-2" onClick={handleSubmit((data)=>{handleSave(data,"configuration")})}>
                    {/* <Save className="h-3 w-3 mr-1" /> */}
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
                  <Button className="bg-orange-500 hover:bg-orange-600 text-sm px-4 py-2" onClick={handleSubmit((data)=>{handleSave(data,"ServiceRequestType")})}>{isEditMode && currentTab==='service-request-type'?'Update':'Save'}</Button>
                  <Button variant="outline" className="text-sm px-4 py-2" onClick={()=>handleReset('')}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-3">
                <ReusableTable
                  data={serviceRequestTypeData} columns={columns}
                  actions={tableActions} permissions={tablePermissions}
                  title="Service Request Type List" onRefresh={()=>handleRefresh('')}
                  enableSearch={true}
                  enableSelection={false}
                  enableExport={true}
                  enableColumnVisibility={true}
                  enablePagination={true}
                  enableSorting={true}
                  enableFiltering={true}
                  pageSize={10}
                  emptyMessage="No Data found"
                  storageKey="service-request-type-list-table"                    
                  enableColumnPinning
                />
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
                  <Button className="bg-orange-500 hover:bg-orange-600 text-sm px-4 py-2" onClick={handleSubmit((data)=>{handleSave(data,"AddNewStatus")})}>{currentTab==='service-request-status' && isEditStatusMode ?'Update':'Save'}</Button>
                  <Button variant="outline" className="text-sm px-4 py-2" onClick={()=>handleReset('AddNewStatus')}>Clear</Button>
                </div>
                <div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden p-3">
                    <ReusableTable
                      data={statusTableData} columns={statusColumns}
                      permissions={tablePermissions}
                      title="Service Request Status List"
                      onRefresh={()=>handleRefresh('Status')} enableSearch={true}
                      enableSelection={false} enableExport={true}
                      enableColumnVisibility={true} enablePagination={true}
                      enableSorting={true} enableFiltering={true}
                      pageSize={10} emptyMessage="No Data found"
                      rowHeight="normal" storageKey="service-request-type-list-table"    
                      enableRowReordering
                      onRowReorder={(newData) => setStatusTableData(newData)}  
                      actions={statusTableActions}              
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-sm px-4 py-2"
                    onClick={handleUpdateStatusSequence}>
                      Update Index Sequence
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Dialog open={isDelModalOpen} onOpenChange={setIsDelModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm the action</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                  {currentTab === "service-request-type"
                    ? `${selectedRecord?.ServiceRequestType || "this"} Service Request Type`
                    : `${selectedStatusRec?.StatusType || "this"} Status`
                  }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <ReusableButton
                variant="default"
                onClick={() => setIsDelModalOpen(false)}
              >
                Cancel
              </ReusableButton>
              <ReusableButton
                variant="primary"
                danger={true}
                onClick={currentTab==="service-request-type"?()=>{deleteServiceRequestType(selectedRecord?.Id);setIsDelModalOpen(false)}:()=>{deleteStatus(selectedStatusRec?.Id);setIsDelModalOpen(false)}} 
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
export default Configuration;
