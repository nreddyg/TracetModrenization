import { URL_GET_SMTP_CONFIG, URL_POST_ADD_OR_UPDATE_SMTP_CONFIG } from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}


export const getSMTPConfig = async (compId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_SMTP_CONFIG, { params: { CompanyID: compId } });
        return { success: true, data: response.data };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
};

//save service request configuration

export const postSMTPconfiguration = async (compId: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_ADD_OR_UPDATE_SMTP_CONFIG, data, { params: { CompanyID: compId} });
        return { success: true, data: response.data };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status, };
    }
};