import { URL_DELETE_USER, URL_GET_CATEGORIES, URL_GET_DEPARTMENTS, URL_GET_ROLES, URL_GET_USER_LIST, URL_POST_NEW_USER, URL_POST_UPDATE_USER } from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//All Company List Based on UserId
export const GetUsersList= async (CompId:string,UserId?:number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_USER_LIST, { params: { CompId, UserId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
// Get Department List Based on CompanyId
export const getDepartmentList = async (CompId:string): Promise<APIResponse<any>> => {
  try {
        const response = await api.get(URL_GET_DEPARTMENTS, { params: { CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
// Get Role List Based on CompanyId
export const getRoleNamesList = async (CompId:string): Promise<APIResponse<any>> => {
   try {
        const response = await api.get(URL_GET_ROLES, { params: { CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
// Get Category List Based on CompanyId
export const getCategoryList = async (CompId:string): Promise<APIResponse<any>> => {
  try {
        const response = await api.get(URL_GET_CATEGORIES, { params: { CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
// Create New User
export const createUser = async (CompId:string, data:any): Promise<APIResponse<any>> => {
  try {
        const response = await api.post(URL_POST_NEW_USER,data, { params: { CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
};
// Delete User
export const deleteUser = async (CompId:string,Id:string): Promise<APIResponse<any>> => {
  try {
        const response = await api.post(URL_DELETE_USER, { params: { CompId, Id } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
};
// Update User Info by UserId
export const updateUser = async (CompId:string, UserId:number, data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_UPDATE_USER, data, { params: { CompId, UserId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
};