import { URL_DELETE_ASSET_CATEGORY_REC, URL_GET_ASSET_CATEGORY_DATA, URL_POST_ASSET_CATEGORY_DATA, URL_UPDATE_ASSET_CATEGORY_DATA } from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//getASSETCategory Data
export const getAssetCategoryData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_ASSET_CATEGORY_DATA, { params: { CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
// URL_POST_ASSET_CATEGORY_DATA
export const postAssetCatDetails = async (CompId: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_ASSET_CATEGORY_DATA, data, { params: { CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

//GET assetCategories based on id and companyID
export const getAssetCatByID = async (id: number, CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_ASSET_CATEGORY_DATA, { params: {AssetCategoryId:id, CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

// update asset category data
export const updateAssetCat = async (mainCatID: number, subCatID: number, CompId: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_UPDATE_ASSET_CATEGORY_DATA, data, { params: {MainAssetCategoryId: mainCatID, SubAssetCategoryId: subCatID, CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

// delete API data
export const deleteAssetCat = async (AssetCatID: number, CompId: string,data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post( URL_DELETE_ASSET_CATEGORY_REC, data, { params: {AssetCategoryId: AssetCatID, CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}