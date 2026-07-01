"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { StoreAnalytics } from "@/components/dashboard/StoreAnalytics";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TopSellingCategories } from "@/components/dashboard/TopSellingCategories";
import { useDashboardSummary } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const [overviewPeriod, setOverviewPeriod] = useState("This Week");
  const [revenuePeriod, setRevenuePeriod] = useState("This Month");
  const [categoryPeriod, setCategoryPeriod] = useState("All Time");

  const { data } = useDashboardSummary({
    overviewTimeframe: overviewPeriod.replace(" ", ""),
    revenueTimeframe: revenuePeriod.replace(" ", ""),
    categoryTimeframe: categoryPeriod.replace(" ", ""),
  });

  const summary = data?.data;

  return (
    <div className="flex min-h-full w-full flex-col gap-4 px-4">
      <Header />
      <StoreAnalytics 
        data={summary?.metrics} 
        period={overviewPeriod} 
        onPeriodChange={setOverviewPeriod} 
      />

      {/* Charts Section */}
      <div className="flex flex-col xl:flex-row gap-4 w-full items-stretch mt-2">
        <div className="flex-1 min-w-0">
          <RevenueChart 
            data={summary?.revenueChart} 
            period={revenuePeriod} 
            onPeriodChange={setRevenuePeriod} 
          />
        </div>
        <TopSellingCategories 
          data={summary?.topCategories} 
          period={categoryPeriod} 
          onPeriodChange={setCategoryPeriod} 
        />
      </div>
    </div>
  );
}
