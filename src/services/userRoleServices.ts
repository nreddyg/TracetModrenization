import {URL_USER_WISE_MODULE_LIST} from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//All Company List Based on UserId
export const getUserWiseModuleList= async (userId:any,compId:number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_USER_WISE_MODULE_LIST, { params: {UserId:userId, CompId: compId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}