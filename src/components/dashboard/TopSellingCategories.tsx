"use client";

import { ListFilter } from "lucide-react";
import { useState } from "react";

import { TopCategory } from "@/hooks/useDashboard";

export interface TopSellingCategoriesProps {
  data?: TopCategory[];
  period: string;
  onPeriodChange: (period: string) => void;
}

const colors = ["#8F55FF", "#55DDB3", "#FEB273", "#FF55A2"];

export function TopSellingCategories({ data, period, onPeriodChange }: TopSellingCategoriesProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const legendData = (data || []).map((item, index) => ({
    name: item.categoryName,
    value: item.percentage,
    color: colors[index % colors.length],
  }));

  return (
    <div className="bg-white rounded-[24px] border border-[#EEF1F6] p-4 sm:p-6 lg:p-4 flex flex-col h-auto sm:h-130 w-full lg:w-95 shrink-0 animate-fade-in-up delay-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-2">
        <h3 className="text-base font-semibold tracking-tight text-text-950">
          Top Selling Categories
        </h3>

        {/* Dropdown Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 rounded-full border border-[#5700FF] bg-white px-4 py-3 text-xs font-semibold text-text-950 transition-all hover:bg-[#F3ECFF] cursor-pointer"
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
                  className="w-full text-left px-4 py-2 text-[13px] text-[#3E4962] hover:bg-[#F3ECFF] hover:text-[#5C00FF] transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Donut Chart SVG */}
      <div className="flex-1 flex items-center justify-center min-h-0 relative">
        <svg
          width="293"
          height="293"
          viewBox="0 0 293 293"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full max-w-[260px] h-auto"
        >
          <path d="M100.491 242.398C90.902 262.383 99.3946 286.98 121.229 290.804C139.216 293.954 157.752 293.734 175.873 290.025C207.208 283.612 235.583 267.121 256.666 243.07C277.749 219.018 290.382 188.728 292.636 156.823C293.939 138.372 291.73 119.968 286.251 102.548C279.601 81.4023 254.104 76.2042 235.546 88.3276C216.989 100.451 213.31 126.154 212.703 148.312C212.677 149.263 212.63 150.215 212.563 151.167C211.544 165.59 205.833 179.283 196.302 190.156C186.771 201.029 173.944 208.484 159.778 211.383C158.843 211.574 157.906 211.745 156.967 211.895C135.079 215.399 110.079 222.412 100.491 242.398Z" fill="#55DDB3"/>
          <path d="M252.864 146.5C275.03 146.5 293.534 128.204 287.536 106.864C285.97 101.292 284.072 95.8061 281.848 90.4369C274.486 72.6627 263.695 56.5126 250.091 42.9089C236.487 29.3051 220.337 18.514 202.563 11.1516C184.789 3.78933 165.739 -8.40948e-07 146.5 0C127.261 8.40948e-07 108.211 3.78934 90.4369 11.1517C72.6627 18.514 56.5126 29.3051 42.9089 42.9089C29.3051 56.5126 18.514 72.6627 11.1516 90.4369C8.92766 95.8061 7.0297 101.292 5.46375 106.864C-0.533508 128.204 17.9696 146.5 40.1362 146.5H54.2652C68.6286 146.5 79.8171 134.426 85.3138 121.156C88.642 113.121 93.5203 105.82 99.6701 99.6701C105.82 93.5203 113.121 88.642 121.156 85.3138C129.191 81.9855 137.803 80.2725 146.5 80.2725C155.197 80.2725 163.809 81.9855 171.844 85.3138C179.879 88.642 187.18 93.5203 193.33 99.6701C199.48 105.82 204.358 113.121 207.686 121.156C213.183 134.426 224.371 146.5 238.735 146.5H252.864Z" fill="#FEB273"/>
          <path d="M138.669 40.4249C137.037 18.3185 117.428 1.2126 96.5876 8.76473C91.1459 10.7367 85.8149 13.0334 80.6241 15.6466C63.4401 24.2976 48.1284 36.2484 35.5631 50.8169C22.9978 65.3853 13.4251 82.286 7.39135 100.554C1.35764 118.822 -1.01884 138.1 0.397598 157.286C1.81404 176.472 6.99566 195.192 15.6466 212.376C24.2976 229.56 36.2484 244.872 50.8169 257.437C65.3853 270.002 82.286 279.575 100.554 285.609C106.072 287.431 111.683 288.92 117.355 290.072C139.079 294.482 155.963 274.682 154.331 252.575L153.291 238.485C152.233 224.16 139.368 213.891 125.729 209.386C117.471 206.659 109.831 202.331 103.245 196.651C96.6591 190.97 91.2566 184.048 87.3458 176.28C83.435 168.512 81.0926 160.049 80.4522 151.376C79.8119 142.702 80.8862 133.988 83.6139 125.729C86.3415 117.471 90.669 109.831 96.3493 103.245C102.03 96.6591 108.952 91.2566 116.72 87.3458C129.549 80.887 140.767 68.84 139.709 54.5155L138.669 40.4249Z" fill="#FF55A2"/>
          <path d="M54.3863 93.3181C35.1894 82.2348 10.0169 88.8286 4.54083 110.308C0.752227 125.169 -0.700215 140.613 0.313668 156.082C2.20872 184.994 12.6349 212.696 30.2737 235.684C47.9126 258.671 71.9719 275.912 99.4091 285.225C114.088 290.208 129.382 292.802 144.717 292.989C166.882 293.259 179.766 270.651 174.029 249.24L173.738 248.152C168.161 227.341 145.613 216.138 125.212 209.213C112.808 205.002 101.932 197.209 93.9582 186.817C85.9843 176.425 81.271 163.902 80.4143 150.831C79.0052 129.333 74.0196 104.653 55.361 93.8809L54.3863 93.3181Z" fill="#8F55FF"/>
          {/* Percentage labels */}
          {legendData.map((item, i) => {
            const positions = [
              { x: 25, y: 130 },
              { x: 188, y: 244 },
              { x: 232, y: 124 },
              { x: 93, y: 53 },
            ];
            const pos = positions[i % positions.length];
            return (
              <text key={item.name} x={pos.x} y={pos.y} fill="#0A1A2F" fontSize="16" fontWeight="600" fontFamily="sans-serif">
                {item.value}%
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-3 mt-2">
        {legendData.map((item) => (
          <div key={item.name} className="flex items-center gap-3 text-[15px]">
            <span
              className="h-3 w-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[#0A1A2F]">{item.name}</span>
            <span className="text-[#0A1A2F] ml-1">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
