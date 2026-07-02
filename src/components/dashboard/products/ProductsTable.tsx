"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import { useProducts, useCreateProduct, useUpdateProduct, useArchiveProduct, usePublishProduct, useUnarchiveProduct } from "@/hooks/useProducts";
import { CreateProductSheet } from "./CreateProductSheet";
import { PublishConfirmModal } from "./PublishConfirmModal";
import { SuccessModal } from "./SuccessModal";
import { ViewProductSheet } from "./ViewProductSheet";
import { ChevronDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductsPagination } from "./ProductsPagination";
import { Search } from "lucide-react";
import { ProductFilterModal } from "./ProductFilterModal";
import { toast } from "sonner";
import { extractApiError } from "@/lib/utils";
import { Product } from "@/types";

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Stock":
      return "bg-[#D1FADF] text-[#039855]";
    case "Low Stock":
      return "bg-[#FEF0C7] text-[#DC6803]";
    case "Out of Stock":
      return "bg-[#E4E7EC] text-[#0C111D]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function ProductsTable() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  const [actionType, setActionType] = useState<"publish" | "draft" | "edit_product" | "archive" | "unarchive" | "publish_action">("publish");
  const [sheetMode, setSheetMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("published");
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<{ categories: string[]; stockStatuses: string[] }>({
    categories: [],
    stockStatuses: [],
  });

  // Map activeTab to API status
  const getApiStatus = (tab: string) => {
    if (tab === "published") return "Published";
    if (tab === "draft") return "Draft";
    if (tab === "archive") return "Archived";
    return undefined;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError } = useProducts({
    pageNumber: page,
    pageSize: 20,
    status: getApiStatus(activeTab),
    searchTerm: debouncedSearch,
    categoryIds: filters.categories,
    stockStatuses: filters.stockStatuses,
  });

  const products = data?.data || [];
  const pagination = data?.pagination;

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const archiveProductMutation = useArchiveProduct();
  const publishProductMutation = usePublishProduct();
  const unarchiveProductMutation = useUnarchiveProduct();

  const handlePublishClick = (formData?: FormData) => {
    if (formData) setPendingFormData(formData);
    setActionType(sheetMode === "edit" ? "edit_product" : "publish");
    setIsConfirmOpen(true);
  };

  const handleDraftClick = (formData?: FormData) => {
    if (formData) setPendingFormData(formData);
    setActionType("draft");
    setIsConfirmOpen(true);
  };

  const handleArchiveClick = (product: Product) => {
    setSelectedProduct(product);
    setActionType("archive");
    setIsConfirmOpen(true);
  };

  const handleUnarchiveClick = (product: Product) => {
    setSelectedProduct(product);
    setActionType("unarchive");
    setIsConfirmOpen(true);
  };

  const handlePublishActionClick = (product: Product) => {
    setSelectedProduct(product);
    setActionType("publish_action");
    setIsConfirmOpen(true);
  };

  const handleConfirmPublish = async () => {
    setIsPublishing(true);
    try {
      if (actionType === "archive" && selectedProduct) {
        await archiveProductMutation.mutateAsync(selectedProduct.id);
      } else if (actionType === "unarchive" && selectedProduct) {
        await unarchiveProductMutation.mutateAsync(selectedProduct.id);
      } else if (actionType === "publish_action" && selectedProduct) {
        await publishProductMutation.mutateAsync(selectedProduct.id);
      } else if (actionType === "edit_product" && selectedProduct && pendingFormData) {
        const payload = {
          name: pendingFormData.get("Name") as string,
          shortDescription: pendingFormData.get("ShortDescription") as string,
          longDescription: pendingFormData.get("LongDescription") as string,
          price: Number(pendingFormData.get("Price")),
          categoryId: pendingFormData.get("CategoryId") as string,
          unitsAvailable: Number(pendingFormData.get("UnitsAvailable"))
        };
        await updateProductMutation.mutateAsync({ id: selectedProduct.id, data: payload });
      } else if ((actionType === "publish" || actionType === "draft") && pendingFormData) {
        await createProductMutation.mutateAsync(pendingFormData);
      }
      
      setIsConfirmOpen(false);
      setIsSheetOpen(false);
      setIsViewSheetOpen(false);
      setIsSuccessOpen(true);
      setPendingFormData(null);
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="w-full flex flex-col bg-white mt-5 p-5 rounded-[24px] animate-fade-in-up delay-2">
       <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <ProductFilterModal 
          initialFilters={filters}
          onApply={(newFilters) => {
            setFilters(newFilters);
            setPage(1);
          }}
        />

        <div className="relative w-full sm:w-[350px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-500" strokeWidth={2.5} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 rounded-full border border-text-950 text-sm outline-none transition-colors"
            placeholder="Search products by title or SKU..."
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setSheetMode("create");
          setSelectedProduct(null);
          setIsSheetOpen(true);
        }}
        className="w-full sm:w-auto rounded-full bg-[#5C00FF] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#5C00FF]/90"
      >
        Create New Product
      </button>
    </div>
      <Tabs 
        value={activeTab} 
        onValueChange={(val) => {
          setActiveTab(val);
          setPage(1);
        }} 
        className="w-full"
      >
        <TabsList variant="line" className="bg-transparent w-full justify-start rounded-none h-auto p-0 flex gap-8 relative px-6 -mb-2 mt-5">
          <TabsTrigger
            value="published"
            className="flex-none relative rounded-none border-none data-active:text-text-950 text-[#565F73] hover:text-[#5C00FF] font-medium data-active:font-semibold text-[14px] pb-3 px-0 bg-transparent data-active:bg-transparent data-active:shadow-none transition-all after:h-1! after:rounded-t-[10px]! after:!bg-[#5C00FF] after:!bottom-0 cursor-pointer"
          >
            Published Products
          </TabsTrigger>
          <TabsTrigger
            value="draft"
            className="flex-none relative rounded-none border-none data-active:text-text-950 text-[#565F73] hover:text-[#5C00FF] font-medium data-active:font-semibold text-[14px] pb-3 px-0 bg-transparent data-active:bg-transparent data-active:shadow-none transition-all after:h-1! after:rounded-t-[10px]! after:!bg-[#5C00FF] after:!bottom-0 cursor-pointer"
          >
            Draft
          </TabsTrigger>
          <TabsTrigger
            value="archive"
            className="flex-none relative rounded-none border-none data-active:text-text-950 text-[#565F73] hover:text-[#5C00FF] font-medium data-active:font-semibold text-[14px] pb-3 px-0 bg-transparent data-active:bg-transparent data-active:shadow-none transition-all after:h-1! after:rounded-t-[10px]! after:!bg-[#5C00FF] after:!bottom-0 cursor-pointer"
          >
            Archive
          </TabsTrigger>
        </TabsList>

        <div className=" bg-white rounded-[16px] border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <Table className="min-w-200">
              <TableHeader className="bg-text-100">
                <TableRow className="hover:bg-transparent border-b-0">
                  <TableHead className="font-semibold text-text-950 text-xs py-4 rounded-tl-[16px]">Product Details</TableHead>
                  <TableHead className="font-semibold text-text-950 text-xs py-4">Category</TableHead>
                  <TableHead className="font-semibold text-text-950 text-xs py-4">Price</TableHead>
                  <TableHead className="font-semibold text-text-950 text-xs py-4">Product Type</TableHead>
                  <TableHead className="font-semibold text-text-950 text-xs py-4">Stock Status</TableHead>
                  <TableHead className="font-semibold text-text-950 text-xs py-4 rounded-tr-[16px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-text-500">
                      Loading products...
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-red-500">
                      Failed to load products.
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-text-500">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-gray-50/50 border-gray-100">
                      <TableCell className="py-1">
                        <div className="flex items-center gap-3">
                          <div className="h-[56px] w-[40px] bg-gray-100 rounded-sm shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                            {product.primaryImageUrl ? (
                              <Image src={product.primaryImageUrl} alt={product.name} width={40} height={56} className="object-cover h-full w-full" />
                            ) : (
                              <div className="w-full h-full bg-gray-200" />
                            )}
                          </div>
                          <span className="text-sm text-text-900 whitespace-nowrap">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-text-600 whitespace-nowrap">{product.categoryName}</TableCell>
                      <TableCell className="text-sm text-text-600 whitespace-nowrap">₦{product.price.toLocaleString()}</TableCell>
                      <TableCell className="text-sm text-text-600 whitespace-nowrap">{product.type}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex px-2.5 py-1.5 rounded-full text-[10px] font-semibold tracking-wide whitespace-nowrap ${getStatusColor(
                            product.stockStatus
                          )}`}
                        >
                          {product.stockStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        {activeTab === "archive" ? (
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsViewSheetOpen(true);
                            }}
                            className="flex items-center justify-center px-6 py-2 rounded-full border border-[#5C00FF] text-[#5C00FF] text-xs font-semibold hover:bg-[#F3ECFF] transition-colors whitespace-nowrap"
                          >
                            View
                          </button>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#5C00FF] text-text-950 text-xs font-semibold hover:bg-[#F3ECFF] transition-colors whitespace-nowrap">
                              More <ChevronDown className="h-3 w-3" strokeWidth={2.5} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32 rounded-[12px] p-2">
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setIsViewSheetOpen(true);
                                }}
                                className="text-sm font-medium text-text-900 cursor-pointer rounded-md py-2 px-3"
                              >
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setSheetMode("edit");
                                  setIsSheetOpen(true);
                                }}
                                className="text-sm font-medium text-text-900 cursor-pointer rounded-md py-2 px-3"
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleArchiveClick(product)}
                                className="text-sm font-medium text-text-900 cursor-pointer rounded-md py-2 px-3 hover:text-red-600"
                              >
                                Archive
                              </DropdownMenuItem>
                              {activeTab === "draft" && (
                                <DropdownMenuItem 
                                  onClick={() => handlePublishActionClick(product)}
                                  className="text-sm font-medium text-text-900 cursor-pointer rounded-md py-2 px-3 text-[#5C00FF] hover:text-[#5C00FF]/90"
                                >
                                  Publish
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Tabs>

      <ProductsPagination pagination={pagination} setPage={setPage} />

      <CreateProductSheet 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
        onPublish={handlePublishClick}
        onSaveDraft={handleDraftClick}
        mode={sheetMode}
        product={selectedProduct || undefined}
      />
      <ViewProductSheet
        open={isViewSheetOpen}
        onOpenChange={setIsViewSheetOpen}
        product={selectedProduct}
        mode={activeTab === "archive" ? "archive" : "view"}
        onArchive={() => {
          setIsViewSheetOpen(false);
          if (selectedProduct) handleArchiveClick(selectedProduct);
        }}
        onUnarchive={() => {
          setIsViewSheetOpen(false);
          if (selectedProduct) handleUnarchiveClick(selectedProduct);
        }}
        onEdit={() => {
          setIsViewSheetOpen(false);
          setSheetMode("edit");
          setIsSheetOpen(true);
        }}
      />
      <PublishConfirmModal 
        open={isConfirmOpen} 
        onOpenChange={setIsConfirmOpen} 
        onConfirm={handleConfirmPublish} 
        isLoading={isPublishing} 
        actionType={actionType}
      />
      <SuccessModal 
        open={isSuccessOpen} 
        onOpenChange={setIsSuccessOpen} 
        onDone={() => {
          setIsSuccessOpen(false);
        }}
        actionType={actionType}
      />
    </div>
  );
}
