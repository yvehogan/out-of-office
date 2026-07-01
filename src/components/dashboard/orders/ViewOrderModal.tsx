import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useUpdateOrderStatus, useOrderDetail } from "@/hooks/useOrders";
import { X } from "lucide-react";

export interface OrderData {
  id?: string;
  name?: string;
  email?: string;
  date?: string;
  amount?: string;
  payment?: string;
  status?: string;
}

interface ViewOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveChanges?: () => void;
  order: OrderData | null;
}

export function ViewOrderModal({ open, onOpenChange, order }: ViewOrderModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  
  const updateStatusMutation = useUpdateOrderStatus();
  const { data: orderDetailData, isLoading: isLoadingDetail } = useOrderDetail(order?.id || "");

  useEffect(() => {
    if (order?.status) {
      setTimeout(() => setSelectedStatus(order.status || ""), 0);
    }
  }, [order]);

  const handleSave = () => {
    if (!order?.id || !selectedStatus) return;

    updateStatusMutation.mutate(
      { 
        id: order.id, 
        payload: { orderStatus: selectedStatus, confirm: true } 
      },
      {
        onSuccess: (data) => {
          if (data.success !== false) {
            onOpenChange(false);
          }
        }
      }
    );
  };

  const products = orderDetailData?.data?.items || [];
  
  const calculatedTotal = products.reduce((acc, item) => acc + (item.subtotal || 0), 0);
  const displayTotal = orderDetailData?.data?.totalAmount 
    ? `₦${orderDetailData.data.totalAmount.toLocaleString()}` 
    : calculatedTotal > 0 ? `₦${calculatedTotal.toLocaleString()}` : order?.amount || "₦0";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" showCloseButton={false} className="max-w-[700px]! w-[95vw] sm:w-[700px] p-0 flex flex-col border-0 rounded-[24px] overflow-hidden !right-4 !top-4 !bottom-4 !h-[calc(100vh-32px)]">
        <SheetTitle className="sr-only">View Order</SheetTitle>
        <div className="bg-white rounded-[24px] flex flex-col flex-1 h-full overflow-y-auto scrollbar-hidden p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8 mt-2">
            <h2 className="text-lg font-semibold text-text-900">View Order</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-600 hover:bg-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-6 gap-4 mb-8">
            {/* Row 1: 3 items */}
            <div className="bg-text-100 rounded-[16px] p-3 col-span-2">
              <p className="text-xs text-text-950 mb-1">Order ID</p>
              <p className="text-sm text-text-950">{orderDetailData?.data?.orderNumber || order?.id || "-"}</p>
            </div>
            <div className="bg-text-100 rounded-[16px] p-3 col-span-2">
              <p className="text-xs text-text-950 mb-1">Date Purchased</p>
              <p className="text-sm text-text-950">{order?.date || "-"}</p>
            </div>
            <div className="bg-text-100 rounded-[16px] p-3 col-span-2">
              <p className="text-xs text-text-950 mb-1">Amount</p>
              <p className="text-sm text-text-950">{order?.amount || "-"}</p>
            </div>

            {/* Row 2: 2 items */}
            <div className="bg-text-100 rounded-[16px] p-3 col-span-3">
              <p className="text-xs text-text-950 mb-1">Customer Name</p>
              <p className="text-sm text-text-950">{order?.name || "-"}</p>
            </div>
            <div className="bg-text-100 rounded-[16px] p-3 col-span-3">
              <p className="text-xs text-text-950 mb-1">Customer Email</p>
              <p className="text-sm text-text-950">{order?.email || "-"}</p>
            </div>

            {/* Row 3: 3 items */}
            <div className="bg-text-100 rounded-[16px] p-3 col-span-2">
              <p className="text-xs text-text-950 mb-1">Customer Phone</p>
              <p className="text-sm text-text-950">{orderDetailData?.data?.customerPhone || "-"}</p>
            </div>
            <div className="bg-text-100 rounded-[16px] p-3 col-span-2">
              <p className="text-xs text-text-950 mb-1">Payment Status</p>
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                order?.payment === "Paid" || order?.payment === "Refunded" ? "bg-success-100 text-success-600" :
                order?.payment === "Pending" ? "bg-warning-100 text-warning-600" : "bg-gray-100 text-gray-700"
              }`}>
                {order?.payment || "-"}
              </div>
            </div>
            <div className="bg-text-100 rounded-[16px] p-3 col-span-2">
              <p className="text-xs text-text-950 mb-1">Delivery Type</p>
              <p className="text-sm text-text-950">{orderDetailData?.data?.deliveryType || "-"}</p>
            </div>

            {/* Row 4: 2 items */}
            <div className="bg-text-100 rounded-[16px] p-3 col-span-3">
              <p className="text-xs text-text-950 mb-1">Pickup Location</p>
              <p className="text-sm text-text-950">{orderDetailData?.data?.pickupLocation || "-"}</p>
            </div>
            <div className="bg-text-100 rounded-[16px] p-3 col-span-3">
              <p className="text-xs text-text-950 mb-1">City / State</p>
              <p className="text-sm text-text-950">
                {orderDetailData?.data?.city ? `${orderDetailData.data.city}, ${orderDetailData.data.state || ""}` : "-"}
              </p>
            </div>

            {/* Row 5: 2 items */}
            <div className="bg-text-100 rounded-[16px] p-3 col-span-2">
              <p className="text-xs text-text-950 mb-1">Landmark</p>
              <p className="text-sm text-text-950">{orderDetailData?.data?.landmark || "-"}</p>
            </div>
            <div className="bg-text-100 rounded-[16px] p-3 col-span-4">
              <p className="text-xs text-text-950 mb-1">Shipping Address</p>
              <p className="text-sm text-text-950">{orderDetailData?.data?.shippingAddress || "-"}</p>
            </div>
          </div>

          <div className="border border-gray-100 rounded-[20px] mb-8">
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap text-left text-sm scrollbar-hidden">
                <thead className="bg-white border-b border-gray-100 text-xs font-semibold text-text-950">
                  <tr>
                    <th className="px-6 py-4">S/N</th>
                    <th className="px-6 py-4">Product Details</th>
                    <th className="px-6 py-4">SKU/Code</th>
                    <th className="px-6 py-4">Options</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {isLoadingDetail ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-text-500">Loading items...</td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-text-500">No items found.</td>
                    </tr>
                  ) : (
                    products.map((item, index) => {
                      let parsedOptions: string[] = [];
                      if (item.selectedOptions) {
                        parsedOptions = item.selectedOptions.split(", ").map(opt => {
                          const parts = opt.split(":");
                          return parts.length > 1 ? parts[1] : opt;
                        });
                      }

                      return (
                        <tr key={item.id || index} className="text-xs text-text-950">
                          <td className="px-6 py-4">{index + 1 < 10 ? `0${index + 1}` : index + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md border border-gray-100 overflow-hidden relative bg-gray-50 flex-shrink-0">
                                <Image src={"/images/product1.png"} alt={item.productName || "Product"} fill className="object-cover" />
                              </div>
                              <span className="font-medium">{item.productName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{item.productSku || "-"}</td>
                          <td className="px-6 py-4">
                            {parsedOptions.length > 0 ? (
                              <div className="flex gap-2">
                                {parsedOptions.map(opt => (
                                  <span key={opt} className="bg-gray-100 rounded-full px-2 py-1 text-[10px] text-text-900 font-medium">
                                    {opt}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="bg-gray-100 rounded-full px-2 py-1 text-[10px] text-text-900 font-medium">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">{item.quantity}</td>
                          <td className="px-6 py-4">₦{(item.unitPrice || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 text-right">₦{(item.subtotal || 0).toLocaleString()}</td>
                        </tr>
                      );
                    })
                  )}
                  <tr className="bg-white border-t border-gray-100">
                    <td colSpan={5}></td>
                    <td className="px-6 py-4 font-bold text-text-950 text-right">Total</td>
                    <td className="px-6 py-4 font-bold text-text-950 text-right">{displayTotal}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="relative mb-8">
            <label className="absolute -top-2.5 left-4 px-1 bg-white text-[13px] text-[#374151] z-10 font-medium">Order Status</label>
            <Select 
              value={selectedStatus} 
              onValueChange={(val) => setSelectedStatus(val || "")}
            >
              <SelectTrigger className="w-full h-[60px] px-5 rounded-[24px] border border-[#111827] focus:ring-[#5C00FF] outline-none shadow-none text-sm text-[#111827] relative bg-transparent">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="rounded-[16px] w-(--anchor-width) min-w-(--anchor-width)">
                <SelectItem value="Processing" className="py-4 pl-5">Processing</SelectItem>
                <SelectItem value="Shipped" className="py-4 pl-5">Shipped</SelectItem>
                <SelectItem value="Delivered" className="py-4 pl-5">Delivered</SelectItem>
                <SelectItem value="Cancelled" className="py-4 pl-5">Cancelled</SelectItem>
                <SelectItem value="Pending" className="py-4 pl-5">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={updateStatusMutation.isPending}
              className="px-5 py-3 rounded-full bg-[#5C00FF] text-white text-sm font-semibold transition-all hover:bg-[#5C00FF]/90 shadow-sm disabled:opacity-50"
            >
              {updateStatusMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
