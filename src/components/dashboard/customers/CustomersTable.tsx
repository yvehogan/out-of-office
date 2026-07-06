"use client";

import { useState, useEffect } from "react";
import { Search, ListFilter, Upload } from "lucide-react";
import { ViewCustomerModal } from "./ViewCustomerModal";
import { WaitlistTable } from "./WaitlistTable";
import { useCustomers, exportWaitlist } from "@/hooks/useCustomers";
import { Customer } from "@/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function CustomersTable() {
  const [activeTab, setActiveTab] = useState<"customers" | "waitlists">("customers");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when switching tabs or sort
  useEffect(() => { setPage(1); setSearchTerm(""); setDebouncedSearch(""); }, [activeTab]);
  useEffect(() => { setPage(1); }, [sortOrder]);

  const { data, isLoading, isError } = useCustomers({
    pageNumber: page,
    pageSize: 20,
    searchTerm: debouncedSearch,
    sortOrder,
  });

  const rawCustomers = data?.data || [];
  const customers = [...rawCustomers].sort((a, b) => {
    const dateA = new Date(a.dateJoined).getTime();
    const dateB = new Date(b.dateJoined).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });
  const pagination = data?.pagination;

  const handleExport = async () => {
    if (activeTab === "waitlists") {
      setIsExporting(true);
      try {
        await exportWaitlist();
      } finally {
        setIsExporting(false);
      }
    }
  };

  const TAB_CLASS = "flex-none relative rounded-none border-none data-active:text-text-950 text-[#565F73] hover:text-[#5C00FF] font-medium data-active:font-semibold text-[14px] pb-3 px-0 bg-transparent data-active:bg-transparent data-active:shadow-none transition-all after:h-1! after:rounded-t-[10px]! after:!bg-[#5C00FF] after:!bottom-0 cursor-pointer";

  return (
    <div className="flex flex-col gap-6 bg-white rounded-[24px] mt-5 p-4 sm:p-5 animate-fade-in-up delay-2">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mt-2">
        <button
          onClick={() => setSortOrder(prev => prev === "newest" ? "oldest" : "newest")}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#5C00FF] bg-white text-sm font-semibold text-text-950 hover:bg-gray-50 transition-colors w-full sm:w-auto"
        >
          <ListFilter className="h-4 w-4" />
          {sortOrder === "newest" ? "Newest First" : "Oldest First"}
        </button>

        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={activeTab === "customers" ? "Search by customer name or email..." : "Search waitlist..."}
            className="w-full h-11 pl-12 pr-4 rounded-full border border-text-950 bg-white text-sm outline-none transition-all"
          />
        </div>

        <button
          onClick={handleExport}
          disabled={activeTab !== "waitlists" || isExporting}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#5C00FF] text-white text-sm font-semibold hover:bg-[#5C00FF]/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto sm:ml-auto"
        >
          {isExporting ? "Exporting..." : "Export"}
          <Upload className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "customers" | "waitlists")}
        className="w-full"
      >
        <TabsList
          variant="line"
          className="bg-transparent w-full justify-start rounded-none h-auto p-0 flex gap-8 relative -mb-2"
        >
          <TabsTrigger value="customers" className={TAB_CLASS}>Customers</TabsTrigger>
          <TabsTrigger value="waitlists" className={TAB_CLASS}>Waitlists</TabsTrigger>
        </TabsList>

        {/* Customers tab content */}
        {activeTab === "customers" && (
          <>
            <div className="bg-[#F7F8FA] rounded-[24px] border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap text-left text-sm">
                  <thead className="border-b border-gray-200 text-xs font-semibold text-text-600">
                    <tr>
                      <th className="px-6 py-4">Customer Details</th>
                      <th className="px-6 py-4">Date Joined</th>
                      <th className="px-6 py-4">Total Spend</th>
                      <th className="px-6 py-4">Total Orders</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {isLoading ? (
                      <tr><td colSpan={5} className="px-6 py-10 text-center text-text-500">Loading customers...</td></tr>
                    ) : isError ? (
                      <tr><td colSpan={5} className="px-6 py-10 text-center text-red-500">Failed to load customers.</td></tr>
                    ) : customers.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-10 text-center text-text-500">No customers found.</td></tr>
                    ) : (
                      customers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-3">
                            <div className="flex flex-col">
                              <span className="text-text-950">{customer.fullName}</span>
                              <span className="text-[11px] text-text-500">{customer.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-text-950">
                            {new Date(customer.dateJoined).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                          </td>
                          <td className="px-6 py-4 text-text-950">₦{customer.totalSpend.toLocaleString()}</td>
                          <td className="px-6 py-4 text-text-950">{customer.totalOrders}</td>
                          <td className="px-6 py-3">
                            <button
                              onClick={() => { setSelectedCustomer(customer); setIsViewOpen(true); }}
                              className="px-6 py-1.5 rounded-full border border-[#5C00FF] text-[#5C00FF] bg-transparent text-[13px] font-semibold transition-all hover:bg-[#5C00FF]/5"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {pagination && (
              <div className="flex justify-center mt-6 mb-6">
                <div className="bg-text-100 px-2 py-1.5 rounded-full inline-flex">
                  <Pagination>
                    <PaginationContent className="gap-1">
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => { e.preventDefault(); if (pagination.hasPreviousPage) setPage(p => Math.max(1, p - 1)); }}
                          className={`text-xs font-semibold text-text-950 hover:bg-transparent ${!pagination.hasPreviousPage ? "pointer-events-none opacity-50" : ""}`}
                        />
                      </PaginationItem>
                      {(() => {
                        const pages = [];
                        const total = Math.max(1, pagination.totalPages);
                        const current = pagination.pageNumber;
                        for (let i = 1; i <= total; i++) {
                          if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
                            const isActive = i === current;
                            pages.push(
                              <PaginationItem key={i}>
                                <PaginationLink
                                  href="#"
                                  isActive={isActive}
                                  onClick={(e) => { e.preventDefault(); setPage(i); }}
                                  className={`w-8 h-8 rounded-full font-semibold transition-all ${isActive ? "border border-[#5700FF] bg-transparent text-[#5700FF] hover:bg-transparent" : "border border-transparent text-text-600 hover:bg-gray-200"}`}
                                >{i}</PaginationLink>
                              </PaginationItem>
                            );
                          } else if (i === current - 2 || i === current + 2) {
                            pages.push(<PaginationItem key={`e-${i}`}><span className="w-8 h-8 flex items-center justify-center text-text-600">...</span></PaginationItem>);
                          }
                        }
                        return pages;
                      })()}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => { e.preventDefault(); if (pagination.hasNextPage) setPage(p => p + 1); }}
                          className={`text-xs font-semibold text-text-950 hover:bg-transparent ${!pagination.hasNextPage ? "pointer-events-none opacity-50" : ""}`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </>
        )}

        {/* Waitlists tab content */}
        {activeTab === "waitlists" && (
          <WaitlistTable searchTerm={searchTerm} sortOrder={sortOrder} />
        )}
      </Tabs>

      <ViewCustomerModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        customer={selectedCustomer}
      />
    </div>
  );
}
