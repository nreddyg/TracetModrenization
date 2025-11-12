import { URL_ADD_OR_UPDATE_SOFTWARE_LICENSE, URL_ASSET_TRANSFER_LIST, URL_BASIC_SEARCH, URL_DELETE_SOFTWARE_BY_ID, URL_DELETE_SOFTWARE_LICENSE_BY_ID, URL_FILTER_SEARCH, URL_GET_ALL_CATEGORIES, URL_GET_SOFTWARES_LICENSES_LIST, URL_GET_VENDOR_DETAILS_BY_COMPID } from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

export const getAssetTransferAssets = async (BranchName: string, CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_ASSET_TRANSFER_LIST, { params: { BranchName, CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

export const getAssetTransferBasicSearch = async (searchText: string, BranchName: string, CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_BASIC_SEARCH, { params: { SearchText: searchText, branchName: BranchName, CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

export const getAssetTransferFilterSearch = async (CompId: string, BranchName: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_FILTER_SEARCH, data, { params: { CompId: CompId, branchName: BranchName } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
