import { URL_ADD_OR_UPDATE_SOFTWARE_LICENSE, URL_ASSET_TRANSFER_LIST, URL_BASIC_SEARCH, URL_DELETE_SOFTWARE_BY_ID, URL_DELETE_SOFTWARE_LICENSE_BY_ID, URL_FILTER_SEARCH, URL_GET_ALL_CATEGORIES, URL_GET_ASSET_TRANSFER_HIST_LIST, URL_GET_SOFTWARES_LICENSES_LIST, URL_GET_VENDOR_DETAILS_BY_COMPID } from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}
export const getAssetTransferHistList = async (BranchName: string, CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_ASSET_TRANSFER_HIST_LIST, { params: { BranchName, CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}