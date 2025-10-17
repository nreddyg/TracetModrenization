import { URL_DELETE_STORE, URL_GET_STORE_DATA, URL_POST_NEW_STORE, URL_POST_UPDATE_STORE } from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}
//getCompany Hierarchy Data
export const getStoreData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_STORE_DATA, { params: { CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
export const getEditStoreData = async (CompId: string,id:number | string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_STORE_DATA, { params: { CompId: CompId,StoreId:id } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
export const getStoreDataByCompanyIdAndBranchName= async (CompId: string,branch:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_STORE_DATA, { params: { CompId: CompId,branchName:branch } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const deleteStore = async (compId: string, id: any , data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_STORE, data, { params: { CompId: compId, Id: id } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

export const addNewStore = async (compId: string, branch: any , data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_NEW_STORE, data, { params: { CompId: compId, BranchName: branch } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

export const updateStore = async (compId: string, id: any , data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_UPDATE_STORE, data, { params: { CompId: compId, StoreId: id } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};