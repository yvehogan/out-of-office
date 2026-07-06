import { Header } from "@/components/dashboard/Header";
import { OrdersHeader } from "@/components/dashboard/orders/OrdersHeader";
import { OrdersTable } from "@/components/dashboard/orders/OrdersTable";

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6 px-2 sm:px-4">
      <div className="">
        <Header />
        <OrdersHeader />
        <OrdersTable />
      </div>
    </div>
  );
}
