

import { URL_DELETE_COSTBREAKUP, URL_GET_COSTBREAKUP_LIST, URL_POST_COSTBREAKUP, URL_UPDATE_COSTBREAKUP } from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

export const getCostBreakUpList = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_COSTBREAKUP_LIST, { params: { CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const postCostBreakup = async (CompId: string,data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_COSTBREAKUP,data, { params: { CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const UpdateCostBreakup = async (id:number,data:any,CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_UPDATE_COSTBREAKUP,data, { params: { GroupId:id,CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const editCostBreakup = async (id:number,CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_COSTBREAKUP_LIST, { params: { GroupId:id,CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const deleteCostBreakup = async (id:number,CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_COSTBREAKUP,"", { params: { GroupId:id,CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

