import { URL_DELETE_GROUP, URL_GET_USER_ATTRIBUTES_DATA_BY_ID, URL_POST_NEW_USER_ATTRIBUTES, URL_UPDATE_GROUP, URL_USER_ATTRIBUTES } from '@/config/apiUrls';
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
        const response = await api.get(URL_USER_ATTRIBUTES, { params: { CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
export const getEditUserAttributeData = async (CompId: string,id:number | string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_USER_ATTRIBUTES_DATA_BY_ID, { params: { CompId: CompId,GroupId:id } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const deleteUserAttribute = async (compId: string, id: any , data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_GROUP, data, { params: { CompId: compId, GroupId: id } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

export const addNewUserAttribute = async (compId: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_NEW_USER_ATTRIBUTES, data, { params: { CompId: compId} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

export const updateUserAttribute = async (compId: string, id: any , data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_UPDATE_GROUP, data, { params: { CompId: compId, GroupId: id } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

