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
  const [isSizesOpen, setIsSizesOpen] = useState(false);
  const [isColoursOpen, setIsColoursOpen] = useState(false);
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
        setIsSizesOpen(false);
        setIsColoursOpen(false);
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
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
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

    const attributes = [];
    const sizesAttr = attributesData?.find(a => a.name === "Sizes" || a.name === "Size");
    const coloursAttr = attributesData?.find(a => a.name === "Colours" || a.name === "Colour");

    if (selectedSizes.length > 0 && sizesAttr) {
      const valueIds = selectedSizes.map(size => {
        const val = sizesAttr.values.find(v => v.value.toLowerCase() === size.toLowerCase());
        return val ? val.id : size;
      });
      attributes.push({ attributeId: sizesAttr.id, attributeValueIds: valueIds });
    }
    if (selectedColours.length > 0 && coloursAttr) {
      const valueIds = selectedColours.map(colour => {
        const val = coloursAttr.values.find(v => v.value.toLowerCase() === colour.toLowerCase());
        return val ? val.id : colour;
      });
      attributes.push({ attributeId: coloursAttr.id, attributeValueIds: valueIds });
    }
    data.append("AttributeSelectionsJson", attributes.length > 0 ? JSON.stringify(attributes) : "");
    data.append("MetadataJson", "");

    images.forEach((img) => {
      data.append("Images", img);
    });

    return data;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-150 sm:w-150 p-0 flex flex-col border-0 rounded-[24px] overflow-hidden !right-4 !top-4 !bottom-4 !h-[calc(100vh-32px)]">
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
                  <div className="relative">
                    <label className="absolute -top-2.5 left-4 px-1 bg-white text-xs text-text-950 z-10">Sizes<span className="text-red-500">*</span></label>
                    <div 
                      className="w-full h-18 px-5 rounded-[24px] border border-[#111827] flex items-center justify-between relative bg-transparent cursor-pointer"
                      onClick={() => setIsSizesOpen(!isSizesOpen)}
                    >
                      <span className={`text-sm font-medium ${selectedSizes.length > 0 ? "text-[#111827]" : "text-[#111827]/50"}`}>
                        {selectedSizes.length > 0 ? selectedSizes.join(", ") : "Select"}
                      </span>
                      {isSizesOpen ? <ChevronUpIcon className="w-5 h-5 text-gray-500 shrink-0" /> : <ChevronDownIcon className="w-5 h-5 text-gray-500 shrink-0" />}
                    </div>
                    
                    {isSizesOpen && (
                      <div className="mt-3 bg-white rounded-[24px] p-6 shadow-[0px_8px_32px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col gap-5 absolute z-20 w-full left-0 top-full">
                        {["Small", "Medium", "Large"].map((size) => {
                          const isSelected = selectedSizes.includes(size);
                          return (
                            <div key={size} onClick={() => toggleSize(size)} className="flex items-center gap-4 cursor-pointer group">
                              <div className="w-5 h-5 rounded-lg border-2 border-[#111827] flex items-center justify-center bg-transparent group-hover:border-[#5C00FF] transition-colors">
                                <CheckIcon className={`w-3.5 h-3.5 text-[#111827] transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-10"}`} />
                              </div>
                              <span className="text-[15px] font-medium text-[#111827]">{size}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="relative mt-8">
                    <label className="absolute -top-2.5 left-4 px-1 bg-white text-xs text-text-950 z-10">Colours<span className="text-red-500">*</span></label>
                    <div 
                      className="w-full h-[72px] px-5 rounded-[24px] border border-[#111827] flex items-center justify-between relative bg-transparent cursor-pointer"
                      onClick={() => setIsColoursOpen(!isColoursOpen)}
                    >
                      <span className={`text-sm font-medium ${selectedColours.length > 0 ? "text-[#111827]" : "text-[#111827]/50"}`}>
                        {selectedColours.length > 0 ? selectedColours.join(", ") : "Select"}
                      </span>
                      {isColoursOpen ? <ChevronUpIcon className="w-5 h-5 text-gray-500 shrink-0" /> : <ChevronDownIcon className="w-5 h-5 text-gray-500 shrink-0" />}
                    </div>
                    
                    {isColoursOpen && (
                      <div className="mt-3 bg-white rounded-[24px] p-6 shadow-[0px_8px_32px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col gap-5 absolute z-20 w-full left-0 top-full">
                        {["Red", "Green", "Purple"].map((color) => {
                          const isSelected = selectedColours.includes(color);
                          return (
                            <div key={color} onClick={() => toggleColour(color)} className="flex items-center gap-4 cursor-pointer group">
                              <div className="w-5 h-5 rounded-lg border-2 border-[#111827] flex items-center justify-center bg-transparent group-hover:border-[#5C00FF] transition-colors">
                                <CheckIcon className={`w-3.5 h-3.5 text-[#111827] transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-10"}`} />
                              </div>
                              <span className="text-[15px] font-medium text-[#111827]">{color}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
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

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
