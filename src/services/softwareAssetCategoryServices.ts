import { URL_ADD_OR_UPDATE_CATEGORY, URL_DELETE_CATEGORY_BY_ID, URL_GET_ALL_CATEGORIES} from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//Add or Update Software Category
export const addOrUpdateSoftwareCategory = async (CompId: string,data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_ADD_OR_UPDATE_CATEGORY, data, { params: { CompId } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

//get All Software Categories
export const getCategoriesList= async (CompId:string,CategoryId?:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_ALL_CATEGORIES, { params: { CompId,...(CategoryId?{CategoryId}:{}) } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
//Delete Software Category by ID
export const deleteCategoryById = async (CompId: string,CategoryId:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_CATEGORY_BY_ID,'', { params: { CompId,CategoryId } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};