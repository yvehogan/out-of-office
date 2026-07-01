"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Box, ShoppingCart, UsersRound, LogOut } from "lucide-react";
import { useState } from "react";
import Cookies from "js-cookie";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/dashboard/products", icon: Box },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
    { name: "Customers", href: "/dashboard/customers", icon: UsersRound },
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
                  {/* Active Indicator on the left edge of sidebar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[6px] h-10 bg-[#5C00FF] rounded-r-full z-10" />
                  )}
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`group flex items-center gap-4 rounded-[14px] px-5 py-3.5 text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-[#F3ECFF] text-[#5C00FF] font-semibold"
                        : "text-text-700 hover:bg-text-50 hover:text-[#111827]"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 shrink-0 transition-colors ${
                        isActive ? "text-[#5C00FF]" : "text-[#565F73] group-hover:text-[#111827]"
                      }`}
                      strokeWidth={isActive ? 2.5 : 2}
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
