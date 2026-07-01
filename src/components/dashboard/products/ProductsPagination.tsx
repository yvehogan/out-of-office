import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Pagination as PaginationType } from "@/types";

interface ProductsPaginationProps {
  pagination?: PaginationType;
  setPage: (page: number | ((prev: number) => number)) => void;
}

export function ProductsPagination({ pagination, setPage }: ProductsPaginationProps) {
  if (!pagination) return null;

  return (
    <div className="flex justify-center mt-6 mb-6">
      <div className="bg-text-100 px-2 py-1.5 rounded-full inline-flex">
        <Pagination>
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => { e.preventDefault(); if (pagination.hasPreviousPage) setPage(p => Math.max(1, p - 1)); }}
                className={`text-xs font-semibold text-text-950 hover:bg-transparent ${!pagination.hasPreviousPage ? "pointer-events-none opacity-50" : ""}`}
              />
            </PaginationItem>
            
            {(() => {
              const pages = [];
              const total = Math.max(1, pagination.totalPages);
              const current = pagination.pageNumber;

              for (let i = 1; i <= total; i++) {
                if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
                  const isActive = i === current;
                  pages.push(
                    <PaginationItem key={i}>
                      <PaginationLink 
                        href="#" 
                        isActive={isActive}
                        onClick={(e) => { e.preventDefault(); setPage(i); }}
                        className={`w-8 h-8 rounded-full font-semibold transition-all ${
                          isActive 
                            ? "border border-[#5700FF] bg-transparent text-[#5700FF] hover:bg-transparent" 
                            : "border border-transparent text-text-600 hover:bg-gray-200"
                        }`}
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (i === current - 2 || i === current + 2) {
                  pages.push(
                    <PaginationItem key={`ellipsis-${i}`}>
                      <span className="w-8 h-8 flex items-center justify-center text-text-600">...</span>
                    </PaginationItem>
                  );
                }
              }
              return pages;
            })()}

            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => { e.preventDefault(); if (pagination.hasNextPage) setPage(p => p + 1); }}
                className={`text-xs font-semibold text-text-950 hover:bg-transparent ${!pagination.hasNextPage ? "pointer-events-none opacity-50" : ""}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
