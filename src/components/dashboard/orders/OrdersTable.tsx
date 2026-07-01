"use client";

import { useState, useEffect } from "react";
import { Search, ListFilter } from "lucide-react";
import { ViewOrderModal, OrderData } from "./ViewOrderModal";
import { OrdersFilterModal } from "./OrdersFilterModal";
import { PublishConfirmModal } from "../products/PublishConfirmModal";
import { SuccessModal } from "../products/SuccessModal";
import { useOrders } from "@/hooks/useOrders";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function OrdersTable() {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [filters, setFilters] = useState({
    categories: [] as string[],
    paymentStatuses: [] as string[],
    orderStatuses: [] as string[],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError } = useOrders({ 
    pageNumber: page, 
    pageSize: 20,
    searchTerm: debouncedSearch,
    categoryIds: filters.categories,
    paymentStatuses: filters.paymentStatuses,
    orderStatuses: filters.orderStatuses,
  });
  const orders = data?.data || [];
  const pagination = data?.pagination;

  const handleSaveChangesClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      setIsConfirmOpen(false);
      setIsViewOpen(false);
      setIsSuccessOpen(true);
    }, 2000);
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "Paid":
      case "Refunded":
        return "bg-[#D1FADF] text-[#039855]";
      case "Pending":
        return "bg-[#FEF0C7] text-[#DC6803]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Shipped":
        return "bg-[#EEE4FF] text-[#2036D9]";
      case "Processing":
        return "bg-[#E2EEFE] text-[#2036D9]";
      case "Delivered":
        return "bg-[#D1FADF] text-[#039855]";
      case "Cancelled":
        return "bg-[#FEE4E2] text-[#D92D20]";
      case "Pending":
        return "bg-[#FEF0C7] text-[#DC6803]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-white rounded-[24px] mt-5 p-5">
      <div className="flex items-center gap-4 mt-2">
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 bg-white text-sm font-semibold text-text-700 hover:bg-gray-50 transition-colors"
        >
          <ListFilter className="h-4 w-4" />
          Filter
          {(filters.categories.length > 0 || filters.paymentStatuses.length > 0 || filters.orderStatuses.length > 0) && (
            <span className="ml-1 w-2 h-2 rounded-full bg-[#5C00FF]" />
          )}
        </button>

        <div className="relative flex-1 max-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ID, customer name or email..."
            className="w-full h-11 pl-12 pr-4 rounded-full border border-text-950 bg-white text-sm outline-none transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#F7F8FA] rounded-[24px] border border-gray-100 overflow-">
       
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead className="border-b border-gray-200 text-xs font-semibold text-text-600">
              <tr>
                <th className="px-6 py-5">Order ID</th>
                <th className="px-6 py-5">Customer Details</th>
                <th className="px-6 py-5">Date Purchased</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Payment Status</th>
                <th className="px-6 py-5">Order Status</th>
                <th className="px-6 py-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-text-500">
                    Loading orders...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-red-500">
                    Failed to load orders.
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-text-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-text-950">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-text-950">{order.customerName}</span>
                        <span className="text-[11px] text-text-500">{order.customerEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-950">{new Date(order.purchasedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-text-950">₦{order.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold ${getPaymentBadge(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold ${getStatusBadge(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => {
                          setSelectedOrder({
                            id: order.id,
                            name: order.customerName,
                            email: order.customerEmail,
                            date: new Date(order.purchasedAt).toLocaleDateString(),
                            amount: `₦${order.totalAmount.toLocaleString()}`,
                            payment: order.paymentStatus,
                            status: order.orderStatus,
                          });
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

      <ViewOrderModal 
        open={isViewOpen} 
        onOpenChange={setIsViewOpen} 
        onSaveChanges={handleSaveChangesClick}
        order={selectedOrder}
      />
      <OrdersFilterModal
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        initialFilters={filters}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setPage(1); // Reset to page 1 when filters change
        }}
      />
      <PublishConfirmModal 
        open={isConfirmOpen} 
        onOpenChange={setIsConfirmOpen} 
        onConfirm={handleConfirmSave} 
        isLoading={isSaving} 
        actionType="save_changes"
      />
      <SuccessModal 
        open={isSuccessOpen} 
        onOpenChange={setIsSuccessOpen} 
        onDone={() => {
          setIsSuccessOpen(false);
        }}
        actionType="save_changes"
      />
    </div>
  );
}
