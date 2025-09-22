import { URL_GET_TICKET_PROGRESS_DASHBOARD_DATA } from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//Analytics Data
export const getAnalyticsData = async (CompId: number, branchName: string, graphType: string,data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_GET_TICKET_PROGRESS_DASHBOARD_DATA,data,{params: { compId: CompId, branchName: branchName, graphType: graphType }} )
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}



