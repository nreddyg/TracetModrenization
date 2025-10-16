import { URL_GET_VENDOR_DETAILS, URL_GET_VENDOR_LIST, URL_POST_UPDATE_VENDOR_DETAILS, URL_POST_VENDOR_DETAILS} from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//All Company List Based on UserId
export const GetVendorList= async (compId:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_VENDOR_LIST, { params: { CompId: compId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
export const postNewVendor = async (CompId: string,Data:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_VENDOR_DETAILS,Data, { params: { CompId:CompId,} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};
export const getEditVendorListByCompanyId= async (compId:string,VendorID:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_VENDOR_DETAILS, { params: { CompId: compId,VendorID:VendorID } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
export const updateVendor = async (CompId: string,vendorId:string,Data:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_UPDATE_VENDOR_DETAILS,Data, { params: { CompId:CompId,vendorId:vendorId} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};
export const deleteVendorByCompanyId = async (CompId: string,vendorId:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_UPDATE_VENDOR_DETAILS,"", { params: { CompId:CompId,Id:vendorId} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};