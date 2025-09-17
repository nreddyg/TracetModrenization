import { URL_GET_BRANCH_LIST, URL_GET_COMPANY_LIST } from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//All Company List Based on UserId
export const GetCompanyListBasedonUserId= async (UserId:number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_COMPANY_LIST, { params: { userId: UserId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
//All Branch List Based on CompanyId
export const GetBranchListBasedonCompanyId= async (CompId:number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_BRANCH_LIST, { params: { CompId: CompId } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}