import { GET_TOKEN } from "@/config/apiUrls";
import axios from "axios";
import api from "./api";


interface APIResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}

// const api = axios.create({
//   baseURL:import.meta.env.VITE_API_URL,
//   // timeout: 10000,
  //   headers: {
  //       'Content-Type' :'application/x-www-form-urlencoded',
  // }

// });

export const getToken=async(data:any):Promise<APIResponse<any>>=>{
    try{
        const response=await api.post(GET_TOKEN,data,{ headers: {
        'Content-Type' :'application/x-www-form-urlencoded',
        }})
        return {success:true,data:response.data}
   }catch(err:any)
   {
        return {success: false,message: err.response?.data?.message || err.message,status: err.response?.status};
   }
}