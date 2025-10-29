import { URL_GET_ADDITIONAL_DEPRECIATION_BOOK, URL_GET_BOOK_CATEGORY_LIST, URL_GET_BRANCH_LOOKUP, URL_GET_COUNTRY_LIST, URL_GET_CUSTOMER_DETAILS, URL_GET_CUSTOMER_LIST, URL_GET_CUSTOMER_LOCATION_DATA, URL_GET_DEPRECIATION_BOOK_DETAILS, URL_GET_EFFECTIVE_FROM_DATE, URL_GET_GROUP_BY_BOOK_ID, URL_POST_ADD_ADDITIONAL_DEPRECIATION, URL_POST_ADD_CUSTOMER_LOCATION, URL_POST_ADD_NEW_CUSTOMER, URL_POST_DELETE_CUSTOMER, URL_POST_DELETE_CUSTOMER_LOCATION, URL_POST_UPDATE_ADDITIONAL_DEPRECIATION, URL_POST_UPDATE_CUSTOMER, URL_POST_UPDATE_CUSTOMER_LOCATION, } from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

export const GetAdditionalDepreciationBookDetails= async (compId:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_ADDITIONAL_DEPRECIATION_BOOK,{ params: { CompId: compId} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const AddAdditionalDepreciationBookDetails= async (CompId: string,Data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_ADD_ADDITIONAL_DEPRECIATION,Data, { params: { CompId:CompId} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};
export const updateAdditionalDepreciationDetails= async (CompId: string,Data:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_UPDATE_ADDITIONAL_DEPRECIATION,Data, { params: { CompId:CompId} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};
export const DeleteAdditionalDepreciation= async (CompId: string,Id:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_UPDATE_ADDITIONAL_DEPRECIATION,"", { params: { CompId:CompId,AdditionalDepreciationId:Id} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

export const GetGroupByBookIdDetails = async (compId:string,bookId:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_GROUP_BY_BOOK_ID,{ params: { CompId: compId,bookID:bookId} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const GetBookDetailsById = async (compId:string,bookId:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_DEPRECIATION_BOOK_DETAILS,{ params: { CompId: compId,BookId:bookId} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}


export const GetBookCatListById = async (compId:string,bookId:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_BOOK_CATEGORY_LIST,{ params: { CompId: compId,BookId:bookId} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const GetEffectiveFromDates = async (compId:string,bookId:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_EFFECTIVE_FROM_DATE,{ params: { CompId: compId,BookId:bookId} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}