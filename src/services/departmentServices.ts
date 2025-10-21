// services/customerService.ts
import { HIERARCHY_LEVEL_DATA, URL_DELETE_DEPARTMENT_DATA, URL_GET_DEPARTMENT_DATA, URL_GET_DEPARTMENT_DATA_BY_DEPId, URL_GET_HEIRARCHY_DETAILS_LAST_LEVEL, URL_POST_DEPARTMENT_DATA } from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//Post department Data
export const postOrUpdateDepartmentData = async (departId: Number, compId: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_DEPARTMENT_DATA, data, { params: { departmentId: departId, CompId: compId } });
        return { success: true, data: response.data };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status, };
    }
};

//getDepartment Data
export const getDepartmentData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_DEPARTMENT_DATA, { params: { CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

//getDepartment Data
export const getDepartmentDataByID = async (departid: number, CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_DEPARTMENT_DATA_BY_DEPId, { params: { deptid: departid, CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

// Delete department Data
export const deleteDepartmentData = async (id: any, compId: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_DEPARTMENT_DATA, data, { params: { Id: id, CompId: compId } });
        return { success: true, data: response.data };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status, };
    }
};


export const getHierarchyLevelsdata = async (id: any, compId: string,) => {
    try {
        let response = await api.get(HIERARCHY_LEVEL_DATA, { params: { hdnleveltype: id, CompId: compId } })
        return { success: true, data: response.data };
    }
    catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status, };
    }
}