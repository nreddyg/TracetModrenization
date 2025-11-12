
import { URL_DELETE_SERVICELOCATIONS, URL_GET_SERVICELOCATIONS_LIST, URL_POST_SERVICELOCATIONS, URL_UPDATE_SERVICE_LOCATIONS } from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

export const getServiceLocationData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_SERVICELOCATIONS_LIST, { params: { CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const postServiceLocationData = async (CompId: string,data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_SERVICELOCATIONS,data, { params: { CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const deleteServiceLocation = async (compid: string,id:number): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_SERVICELOCATIONS,"", { params: { Id:id,CompId:compid } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const updateServiceLocation=async (compid: string,id:number,data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_UPDATE_SERVICE_LOCATIONS,data, { params: { serviceLocationId:id,CompId:compid } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}