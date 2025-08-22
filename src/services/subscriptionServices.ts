import { ADD_SUBSCRIPTION, SUBSCRIPTION_CURRENCY, SUBSCRIPTION_NEXT_AMC_FROM_DATE, UPDATE_SUBSCRIPTION, URL_DUPLICATE_ADD_CHECK_NO, URL_DUPLICATE_UPDATE_CHECK_NO, URL_GET_PRODUCT_LIST, URL_GET_SUBSCRIPTION_LIST, URL_SUBSCRIPTION_BY_ID } from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

export const getSubscriptionTableData=async(compId:number,BranchName:string):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_SUBSCRIPTION_LIST,{params:{CompId:compId,BranchName:BranchName}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

export const getProductName=async(compId:number):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_PRODUCT_LIST,{params:{CompId:compId}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

export const getSubscriptionCurrency=async():Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(SUBSCRIPTION_CURRENCY)
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

export const getNextAmcFromDate=async(customerName:string,ProductName:string,branchName:string,CompId:number):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(SUBSCRIPTION_NEXT_AMC_FROM_DATE,{params:{customerName:customerName,ProductName:ProductName,branchName:branchName,CompId:CompId}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

export const addSubscription=async(BranchName:string,CompId:number,data:any):Promise<APIResponse<any>>=>{
    try{
        const response=await api.post(ADD_SUBSCRIPTION,data,{params:{BranchName:BranchName,CompId:CompId}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

export const updateSubscription=async(branchName:string,CompId:number,SubscriptionId:number,CustomerName:string,ProductName:string,data:any):Promise<APIResponse<any>>=>{
    try{
        const response=await api.post(UPDATE_SUBSCRIPTION,data,{params:{branchName:branchName,CompId:CompId,SubscriptionId:SubscriptionId,CustomerName:CustomerName,ProductName:ProductName}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }

}

export const getSubscriptionById=async(Id:number,CompId:number):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_SUBSCRIPTION_BY_ID,{params:{Id:Id,CompId:CompId}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

export const getAddChequeList=async(chequeNo:number,CompId:number):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_DUPLICATE_ADD_CHECK_NO,{params:{chequeNo:chequeNo,CompId:CompId}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

export const getUpdateChequeList=async(chequeNo:number,id:number,CompId:number):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_DUPLICATE_UPDATE_CHECK_NO,{params:{chequeNo:chequeNo,id:id,CompId:CompId}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}