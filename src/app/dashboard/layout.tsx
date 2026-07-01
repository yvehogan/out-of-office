import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-text-100 overflow-hidden">
      <div className="hidden lg:block shrink-0 h-full p-4">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-4">
        {children}
      </div>
    </div>
  );
}
