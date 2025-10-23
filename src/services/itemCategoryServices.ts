import { URL_GET_ITEM_CATEGORY } from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//getASSETCategory Data
export const getItemCategoryData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_ITEM_CATEGORY, { params: { CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}