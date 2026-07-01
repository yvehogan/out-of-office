import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ApiResponse, PaginatedApiResponse, OrderHistory, OrderDetail } from "@/types";
import { AxiosError } from "axios";

interface UpdateOrderStatusPayload {
  orderStatus: string;
  confirm: boolean;
}

interface GetOrdersParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  categoryIds?: string[];
  paymentStatuses?: string[];
  orderStatuses?: string[];
}

export const getOrdersFn = async (params: GetOrdersParams = {}) => {
  const { pageNumber = 1, pageSize = 20, searchTerm, categoryIds, paymentStatuses, orderStatuses } = params;
  
  const queryParams: Record<string, string | number | string[]> = { pageNumber, pageSize };
  if (searchTerm) queryParams.searchTerm = searchTerm;
  if (categoryIds?.length) queryParams.categoryIds = categoryIds;
  if (paymentStatuses?.length) queryParams.paymentStatuses = paymentStatuses;
  if (orderStatuses?.length) queryParams.orderStatuses = orderStatuses;

  const response = await api.get<PaginatedApiResponse<OrderHistory>>("orders", {
    params: queryParams,
  });
  return response.data;
};

export const getOrderDetailFn = async (id: string) => {
  const response = await api.get<ApiResponse<OrderDetail>>(`orders/${id}`);
  return response.data;
};

export const updateOrderStatusFn = async ({ id, payload }: { id: string, payload: UpdateOrderStatusPayload }) => {
  const response = await api.patch<ApiResponse<unknown>>(`orders/${id}/status`, payload);
  return response.data;
};

export const useOrders = (params?: GetOrdersParams) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrdersFn(params),
  });
};

export const useOrderDetail = (id: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderDetailFn(id),
    enabled: !!id,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatusFn,
    onSuccess: (data) => {
      if (data.success !== false) {
        toast.success(data.message || "Order status updated successfully.");
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["order"] });
        queryClient.invalidateQueries({ queryKey: ["ordersSummary"] });
      } else {
        toast.error(data.message || "Failed to update order status.");
      }
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || error.message || "An error occurred while updating order status.";
      toast.error(message);
    },
  });
};

export const getOrdersSummaryFn = async () => {
  const response = await api.get<ApiResponse<{ totalOrders: number; pendingOrders: number }>>("orders/summary");
  return response.data;
};

export const useOrdersSummary = () => {
  return useQuery({
    queryKey: ["ordersSummary"],
    queryFn: getOrdersSummaryFn,
  });
};
