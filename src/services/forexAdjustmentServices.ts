


import { URL_GET_CALCULATION_LIST_LOOKUP, URL_GET_FOREX_ADJUSTMENT } from '@/config/apiUrls';
import api from './api';

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

export const getCalculationLookupList = async (): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_CALCULATION_LIST_LOOKUP)
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const getForexList = async (bookid:number,effectivedate:number,locationid:number,maincategoryid:number,subcategoryid:number,deparmentid:number,costcenterid:number,userattributeid:number,assetcode:string,compid:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_FOREX_ADJUSTMENT,{params:{BookId:bookid,EffectiveDate:effectivedate,LocationId:locationid,MainCategoryId:maincategoryid,SubCategoryId:subcategoryid,DepartmentId:deparmentid,CostCenterId:costcenterid,UserAttributeId:userattributeid,AssetCode:assetcode,CompId:compid}})
        return {success: true,data: response.data,}
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
