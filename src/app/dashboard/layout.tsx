import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-text-100 overflow-hidden">
      <div className="hidden lg:block shrink-0 h-full py-4 pl-4 pr-2">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto py-4 pr-4 pl-2">
        {children}
      </div>
    </div>
  );
}
