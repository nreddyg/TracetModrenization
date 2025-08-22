// services/customerService.ts
import { URL_CREATE_SERVICE_REQUEST, URL_GET_ALL_SERVICE_REQUESTS_DETAILS, URL_GET_COMMENT_CHANGES_HISTORY_BY_SERVICE_REQUEST_ID, URL_GET_COMMENTS_API, URL_GET_HEIRARCHY_DETAILS_LAST_LEVEL, URL_GET_LINKED_SERVICE_REQUESTS_API, URL_GET_MANAGE_ASSETS_LIST, URL_GET_NOTIFY_TYPE_LOOKUPS, URL_GET_SERVICE_REQUEST_CC_LIST_LOOKUPS, URL_GET_SERVICE_REQUEST_DETAILS_BY_SERVICE_REQUEST_ID, URL_GET_SERVICE_REQUEST_LINK_TO_LOOKUP_LIST, URL_GET_SERVICE_REQUEST_STATUS, URL_GET_SERVICE_REQUEST_TYPES, URL_GET_SERVICE_REQUEST_TYPES_BY_ID, URL_GET_SR_ADDITIONAL_FIELDS, URL_GET_SR_ASSETS_LIST, URL_GET_SR_ASSIGN_TO_LOOKUPS, URL_GET_SR_CUSTOMER_LOOKUPS, URL_GET_SR_REQUESTED_BY_LOOKUPS, URL_GET_SR_TYPE_LOOKUPS, URL_GET_SRCONFIG_LIST, URL_GET_STATUS_LOOKUP_API, URL_GET_SUBSCRIPTION_BY_CUSTOMER, URL_GET_SUBSCRIPTION_HISTORY_BY_CUSTOMER, URL_GET_UPLOADED_FILES_API_BY_SERVICE_REQUEST_ID, URL_GET_VENDOR_DETAILS_BY_COMPID, URL_POST_DELETE_SR_TYPE_BY_ID, URL_POST_DELETE_UPLOADED_FILES, URL_POST_SERVICE_REQUEST_COMMENT_API, URL_POST_SERVICE_REQUEST_CONFIGURATION, URL_POST_SERVICE_REQUEST_TYPE, URL_POST_UPDATE_SERVICE_REQUEST, URL_SAVE_FILE_UPLOAD } from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

// interface genericResponse {
//   [key: string]: any;
// };

//save service request configuration

export const postServiceRequestConfiguration = async (compId: number, SerReqConfigurationId: number, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_SERVICE_REQUEST_CONFIGURATION, data, { params: { CompId: compId, SerReqConfigurationId: SerReqConfigurationId } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

//post service request type
export const postServiceRequestType = async (compId: number, branchName: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_SERVICE_REQUEST_TYPE, data, { params: { CompId: compId, branchName: branchName } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

//getServiceRequestType List 
export const getServiceRequestTypes = async (CompId: number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_SERVICE_REQUEST_TYPES, { params: { CompId: CompId, } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}


//vendor details for look up
export const getVendorDetails = async (CompId: number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_VENDOR_DETAILS_BY_COMPID, { params: { CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

//get service request lookup
export const GetServiceRequestStatus = async (CompId: number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_SERVICE_REQUEST_STATUS, { params: { CompId: CompId} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

//Notify type look
export const GetNotifyTypeLookup = async (): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_NOTIFY_TYPE_LOOKUPS)
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

//GetServiceRequestRequestedByLookups 
 export const getSRRequestByLookupsList=async(compId:number,branchName:string):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_SR_REQUESTED_BY_LOOKUPS,{params:{CompId:compId,branchname:branchName}})
        return {success:true,data:response.data}
    } catch(err:any)
    {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
 }

 //getSRTypesById
 export const getSRTypesById=async(compId:number,Id:number):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_SERVICE_REQUEST_TYPES_BY_ID,{params:{CompId:compId,Id:Id}})
        return {success:true,data:response.data}
    }catch(err:any)
    {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
 }



 export const deleteSRType = async (Id: number, compId: number): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_DELETE_SR_TYPE_BY_ID,"", { params: { Id: Id, CompId: compId } });
        return { success: true, data: response.data };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
};
//GetServiceRequestsAdditionalFieldsByServiceRequestType
export const getSRAdditionalFieldsByServiceRequestType=async(ServiceRequestTypeName:string,compId:number):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_SR_ADDITIONAL_FIELDS,{params:{CompId:compId,ServiceRequestTypeNames:ServiceRequestTypeName}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

//GetSubscriptionByCustomer
export const getSubscriptionByCustomer=async(CustomerName:string,compId:number,BranchName:string):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_SUBSCRIPTION_BY_CUSTOMER,{params:{CompId:compId,CustomerName:CustomerName,BranchName:BranchName}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}
//GetSubscriptionHistoryByCustomer
export const getSubscriptionHistoryByCustomer=async(CustomerName:string,compId:number,BranchName:string,ProductID:number):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_SUBSCRIPTION_HISTORY_BY_CUSTOMER,{params:{CompId:compId,CustomerName:CustomerName,BranchName:BranchName,ProductId:ProductID}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

//GetManageAssetsList
export const getManageAssetsList=async(BranchName:string,compId:number):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_MANAGE_ASSETS_LIST,{params:{CompId:compId,BranchName:BranchName}})
        return {success:true,data:response.data}
    }catch(err:any)
    {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

//GetAllServiceRequestsDetails
export const getAllSRDetailsList=async(BranchName:string,compId:number,requesttype:string):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_ALL_SERVICE_REQUESTS_DETAILS,{params:{CompId:compId,BranchName:BranchName,requesttype:requesttype}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
     return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

//Get Service Request Link To Lookup List
export const getSRLinkToLookupsList=async(CompId:number,BranchName:string):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_SERVICE_REQUEST_LINK_TO_LOOKUP_LIST,{params:{CompId:CompId,branchname:BranchName}})
        return {success:true,data:response.data}
    }catch(err:any)
    {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
 }

 //Get CC List Lookup List
export const getSRCCListLookupsList=async(CompId:number,BranchName:string):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_SERVICE_REQUEST_CC_LIST_LOOKUPS,{params:{CompId:CompId,branchname:BranchName}})
        return {success:true,data:response.data}
    }catch(err:any)
    {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
 }

 //Get Branch List
export const getSRBranchList=async(CompId:number):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_HEIRARCHY_DETAILS_LAST_LEVEL,{params:{CompId:CompId}})
        return {success:true,data:response.data}
    }catch(err:any)
    {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

 
//GetCommentHistoryList
export const getCommentHistoryList=async(ServiceRequestId:number,compId:number):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_COMMENT_CHANGES_HISTORY_BY_SERVICE_REQUEST_ID,{params:{CompId:compId,ServiceRequestId:ServiceRequestId}})
        return {success:true,data:response.data}
    }catch(err:any)
    {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}