import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params: Record<string, unknown>) => {
    const searchParams = new URLSearchParams();
    for (const key in params) {
      if (Array.isArray(params[key])) {
        (params[key] as unknown[]).forEach((val) => searchParams.append(key, String(val)));
      } else if (params[key] !== undefined && params[key] !== null) {
        searchParams.append(key, String(params[key]));
      }
    }
    return searchParams.toString();
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token && config.headers) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = Cookies.get("refreshToken");
      if (refreshToken) {
        try {
          const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || "/api/v1/";
          const res = await axios.post(`${baseURL}auth/refresh-token`, { refreshToken });
          
          if (res.data?.success && res.data?.data?.accessToken) {
            Cookies.set("accessToken", res.data.data.accessToken, { expires: 7 });
            if (res.data.data.refreshToken) {
              Cookies.set("refreshToken", res.data.data.refreshToken, { expires: 30 });
            }
            
            originalRequest.headers.set("Authorization", `Bearer ${res.data.data.accessToken}`);
            return api(originalRequest);
          }
        } catch {
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          if (typeof window !== "undefined") {
            window.location.href = "/";
          }
        }
      } else {
        Cookies.remove("accessToken");
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }
    }
    
    return Promise.reject(error);
  }
);
