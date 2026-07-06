"use client";

import { NotificationsSheet } from "./NotificationsSheet";
import { usePathname } from "next/navigation";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

export function Header() {
  const pathname = usePathname();
  const [userName, setUserName] = useState("David Babatunde");

  useEffect(() => {
    setTimeout(() => {
      const firstName = Cookies.get("userFirstName");
      const lastName = Cookies.get("userLastName");
      if (firstName && lastName) {
        setUserName(`${firstName} ${lastName}`);
      } else if (firstName) {
        setUserName(firstName);
      }
    }, 0);
  }, []);

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/dashboard/products") return "Products";
    if (pathname === "/dashboard/orders") return "Orders";
    if (pathname === "/dashboard/customers") return "Customers";
    
    const segments = pathname?.split("/") || [];
    const lastSegment = segments[segments.length - 1];
    if (lastSegment) {
      return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    }
    
    return "Dashboard";
  };
  return (
    <header className="flex items-center justify-between bg-white rounded-[16px] shrink-0 py-2 px-4">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger>
            <div className="lg:hidden p-2 -ml-2 text-text-700 hover:bg-gray-100 rounded-lg cursor-pointer flex items-center">
              <Menu className="w-5 h-5" />
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 border-0 bg-white sm:max-w-[280px]">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <Sidebar />
          </SheetContent>
        </Sheet>
        <h1 className="text-[18px] font-semibold text-text-950">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <NotificationsSheet />

        <span className="hidden sm:inline text-sm font-bold text-[#24262D] whitespace-nowrap">
          Hello, {userName}
        </span>
      </div>
    </header>
  );
}
