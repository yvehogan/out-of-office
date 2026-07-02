"use client"
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ListFilter } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

export interface ProductFilters {
  categories: string[];
  stockStatuses: string[];
}

interface ProductFilterModalProps {
  initialFilters?: ProductFilters;
  onApply?: (filters: ProductFilters) => void;
}

const STOCK_STATUS_MAP: Record<string, string> = {
  "In Stock": "InStock",
  "Low Stock": "LowStock",
  "Out of Stock": "OutOfStock",
};

export function ProductFilterModal({ initialFilters, onApply }: ProductFilterModalProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(initialFilters?.categories || []);
  const [stockStatuses, setStockStatuses] = useState<string[]>(initialFilters?.stockStatuses || []);

  const { data: categoryData, isLoading: isLoadingCategories } = useCategories();

  useEffect(() => {
    if (open && initialFilters) {
      setTimeout(() => {
        setCategories(initialFilters.categories);
        setStockStatuses(initialFilters.stockStatuses);
      }, 0);
    }
  }, [open, initialFilters]);

  const toggleCategory = (catId: string) => {
    setCategories(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const toggleStockStatus = (status: string) => {
    const apiStatus = STOCK_STATUS_MAP[status];
    setStockStatuses(prev => 
      prev.includes(apiStatus) ? prev.filter(s => s !== apiStatus) : [...prev, apiStatus]
    );
  };

  const handleApply = () => {
    onApply?.({ categories, stockStatuses });
    setOpen(false);
  };

  const handleClear = () => {
    setCategories([]);
    setStockStatuses([]);
    onApply?.({ categories: [], stockStatuses: [] });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center gap-2 rounded-full border border-[#5700FF] bg-white px-5 py-2.5 text-xs font-semibold text-text-950 transition-all hover:bg-[#F3ECFF] w-full sm:w-auto justify-center">
        <ListFilter className="h-5 w-5 text-text-950" strokeWidth={2.5} />
        <span>Filter</span>
        {(initialFilters?.categories.length || initialFilters?.stockStatuses.length) ? (
          <span className="ml-1 w-2 h-2 rounded-full bg-[#5C00FF]" />
        ) : null}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[24px] border-none p-0 overflow-hidden shadow-2xl">
        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-lg font-semibold text-text-950">Filter</DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            {/* By Category */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:w-1/3">
                <h4 className="font-semibold text-text-950 text-xs">By Category</h4>
              </div>
              <div className="sm:w-2/3 grid grid-cols-2 gap-4">
                {isLoadingCategories ? (
                  <div className="text-xs text-text-500">Loading categories...</div>
                ) : (
                  categoryData?.map((cat) => (
                    <div key={cat.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`cat-${cat.id}`} 
                        checked={categories.includes(cat.id)}
                        onCheckedChange={() => toggleCategory(cat.id)}
                        className="border-gray-300 data-[state=checked]:bg-[#5700FF] data-[state=checked]:border-[#5700FF]" 
                      />
                      <label
                        htmlFor={`cat-${cat.id}`}
                        className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-text-700 cursor-pointer"
                      >
                        {cat.name}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* By Stock Status */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:w-1/3">
                <h4 className="font-semibold text-text-950 text-xs">By Stock Status</h4>
              </div>
              <div className="sm:w-2/3 flex flex-col space-y-4">
                {["In Stock", "Low Stock", "Out of Stock"].map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`status-${status}`} 
                      checked={stockStatuses.includes(STOCK_STATUS_MAP[status])}
                      onCheckedChange={() => toggleStockStatus(status)}
                      className="border-gray-300 data-[state=checked]:bg-[#5700FF] data-[state=checked]:border-[#5700FF]" 
                    />
                    <label
                      htmlFor={`status-${status}`}
                      className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-text-700 cursor-pointer"
                    >
                      {status}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-[24px]">
          <button
            type="button"
            className="px-6 py-2.5 rounded-full border border-[#00CC8D] text-text-950 font-semibold text-[10px] hover:bg-[#ECFBF5] transition-colors"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            type="button"
            className="px-6 py-2.5 rounded-full bg-[#5700FF] text-white font-semibold text-sm hover:bg-[#5700FF]/90 transition-colors"
            onClick={handleApply}
          >
            Apply Filter
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
