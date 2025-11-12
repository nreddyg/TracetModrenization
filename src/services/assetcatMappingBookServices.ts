import { URL_ADD_OR_UPDATE_NEW_FIN_YEAR, URL_ASSET_CAT_BOOK_MAPPING_DETAILS, URL_ASSET_CATEGORIES_PREV_NEXT_DATES, URL_DEP_BOOK_DETAILS, URL_DOWNLOAD_EXCEL_DATA, URL_GET_DATE_LIST, URL_GET_PREV_NEXT_FINANCIAL_YEAR_BOOK_DETAILS, URL_POST_UPLOAD_EXCEL_DATA } from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//getASSETCategory Data
export const getDepBookDetails = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_DEP_BOOK_DETAILS, { params: { CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

// BOOKMAPpping details
export const getAssetCategoryBookMappingDetails = async (id: number, CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_ASSET_CAT_BOOK_MAPPING_DETAILS, { params: { BookId: id, CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

// drop options for table
export const getDropdownOptions = async (id: number, CompId: string, date: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_PREV_NEXT_FINANCIAL_YEAR_BOOK_DETAILS, { params: { BookId: id, CompId: CompId, EffectiveFromDate: date } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

// URL_ADD_OR_UPDATE_NEW_FIN_YEAR
export const postOrUpdtAddNewFinancialYear = async (id: number, date: string, CompId: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_ADD_OR_UPDATE_NEW_FIN_YEAR, data, { params: { BookId: id, EffectiveFrom: date, CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

// getting asset categories based on years
export const getAssetCatBasedOnYear = async (CompId: string, date: string, id: number,): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_ASSET_CATEGORIES_PREV_NEXT_DATES, { params: { CompId: CompId, EffectiveDate: date, BookId: id } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}


export const getDateList = async (CompId: string, id: number,): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_DATE_LIST, { params: { CompId: CompId, BookId: id } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

export const getDownloadAssetCatData = async (fyDate: string, id: number, CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_DOWNLOAD_EXCEL_DATA, { params: { effectiveFrom: fyDate, BookId: id, CompId: CompId, } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

// post AssetCat excel data
export const postExcelData = async (date: string, ID: number, CompId: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_UPLOAD_EXCEL_DATA, data, { params: { EffectiveDate: date, BookId: ID, CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}