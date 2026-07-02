"use client";

import { ArrowUpRight, ListFilter } from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { month: string } }>;
}) {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0].value;
  const month = payload[0].payload.month;
  const date = `30 ${month}, 2026`;

  return (
    <div className="flex flex-col items-center -translate-y-full pointer-events-none">
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 px-4 py-2.5 text-center mb-2">
        <p className="text-[11px] text-[#8F98A9] font-medium">{date}</p>
        <p className="text-[20px] font-bold text-[#7C5CFC] mt-0.5 leading-tight">
          {value.toLocaleString()}
        </p>
      </div>

      {/* Dot + vertical line */}
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-[#7C5CFC] ring-[3px] ring-[#7C5CFC]/25" />
        <div className="w-[2px] h-10 bg-[#7C5CFC]/40" />
      </div>
    </div>
  );
}

import { RevenueChartData } from "@/hooks/useDashboard";

export interface RevenueChartProps {
  data?: RevenueChartData;
  period: string;
  onPeriodChange: (period: string) => void;
}

export function RevenueChart({ data, period, onPeriodChange }: RevenueChartProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const chartData = data?.points.map(p => ({
    month: p.label,
    sales: p.revenue,
  })) || [];

  const isUp = (data?.trendPercentage || 0) >= 0;

  return (
    <div className="flex-1 bg-white rounded-[24px] border border-[#EEF1F6] p-6 lg:p-4 flex flex-col h-[520px] animate-fade-in-up delay-3">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-text-950">
            Revenue
          </h3>
          <p className="text-xs text-text-950 mt-1 flex items-center gap-1 font-semibold">
            <span>Sales went {isUp ? "up" : "down"} by</span>
            <span className={`${isUp ? "text-success-500" : "text-[#F04438]"} font-semibold flex items-center gap-0.5`}>
              <ArrowUpRight className="h-3 w-3" strokeWidth={3} />
              {Math.abs(data?.trendPercentage || 0)}%
            </span>
            <span>{data?.trendLabel || "this month"}</span>
          </p>
        </div>

        {/* Dropdown Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 rounded-full border border-[#5C00FF] bg-white px-4 py-2.5 text-[13px] font-semibold text-text-950 transition-all hover:bg-[#F3ECFF] cursor-pointer"
          >
            <ListFilter className="h-3.5 w-3.5 text-[#5C00FF]" strokeWidth={2.5} />
            <span>{period}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-40 z-20 rounded-2xl border border-[#EEF1F6] bg-white py-2 shadow-lg">
              {["All Time", "This Year", "This Month", "This Week"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    onPeriodChange(p);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-[#3E4962] hover:bg-[#F3ECFF] hover:text-[#5C00FF] transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full mt-2 min-h-0">
        <ResponsiveContainer width="100%" height="100%" className="focus:outline-none">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 10, left: -20, bottom: 20 }}
            style={{ outline: "none", border: "none" }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9B7FFC" stopOpacity={0.7} />
                <stop offset="50%" stopColor="#AB7FFF" stopOpacity={0.30} />
                <stop offset="100%" stopColor="#D4C7FE" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              horizontal={false}
            />
            <XAxis
              dataKey="month"
              axisLine={{ stroke: "#E4E7EC", strokeWidth: 1 }}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#344054", fontWeight: 500 }}
              tickMargin={16}
            />
            <YAxis
              axisLine={{ stroke: "#E4E7EC", strokeWidth: 0.5 }}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#344054", fontWeight: 500 }}
              tickMargin={10}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
                return value.toString();
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#AB7FFF"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
