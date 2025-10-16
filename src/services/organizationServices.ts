import { URL_ADD_ORGANIZATION, URL_GET_COUNTRY_LIST, URL_GET_CURRENCY_LIST, URL_GET_ORGANIZATION_LIST, URL_UPDATE_ORGANIZATION} from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//All Company List Based on UserId
export const GetOrganizationsList= async (OrgId?:number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_ORGANIZATION_LIST, { params: { OrgId} })
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
//get currency list
export const GetCurrency= async (Country:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_CURRENCY_LIST, { params: { Country } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
//Add Organization
export const AddOrganization= async (data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_ADD_ORGANIZATION, data)
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
//Update Organization
export const UpdateOrganization= async (data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_UPDATE_ORGANIZATION, data,{})
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}