"use client";
import Image from "next/image";
import { useProductSummary } from "@/hooks/useProducts";

const METRIC_CONFIG = [
  {
    key: "totalProducts" as const,
    title: "Total Products",
    icon: "/svgs/product_icon1.svg",
    decoration: "/svgs/product_card1.svg",
  },
  {
    key: "outOfStockProducts" as const,
    title: "Out of Stock Products",
    icon: "/svgs/product_icon2.svg",
    decoration: "/svgs/product_card2.svg",
  },
];

export function ProductsHeader() {
  const { data: summary, isLoading } = useProductSummary();

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="bg-text-25 rounded-[24px] px-3 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {METRIC_CONFIG.map((metric, i) => (
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
            <div>
              <p className="text-xs font-semibold text-text-600 mb-1">
                {metric.title}
              </p>
              <p className="text-[28px] font-bold text-text-950 leading-tight">
                {isLoading ? "—" : (summary?.[metric.key] ?? 0).toLocaleString()}
              </p>
            </div>
            <Image
              src={metric.decoration}
              alt=""
              width={110}
              height={80}
              className="absolute bottom-0 right-0 object-contain pointer-events-none"
            />
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
