import { URL_DOWNLOAD_IMPORT_ASSET_WISE, URL_POST_IMPORT_WISE_ACCUMULATED_VALUE } from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

export const getDownloadAssetWise = async (bookid:number,physicallocationid:number,costcenterid:number,departmentid:number,maincategoryid:number,subcategoryid:number,compid:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_DOWNLOAD_IMPORT_ASSET_WISE,{params:{BookId:bookid,PhysicalLocationIds:physicallocationid,CostCenterIds:costcenterid,DepartmentIds:departmentid,MainCategoryIds:maincategoryid,SubCategoryIds:subcategoryid,CompId:compid}})
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const postAccumulatedValues = async (branchname:string,bookid:number,compid:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_IMPORT_WISE_ACCUMULATED_VALUE,{params:{branchname:branchname,BookId:bookid,CompId:compid}})
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}