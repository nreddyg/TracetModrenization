import { URL_GET_BRANCH_LOOKUP, URL_GET_COUNTRY_LIST, URL_GET_CUSTOMER_DETAILS, URL_GET_CUSTOMER_LIST, URL_GET_CUSTOMER_LOCATION_DATA, URL_POST_ADD_NEW_CUSTOMER, URL_POST_DELETE_CUSTOMER, URL_POST_UPDATE_CUSTOMER, } from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//All Customers List
export const GetCustomersList= async (compId:string, BranchName:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_CUSTOMER_LIST,{ params: { CompId: compId, BranchName:BranchName } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

//get country list
export const getBranchList= async (): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_BRANCH_LOOKUP, { params: {} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const postNewCustomer= async (CompId: string,Data:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_ADD_NEW_CUSTOMER,Data, { params: { CompId:CompId,} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};
export const getEditCustomerListByCompanyId= async (compId:string,CustomerId:string,branchName:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_CUSTOMER_DETAILS, { params: { CompId: compId,CustomerId:CustomerId,BranchName:branchName} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
//get country list
export const GetCountryList= async (): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_COUNTRY_LIST, { params: {} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
export const updateCustomer = async (CompId: string,customerId:string,Data:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_UPDATE_CUSTOMER,Data, { params: { CompId:CompId,customerId:customerId} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};
export const deleteCustomerByCompanyId = async (CompId: string,customerId:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_DELETE_CUSTOMER,"", { params: { CompId:CompId,Id:customerId} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

export const getCustomerLocations=async (companyId:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_CUSTOMER_LOCATION_DATA, { params: {CompId:companyId} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}