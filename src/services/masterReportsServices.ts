import { URL_GET_ASSET_CATEGORY_MASTER_REPORT, URL_GET_ASSET_LOCATION_MASTER_REPORT, URL_GET_COMPANY_HIERARCHY_MASTER_REPORT, URL_GET_COST_CENTER_MASTER_REPORT, URL_GET_CUSTOMER_LOCATIONS_DATA, URL_GET_CUSTOMER_LOCATIONS_MASTER_REPORT, URL_GET_CUSTOMER_MASTER_REPORT, URL_GET_DEPARTMENT_MASTER_REPORT, URL_GET_SERVICE_LOCATIONS_MASTER_REPORT, URL_GET_USER_LOG_MASTER_REPORT, URL_GET_USER_MASTER_REPORT, URL_GET_VENDOR_MASTER_REPORT } from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}
// Customer Locations
export const getCustomerLocations= async (CompId:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_CUSTOMER_LOCATIONS_DATA, { params: { CompId} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
//Company Hierarchy Master Report
export const getCompanyHierarchyReport= async (CompId:string,BranchId:string,FromDate:string,ToDate:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_COMPANY_HIERARCHY_MASTER_REPORT, { params: { CompId,BranchId,FromDate,ToDate} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
//Department Master Report
export const getDepartmentReport= async (CompId:string,DepartmentId:string,FromDate:string,ToDate:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_DEPARTMENT_MASTER_REPORT, { params: { CompId,DepartmentId,FromDate,ToDate} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
//Cost Center Master Report
export const getCostCenterReport= async (CompId:string,CostCenterId:string,FromDate:string,ToDate:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_COST_CENTER_MASTER_REPORT, { params: { CompId,CostCenterId,FromDate,ToDate} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
//Asset Location Master Report
export const getAssetLocationReport= async (CompId:string,AssetLocationId:string,FromDate:string,ToDate:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_ASSET_LOCATION_MASTER_REPORT, { params: { CompId,AssetLocationId,FromDate,ToDate} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
//Asset Category Master Report
export const getAssetCategoryReport= async (CompId:string,AssetCategoryId:string,FromDate:string,ToDate:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_ASSET_CATEGORY_MASTER_REPORT, { params: { CompId,AssetCategoryId,FromDate,ToDate} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
//User Master Report
export const getUserReport= async (CompId:string,UserId:string,FromDate:string,ToDate:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_USER_MASTER_REPORT, { params: { CompId,UserId,FromDate,ToDate} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
//Vendor Master Report
export const getVendorReport= async (CompId:string,VendorType:string,VendorId:string,FromDate:string,ToDate:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_VENDOR_MASTER_REPORT, { params: { CompId,VendorType,VendorId,FromDate,ToDate} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
//Customer Master Report
export const getCustomerReport= async (CompId:string,CustomerId:string,FromDate:string,ToDate:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_CUSTOMER_MASTER_REPORT, { params: { CompId,CustomerId,FromDate,ToDate} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
// User Log Master Report
export const getUserLogReport= async (CompId:string,FromDate:string,ToDate:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_USER_LOG_MASTER_REPORT, { params: { CompId,FromDate,ToDate} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
// Service Locations Master Report
export const getServiceLocationsReport= async (CompId:string,ServiceLocationId:string,FromDate:string,ToDate:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_SERVICE_LOCATIONS_MASTER_REPORT, { params: { CompId,ServiceLocationId,FromDate,ToDate} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}
// Customer Locations Master Report
export const getCustomerLocationsReport= async (CompId:string,CustomerLocationId:string,FromDate:string,ToDate:string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_CUSTOMER_LOCATIONS_MASTER_REPORT, { params: { CompId,CustomerLocationId,FromDate,ToDate} })
        return {success: true,data: response.data,}
    } catch (err: any) {
        return { success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
    }
}


