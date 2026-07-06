import { Header } from "@/components/dashboard/Header";
import { ProductsHeader } from "@/components/dashboard/products/ProductsHeader";
import { ProductsTable } from "@/components/dashboard/products/ProductsTable";

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-6 px-2 sm:px-4">
      <div className="">
      <Header />
      <ProductsHeader />
      <ProductsTable />
      </div>
    </div>
  );
}
