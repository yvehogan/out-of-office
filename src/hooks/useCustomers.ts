import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PaginatedApiResponse, ApiResponse, Customer, CustomerDetail, WaitlistEntry } from "@/types";

interface GetCustomersParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortOrder?: "newest" | "oldest";
}

export const getCustomersFn = async ({ pageNumber = 1, pageSize = 20, searchTerm, sortOrder }: GetCustomersParams = {}) => {
  const response = await api.get<PaginatedApiResponse<Customer>>("customers", {
    params: {
      pageNumber,
      pageSize,
      ...(searchTerm && { searchTerm }),
      ...(sortOrder && { sortOrder: sortOrder === "newest" ? "desc" : "asc" }),
    },
  });
  return response.data;
};

export const getCustomerDetailFn = async (id: string, pageNumber = 1, pageSize = 10) => {
  const response = await api.get<ApiResponse<CustomerDetail>>(`customers/${id}`, {
    params: { pageNumber, pageSize },
  });
  return response.data;
};

// Hook for fetching a paginated list of customers
export const useCustomers = (params?: GetCustomersParams) => {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => getCustomersFn(params),
  });
};

// Hook for fetching a single customer's details
export const useCustomerDetail = (id: string, pageNumber = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["customer", id, pageNumber, pageSize],
    queryFn: () => getCustomerDetailFn(id, pageNumber, pageSize),
    enabled: !!id,
  });
};

interface GetWaitlistParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortOrder?: "newest" | "oldest";
}

export const useWaitlist = (params: GetWaitlistParams = {}) => {
  const { pageNumber = 1, pageSize = 20, searchTerm, sortOrder } = params;
  return useQuery({
    queryKey: ["waitlist", params],
    queryFn: async () => {
      const response = await api.get<PaginatedApiResponse<WaitlistEntry>>("waitlist", {
        params: {
          pageNumber,
          pageSize,
          ...(searchTerm && { searchTerm }),
          ...(sortOrder && { sortOrder: sortOrder === "newest" ? "desc" : "asc" }),
        },
      });
      return response.data;
    },
  });
};

export async function exportWaitlist(): Promise<void> {
  const response = await api.get("waitlist/export", {
    responseType: "blob",
  });
  const blob = new Blob([response.data as BlobPart], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "waitlist.xlsx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
