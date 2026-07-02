import { Header } from "@/components/dashboard/Header";
import { CustomersTable } from "@/components/dashboard/customers/CustomersTable";

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="">
        <Header />
        <CustomersTable />
      </div>
    </div>
  );
}
