import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { extractApiError } from "@/lib/utils";
import { PaginatedApiResponse, Product } from "@/types";

export interface UseProductsOptions {
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  categoryIds?: string[];
  stockStatuses?: string[];
  searchTerm?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  return useQuery({
    queryKey: ["products", options],
    queryFn: async () => {
      const response = await api.get<PaginatedApiResponse<Product>>("/products", {
        params: {
          pageNumber: options.pageNumber || 1,
          pageSize: options.pageSize || 20,
          status: options.status,
          categoryIds: options.categoryIds?.length ? options.categoryIds : undefined,
          stockStatuses: options.stockStatuses?.length ? options.stockStatuses : undefined,
          searchTerm: options.searchTerm || undefined,
        },
      });
      return response.data;
    },
  });
}

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: ["productDetail", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get<{ success: boolean; data: Product }>(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/products", formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: unknown) => {
      toast.error(extractApiError(error));
    },
  });
}

interface UpdateProductPayload {
  Name: string;
  ShortDescription: string;
  LongDescription: string;
  Price: number;
  CategoryId: string;
  UnitsAvailable: number;
  Status: string;
  Type: string;
  ExistingImageIds: string[];
  AttributeSelectionsJson?: string;
  MetadataJson?: string;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProductPayload }) => {
      const response = await api.put(`/products/${id}`, { request: data });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productDetail"] });
    },
    onError: (error: unknown) => {
      toast.error(extractApiError(error));
    },
  });
}

export function useArchiveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/products/${id}/archive`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productDetail"] });
    },
    onError: (error: unknown) => {
      toast.error(extractApiError(error));
    },
  });
}

export function usePublishProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/products/${id}/publish`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productDetail"] });
    },
    onError: (error: unknown) => {
      toast.error(extractApiError(error));
    },
  });
}

export function useUnarchiveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/products/${id}/unarchive`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productDetail"] });
    },
    onError: (error: unknown) => {
      toast.error(extractApiError(error));
    },
  });
}

interface ProductSummary {
  totalProducts: number;
  outOfStockProducts: number;
}

export interface UpdateVariantPayload {
  sku: string;
  sellingPrice: number;
  unitsAvailable: number;
}

export function useUpdateVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, variantId, data }: { productId: string; variantId: string; data: UpdateVariantPayload }) => {
      const response = await api.put(`/products/${productId}/variants/${variantId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productDetail"] });
    },
    onError: (error: unknown) => {
      toast.error(extractApiError(error));
    },
  });
}

export function useProductSummary() {
  return useQuery({
    queryKey: ["productSummary"],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: ProductSummary }>(
        "/dashboard/product-summary"
      );
      return response.data.data;
    },
  });
}
