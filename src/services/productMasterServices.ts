
import { URL_DELETE_PRODUCTS, URL_EDIT_PRODUCTS, URL_POST_PRODUCTS, URL_PRODUCT_MASTERS, URL_UPDATE_PRODUCTS } from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

export const getProducts = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_PRODUCT_MASTERS, { params: { CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const addProducts = async (CompId: string,data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_PRODUCTS,data, { params: { CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const editProducts=async (id:number,CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_EDIT_PRODUCTS, { params: {Id:id,CompId: CompId} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const updateProducts=async (id:number,CompId: string,data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_UPDATE_PRODUCTS, data,{ params: {Id:id,CompId: CompId} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const deleteProducts=async (id:number,CompId: String): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_PRODUCTS, "",{ params: {Id:id,CompId: CompId} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}