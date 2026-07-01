import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { LoginCredentials, ApiResponse, LoginResponse } from "@/types";
import { toast } from "sonner";

import Cookies from "js-cookie";

export const loginFn = async (credentials: LoginCredentials) => {
  const response = await api.post<ApiResponse<LoginResponse>>("auth/login", credentials);
  return response.data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginFn,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Login successful!");
        if (data.data?.accessToken) {
          Cookies.set("accessToken", data.data.accessToken, { expires: 7 }); // Expires in 7 days
        }
        if (data.data?.refreshToken) {
          Cookies.set("refreshToken", data.data.refreshToken, { expires: 30 }); // Expires in 30 days
        }
        if (data.data?.user) {
          Cookies.set("userFirstName", data.data.user.firstName, { expires: 7 });
          Cookies.set("userLastName", data.data.user.lastName, { expires: 7 });
        }
      } else {
        toast.error(data.message || "Login failed");
      }
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || error.message || "An error occurred during login";
      toast.error(message);
    },
  });
};
