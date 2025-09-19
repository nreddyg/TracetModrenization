import { URL_GET_CUSTOMER_LIST, } from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//All Customers List
export const GetCustomersList= async (compId:number, BranchName:string): Promise<APIResponse<any>> => {
    console.log("sachin")
    try {
        const response = await api.get(URL_GET_CUSTOMER_LIST, { params: { CompId: compId,BranchName:BranchName } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}