import { URL_ASSET_LOCATION_DETAILS, URL_GET_BRANCH_LIST, URL_GET_DEPARTMENT_DETAILS, URL_GET_LIST_BY_IDS, URL_GET_PLACE_OF_SUPPLY } from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

export const getAssetsTrnsfToList = async (BranchName: string, AssetIds: any, CompId: number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_LIST_BY_IDS, { params: { BranchName, AssetIds, CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
export const getPlaceOfSupply = async (frombranchname: string, tobranchname: string, CompId: number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_PLACE_OF_SUPPLY, { params: { frombranchname, tobranchname, CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
export const getBranchDetails = async (CompId: number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_BRANCH_LIST, { params: { CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
export const getDepartmentDetails = async (CompId: number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_DEPARTMENT_DETAILS, { params: { CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
export const getLocationDetails = async (CompId: number, branchName: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_ASSET_LOCATION_DETAILS, { params: { CompId, branchName } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}