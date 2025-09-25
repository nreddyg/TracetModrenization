import { URL_GET_TICKET_PROGRESS_DASHBOARD_DATA } from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//Analytics Data
export const getAnalyticsData = async (compId: string | number, branchId: string, graphType: string,data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_GET_TICKET_PROGRESS_DASHBOARD_DATA,data,{params: { CompId: compId, BranchId:branchId , graphType: graphType }} )
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}



