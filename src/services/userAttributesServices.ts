import { URL_DELETE_CONVERSION, URL_DELETE_ITEM_MASTER, URL_DELETE_STORE, URL_DELETE_UNITS_OF_MEASURE, URL_GET_ITEM_MASTER_DATA, URL_GET_MANAGE_UNITS_OF_MEASURE_DATA, URL_GET_STORE_DATA, URL_GET_UNITS_OF_MEASURE_DATA, URL_GET_UNITS_OF_MEASURE_DATA_BY_ID, URL_GET_USER_ATTRIBUTES, URL_POST_NEW_ITEM_MASTER, URL_POST_NEW_STORE, URL_POST_NEW_UNITS_OF_MEASURE, URL_POST_UPDATE_ITEM_MASTER, URL_POST_UPDATE_STORE, URL_POST_UPDATE_UNITS_OF_MEASURE } from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}
//getCompany Hierarchy Data
export const getUserAttributes = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_USER_ATTRIBUTES, { params: { CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
export const getEditUOMData = async (CompId: string,id:number | string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_UNITS_OF_MEASURE_DATA_BY_ID, { params: { CompId: CompId,UOMId:id } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const deleteUOM = async (compId: string, id: any , data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_UNITS_OF_MEASURE, data, { params: { CompId: compId, Id: id } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

export const addNewUOM = async (compId: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_NEW_UNITS_OF_MEASURE, data, { params: { CompId: compId} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

export const updateUOM = async (compId: string, id: any , data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_UPDATE_UNITS_OF_MEASURE, data, { params: { CompId: compId, UOMId: id } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};


export const getConversionUOMData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_MANAGE_UNITS_OF_MEASURE_DATA, { params: { CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
export const deleteConversion = async (compId: string, id: any , data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_CONVERSION, data, { params: { CompId: compId, UnitConversionId: id } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};
export const addNewConversion = async (compId: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_NEW_UNITS_OF_MEASURE, data, { params: { CompId: compId} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};