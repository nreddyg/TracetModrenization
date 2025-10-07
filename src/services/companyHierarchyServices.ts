// services/customerService.ts
import { URL_GET_COMPANY_HIERARCHY_DATA, URL_POST_COMPANY_HIERARCHY_DATA, URL_POST_DEPARTMENT_DATA} from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//Post department Data
export const getDepartment = async (compId: string, branchname: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_COMPANY_HIERARCHY_DATA, data, { params: { CompId: compId, branchname: branchname } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

//getDepartment Data
export const getCompanyData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_COMPANY_HIERARCHY_DATA, { params: { CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}