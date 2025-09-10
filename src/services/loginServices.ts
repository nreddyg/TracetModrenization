import { GET_TOKEN } from "@/config/apiUrls";
import axios from "axios";


interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // timeout: 10000,
    headers: {
        'Content-Type' :'application/x-www-form-urlencoded',
  }

});

export const getToken=async(data:any):Promise<APIResponse<any>>=>{
    try{
        const response=await api.post(GET_TOKEN,data)
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}