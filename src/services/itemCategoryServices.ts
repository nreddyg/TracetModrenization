import { URL_ADD_ITEM_CATEGORY, URL_DELETE_ITEM_CATEGORY, URL_GET_ITEM_CATEGORY, URL_ITEM_CATEGORY_BY_ID, URL_UNIT_OF_MEASURE, URL_UPDATE_ITEM_CATEGORY } from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//getASSETCategory Data
export const getItemCategoryData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_ITEM_CATEGORY, { params: { CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

export const getUnitOfMeasure = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_UNIT_OF_MEASURE, { params: { CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
// URL_ADD_ITEM_CATEGORY
export const postItemCatDetails = async (CompId: string, data: any): Promise<APIResponse<any>> => {
    console.log("data", data);
    try {
        const response = await api.post(URL_ADD_ITEM_CATEGORY, data, { params: { CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
// update asset category data
export const updateItemCat = async (mainCatID: number, CompId: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_UPDATE_ITEM_CATEGORY, data, { params: { ItemCategoryId: mainCatID, CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

export const deleteItemCat = async (id: number, CompId: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_ITEM_CATEGORY, data, { params: { Id: id, CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

//GET assetCategories based on id and companyID
export const getItemtCatByID = async (id: number, CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_ITEM_CATEGORY_BY_ID, { params: { ItemCategoryId: id, CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}