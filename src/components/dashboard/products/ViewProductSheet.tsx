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
  createdDate?: string;
  stockStatus?: string;
  shortDescription?: string;
  longDescription?: string;
  categoryName?: string;
  primaryImageUrl?: string;
  type?: string;
  variantCount?: number;
  minVariantPrice?: number | null;
  maxVariantPrice?: number | null;
  images?: { id: string; url: string }[];
  catalogueProperties?: { label: string; value: string; count: number; displayFormat: string; displayOrder: number }[];
  attributes?: { name: string; slug: string }[];
  variants?: {
    id: string;
    sku: string;
    sellingPrice: number;
    unitsAvailable: number;
    attributeValues: { value: string }[];
  }[];
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

function formatPrice(price?: string | number | null) {
  if (price == null || price === "") return "—";
  return `₦${Number(price).toLocaleString()}`;
}

function StockBadge({ status }: { status?: string }) {
  if (!status) return <span className="text-sm font-semibold text-text-950">—</span>;
  const s = status.toLowerCase().replace(/[_\s]/g, "");
  const isIn = s === "instock";
  const isLow = s === "lowstock";
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${
        isIn
          ? "bg-green-100 text-green-600"
          : isLow
          ? "bg-yellow-100 text-yellow-600"
          : "bg-red-100 text-red-600"
      }`}
    >
      {status}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#F7F8FA] p-4 rounded-[16px]">
      <p className="text-xs text-text-600 mb-1.5">{label}</p>
      {children}
    </div>
  );
}

function FieldText({ value }: { value: string }) {
  return <p className="text-sm font-semibold text-text-950">{value}</p>;
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

  const isVariable = product?.type === "Variable";

  const allImages =
    product?.images && product.images.length > 0
      ? product.images
      : product?.primaryImageUrl
      ? [{ id: "primary", url: product.primaryImageUrl }]
      : [];

  const dateStr = product?.publishedAt || product?.createdDate;

  const priceDisplay = isVariable
    ? product?.minVariantPrice != null && product?.maxVariantPrice != null
      ? product.minVariantPrice === product.maxVariantPrice
        ? formatPrice(product.minVariantPrice)
        : `${formatPrice(product.minVariantPrice)} – ${formatPrice(product.maxVariantPrice)}`
      : formatPrice(product?.price)
    : formatPrice(product?.price);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-145 sm:max-w-145 p-0 flex flex-col border-0 rounded-none sm:rounded-[24px] overflow-hidden sm:right-4! sm:top-4! sm:bottom-4! sm:h-[calc(100vh-32px)]!"
      >
        <SheetHeader className="px-6 pt-5 pb-4 flex flex-row items-center justify-between sticky top-0 bg-white z-10 border-b border-gray-100">
          <div>
            <SheetTitle className="text-lg font-bold text-text-950">View Product</SheetTitle>
            {product?.type && (
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isVariable
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {product.type}
              </span>
            )}
          </div>
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
                      className="shrink-0 w-40 h-40 border-2 border-dashed border-[#D8D8D9] rounded-[16px] overflow-hidden bg-[#FAFAFA]"
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
                    <div className="shrink-0 w-40 h-40 border-2 border-dashed border-[#D8D8D9] rounded-[16px] bg-[#FAFAFA] flex items-center justify-center">
                      <Image src="/svgs/product1.svg" alt="No image" width={64} height={64} className="object-contain opacity-40" />
                    </div>
                    <div className="shrink-0 w-40 h-40 border-2 border-dashed border-[#D8D8D9] rounded-[16px] bg-[#FAFAFA]" />
                  </>
                )}
              </div>

              {/* --- SIMPLE PRODUCT --- */}
              {!isVariable && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Product Name"><FieldText value={product?.name || "—"} /></Field>
                  <Field label="Price"><FieldText value={priceDisplay} /></Field>
                  <Field label="Category"><FieldText value={product?.categoryName || "—"} /></Field>
                  <Field label="SKU/Code"><FieldText value={product?.sku || "—"} /></Field>
                  <Field label="Units Available">
                    <FieldText value={product?.unitsAvailable != null ? Number(product.unitsAvailable).toLocaleString() : "—"} />
                  </Field>
                  <Field label="Stock Status"><StockBadge status={product?.stockStatus} /></Field>
                  <Field label="Units Sold">
                    <FieldText value={product?.unitsSold != null ? Number(product.unitsSold).toLocaleString() : "—"} />
                  </Field>
                  <Field label="Date Published"><FieldText value={formatDate(dateStr)} /></Field>
                  {product?.catalogueProperties && product.catalogueProperties.length > 0 && (
                    <div className="col-span-1 sm:col-span-2 bg-[#F7F8FA] p-4 rounded-[16px]">
                      <p className="text-xs text-text-600 mb-2">Properties</p>
                      <div className="flex flex-wrap gap-2">
                        {[...product.catalogueProperties]
                          .sort((a, b) => a.displayOrder - b.displayOrder)
                          .map((prop) => (
                            <span key={prop.label} className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs font-medium text-text-950">
                              {prop.label}: {prop.value}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* --- VARIABLE PRODUCT --- */}
              {isVariable && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Product Name"><FieldText value={product?.name || "—"} /></Field>
                  <Field label="Price Range"><FieldText value={priceDisplay} /></Field>
                  <Field label="Category"><FieldText value={product?.categoryName || "—"} /></Field>
                  <Field label="SKU/Code"><FieldText value={product?.sku || "—"} /></Field>
                  <Field label="Units Available">
                    <FieldText value={product?.unitsAvailable != null ? Number(product.unitsAvailable).toLocaleString() : "—"} />
                  </Field>
                  <Field label="Stock Status"><StockBadge status={product?.stockStatus} /></Field>
                  <Field label="Units Sold">
                    <FieldText value={product?.unitsSold != null ? Number(product.unitsSold).toLocaleString() : "—"} />
                  </Field>
                  <Field label="Date Published"><FieldText value={formatDate(dateStr)} /></Field>
                  {product?.attributes && product.attributes.length > 0 && (
                    <div className="col-span-1 sm:col-span-2 bg-[#F7F8FA] p-4 rounded-[16px]">
                      <p className="text-xs text-text-600 mb-3">Attributes</p>
                      <div className="flex flex-wrap gap-2">
                        {product.attributes.map((attr) => (
                          <span key={attr.slug} className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs font-medium text-text-950">
                            {attr.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product?.variants && product.variants.length > 0 && (
                    <div className="col-span-1 sm:col-span-2 bg-[#F7F8FA] p-4 rounded-[16px]">
                      <p className="text-xs text-text-600 mb-3">Variants</p>
                      <div className="space-y-3">
                        {product.variants.map((v) => (
                          <div key={v.id} className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm flex items-center justify-between">
                            <div className="flex shadow-none border-0 flex-col gap-1 items-start">
                               <p className="font-semibold text-sm text-text-950">
                                {v.attributeValues.map(av => av.value).join(" / ")}
                              </p>
                              <span className="text-xs text-text-500">{v.sku}</span>
                            </div>
                            <div className="flex flex-col items-end gap-1 border-0 shadow-none">
                              <span className="font-medium text-sm text-text-950">{formatPrice(v.sellingPrice)}</span>
                              <span className="text-xs text-text-500">{v.unitsAvailable} in stock</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Descriptions */}
              <div className="space-y-3">
                <div className="bg-[#F7F8FA] rounded-[16px] overflow-hidden">
                  <button
                    onClick={() => setIsShortDescOpen(!isShortDescOpen)}
                    className="w-full px-5 py-4 flex items-center justify-between"
                  >
                    <span className="text-sm font-semibold text-text-950">Short Description</span>
                    {isShortDescOpen ? <ChevronUp className="w-4 h-4 text-text-600" /> : <ChevronDown className="w-4 h-4 text-text-600" />}
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
                    {isLongDescOpen ? <ChevronUp className="w-4 h-4 text-text-600" /> : <ChevronDown className="w-4 h-4 text-text-600" />}
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
              className="px-8 py-2.5 rounded-full bg-[#5C00FF] text-white text-sm font-semibold hover:bg-[#00CC8D] hover:text-text-950 transition-colors"
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
                className="px-8 py-2.5 rounded-full bg-[#5C00FF] text-white text-sm font-semibold hover:bg-[#00CC8D] hover:text-text-950 transition-colors"
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
