

import { URL_DELETE_COSTCENTER, URL_GET_COSTCENTER_BY_ID, URL_GET_COSTCENTER_DATA, URL_POST_COSTCENTER } from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

export const getCostCenterData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_COSTCENTER_DATA, { params: { CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}


export const postCostCenter = async (CompId: string,costcenterId:number,data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_COSTCENTER,data, { params: { CompId: CompId ,costcenterId:costcenterId} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const getCostcenterById=async (CompId: string,id:number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_COSTCENTER_BY_ID, { params: {costcentid:id,CompId:CompId} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const deleteCostCenter=async (CompId: string,id:number,data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_COSTCENTER,data, { params: {Id:id,CompId:CompId} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

