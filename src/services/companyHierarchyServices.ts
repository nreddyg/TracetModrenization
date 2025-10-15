import { URL_GET_COMPANY_HIERARCHY_DATA_BY_BRANCHID, URL_GET_HIERARCHY_LEVELS_DATA, URL_GET_STATE_LOOKUP_DATA } from './../config/apiUrls';
// services/customerService.ts
import { URL_DELETE_COMPANY_HIERARCHY_DATA, URL_GET_COMPANY_HIERARCHY_DATA, URL_POST_COMPANY_HIERARCHY_DATA, URL_POST_DEPARTMENT_DATA} from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

// Delete Hierarchy level
export const deleteHierarchyLevel = async (compId: string, id: any , data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_COMPANY_HIERARCHY_DATA, data, { params: { CompId: compId, Id: id } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

// Save or Update Hierarchy level
export const addOrUpdateHierarchyLevel = async (compId: string, id: any , data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_COMPANY_HIERARCHY_DATA, data, { params: { CompId: compId, branchId: id } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

//getCompany Hierarchy Data
export const getCompanyData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_COMPANY_HIERARCHY_DATA, { params: { CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

//getState Look up data
export const getStateData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_STATE_LOOKUP_DATA, { params: { CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
//getCompany Hierarchy Data by branch ID
export const getCompanyDataBybranchId = async (CompId: string,id:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_COMPANY_HIERARCHY_DATA_BY_BRANCHID, { params: { CompId: CompId,BranchId:id } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

//getLabel Levels data Data
export const getHierarchyLevelsData = async (CompId: string,id:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_HIERARCHY_LEVELS_DATA, { params: { CompId: CompId,hdnleveltype:id } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}