import {URL_ADD_OR_UPDATE_LICENSE_ASIGNMENT, URL_DELETE_LICENSE_ASSIGNMENT_BY_ID, URL_GET_LICENSE_ASSIGNMENT_LIST} from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

// Add or Update Software License Assignment
export const addOrUpdateLicenseAssignment = async (CompId: string,data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_ADD_OR_UPDATE_LICENSE_ASIGNMENT, data, { params: { CompId } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

//get All  Software Licenses
export const getLicenseAssigmentsList= async (CompId:string,LicenseAssignmentId?:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_LICENSE_ASSIGNMENT_LIST, { params: { CompId,...(LicenseAssignmentId?{LicenseAssignmentId}:{}) } })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
//Delete Software by ID
export const deleteLicenseAssignmentById = async (CompId: string,LicenseAssignmentId:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_DELETE_LICENSE_ASSIGNMENT_BY_ID,'', { params: { CompId,LicenseAssignmentId } });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};
