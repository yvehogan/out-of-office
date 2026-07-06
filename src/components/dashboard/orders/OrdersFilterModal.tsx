import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";

interface FilterState {
  categories: string[];
  paymentStatuses: string[];
  orderStatuses: string[];
}

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export function OrdersFilterModal({ open, onOpenChange, onApply, initialFilters }: FilterModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters?.categories || []);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string[]>(initialFilters?.paymentStatuses || []);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string[]>(initialFilters?.orderStatuses || []);

  // Update local state when modal opens
  useEffect(() => {
    if (open && initialFilters) {
      setTimeout(() => {
        setSelectedCategories(initialFilters.categories);
        setSelectedPaymentStatus(initialFilters.paymentStatuses);
        setSelectedOrderStatus(initialFilters.orderStatuses);
      }, 0);
    }
  }, [open, initialFilters]);

  const toggleSelection = (
    item: string,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const categories = ["Books", "Journals", "Shirts", "Hoodies", "Caps"];
  const paymentStatuses = ["Paid", "Pending", "Failed", "Refunded"];
  const orderStatuses = ["Processing", "Shipped", "Delivered", "Cancelled", "Pending"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-125 p-0 border-0 rounded-[24px] overflow-hidden gap-0 shadow-lg">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-lg font-semibold text-text-950">Filter</h2>
          {/* <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-600 hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button> */}
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Category */}
          <div className="flex flex-col md:flex-row mb-6 border-b border-gray-100 pb-6 gap-4 md:gap-0">
            <div className="w-full md:w-1/3">
              <h3 className="text-xs font-semibold text-text-950">By Category</h3>
            </div>
            <div className="w-full md:w-2/3 grid grid-cols-2 gap-y-4 gap-x-2">
              {categories.map((cat) => (
                <label 
                  key={cat} 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={(e) => { e.preventDefault(); toggleSelection(cat, selectedCategories, setSelectedCategories); }}
                >
                  <div className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'border-[#111827] bg-[#111827]' : 'border-gray-300 bg-white group-hover:border-[#111827]'}`}>
                    {selectedCategories.includes(cat) && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-[13px] text-text-900 font-medium">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Status */}
          <div className="flex flex-col md:flex-row mb-6 border-b border-gray-100 pb-6 gap-4 md:gap-0">
            <div className="w-full md:w-1/3">
              <h3 className="text-xs font-semibold text-text-950">By Payment Status</h3>
            </div>
            <div className="w-full md:w-2/3 grid grid-cols-2 gap-y-4 gap-x-2">
              {paymentStatuses.map((status) => (
                <label 
                  key={status} 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={(e) => { e.preventDefault(); toggleSelection(status, selectedPaymentStatus, setSelectedPaymentStatus); }}
                >
                  <div className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors ${selectedPaymentStatus.includes(status) ? 'border-[#111827] bg-[#111827]' : 'border-gray-300 bg-white group-hover:border-[#111827]'}`}>
                    {selectedPaymentStatus.includes(status) && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-[13px] text-text-900 font-medium">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Order Status */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-0">
            <div className="w-full md:w-1/3">
              <h3 className="text-xs font-semibold text-text-950">Order Status</h3>
            </div>
            <div className="w-full md:w-2/3 grid grid-cols-2 gap-y-4 gap-x-2">
              {orderStatuses.map((status) => (
                <label 
                  key={status} 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={(e) => { e.preventDefault(); toggleSelection(status, selectedOrderStatus, setSelectedOrderStatus); }}
                >
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${selectedOrderStatus.includes(status) ? 'border-[#111827] bg-[#111827]' : 'border-gray-300 bg-white group-hover:border-[#111827]'}`}>
                    {selectedOrderStatus.includes(status) && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-[13px] text-text-900 font-medium">{status === "Filter Item 1" || status === "Filter Item 2" ? "Filter Item" : status}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-4">
          <button
            onClick={() => {
              setSelectedCategories([]);
              setSelectedPaymentStatus([]);
              setSelectedOrderStatus([]);
              onApply({ categories: [], paymentStatuses: [], orderStatuses: [] });
              onOpenChange(false);
            }}
            className="px-5 py-2 rounded-full border border-success-600 text-success-600 bg-transparent text-xs font-semibold transition-all hover:bg-[#039855]/10"
          >
            Clear
          </button>
          <button
            onClick={() => {
              onApply({
                categories: selectedCategories,
                paymentStatuses: selectedPaymentStatus,
                orderStatuses: selectedOrderStatus,
              });
              onOpenChange(false);
            }}
            className="px-5 py-2 rounded-full bg-[#5C00FF] text-white text-xs font-semibold transition-all hover:bg-[#5C00FF]/90 shadow-sm"
          >
            Apply Filter
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
