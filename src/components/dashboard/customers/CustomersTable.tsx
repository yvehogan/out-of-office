"use client";

import { useState, useEffect } from "react";
import { Search, ListFilter } from "lucide-react";
import { ViewCustomerModal } from "./ViewCustomerModal";
import { useCustomers } from "@/hooks/useCustomers";
import { Customer } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function CustomersTable() {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError } = useCustomers({ 
    pageNumber: page, 
    pageSize: 20,
    searchTerm: debouncedSearch
  });

  const customers = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="flex flex-col gap-6 bg-white rounded-[24px] mt-5 p-5">
      {/* Controls */}
      <div className="flex items-center gap-4 mt-2">
        <button 
          onClick={() => setSortOrder(prev => prev === "newest" ? "oldest" : "newest")}
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 bg-white text-sm font-semibold text-text-700 hover:bg-gray-50 transition-colors"
        >
          <ListFilter className="h-4 w-4" />
          {sortOrder === "newest" ? "Newest First" : "Oldest First"}
        </button>

        <div className="relative flex-1 max-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name or email..."
            className="w-full h-11 pl-12 pr-4 rounded-full border border-text-950 bg-white text-sm outline-none transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#F7F8FA] rounded-[24px] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead className="border-b border-gray-200 text-xs font-semibold text-text-600">
              <tr>
                <th className="px-6 py-5">Customer Details</th>
                <th className="px-6 py-5">Date Joined</th>
                <th className="px-6 py-5">Total Spend</th>
                <th className="px-6 py-5">Total Orders</th>
                <th className="px-6 py-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-text-500">
                    Loading customers...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-red-500">
                    Failed to load customers.
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-text-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-text-950">{customer.fullName}</span>
                        <span className="text-[11px] text-text-500">{customer.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-950">
                      {new Date(customer.dateJoined).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-text-950">₦{customer.totalSpend.toLocaleString()}</td>
                    <td className="px-6 py-4 text-text-950">{customer.totalOrders}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setIsViewOpen(true);
                        }}
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
      
      {/* Pagination */}
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
                  const total = Math.max(1, pagination.totalPages); // Ensure at least 1 page
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
                            className={`w-8 h-8 rounded-full font-semibold transition-all ${
                              isActive 
                                ? "border border-[#5700FF] bg-transparent text-[#5700FF] hover:bg-transparent" 
                                : "border border-transparent text-text-600 hover:bg-gray-200"
                            }`}
                          >
                            {i}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (i === current - 2 || i === current + 2) {
                      pages.push(
                        <PaginationItem key={`ellipsis-${i}`}>
                          <span className="w-8 h-8 flex items-center justify-center text-text-600">...</span>
                        </PaginationItem>
                      );
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


      <ViewCustomerModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        customer={selectedCustomer}
      />
    </div>
  );
}
