import { URL_GET_ACQUISITION_TYPE_LIST, URL_GET_ASSET_DETAILS, URL_GET_ASSET_OWNER_LOOKUP_DATA, URL_GET_ASSET_TAGGABLE_LOOKUP_DATA, URL_GET_ASSIGNED_TO_LOOKUP_DATA, URL_GET_COST_BREAKUP_DATA_BY_ASSET_ID, URL_GET_DEPARTMENT_LOOKUP_DATA_BY_USER, URL_GET_DEPENDENCY_TYPE_LIST, URL_GET_GROUP_ASSET_CARD_DETAILS, URL_GET_MANUFACTURER_LOOKUP_DATA, URL_GET_RETIRE_DETAILS_BY_ASSET_ID, URL_GET_SELLER_LOOKUP_DATA, URL_GET_USER_ATTRIBUTES_BY_SUB_CAT, URL_GET_WORKING_CONDITION_LOOKUP_LIST, URL_POST_ADD_ASSET_DETAILS, URL_POST_ADD_ASSET_DETAILS_WITH_ATTRIBUTES, URL_POST_UPDATE_ASSET_DETAILS, URL_POST_UPDATE_ASSET_DETAILS_WITH_ATTRIBUTES } from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//Acquisition Type Lookup Data
export const getAssetAcquistionTypeLookupData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_ACQUISITION_TYPE_LIST, { params: {CompId} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
//Working Condition Type Lookup Data
export const getWorkingConditionLookupData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_WORKING_CONDITION_LOOKUP_LIST, { params: {CompId} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
//Dependency Type Lookup Data
export const getDependencyLookupData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_DEPENDENCY_TYPE_LIST, { params: {CompId} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
//Asset Taggable Lookup Data
export const getAssetTaggableLookupData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_ASSET_TAGGABLE_LOOKUP_DATA, { params: {CompId} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
// Departments by user
export const getDepartmentLookupByUser = async (CompId: string,userid:number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_DEPARTMENT_LOOKUP_DATA_BY_USER, { params: {CompId,userid} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
//Assigned to data
export const getAssignedToUserLookupData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_ASSIGNED_TO_LOOKUP_DATA, { params: {CompId} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
// Asset Owner
export const getAssetOwnerLookupData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_ASSET_OWNER_LOOKUP_DATA, { params: {CompId} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
//Seller Lookup
export const getSellerLookupData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_SELLER_LOOKUP_DATA, { params: {CompId} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
// Lookup
export const getManufacturerLookupData = async (CompId: string): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_MANUFACTURER_LOOKUP_DATA, { params: {CompId} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
//User attributes by sub category id
export const getUserAttributesData = async (CompId: string,CatId:number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_USER_ATTRIBUTES_BY_SUB_CAT, { params: {CompId,CatId} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
// Cost Breakup Data By Sub Category Id
export const getCostBreakupData = async (CompId: string,CategoryId:number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_USER_ATTRIBUTES_BY_SUB_CAT, { params: {CompId,CategoryId} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
// Asset Details by asset id
export const getAssetDetailsById = async (CompId: string,BranchName:string,AssetId:number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_ASSET_DETAILS, { params: {CompId,BranchName,AssetId} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
// Asset Card Details By Asset Id
export const getViewAssetCardDetailsByAssetId = async (CompId: string,AssetId:number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_ASSET_DETAILS, { params: {CompId,AssetId} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
// Group Asset Card Details By Asset Id
export const getGroupAssetViewCardDetailsByAssetId = async (CompId: string,AssetId:number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_GROUP_ASSET_CARD_DETAILS, { params: {CompId,AssetId} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
// Group Asset Card Details By Asset Id
export const getCostBreakupDetailsByAssetId = async (CompId: string,AssetId:number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_COST_BREAKUP_DATA_BY_ASSET_ID, { params: {CompId,AssetId} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
//Asset is Retired or not details by asset id
export const getAssetRetireDetailsByAssetId = async (CompId: string,AssetId:number): Promise<APIResponse<any>> => {
    try {
        const response = await api.get(URL_GET_RETIRE_DETAILS_BY_ASSET_ID, { params: {CompId,AssetId} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
// Add new asset
export const addNewAsset = async (CompId:string,DependencyTypeName:string,data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_ADD_ASSET_DETAILS, data, { params: { CompId,DependencyTypeName} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
//Update Asset
export const updateAsset = async (CompId:string,branchName:string,AssetId:number,data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_UPDATE_ASSET_DETAILS, data, { params: { CompId,branchName,AssetId} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
// Add Asset With Attributes
export const addNewAssetWithAttributes = async (CompId:string,DependencyTypeName:string,data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_ADD_ASSET_DETAILS_WITH_ATTRIBUTES, data, { params: { CompId,DependencyTypeName} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}
//Update Asset With Attributes
export const updateAssetWithAttributes = async (CompId:string,branchName:string,AssetId:number,data:any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_UPDATE_ASSET_DETAILS_WITH_ATTRIBUTES, data, { params: { CompId,branchName,AssetId} })
        return { success: true, data: response.data, }
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message, status: err.response?.status };
    }
}