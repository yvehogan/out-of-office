"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { BsFillBoxFill } from "react-icons/bs";
import { FaCartShopping } from "react-icons/fa6";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { useState } from "react";
import Cookies from "js-cookie";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: TbLayoutDashboardFilled },
    { name: "Products", href: "/dashboard/products", icon: BsFillBoxFill },
    { name: "Orders", href: "/dashboard/orders", icon: FaCartShopping },
    { name: "Customers", href: "/dashboard/customers", icon: MdOutlinePeopleAlt },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("userFirstName");
      Cookies.remove("userLastName");
      router.push("/");
    }, 1500);
  };

  if (isLoggingOut) {
    return (
      <>
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <Image
            src="/gif/loading-animation.gif"
            alt="Logging out..."
            width={160}
            height={160}
            unoptimized
          />
          <p className="text-sm text-text-500 mt-2 font-medium animate-pulse">Logging out...</p>
        </div>
        <aside className="relative flex w-full h-full shrink-0 flex-col bg-white py-6 lg:rounded-[24px] lg:w-72" />
      </>
    );
  }

  return (
    <aside className="relative flex w-full h-full min-h-screen shrink-0 flex-col bg-white py-6 lg:rounded-[24px] lg:w-72">
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="py-2 flex items-center justify-start pl-14">
            <Image
              src="/images/logo.png"
              alt="Out of Office Logo"
              width={120}
              height={50}
              priority
              className="object-contain"
            />
          </div>

          <nav className="mt-4 flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.href);

              return (
                <div key={item.name} className="relative px-3">
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-[#5C00FF] rounded-r-full z-10" />
                  )}
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`group flex items-center gap-4 rounded-[14px] px-5 py-4 text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-text-100 text-[#5C00FF] font-semibold pl-"
                        : "text-text-700 hover:bg-text-50 hover:text-[#111827]"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 shrink-0 transition-colors ${
                        isActive ? "text-[#5C00FF]" : "text-[#565F73] group-hover:text-[#111827]"
                      }`}
                    />
                    <span>{item.name}</span>
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Logout at the bottom */}
        <div className="mt-auto px-3 pt-6">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-4 rounded-[14px] px-5 py-3.5 text-[15px] font-medium text-[#565F73] transition-colors hover:bg-[#FEF3F2] hover:text-[#D92D20]"
          >
            <LogOut className="h-5 w-5 shrink-0 text-[#565F73] group-hover:text-red-600" strokeWidth={2} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
