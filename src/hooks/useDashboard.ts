import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types";

interface DashboardSummaryParams {
  overviewTimeframe?: string;
  revenueTimeframe?: string;
  categoryTimeframe?: string;
}

export interface Metric {
  key: string;
  value: number;
  trendPercentage: number;
  trendLabel: string;
}

export interface RevenuePoint {
  bucketStart: string;
  label: string;
  revenue: number;
}

export interface RevenueChartData {
  totalRevenue: number;
  trendPercentage: number;
  trendLabel: string;
  points: RevenuePoint[];
}

export interface TopCategory {
  categoryName: string;
  revenue: number;
  percentage: number;
}

export interface DashboardSummaryData {
  overviewTimeframe: string;
  revenueTimeframe: string;
  categoryTimeframe: string;
  metrics: Metric[];
  revenueChart: RevenueChartData;
  topCategories: TopCategory[];
}

export const getDashboardSummaryFn = async (params: DashboardSummaryParams = {}) => {
  const { overviewTimeframe = "ThisWeek", revenueTimeframe = "ThisMonth", categoryTimeframe = "AllTime" } = params;
  
  const response = await api.get<ApiResponse<DashboardSummaryData>>("dashboard/summary", {
    params: { overviewTimeframe, revenueTimeframe, categoryTimeframe },
  });
  return response.data;
};

export const useDashboardSummary = (params?: DashboardSummaryParams) => {
  return useQuery({
    queryKey: ["dashboardSummary", params],
    queryFn: () => getDashboardSummaryFn(params),
  });
};
