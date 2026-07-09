"use client"
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { useAttributes } from "@/hooks/useAttributes";
import { useProductDetail } from "@/hooks/useProducts";
import { Product } from "@/types";
import { toast } from "sonner";

interface CreateProductSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublish: (data: FormData) => void;
  onSaveDraft: (data: FormData) => void;
  mode?: "create" | "edit";
  product?: Product;
}

const INITIAL_FORM_DATA = {
  name: "",
  shortDescription: "",
  longDescription: "",
  price: "" as string | number,
  unitsAvailable: "" as string | number,
  categoryId: "",
};

export function CreateProductSheet({ open, onOpenChange, onPublish, onSaveDraft, mode = "create", product }: CreateProductSheetProps) {
  const [selectedAttribute, setSelectedAttribute] = useState<string>("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: string; url: string }[]>([]);
  const { data: categoryData, isLoading: isLoadingCategories } = useCategories();
  const { data: attributesData } = useAttributes();
  const { data: productDetail } = useProductDetail(mode === "edit" && open ? (product?.id ?? "") : "");

  const [formData, setFormData] = useState<{
    name: string;
    shortDescription: string;
    longDescription: string;
    price: string | number;
    unitsAvailable: string | number;
    categoryId: string;
  }>(INITIAL_FORM_DATA);

  const selectedCategoryName = categoryData?.find(c => c.id === formData.categoryId)?.name ?? "";
  const isNonVariableCategory = /book|journal/i.test(selectedCategoryName);
  const productType: "Simple" | "Variable" =
    isNonVariableCategory || (selectedSizes.length === 0 && selectedColours.length === 0)
      ? "Simple"
      : "Variable";

  const prevOpenRef = useRef(open);
  // Reset form state when sheet opens (transition from closed → open)
  useEffect(() => {
    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = open;

    if (open && !wasOpen) {
      if (mode === "create") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(INITIAL_FORM_DATA);
        setSelectedSizes([]);
        setSelectedColours([]);
        setImages([]);
        setExistingImages([]);
        setSelectedAttribute("");
      } else if (product) {
        // Seed basic fields immediately; descriptions + images filled once detail loads
        setFormData({
          name: product.name || "",
          shortDescription: product.shortDescription || "",
          longDescription: product.longDescription || "",
          price: product.price?.toString() || "",
          unitsAvailable: product.unitsAvailable?.toString() || "",
          categoryId: product.categoryId || "",
        });
        setImages([]);
        setExistingImages([]);
      }
    }
  }, [open, mode, product]);

  // Populate descriptions + images once the full product detail is available in edit mode
  useEffect(() => {
    if (mode === "edit" && open && productDetail?.data) {
      const detail = productDetail.data;
      setFormData(f => ({
        ...f,
        shortDescription: detail.shortDescription || f.shortDescription,
        longDescription: detail.longDescription || f.longDescription,
      }));
      setExistingImages(
        (detail.images ?? []).map(img => ({ id: img.id, url: img.url }))
      );
    }
  }, [productDetail, mode, open]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => 
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColour = (color: string) => {
    setSelectedColours((prev) => 
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const MAX_SIZE = 2 * 1024 * 1024; // 2MB
      const newFiles = Array.from(e.target.files);
      const oversized = newFiles.filter((f) => f.size > MAX_SIZE);
      if (oversized.length > 0) {
        toast.error(`${oversized.length > 1 ? "Some images exceed" : "Image exceeds"} the 2MB limit. Please use smaller files.`);
      }
      const valid = newFiles.filter((f) => f.size <= MAX_SIZE);
      if (valid.length > 0) {
        setImages((prev) => [...prev, ...valid]);
      }
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const buildFormData = (status: "Draft" | "Published") => {
    const data = new FormData();
    data.append("Name", formData.name);
    data.append("ShortDescription", formData.shortDescription);
    data.append("LongDescription", formData.longDescription);
    data.append("Price", formData.price.toString());
    data.append("CategoryId", formData.categoryId);
    data.append("UnitsAvailable", formData.unitsAvailable.toString());
    data.append("Status", status);

    const hasAttributes = selectedSizes.length > 0 || selectedColours.length > 0;
    data.append("Type", hasAttributes ? "Variable" : "Simple");

    // Map display labels → API value slugs
    const SIZE_SLUG_MAP: Record<string, string> = {
      S: "small", M: "medium", L: "large", XL: "xl", XXL: "2xl",
    };
    const COLOUR_SLUG_MAP: Record<string, string> = {
      White: "white", Black: "black", Red: "red", Blue: "blue", Purple: "purple",
    };

    // Find parent attributes by slug (handles "sizes"/"size", "colors"/"colours" etc.)
    const sizesAttr = attributesData?.find(a => /size/i.test(a.slug));
    const coloursAttr = attributesData?.find(a => /colou?r/i.test(a.slug));

    const resolveValueId = (attr: NonNullable<typeof sizesAttr>, slug: string) =>
      attr.values.find(v => v.slug.toLowerCase() === slug)?.id ?? null;

    const attributes: { attributeId: string; attributeValueIds: string[] }[] = [];

    if (selectedSizes.length > 0 && sizesAttr) {
      const valueIds = selectedSizes
        .map(s => resolveValueId(sizesAttr, SIZE_SLUG_MAP[s] ?? s.toLowerCase()))
        .filter((id): id is string => id !== null);
      if (valueIds.length > 0) {
        attributes.push({ attributeId: sizesAttr.id, attributeValueIds: valueIds });
      }
    }

    if (selectedColours.length > 0 && coloursAttr) {
      const valueIds = selectedColours
        .map(c => resolveValueId(coloursAttr, COLOUR_SLUG_MAP[c] ?? c.toLowerCase()))
        .filter((id): id is string => id !== null);
      if (valueIds.length > 0) {
        attributes.push({ attributeId: coloursAttr.id, attributeValueIds: valueIds });
      }
    }

    data.append("AttributeSelectionsJson", attributes.length > 0 ? JSON.stringify(attributes) : "");
    data.append("MetadataJson", "");

    // Preserve existing images (edit mode) — send their IDs so the API keeps them
    existingImages.forEach((img) => {
      data.append("ExistingImageIds", img.id);
    });

    // New file uploads
    images.forEach((img) => {
      data.append("Images", img);
    });

    return data;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-150 sm:max-w-150 p-0 flex flex-col border-0 rounded-none sm:rounded-[24px] overflow-hidden sm:right-4! sm:top-4! sm:bottom-4! sm:h-[calc(100vh-32px)]!">
        <SheetHeader className="px-6 py-4 flex flex-row items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <SheetTitle className="text-lg font-bold text-text-900">
              {mode === "create" ? "Create New Product" : "Edit Product"}
            </SheetTitle>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full transition-all ${
                productType === "Variable"
                  ? "bg-purple-100 text-[#5C00FF]"
                  : "bg-emerald-50 text-[#00CC8D]"
              }`}
            >
              {productType}
            </span>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-600 hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                {/* Existing images (edit mode – URL previews) */}
                {existingImages.map((img) => (
                  <div key={img.id} className="w-37.5 h-37.5 border border-gray-200 rounded-[16px] relative overflow-hidden bg-white shadow-sm group">
                    <Image src={img.url} alt="Product image" fill className="object-cover" />
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-3 z-10">
                      <div
                        onClick={() => setExistingImages(prev => prev.filter(i => i.id !== img.id))}
                        className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm cursor-pointer"
                      >
                        <span className="text-[10px] font-bold">🗑</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* New file uploads */}
                {images.map((img, idx) => (
                  <div key={idx} className="w-37.5 h-37.5 border border-gray-200 rounded-[16px] relative overflow-hidden bg-white shadow-sm group">
                    <Image src={URL.createObjectURL(img)} alt="Preview" fill className="object-cover" />
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-3 z-10">
                      <div 
                        onClick={() => removeImage(idx)}
                        className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm cursor-pointer"
                      >
                        <span className="text-[10px] font-bold">🗑</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add New Image Placeholder */}
                <label className="w-37.5 h-37.5 border border-dashed border-[#D8D8D9] rounded-[16px] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-[#5C00FF]">
                    <Plus className="w-4 h-4" />
                  </div>
                </label>
              </div>
              <p className="text-xs text-text-600 p-3 leading-relaxed max-w-100 border border-dashed border-[#D8D8D9] rounded-[16px]">
                Upload at least 2 images of the product. You can also upload a video. Drag and drop to rearrange the order of your media files. File dimension is 1080 x 1080
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-6 mt-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-4 px-1 bg-white text-xs text-text-950 z-10">Product Name<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                  className="w-full h-13 px-5 rounded-[24px] border border-[#111827] text-sm outline-none transition-all relative bg-transparent"
                />
              </div>

              <div className="relative">
                <label className="absolute -top-2.5 left-4 px-1 bg-white text-xs text-text-950 z-10">Price (₦)<span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData(f => ({ ...f, price: e.target.value }))}
                  className="w-full h-13 px-5 rounded-[24px] border border-[#111827] text-sm outline-none transition-all relative bg-transparent"
                />
              </div>

              <div className="relative">
                <label className="absolute -top-2.5 left-4 px-1 bg-white text-xs text-text-950 z-10">Short Description<span className="text-red-500">*</span></label>
                <textarea
                  rows={4}
                  maxLength={1000}
                  value={formData.shortDescription}
                  onChange={e => setFormData(f => ({ ...f, shortDescription: e.target.value }))}
                  className="w-full p-5 rounded-[24px] border border-[#111827] text-[14px] leading-relaxed text-text-950 outline-none transition-all resize-none relative bg-transparent"
                />
                <span className="absolute bottom-4 right-5 text-[11px] text-[#111827] font-medium z-10">{formData.shortDescription.length}/1000</span>
              </div>

              <div className="relative">
                <label className="absolute -top-2.5 left-4 px-1 bg-white text-xs text-text-950 z-10">Long Description<span className="text-red-500">*</span></label>
                <textarea
                  rows={6}
                  maxLength={2000}
                  value={formData.longDescription}
                  onChange={e => setFormData(f => ({ ...f, longDescription: e.target.value }))}
                  className="w-full p-5 rounded-[24px] border border-[#111827] text-[14px] leading-relaxed text-text-950 outline-none transition-all resize-none relative bg-transparent"
                />
                <span className="absolute bottom-4 right-5 text-[11px] text-[#111827] font-medium z-10">{formData.longDescription.length}/2000</span>
              </div>

              <div className="relative">
                <label className="absolute -top-2.5 left-4 px-1 bg-white text-xs text-text-950 z-10">Units Available<span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={formData.unitsAvailable}
                  onChange={e => setFormData(f => ({ ...f, unitsAvailable: e.target.value }))}
                  className="w-full h-13.75 px-5 rounded-[24px] border border-[#111827] text-sm outline-none transition-all relative bg-transparent"
                />
              </div>

              <div className="relative">
                <label className="absolute -top-2.5 left-4 px-1 bg-white text-xs text-text-950 z-10">Category<span className="text-red-500">*</span></label>
                <Select value={formData.categoryId} onValueChange={(val) => setFormData(f => ({ ...f, categoryId: val as string }))}>
                  <SelectTrigger className="w-full h-[72px] px-5 rounded-[24px] border-[#111827] outline-none shadow-none text-sm text-[#111827] relative bg-transparent">
                    <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Select a category"}>
                      {(value: string | null) => value ? (categoryData?.find(c => c.id === value)?.name ?? value) : null}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-[16px]">
                    {categoryData?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} className="py-3">{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!isNonVariableCategory && (
              <div className="relative">
                <label className="absolute -top-2.5 left-4 px-1 bg-white text-xs text-text-950 z-10">Attributes</label>
                <Select value={selectedAttribute} onValueChange={(val) => setSelectedAttribute(val || "")}>
                  <SelectTrigger className="w-full h-18 px-5 rounded-[24px] border-[#111827] outline-none shadow-none text-sm text-[#111827] relative bg-transparent">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[16px]">
                    <SelectItem value="sizes-colors" className="py-3">Sizes and Colours</SelectItem>
                    <SelectItem value="sizes" className="py-3">Sizes</SelectItem>
                    <SelectItem value="colors" className="py-3">Colours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              )}

              {selectedAttribute && (
                <div className="space-y-6 animate-in slide-in-from-top-2 fade-in duration-200">
                  {(selectedAttribute === "sizes-colors" || selectedAttribute === "sizes") && (
                    <div className="relative">
                      <label className="absolute -top-2.5 left-4 px-1 bg-white text-xs text-text-950 z-10">Sizes<span className="text-red-500">*</span></label>
                      <div className="w-full px-5 pt-6 pb-5 rounded-[24px] border border-[#111827] relative bg-transparent">
                        <div className="flex flex-wrap gap-2">
                          {["S", "M", "L", "XL", "XXL"].map((size) => {
                            const isSelected = selectedSizes.includes(size);
                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => toggleSize(size)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                                  isSelected
                                    ? "bg-[#5C00FF] border-[#5C00FF] text-white"
                                    : "bg-white border-[#D8D8D9] text-[#111827] hover:border-[#5C00FF] hover:text-[#5C00FF]"
                                }`}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {(selectedAttribute === "sizes-colors" || selectedAttribute === "colors") && (
                    <div className="relative">
                      <label className="absolute -top-2.5 left-4 px-1 bg-white text-xs text-text-950 z-10">Colours<span className="text-red-500">*</span></label>
                      <div className="w-full px-5 pt-6 pb-5 rounded-[24px] border border-[#111827] relative bg-transparent">
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: "White", hex: "#FFFFFF" },
                            { name: "Black", hex: "#000000" },
                            { name: "Red", hex: "#EF4444" },
                            { name: "Blue", hex: "#3B82F6" },
                            { name: "Purple", hex: "#A855F7" },
                          ].map(({ name, hex }) => {
                            const isSelected = selectedColours.includes(name);
                            return (
                              <button
                                key={name}
                                type="button"
                                onClick={() => toggleColour(name)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                                  isSelected
                                    ? "border-[#5C00FF] bg-purple-50 text-[#5C00FF]"
                                    : "border-[#D8D8D9] bg-white text-[#111827] hover:border-[#5C00FF] hover:text-[#5C00FF]"
                                }`}
                              >
                                <span
                                  className="w-3.5 h-3.5 rounded-full shrink-0 border border-gray-300"
                                  style={{ backgroundColor: hex }}
                                />
                                {name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-white flex gap-4 justify-end">
          <button
            onClick={() => onSaveDraft(buildFormData("Draft"))}
            className="px-5 py-3 rounded-full border border-success-600 text-text-950 bg-transparent text-sm font-semibold transition-all hover:bg-gray-50"
          >
            Save To Draft
          </button>
          <button
            onClick={() => onPublish(buildFormData("Published"))}
            className="px-5 py-3 rounded-full bg-[#5C00FF] text-white text-sm font-semibold transition-all hover:bg-[#5C00FF]/90 shadow-sm"
          >
            {mode === "create" ? "Publish Product" : "Update Product"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}


