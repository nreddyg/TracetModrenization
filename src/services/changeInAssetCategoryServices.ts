import { URL_GET_CHANGE_ASSET_CATEGORY, URL_GET_COLUMNS_FOR_CHANGE_ASSET_CATEGORY } from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

export const GetChangeAssetCategories= async (branchName:any,main:any,sub:any,compId:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_CHANGE_ASSET_CATEGORY,{ params: {branchName:branchName,MainCatId:main,SubCatId:sub, CompId: compId} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
export const GetGetColumnsForChangeAssetCategories= async (branchName:any,compId:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_COLUMNS_FOR_CHANGE_ASSET_CATEGORY,{ params: {BranchName:branchName, CompId: compId} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}