"use client";

import { ArrowDownRight, ArrowUpRight, ListFilter } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface StoreMetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: string;
  icon: string;
  card: string;
  changeText: string;
}

export function StoreMetricCard({ title, value, change, trend, icon, card, changeText }: StoreMetricCardProps) {
  return (
    <div className="relative bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden min-h-[160px] flex flex-col justify-between p-5">
      <Image
        src={icon}
        alt=""
        width={44}
        height={44}
        className="object-contain"
      />

      <div className="space-y-1">
        <p className="text-xs text-text-600">
          {title}
        </p>
        <p className="text-[22px] font-bold leading-tight text-text-950 tracking-tight">
          {value}
        </p>

        <div className={`flex items-center gap-1 text-[10px] font-semibold ${changeText}`}>
          {trend === "up" ? (
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={3} />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" strokeWidth={3} />
          )}
          <span>{change}</span>
        </div>
      </div>

      <Image
        src={card}
        alt=""
        width={110}
        height={80}
        className="absolute bottom-0 right-0 object-contain pointer-events-none"
      />
    </div>
  );
}

import { Metric } from "@/hooks/useDashboard";

export interface StoreAnalyticsProps {
  data?: Metric[];
  period: string;
  onPeriodChange: (period: string) => void;
}

export function StoreAnalytics({ data, period, onPeriodChange }: StoreAnalyticsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const metricConfigs: Record<string, { title: string; icon: string; card: string }> = {
    revenue: {
      title: "Revenue",
      icon: "/svgs/revenue.svg",
      card: "/svgs/product_card1.svg",
    },
    orders: {
      title: "Orders",
      icon: "/svgs/orders.svg",
      card: "/svgs/product_card2.svg",
    },
    products: {
      title: "Products",
      icon: "/svgs/product.svg",
      card: "/svgs/product_card3.svg",
    },
    customers: {
      title: "Customers",
      icon: "/svgs/customers.svg",
      card: "/svgs/product_card4.svg",
    },
  };

  const formattedMetrics: StoreMetricCardProps[] = (data || []).map((m) => {
    const config = metricConfigs[m.key] || {
      title: m.key,
      icon: "/svgs/orders.svg",
      card: "/svgs/product_card1.svg",
    };

    const isUp = m.trendPercentage >= 0;
    const valueString = m.key === "revenue" ? `₦${m.value.toLocaleString()}` : m.value.toLocaleString();

    return {
      title: config.title,
      value: valueString,
      change: `${Math.abs(m.trendPercentage)}%`,
      trend: isUp ? "up" : "down",
      icon: config.icon,
      card: config.card,
      changeText: isUp ? "text-[#12B76A]" : "text-[#F04438]",
    };
  });

  return (
    <div className="w-full bg-text-25 rounded-[24px] px-3 py-4 animate-fade-in">
      <div className=" flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-text-950">
          Store Analytics
        </h2>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 rounded-full border border-[#5C00FF] bg-white px-5 py-2 text-[13px] font-semibold text-[#111827] transition-all hover:bg-[#F3ECFF] cursor-pointer shadow-sm"
          >
            <ListFilter className="h-3.5 w-3.5 text-[#5C00FF]" strokeWidth={2.5} />
            <span>{period}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-28 z-20 rounded-2xl border border-[#EEF1F6] bg-white py-4 shadow-lg">
              {["All Time", "This Year", "This Month", "This Week"].map((interval) => (
                <button
                  key={interval}
                  type="button"
                  onClick={() => {
                    onPeriodChange(interval);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-2 py-3.5 text-[13px] text-[#3E4962] hover:bg-[#F3ECFF] hover:text-[#5C00FF] transition-colors"
                >
                  {interval}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 lg:gap-3 mt-4">
        {formattedMetrics.length > 0 ? (
          formattedMetrics.map((metric, i) => (
            <div key={metric.title} className={`animate-fade-in-up delay-${i + 1}`}>
              <StoreMetricCard {...metric} />
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-text-500">
            No metrics available
          </div>
        )}
      </div>
    </div>
  );
}
