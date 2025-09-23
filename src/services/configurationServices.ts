// services/customerService.ts
import { URL_CREATE_SERVICE_REQUEST, URL_GET_ALL_SERVICE_REQUESTS_DETAILS, URL_GET_COMMENT_CHANGES_HISTORY_BY_SERVICE_REQUEST_ID, URL_GET_COMMENTS_API, URL_GET_HEIRARCHY_DETAILS_LAST_LEVEL, URL_GET_LINKED_SERVICE_REQUESTS_API, URL_GET_MANAGE_ASSETS_LIST, URL_GET_NOTIFY_TYPE_LOOKUPS, URL_GET_SERVICE_REQUEST_CC_LIST_LOOKUPS, URL_GET_SERVICE_REQUEST_DETAILS_BY_SERVICE_REQUEST_ID, URL_GET_SERVICE_REQUEST_LINK_TO_LOOKUP_LIST, URL_GET_SERVICE_REQUEST_STATUS, URL_GET_SERVICE_REQUEST_TYPES, URL_GET_SERVICE_REQUEST_TYPES_BY_ID, URL_GET_SR_ADDITIONAL_FIELDS, URL_GET_SR_ASSETS_LIST, URL_GET_SR_ASSIGN_TO_LOOKUPS, URL_GET_SR_CUSTOMER_LOOKUPS, URL_GET_SR_REQUESTED_BY_LOOKUPS, URL_GET_SR_TYPE_LOOKUPS, URL_GET_SRCONFIG_LIST, URL_GET_STATUS_LOOKUP_API, URL_GET_STATUS_LOOKUP_FOR_CALCULATE_SLA_API, URL_GET_SUBSCRIPTION_BY_CUSTOMER, URL_GET_SUBSCRIPTION_HISTORY_BY_CUSTOMER, URL_GET_UPLOADED_FILES_API_BY_SERVICE_REQUEST_ID, URL_GET_VENDOR_DETAILS_BY_COMPID, URL_POST_ADD_SR_STATUS, URL_POST_DELETE_SR_STATUS, URL_POST_DELETE_SR_TYPE_BY_ID, URL_POST_DELETE_UPLOADED_FILES, URL_POST_SERVICE_REQUEST_COMMENT_API, URL_POST_SERVICE_REQUEST_CONFIGURATION, URL_POST_SERVICE_REQUEST_TYPE, URL_POST_UPDATE_SERVICE_REQUEST, URL_POST_UPDATE_SR_STATUS, URL_POST_UPDATE_SR_STATUS_SEQUENCE, URL_POST_UPDATE_SR_TYPE, URL_SAVE_FILE_UPLOAD } from '@/config/apiUrls';
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
//Service Request Assign To Lookup
export const GetServiceRequestAssignToLookups = async (CompId: string, branchName: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_SR_ASSIGN_TO_LOOKUPS, { params: { CompId: CompId, branchname: branchName } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
//SRConfiguration list
export const getSRConfigList = async (CompId: string, branchName: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_SRCONFIG_LIST, { params: { CompId: CompId, branchName: branchName } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

//Status Lookup Data
export const getStatusLookups = async (compId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_STATUS_LOOKUP_API, { params: { CompId: compId } });
        return { success: true, data: response.data };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
};
export const getStatusLookupsForSLA = async (compId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_STATUS_LOOKUP_FOR_CALCULATE_SLA_API, { params: { CompId: compId } });
        return { success: true, data: response.data };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
};

//save service request configuration

export const postServiceRequestConfiguration = async (compId: string, SerReqConfigurationId: number, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_SERVICE_REQUEST_CONFIGURATION, data, { params: { CompId: compId, SerReqConfigurationId: SerReqConfigurationId } });
        return { success: true, data: response.data };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status, };
    }
};

//post service request type
export const postServiceRequestType = async (compId: string, branchName: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_SERVICE_REQUEST_TYPE, data, { params: { CompId: compId, branchName: branchName } });
        return { success: true, data: response.data };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status, };
    }
};

//getServiceRequestType List 
export const getServiceRequestTypes = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_SERVICE_REQUEST_TYPES, { params: { CompId: CompId, } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}


//vendor details for look up
export const getVendorDetails = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_VENDOR_DETAILS_BY_COMPID, { params: { CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

//get service request lookup
export const GetServiceRequestStatus = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_SERVICE_REQUEST_STATUS, { params: { CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

//Notify type look
export const GetNotifyTypeLookup = async (): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_NOTIFY_TYPE_LOOKUPS)
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

//GetServiceRequestRequestedByLookups 
export const getSRRequestByLookupsList = async (compId: string, branchName: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_SR_REQUESTED_BY_LOOKUPS, { params: { CompId: compId, branchname: branchName } })
        return { success: true, data: response.data }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

//getSRTypesById
export const getSRTypesById = async (compId: string, Id: number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_SERVICE_REQUEST_TYPES_BY_ID, { params: { CompId: compId, Id: Id } })
        return { success: true, data: response.data }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}


//delete Service Request Type
export const deleteSRType = async (Id: number, compId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_DELETE_SR_TYPE_BY_ID, "", { params: { Id: Id, CompId: compId } });
        return { success: true, data: response.data };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
};


//post service request status
export const postServiceRequestStatus = async (compId: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_ADD_SR_STATUS, data, { params: { CompId: compId } });
        return { success: true, data: response.data };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status, };
    }
};


//post for update service request status
export const postUpdateServiceRequestStatus = async (compId: string, Id: number, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_UPDATE_SR_STATUS, data, { params: { CompId: compId, Id: Id } });
        return { success: true, data: response.data };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status, };
    }
};


// delete service request status
export const postDeleteServiceRequestStatus = async (compId: string, Id: number): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_DELETE_SR_STATUS, "", { params: { CompId: compId, Id: Id } });
        return { success: true, data: response.data };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status, };
    }
};

//post for update service request type
export const postUpdateServiceRequesttype = async (compId: string, Id: number, branchName: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_UPDATE_SR_TYPE, data, { params: { CompId: compId, Id: Id, branchName: branchName } });
        return { success: true, data: response.data };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status, };
    }
};

//service for updating sequence
export const postUpdateStatusSequence = async (compId: string, ServiceRequestStatusSequence:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_UPDATE_SR_STATUS_SEQUENCE, '', { params: { CompId: compId,serReqStatus:ServiceRequestStatusSequence } });
        return { success: true, data: response.data };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status, };
    }
};
