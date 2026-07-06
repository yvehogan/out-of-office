import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { useState } from "react";

const NOTIFICATIONS = [
  {
    id: 1,
    title: "Notification Title",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin suscipit lectus quis neque eleifend, tempor sagittis tortor efficitur.",
    date: "12 Mar, 2026",
    unread: true,
    type: "Orders",
  },
  {
    id: 2,
    title: "Notification Title",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin suscipit lectus quis neque eleifend, tempor sagittis tortor efficitur.",
    date: "12 Mar, 2026",
    unread: true,
    type: "Low Stock",
  },
  {
    id: 3,
    title: "Notification Title",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin suscipit lectus quis neque eleifend, tempor sagittis tortor efficitur.",
    date: "12 Mar, 2026",
    unread: false,
    type: "Orders",
  },
  {
    id: 4,
    title: "Notification Title",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin suscipit lectus quis neque eleifend, tempor sagittis tortor efficitur.",
    date: "12 Mar, 2026",
    unread: false,
    type: "Low Stock",
  },
  {
    id: 5,
    title: "Notification Title",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin suscipit lectus quis neque eleifend, tempor sagittis tortor efficitur.",
    date: "12 Mar, 2026",
    unread: false,
    type: "Orders",
  },
];

export function NotificationsSheet() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredNotifications = activeTab === "All"
    ? NOTIFICATIONS
    : NOTIFICATIONS.filter((n) => n.type === activeTab);

  return (
    <Sheet>
      <SheetTrigger className="relative flex h-13 w-13 items-center justify-center rounded-full transition-all cursor-pointer hover:bg-gray-50">
        <Image 
          src="/icons/notifications.png" 
          alt="Notifications" 
          width={30} 
          height={30} 
          className="object-contain"
        />
      </SheetTrigger>
      <SheetContent className="left-4! right-4! w-auto! h-[calc(100vh-2rem)]! sm:left-auto! sm:right-4! sm:w-[540px]! sm:h-[calc(100vh-32px)]! bg-[#F6F7F9] p-0 flex flex-col border-none shadow-2xl rounded-[16px]">
        <div className="py-2 px-3 pb-4">
          <SheetHeader className="mb-6 flex flex-row items-center justify-between space-y-0">
            <SheetTitle className="text-lg font-semibold text-text-950">
              Notifications
            </SheetTitle>
          </SheetHeader>

          {/* Filters/Tabs */}
          <div className="flex items-center rounded-full border border-text-200 p-1 bg-white mb-6">
            {["All", "Orders", "Low Stock"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-full py-3 text-xs transition-all ${
                  activeTab === tab
                    ? "bg-[#EAE1FF] text-[#5700FF] font-semibold"
                    : "text-text-950 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex justify-end mb-3">
            <button className="text-sm font-semibold text-[#5700FF] hover:underline">
              Mark all as read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-[16px] p-5 transition-all ${
                notification.unread
                  ? "bg-white border border-[#5700FF]"
                  : "bg-white/50 border border-transparent"
              }`}
            >
              <h4 className="flex items-center gap-2 text-sm font-semibold text-[#5700FF] mb-2">
                {notification.unread && (
                  <span className="h-2 w-2 rounded-full bg-[#5700FF]" />
                )}
                {notification.title}
              </h4>
              <p className="text-sm text-text-950 leading-relaxed mb-3">
                {notification.description}
              </p>
              <p className="text-sm text-text-600">
                {notification.date}
              </p>
            </div>
          ))}
          {filteredNotifications.length === 0 && (
            <p className="text-center text-sm text-[#8F98A9] mt-10">No notifications found.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
