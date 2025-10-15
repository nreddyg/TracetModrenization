import {URL_ADD_OR_UPDATE_SOFTWARE_LICENSE, URL_DELETE_SOFTWARE_BY_ID, URL_DELETE_SOFTWARE_LICENSE_BY_ID,URL_GET_ALL_CATEGORIES,URL_GET_SOFTWARES_LICENSES_LIST, URL_GET_VENDOR_DETAILS_BY_COMPID} from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

// Add or Update Software Asset Registry
export const addOrUpdateSoftwareAsset = async (CompId: string,data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_ADD_OR_UPDATE_SOFTWARE_LICENSE, data, { params: { CompId } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

//get All  Software Licenses
export const getSoftwaresList= async (CompId:string,SoftwareId?:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_SOFTWARES_LICENSES_LIST, { params: { CompId,...(SoftwareId?{SoftwareId}:{}) } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
//Delete Software by ID
export const deleteSoftwareById = async (CompId: string,SoftwareId:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_SOFTWARE_BY_ID,'', { params: { CompId,SoftwareId } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};
//Delete Software License based on SoftwareId, LicenseDetailId & CompanyId
export const deleteSoftwareLicenseById = async (CompId: string,SoftwareId:string,LicenseDetailId:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_SOFTWARE_LICENSE_BY_ID,'', { params: { CompId,SoftwareId,LicenseDetailId } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

export const vendorsLookUp= async(compId:string)=>{
    try{
    const response =await api.get(URL_GET_VENDOR_DETAILS_BY_COMPID,{params:{CompId:compId}})
    return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}

export const categoryLookUp =async (compId:string)=>{

    try {
      const response=await api.get(URL_GET_ALL_CATEGORIES,{params:{CompId:compId}})
      return {success: true,data: response.data}

    }catch(err:any){
            return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}