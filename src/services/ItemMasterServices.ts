import { URL_DELETE_ITEM_MASTER, URL_DELETE_STORE, URL_GET_ITEM_MASTER_DATA, URL_GET_STORE_DATA, URL_POST_NEW_ITEM_MASTER, URL_POST_NEW_STORE, URL_POST_UPDATE_ITEM_MASTER, URL_POST_UPDATE_STORE } from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}
//getCompany Hierarchy Data
export const getItemMasterData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_ITEM_MASTER_DATA, { params: { CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
export const getEditItemMasterData = async (CompId: string,id:number | string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_ITEM_MASTER_DATA, { params: { CompId: CompId,ItemMasterId:id } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const deleteItemMaster = async (compId: string, id: any , data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_ITEM_MASTER, data, { params: { CompId: compId, Id: id } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

export const addNewItemMaster = async (compId: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_NEW_ITEM_MASTER, data, { params: { CompId: compId} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

export const updateItemMaster = async (compId: string, id: any , data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_UPDATE_ITEM_MASTER, data, { params: { CompId: compId, ItemMasterId: id } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};