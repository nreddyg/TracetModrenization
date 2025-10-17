
import { URL_GET_SERVICELOCATIONS_LIST, URL_POST_SERVICELOCATIONS } from '@/config/apiUrls';
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
