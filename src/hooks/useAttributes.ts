import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface AttributeValue {
  id: string;
  attributeId: string;
  value: string;
  slug: string;
}

export interface Attribute {
  id: string;
  name: string;
  slug: string;
  values: AttributeValue[];
}

export const useAttributes = () => {
  return useQuery({
    queryKey: ["attributes"],
    queryFn: async () => {
      const response = await api.get<{ data: Attribute[] }>("/attributes");
      return response.data.data;
    },
  });
};
