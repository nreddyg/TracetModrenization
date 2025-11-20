import { URL_GET_ASSET_TRANSFER_HIST_LIST } from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}
export const getAssetTransferHistList = async (BranchName: string, CompId: number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_ASSET_TRANSFER_HIST_LIST, { params: { BranchName, CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}