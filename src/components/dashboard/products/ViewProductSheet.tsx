"use client"
import { useState } from "react";
import Image from "next/image";
import { X, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useProductDetail } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";

export interface ProductData {
  id?: string;
  name?: string;
  price?: string | number;
  category?: string;
  sku?: string;
  unitsAvailable?: string | number;
  stockStatus?: string;
  shortDescription?: string;
  longDescription?: string;
  categoryName?: string;
  primaryImageUrl?: string;
  images?: { id: string; url: string }[];
}

interface ViewProductSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductData | null;
  onPublish?: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
  onUnarchive?: () => void;
  mode?: "archive" | "view";
}

export function ViewProductSheet({ open, onOpenChange, product: initialProduct, onEdit, onArchive, onUnarchive, mode = "view" }: ViewProductSheetProps) {
  const [isShortDescOpen, setIsShortDescOpen] = useState(true);
  const [isLongDescOpen, setIsLongDescOpen] = useState(false);

  const { data: productDetail, isLoading } = useProductDetail(initialProduct?.id || "");
  const product = productDetail?.data || initialProduct;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[600px] sm:w-[600px] p-0 flex flex-col border-0 rounded-[24px] overflow-hidden right-4! top-4! bottom-4! h-[calc(100vh-32px)]!">
        <SheetHeader className="px-6 py-4 flex flex-row items-center justify-between sticky top-0 bg-white z-10">
          <SheetTitle className="text-lg font-bold text-text-900">View Product</SheetTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-600 hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide flex flex-col gap-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-[#5C00FF]" />
            </div>
          ) : (
            <>
              {/* Details Grid */}
              <div className="flex gap-4 overflow-x-auto pb-2 relative h-[200px]">
                {(product?.images && product.images.length > 0) ? (
                  product.images.map((img) => (
                    <div key={img.id} className="w-[180px] h-[180px] shrink-0 border border-dashed border-[#D8D8D9] rounded-[16px] bg-white p-2">
                      <div className="relative w-full h-full">
                        <Image src={img.url} alt="Product image" fill className="object-cover rounded-[8px]" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-[180px] h-[180px] shrink-0 border border-dashed border-[#D8D8D9] rounded-[16px] bg-white p-2">
                    <div className="relative w-full h-full">
                      {product?.primaryImageUrl ? (
                        <Image src={product.primaryImageUrl} alt="Product image" fill className="object-cover rounded-[8px]" />
                      ) : (
                        <Image src="/svgs/product1.svg" alt="Product image" fill className="object-contain" />
                      )}
                    </div>
                  </div>
                )}
                
                {product?.images && product.images.length > 2 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 shadow-sm rounded-full flex items-center justify-center text-[#5C00FF] cursor-pointer z-10">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F7F8FA] p-4 rounded-[16px]">
              <p className="text-xs text-text-600 mb-1">Product Name</p>
              <p className="text-sm text-text-950 font-medium">{product?.name || "Adebayo Ogunlesi"}</p>
            </div>
            <div className="bg-[#F7F8FA] p-4 rounded-[16px]">
              <p className="text-xs text-text-600 mb-1">Price</p>
              <p className="text-sm text-text-950 font-medium">₦{product?.price ? Number(product.price).toLocaleString() : "24,000"}</p>
            </div>
            <div className="bg-[#F7F8FA] p-4 rounded-[16px]">
              <p className="text-xs text-text-600 mb-1">Category</p>
              <p className="text-sm text-text-950 font-medium">{product?.categoryName || "Books"}</p>
            </div>
            <div className="bg-[#F7F8FA] p-4 rounded-[16px]">
              <p className="text-xs text-text-600 mb-1">SKU/Code</p>
              <p className="text-sm text-text-950 font-medium">{product?.sku || "OOU-BF-HDP-01"}</p>
            </div>
            <div className="bg-[#F7F8FA] p-4 rounded-[16px]">
              <p className="text-xs text-text-600 mb-1">Units Available</p>
              <p className="text-sm text-text-950 font-medium">{product?.unitsAvailable || "100,000"}</p>
            </div>
            <div className="bg-[#F7F8FA] p-4 rounded-[16px]">
              <p className="text-xs text-text-600 mb-1">Stock Status</p>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide bg-success-100 text-success-600`}>
                {product?.stockStatus || "In Stock"}
              </span>
            </div>
            <div className="bg-[#F7F8FA] p-4 rounded-[16px]">
              <p className="text-xs text-text-600 mb-1">Units Sold</p>
              <p className="text-sm text-text-950 font-medium">100,000</p>
            </div>
            <div className="bg-[#F7F8FA] p-4 rounded-[16px]">
              <p className="text-xs text-text-600 mb-1">Attributes</p>
              <p className="text-sm text-text-950 font-medium">None</p>
            </div>
            <div className="bg-[#F7F8FA] p-4 rounded-[16px]">
              <p className="text-xs text-text-600 mb-1">Date Published</p>
              <p className="text-sm text-text-950 font-medium">24 May, 2026</p>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4 mt-2">
            <div className="bg-[#F7F8FA] rounded-[24px] overflow-hidden">
              <button 
                onClick={() => setIsShortDescOpen(!isShortDescOpen)}
                className="w-full px-5 py-4 flex items-center justify-between"
              >
                <span className="text-sm font-semibold text-text-950">Short Description</span>
                {isShortDescOpen ? <ChevronUp className="w-5 h-5 text-text-600" /> : <ChevronDown className="w-5 h-5 text-text-600" />}
              </button>
              {isShortDescOpen && (
                <div className="px-5 pb-5 text-sm text-text-600 leading-relaxed">
                  {product?.shortDescription || "Out of Office is a deeply personal reflection on work, purpose, leadership, faith, relationships, and the decisions that shape our lives. Through honest stories and practical lessons, Solomon O. Ayodele"}
                </div>
              )}
            </div>

            <div className="bg-[#F7F8FA] rounded-[24px] overflow-hidden">
              <button 
                onClick={() => setIsLongDescOpen(!isLongDescOpen)}
                className="w-full px-5 py-4 flex items-center justify-between"
              >
                <span className="text-sm font-semibold text-text-950">Long Description</span>
                {isLongDescOpen ? <ChevronUp className="w-5 h-5 text-text-600" /> : <ChevronDown className="w-5 h-5 text-text-600" />}
              </button>
              {isLongDescOpen && (
                <div className="px-5 pb-5 text-sm text-text-600 leading-relaxed">
                  {product?.longDescription || "In this deeply personal and thought-provoking book, Solomon O. Ayodele shares the stories that rarely make it onto social media or a résumé—the difficult career decisions, failed ventures, moments of"}
                </div>
              )}
            </div>
          </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-4">
          {mode === "archive" ? (
            <button 
              onClick={onUnarchive}
              className="px-6 py-2.5 rounded-full bg-[#5C00FF] text-white text-sm font-semibold transition-all hover:bg-[#5C00FF]/90 shadow-sm"
            >
              Unarchive Product
            </button>
          ) : (
            <>
              <button 
                onClick={onArchive}
                className="px-6 py-2.5 rounded-full border border-success-600 text-success-600 text-sm font-semibold transition-all hover:bg-success-600/10 shadow-sm"
              >
                Archive Product
              </button>
              <button 
                onClick={onEdit}
                className="px-6 py-2.5 rounded-full bg-[#5C00FF] text-white text-sm font-semibold transition-all hover:bg-[#5C00FF]/90 shadow-sm"
              >
                Edit Product
              </button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
