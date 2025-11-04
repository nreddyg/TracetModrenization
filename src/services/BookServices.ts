import { URL_DELETE_BOOK_CATEGORY, URL_DELETE_DEPRECIATION_BOOK, URL_DELETE_GROUP_BY_ID, URL_GET_ADDITIONAL_DEPRECIATION_BOOK, URL_GET_BOOK_CATEGORY_LIST, URL_GET_BRANCH_LOOKUP, URL_GET_CHECK_DEP_RAN_FY, URL_GET_COUNTRY_LIST, URL_GET_CUSTOMER_DETAILS, URL_GET_CUSTOMER_LIST, URL_GET_CUSTOMER_LOCATION_DATA, URL_GET_DEPRECIATION_BOOK_DETAILS, URL_GET_DEPRECIATION_BOOK_DETAILS_BY_ID, URL_GET_EFFECTIVE_FROM_DATE, URL_GET_GROUP_BY_BOOK_ID, URL_POST_ADD_ADDITIONAL_DEPRECIATION, URL_POST_ADD_CUSTOMER_LOCATION, URL_POST_ADD_DEPRECIATION_MASTER, URL_POST_ADD_GROUP_CATEGORY_DETAILS, URL_POST_ADD_NEW_CUSTOMER, URL_POST_DELETE_CUSTOMER, URL_POST_DELETE_CUSTOMER_LOCATION, URL_POST_UPDATE_ADDITIONAL_DEPRECIATION, URL_POST_UPDATE_BOOK_DETAILS, URL_POST_UPDATE_CUSTOMER, URL_POST_UPDATE_CUSTOMER_LOCATION, URL_POST_UPDATE_GROUP_CATEGORY_DETAILS, } from "@/config/apiUrls";
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
        const response = await api.get(URL_GET_DEPRECIATION_BOOK_DETAILS_BY_ID,{ params: { CompId: compId,BookId:bookId} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
export const GetDepreciationBookDetails = async (compId:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_DEPRECIATION_BOOK_DETAILS,{ params: { CompId: compId} })
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

export const GetIsDepRanForFy = async (compId:string,bookId:string,EffectiveDate:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_CHECK_DEP_RAN_FY,{ params: { CompId: compId,BookId:bookId,EffectiveDate:EffectiveDate} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}


export const AddOrUpdateBookCat= async (CompId: string,EffectiveFrom:string,BookId:string,Data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_ADD_ADDITIONAL_DEPRECIATION,Data, { params: { CompId:CompId,BookId:BookId,EffectiveFrom:EffectiveFrom} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

export const AddGroupCategoryDetails= async (CompId: string,EffectiveFrom:string,BookId:string,Data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_ADD_GROUP_CATEGORY_DETAILS,Data, { params: { CompId:CompId,BookId:BookId,EffectiveFrom:EffectiveFrom} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

export const AddDepBookMasterDetails= async (CompId: string,Data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_ADD_DEPRECIATION_MASTER,Data, { params: { CompId:CompId} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

export const updateBookDetails= async (CompId: string,BookId:string,Data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_UPDATE_BOOK_DETAILS,Data, { params: { CompId:CompId,BookId:BookId} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};
export const UpdateGroupCategoryDetails= async (CompId: string,BookId:string,groupId:string,Data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_UPDATE_GROUP_CATEGORY_DETAILS,Data, { params: { CompId:CompId,BookId:BookId,groupId:groupId} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

export const DeleteDepreciationBook= async (CompId: string,Id:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_DEPRECIATION_BOOK,"", { params: { CompId:CompId,BookId:Id} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

export const DeleteGroupById= async (CompId: string,Id:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_GROUP_BY_ID,"", { params: { CompId:CompId,groupId:Id} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};
export const DeleteBookCategory= async (CompId: string,Id:string,BookId:string,EffectiveFromDate:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_BOOK_CATEGORY,"", { params: { CompId:CompId,CatId:Id,BookId:BookId,EffectiveFromDate:EffectiveFromDate} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};