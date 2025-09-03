import { URL_ORGANZIATION_DETAILS } from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}
//get organization details by token
export const getOrganizationDetailsByToken = async (): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_ORGANZIATION_DETAILS, { params: {} })
        return { success: true, data: response.data }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
