import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdDate: string;
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: Category[] }>("/categories");
      return response.data.data;
    },
  });
}
