import { URL_GET_DEPARTMENT_DETAILS, URL_GET_LEVEL_FIVE_COMPANY, URL_GET_MAIN_CATEGORY_DETAILS, URL_GET_REPORT_FOR_SR_DETAILS, URL_GET_REPORT_FOR_SR_DETAILS_COLUMNS, URL_GET_REPORT_FOR_SR_DETAILS_HISTORY, URL_GET_SLA_STATUS, URL_GET_SR_PRIORITY, URL_GET_SR_SEVERITY, URL_GET_SR_SLA_MET_SEL_VIOLATED, URL_GET_SR_SLA_MET_SEL_VIOLATED_COLUMNS, URL_GET_SUB_CATEGORY_DETAILS, URL_POST_COLUMNS_FOR_SR_DETAILS,URL_ADDITIONAL_FIELD_CONFIG_DETAILS, URL_POST_COLUMNS_FOR_SR_MET_VIOLATED } from "@/config/apiUrls";import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//GetServiceRequestDetailsReport    companyId, srType, srNo, srStatus, requestedBy, fromDate, toDate, branch, customer, AssigneeUsers, AssigneeGroups, severity, priority, SLAStatus, dept, mainCategory, subCategory, assetCode
export const getServiceRequestDetailsReport=async(compId:number,BranchName:string,srType:string,srNo:string,srStatus:string,requestedBy:string,fromDate:string,toDate:string,customer:string,AssigneeUsers:string,AssigneeGroups:string,severity:string,priority:string,SLAStatus:string,dept:string,mainCategory:string,subCategory:string,assetCode:string):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_REPORT_FOR_SR_DETAILS,{params:{CompId:compId,BranchId:BranchName,serviceReqTypeId:srType,serviceReqNoId:srNo,SRStatusId:srStatus,RequestedById:requestedBy,FromDate:fromDate,ToDate:toDate,CustomerId:customer,AssigneeUsersId:AssigneeUsers,AssigneeGroupsId:AssigneeGroups,SeverityId:severity,PriorityId:priority,SlaStatusId:SLAStatus,DeptId:dept,MainCategoryId:mainCategory,SubCategoryId:subCategory,Assetcode:assetCode}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}
//GetServiceRequestDetailsHistoryReport

export const getServiceRequestDetailsHistoryReport=async(compId:number | string,BranchName:string,srID:string):Promise<APIResponse<any>>=>{
    console.log("compId",compId, "branch", BranchName);
    try{
        const response=await api.get(URL_GET_REPORT_FOR_SR_DETAILS_HISTORY,{params:{CompId:compId,branchName:BranchName,ServiceRequestId:srID}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}
//GetServiceRequestSLAMet/ViolatedReport

export const getServiceRequestSLAMetViolatedReport=async(compId:number,BranchName:string,srType:string,srNo:string,srStatus:string,requestedBy:string,fromDate:string,toDate:string,customer:string,AssigneeUsers:string,AssigneeGroups:string,severity:string,priority:string,SLAStatus:string,dept:string,mainCategory:string,subCategory:string,assetCode:string):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_SR_SLA_MET_SEL_VIOLATED,{params:{CompId:compId,BranchId:BranchName,serviceReqTypeId:srType,serviceReqNoId:srNo,SRStatusId:srStatus,RequestedById:requestedBy,FromDate:fromDate,ToDate:toDate,CustomerId:customer,AssigneeUsersId:AssigneeUsers,AssigneeGroupsId:AssigneeGroups,SeverityId:severity,PriorityId:priority,SlaStatusId:SLAStatus,DeptId:dept,MainCategoryId:mainCategory,SubCategoryId:subCategory,Assetcode:assetCode}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

export const postServiceRequestDetailsColumns = async (compId: number, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_COLUMNS_FOR_SR_DETAILS, data, { params: { CompId: compId} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};
export const postServiceRequestMetViolatedColumns = async (compId: number, data: any): Promise<APIResponse<any>> => {
    try {
        const response = await api.post(URL_POST_COLUMNS_FOR_SR_MET_VIOLATED, data, { params: { CompId: compId} });
        return {success: true,data: response.data};
    } catch (err: any) {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status,};
    }
};

export const getAdditionaliFieldsConfigurationDetails=async(compId:number):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_ADDITIONAL_FIELD_CONFIG_DETAILS,{params:{CompId:compId}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

//Get columns for service request details report
export const getServiceRequestDetailsColumns=async(compId:number):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_REPORT_FOR_SR_DETAILS_COLUMNS,{params:{CompId:compId}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

//Get columns for service request details report
export const getServiceRequestSLAMetViolatedColumns=async(compId:number):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_SR_SLA_MET_SEL_VIOLATED_COLUMNS,{params:{CompId:compId}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

 
//Get Service Request Severity
export const getServiceRequestSeverity=async():Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_SR_SEVERITY,{})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}
 
 
//Get Service Request Severity
export const getServiceRequestPriority=async():Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_SR_PRIORITY,{})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}
 
//Get main Category LookUps
export const getMainCategoryLookUp=async(compId:number):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_MAIN_CATEGORY_DETAILS,{params:{CompId:compId}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}
 
//Get SUB Category LookUps
export const getSubCategoryLookUp=async(compId:number, id:number):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_SUB_CATEGORY_DETAILS,{params:{CompId:compId, MainCatId:id}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}
 
// SERVICE DESK tree get data
export const getDepartment=async(compId:number):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_DEPARTMENT_DETAILS,{params:{CompId:compId}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}
 
 
// SERVICE DESK tree get data
export const getSlaStatus=async():Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_SLA_STATUS,{})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}
export const getCompanyHierarchy=async(compId:number):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_LEVEL_FIVE_COMPANY,{params:{CompId:compId}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}
 