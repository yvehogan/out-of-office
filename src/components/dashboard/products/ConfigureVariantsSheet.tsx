"use client";
import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useProductDetail, useUpdateVariant } from "@/hooks/useProducts";
import { toast } from "sonner";
import { Product, ProductVariant } from "@/types";

interface VariantForm {
  id: string;
  sku: string;
  sellingPrice: number | "";
  unitsAvailable: number | "";
  label: string;
}

interface ConfigureVariantsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function ConfigureVariantsSheet({ open, onOpenChange, product }: ConfigureVariantsSheetProps) {
  const { data: productDetail, isLoading } = useProductDetail(open && product ? product.id : "");
  const updateVariantMutation = useUpdateVariant();
  const [variantForms, setVariantForms] = useState<VariantForm[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (productDetail?.data?.variants) {
      setVariantForms(
        productDetail.data.variants.map((v: ProductVariant) => ({
          id: v.id,
          sku: v.sku,
          sellingPrice: v.sellingPrice,
          unitsAvailable: v.unitsAvailable,
          label: v.attributeValues.map((av) => av.value).join(" / "),
        }))
      );
    }
  }, [productDetail]);

  const updateField = (id: string, field: "sellingPrice" | "unitsAvailable", value: string) => {
    setVariantForms((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value === "" ? "" : Number(value) } : v))
    );
  };

  const handleSave = async (variant: VariantForm) => {
    if (!product) return;
    setSavingId(variant.id);
    try {
      await updateVariantMutation.mutateAsync({
        productId: product.id,
        variantId: variant.id,
        data: {
          sku: variant.sku,
          sellingPrice: Number(variant.sellingPrice) || 0,
          unitsAvailable: Number(variant.unitsAvailable) || 0,
        },
      });
      toast.success(`Variant "${variant.label}" updated`);
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveAll = async () => {
    if (!product) return;
    setSavingId("all");
    try {
      for (const variant of variantForms) {
        await updateVariantMutation.mutateAsync({
          productId: product.id,
          variantId: variant.id,
          data: {
            sku: variant.sku,
            sellingPrice: Number(variant.sellingPrice) || 0,
            unitsAvailable: Number(variant.unitsAvailable) || 0,
          },
        });
      }
      toast.success("All variants updated successfully");
      onOpenChange(false);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-130 sm:max-w-130 p-0 flex flex-col border-0 rounded-none sm:rounded-[24px] overflow-hidden sm:right-4! sm:top-4! sm:bottom-4! sm:h-[calc(100vh-32px)]!">
        <SheetHeader className="px-6 py-4 flex flex-row items-center justify-between sticky top-0 bg-white z-10 border-b border-gray-100">
          <div>
            <SheetTitle className="text-lg font-bold text-text-900">Configure Variants</SheetTitle>
            <p className="text-xs text-text-500 mt-0.5">{product?.name}</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-600 hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-[#5C00FF]" />
            </div>
          ) : variantForms.length === 0 ? (
            <p className="text-sm text-text-500 text-center py-10">No variants found for this product.</p>
          ) : (
            variantForms.map((variant) => (
              <div key={variant.id} className="border border-gray-200 rounded-[16px] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-text-950">{variant.label}</p>
                    <p className="text-xs text-text-500 mt-0.5">SKU: {variant.sku}</p>
                  </div>
                  <button
                    onClick={() => handleSave(variant)}
                    disabled={savingId !== null}
                    className="px-3 py-1.5 rounded-full bg-[#5C00FF] text-white text-xs font-semibold hover:bg-[#5C00FF]/90 disabled:opacity-50 transition-all"
                  >
                    {savingId === variant.id ? "Saving..." : "Save"}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <label className="absolute -top-2 left-3 px-1 bg-white text-[10px] text-text-600 z-10">Price (₦)</label>
                    <input
                      type="number"
                      value={variant.sellingPrice}
                      onChange={(e) => updateField(variant.id, "sellingPrice", e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#5C00FF] transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 px-1 bg-white text-[10px] text-text-600 z-10">Units Available</label>
                    <input
                      type="number"
                      value={variant.unitsAvailable}
                      onChange={(e) => updateField(variant.id, "unitsAvailable", e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#5C00FF] transition-colors"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {variantForms.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-white">
            <button
              onClick={handleSaveAll}
              disabled={savingId !== null}
              className="w-full py-3 rounded-full bg-[#5C00FF] text-white text-sm font-semibold hover:bg-[#5C00FF]/90 disabled:opacity-50 transition-all"
            >
              {savingId === "all" ? "Saving All..." : "Save All Variants"}
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
