// services/customerService.ts
import { URL_ASSET_LOCATION_DETAILS, URL_DELETE_LOC, URL_POST_ASSET_LOC_DATA,} from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//getDepartment Data
export const getAssetLocationDetals = async (CompId: string, branchName: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_ASSET_LOCATION_DETAILS, { params: { CompId: CompId, branchName: branchName } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

export const getAssetLocationDataByLocID = async (branchName: string, locationid: number, CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_ASSET_LOCATION_DETAILS, { params: { branchName: branchName, locationid: locationid, CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

export const postOrUpdateAssetLocationDetails = async (locationId: number, BranchName: string, CompId: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_ASSET_LOC_DATA, data, { params: { locationId: locationId, BranchName: BranchName, CompId: CompId } })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}

export const deleteAssetLocData = async (id: any, compId: string, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_LOC, data, { params: { Id: id, CompId: compId } });
        return { success: true, data: response.data };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status, };
    }
};
