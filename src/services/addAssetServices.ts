import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//getASSETCategory Data
export const getAssetCategoryData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get('', { params: { CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}