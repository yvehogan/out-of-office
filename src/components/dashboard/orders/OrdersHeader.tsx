"use client";

import Image from "next/image";
import { useOrdersSummary } from "@/hooks/useOrders";

const orderMetrics = [
  {
    title: "Total Orders",
    icon: "/svgs/order_icon1.svg",
    decoration: "/svgs/product_card1.svg",
    key: "totalOrders" as const,
  },
  {
    title: "Pending Orders",
    icon: "/svgs/order_icon2.svg",
    decoration: "/svgs/product_card2.svg",
    key: "pendingOrders" as const,
  },
];

export function OrdersHeader() {
  const { data } = useOrdersSummary();
  const summary = data?.data;

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="bg-text-25 rounded-[24px] px-3 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orderMetrics.map((metric, i) => (
          <div
            key={metric.title}
            className={`relative bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden min-h-[160px] flex flex-col justify-between p-6 animate-fade-in-up delay-${i + 1}`}
          >
            <Image
              src={metric.icon}
              alt=""
              width={44}
              height={44}
              className="object-contain"
            />
            <div className="relative z-10">
              <p className="text-xs font-semibold text-text-600 mb-1">
                {metric.title}
              </p>
              <p className="text-[28px] font-bold text-text-950 leading-tight">
                {summary?.[metric.key]?.toLocaleString() ?? 0}
              </p>
            </div>
            <Image
              src={metric.decoration}
              alt=""
              width={180}
              height={120}
              className="absolute bottom-0 right-0 object-contain pointer-events-none"
            />
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
