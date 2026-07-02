import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { useState } from "react";
import { ViewOrderModal, OrderData } from "../orders/ViewOrderModal";
import { PublishConfirmModal } from "../products/PublishConfirmModal";
import { SuccessModal } from "../products/SuccessModal";
import { useCustomerDetail } from "@/hooks/useCustomers";
import { Customer } from "@/types";

interface ViewCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}

export function ViewCustomerModal({ open, onOpenChange, customer }: ViewCustomerModalProps) {
  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useCustomerDetail(customer?.id || "", page, 10);
  const detail = data?.data;
  const pagination = detail?.orderHistoryPagination;

  const handleSaveChangesClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      setIsConfirmOpen(false);
      setIsViewOrderOpen(false);
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" showCloseButton={false} className="max-w-[800px]! w-[95vw] sm:w-[800px] p-0 flex flex-col border-0 rounded-[24px] overflow-hidden !right-4 !top-4 !bottom-4 !h-[calc(100vh-32px)]">
        <SheetTitle className="sr-only">View Customer</SheetTitle>
        <div className="bg-white rounded-[24px] flex flex-col flex-1 min-h-0 overflow-y-auto scrollbar-hide p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8 mt-2">
            <h2 className="text-lg font-semibold text-text-900">View Customer</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-600 hover:bg-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-text-100 rounded-[16px] p-5">
              <p className="text-xs text-text-950 mb-1">Customer Name</p>
              <p className="text-sm text-text-950">
                {isLoading ? "Loading..." : detail?.fullName || customer?.fullName}
              </p>
            </div>
            <div className="bg-text-100 rounded-[16px] p-5">
              <p className="text-xs text-text-950 mb-1">Customer Email</p>
              <p className="text-sm text-text-950">
                {isLoading ? "Loading..." : detail?.email || customer?.email}
              </p>
            </div>
            <div className="bg-text-100 rounded-[16px] p-5">
              <p className="text-xs text-text-950 mb-1">Date Joined</p>
              <p className="text-sm text-text-950">
                {isLoading ? "Loading..." : new Date(detail?.dateJoined || customer?.dateJoined || "").toLocaleDateString()}
              </p>
            </div>
            <div className="bg-text-100 rounded-[16px] p-5">
              <p className="text-xs text-text-950 mb-1">Total Orders</p>
              <p className="text-sm text-text-950">
                {isLoading ? "Loading..." : detail?.totalOrders || customer?.totalOrders}
              </p>
            </div>
            <div className="bg-text-100 rounded-[16px] p-5">
              <p className="text-xs text-text-950 mb-1">Total Spend</p>
              <p className="text-sm text-text-950">
                {isLoading ? "Loading..." : `₦${(detail?.totalSpend || customer?.totalSpend || 0).toLocaleString()}`}
              </p>
            </div>
            {detail?.phoneNumber && (
              <div className="bg-text-100 rounded-[16px] p-5">
                <p className="text-xs text-text-950 mb-1">Phone Number</p>
                <p className="text-sm text-text-950">{detail.phoneNumber}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-[13px] font-semibold text-[#111827] whitespace-nowrap">Order History</h3>
            <div className="h-[2px] w-full border-t-[2px] border-dotted border-[#5C00FF]/30"></div>
          </div>

          <div className="bg-white rounded-[24px] border border-gray-100 mb-6">
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap text-left text-sm">
                <thead className="border-b border-gray-100 text-xs font-semibold text-text-600 bg-white">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Date Purchased</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Payment Status</th>
                    <th className="px-6 py-4">Order Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-text-500">
                        Loading order history...
                      </td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-red-500">
                        Failed to load order history.
                      </td>
                    </tr>
                  ) : !detail?.orderHistory || detail.orderHistory.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-text-500">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    detail.orderHistory.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-text-950">{order.orderNumber}</td>
                        <td className="px-6 py-4 text-text-950">
                          {new Date(order.purchasedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-text-950">₦{order.totalAmount.toLocaleString()}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold ${getPaymentBadge(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold ${getStatusBadge(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <button 
                            onClick={() => {
                              setSelectedOrder({
                                id: order.id,
                                date: new Date(order.purchasedAt).toLocaleDateString(),
                                amount: `₦${order.totalAmount.toLocaleString()}`,
                                payment: order.paymentStatus,
                                status: order.orderStatus,
                                name: customer?.fullName || "",
                                email: customer?.email || "",
                              });
                              onOpenChange(false);
                              setIsViewOrderOpen(true);
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

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="bg-white px-6 py-4 flex items-center justify-center border-t border-gray-100">
                <div className="flex items-center gap-1 text-[13px] font-medium text-text-600 bg-gray-100 rounded-full px-4 py-1.5">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={!pagination.hasPreviousPage}
                    className="px-2 py-1 hover:text-[#5C00FF] transition-colors disabled:opacity-50 disabled:hover:text-text-600"
                  >
                    Previous
                  </button>
                  <button className="w-6 h-6 rounded-full bg-white border border-[#5C00FF] text-[#5C00FF] flex items-center justify-center">
                    {pagination.pageNumber}
                  </button>
                  <span className="px-2">of {pagination.totalPages}</span>
                  <button 
                    onClick={() => setPage(p => p + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-2 py-1 hover:text-[#5C00FF] transition-colors disabled:opacity-50 disabled:hover:text-text-600"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
      
      <ViewOrderModal
        open={isViewOrderOpen}
        onOpenChange={setIsViewOrderOpen}
        onSaveChanges={handleSaveChangesClick}
        order={selectedOrder}
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
    </Sheet>
  );
}
