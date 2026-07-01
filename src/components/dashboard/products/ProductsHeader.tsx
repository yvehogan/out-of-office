import Image from "next/image";

const metrics = [
  {
    title: "Total Products",
    value: "1,034",
    icon: "/svgs/product_icon1.svg",
    decoration: "/svgs/product_card1.svg",
  },
  {
    title: "Out of Stock Products",
    value: "45",
    icon: "/svgs/product_icon2.svg",
    decoration: "/svgs/product_card2.svg",
  },
];

export function ProductsHeader() {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="bg-text-25 rounded-[24px] px-3 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="relative bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden min-h-[160px] flex flex-col justify-between p-6"
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
                {metric.value}
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
