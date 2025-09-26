import { URL_CHANGE_PASSWORD, URL_GET_USER_DETAILS, URL_ORGANZIATION_DETAILS } from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

// change pw
export const postLatestPassword = async (data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_CHANGE_PASSWORD, data);
        return { success: true, data: response.data };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status, };
    }
};
