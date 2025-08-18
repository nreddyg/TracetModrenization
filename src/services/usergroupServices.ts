import { URL_ADD_USER_GROUP, URL_DELETE_USER_GROUP, URL_GET_USER_GROUP_BY_ID, URL_GET_USER_GROUP_TABLE_DATA, URL_UPDATE_USER_GROUP } from "@/config/apiUrls";
import api from "./api";

interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

//GetUserGroupTable
export const getUserGroupData=async(compId:number,BranchName:string):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_USER_GROUP_TABLE_DATA,{params:{CompId:compId,branchName:BranchName}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

//GetUserGroupById

export const getUserGroupById=async(compId:number,usergroupid:number):Promise<APIResponse<any>>=>{
    try{
        const response=await api.get(URL_GET_USER_GROUP_BY_ID,{params:{CompId:compId,userGroupId:usergroupid}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

//AddUserGroup

export const addUserGroup=async(compId:number,BranchName:string,data:any):Promise<APIResponse<any>>=>{
    try{
        const response=await api.post(URL_ADD_USER_GROUP,data,{params:{CompId:compId,branchName:BranchName}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

//UpdateUserGroup

export const updateUserGroup=async(compId:number,BranchName:string,usergroupid:number,data:any):Promise<APIResponse<any>>=>{
    try{
        const response=await api.post(URL_UPDATE_USER_GROUP,data,{params:{CompId:compId,branchName:BranchName,UserGroupId:usergroupid}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}

//delete UserGroup

export const deleteUserGroup=async(compId:number,usergroupid:number):Promise<APIResponse<any>>=>{
    console.log(compId,usergroupid,"61services")
    try{
        const response=await api.post(URL_DELETE_USER_GROUP,"",{params:{UserGroupId:usergroupid,CompId:compId}})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}
