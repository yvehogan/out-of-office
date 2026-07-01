"use client";
import { useState } from "react";
import Image from "next/image";
import { X, ChevronDown, ChevronUp } from "lucide-react";
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
  unitsSold?: string | number;
  publishedAt?: string;
  stockStatus?: string;
  shortDescription?: string;
  longDescription?: string;
  categoryName?: string;
  primaryImageUrl?: string;
  images?: { id: string; url: string }[];
  catalogueProperties?: { attributeId: string; attributeName: string; values: { id: string; value: string }[] }[];
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

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function getStockBadge(status?: string) {
  if (!status) return <span className="text-sm font-semibold text-text-950">—</span>;
  return (
    <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-100 text-green-600">
      {status}
    </span>
  );
}

export function ViewProductSheet({
  open,
  onOpenChange,
  product: initialProduct,
  onEdit,
  onArchive,
  onUnarchive,
  mode = "view",
}: ViewProductSheetProps) {
  const [isShortDescOpen, setIsShortDescOpen] = useState(true);
  const [isLongDescOpen, setIsLongDescOpen] = useState(false);

  const { data: productDetail, isLoading } = useProductDetail(initialProduct?.id || "");
  const product = productDetail?.data || initialProduct;

  const allImages =
    product?.images && product.images.length > 0
      ? product.images
      : product?.primaryImageUrl
      ? [{ id: "primary", url: product.primaryImageUrl }]
      : [];

  const attributeText =
    product?.catalogueProperties && product.catalogueProperties.length > 0
      ? product.catalogueProperties
          .map((p) => `${p.attributeName}: ${p.values.map((v) => v.value).join(", ")}`)
          .join(" · ")
      : "None";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[580px] sm:w-[580px] p-0 flex flex-col border-0 rounded-[24px] overflow-hidden right-4! top-4! bottom-4! h-[calc(100vh-32px)]!"
      >
        <SheetHeader className="px-6 pt-5 pb-4 flex flex-row items-center justify-between sticky top-0 bg-white z-10 border-b border-gray-100">
          <SheetTitle className="text-lg font-bold text-text-950">View Product</SheetTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-600 hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-[#5C00FF]" />
            </div>
          ) : (
            <>
              {/* Images */}
              <div className="flex gap-3 overflow-x-auto pb-1">
                {allImages.length > 0 ? (
                  allImages.map((img) => (
                    <div
                      key={img.id}
                      className="shrink-0 w-[160px] h-[160px] border-2 border-dashed border-[#D8D8D9] rounded-[16px] overflow-hidden bg-[#FAFAFA]"
                    >
                      <Image
                        src={img.url}
                        alt="Product image"
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="shrink-0 w-[160px] h-[160px] border-2 border-dashed border-[#D8D8D9] rounded-[16px] bg-[#FAFAFA] flex items-center justify-center">
                      <Image src="/svgs/product1.svg" alt="No image" width={64} height={64} className="object-contain opacity-40" />
                    </div>
                    <div className="shrink-0 w-[160px] h-[160px] border-2 border-dashed border-[#D8D8D9] rounded-[16px] bg-[#FAFAFA]" />
                  </>
                )}
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F7F8FA] p-4 rounded-[16px]">
                  <p className="text-xs text-text-600 mb-1.5">Product Name</p>
                  <p className="text-sm font-semibold text-text-950">{product?.name || "—"}</p>
                </div>
                <div className="bg-[#F7F8FA] p-4 rounded-[16px]">
                  <p className="text-xs text-text-600 mb-1.5">Price</p>
                  <p className="text-sm font-semibold text-text-950">
                    ₦{product?.price ? Number(product.price).toLocaleString() : "—"}
                  </p>
                </div>

                <div className="bg-[#F7F8FA] p-4 rounded-[16px]">
                  <p className="text-xs text-text-600 mb-1.5">Category</p>
                  <p className="text-sm font-semibold text-text-950">{product?.categoryName || "—"}</p>
                </div>
                <div className="bg-[#F7F8FA] p-4 rounded-[16px]">
                  <p className="text-xs text-text-600 mb-1.5">SKU/Code</p>
                  <p className="text-sm font-semibold text-text-950">{product?.sku || "—"}</p>
                </div>

                <div className="bg-[#F7F8FA] p-4 rounded-[16px]">
                  <p className="text-xs text-text-600 mb-1.5">Units Available</p>
                  <p className="text-sm font-semibold text-text-950">
                    {product?.unitsAvailable !== undefined ? Number(product.unitsAvailable).toLocaleString() : "—"}
                  </p>
                </div>
                <div className="bg-[#F7F8FA] p-4 rounded-[16px]">
                  <p className="text-xs text-text-600 mb-1.5">Stock Status</p>
                  {getStockBadge(product?.stockStatus)}
                </div>

                <div className="bg-[#F7F8FA] p-4 rounded-[16px]">
                  <p className="text-xs text-text-600 mb-1.5">Units Sold</p>
                  <p className="text-sm font-semibold text-text-950">
                    {product?.unitsSold !== undefined ? Number(product.unitsSold).toLocaleString() : "—"}
                  </p>
                </div>
                <div className="bg-[#F7F8FA] p-4 rounded-[16px]">
                  <p className="text-xs text-text-600 mb-1.5">Attributes</p>
                  <p className="text-sm font-semibold text-text-950">{attributeText}</p>
                </div>

                <div className="bg-[#F7F8FA] p-4 rounded-[16px]">
                  <p className="text-xs text-text-600 mb-1.5">Date Published</p>
                  <p className="text-sm font-semibold text-text-950">{formatDate(product?.publishedAt)}</p>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-3">
                <div className="bg-[#F7F8FA] rounded-[16px] overflow-hidden">
                  <button
                    onClick={() => setIsShortDescOpen(!isShortDescOpen)}
                    className="w-full px-5 py-4 flex items-center justify-between"
                  >
                    <span className="text-sm font-semibold text-text-950">Short Description</span>
                    {isShortDescOpen ? (
                      <ChevronUp className="w-4 h-4 text-text-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-text-600" />
                    )}
                  </button>
                  {isShortDescOpen && (
                    <div className="px-5 pb-5 text-sm text-text-600 leading-relaxed">
                      {product?.shortDescription || "No short description provided."}
                    </div>
                  )}
                </div>

                <div className="bg-[#F7F8FA] rounded-[16px] overflow-hidden">
                  <button
                    onClick={() => setIsLongDescOpen(!isLongDescOpen)}
                    className="w-full px-5 py-4 flex items-center justify-between"
                  >
                    <span className="text-sm font-semibold text-text-950">Long Description</span>
                    {isLongDescOpen ? (
                      <ChevronUp className="w-4 h-4 text-text-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-text-600" />
                    )}
                  </button>
                  {isLongDescOpen && (
                    <div className="px-5 pb-5 text-sm text-text-600 leading-relaxed">
                      {product?.longDescription || "No long description provided."}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-center gap-4">
          {mode === "archive" ? (
            <button
              onClick={onUnarchive}
              className="px-8 py-2.5 rounded-full bg-[#5C00FF] text-white text-sm font-semibold hover:bg-[#5C00FF]/90 transition-colors"
            >
              Unarchive Product
            </button>
          ) : (
            <>
              <button
                onClick={onArchive}
                className="px-8 py-2.5 rounded-full border border-success-600 text-success-600 text-sm font-semibold hover:bg-success-600/10 transition-colors"
              >
                Archive Product
              </button>
              <button
                onClick={onEdit}
                className="px-8 py-2.5 rounded-full bg-[#5C00FF] text-white text-sm font-semibold hover:bg-[#5C00FF]/90 transition-colors"
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
