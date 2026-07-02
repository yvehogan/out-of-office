"use client";

import { useState, useEffect } from "react";
import { useWaitlist } from "@/hooks/useCustomers";
import { WaitlistEntry } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface WaitlistTableProps {
  searchTerm: string;
  sortOrder: "newest" | "oldest";
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function WaitlistTable({ searchTerm, sortOrder }: WaitlistTableProps) {
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [sortOrder]);

  const { data, isLoading, isError } = useWaitlist({
    pageNumber: page,
    pageSize: 20,
    searchTerm: debouncedSearch,
    sortOrder,
  });

  const rawEntries: WaitlistEntry[] = data?.data || [];
  const entries = [...rawEntries].sort((a, b) => {
    const dateA = new Date(a.createdDate).getTime();
    const dateB = new Date(b.createdDate).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });
  const pagination = data?.pagination;

  return (
    <>
      {/* Table */}
      <div className="bg-[#F7F8FA] rounded-[24px] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left text-sm">
            <thead className="border-b border-gray-200 text-xs font-semibold text-text-600">
              <tr>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Submission Date</th>
                <th className="px-6 py-4">Phone Number</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-text-500">
                    Loading waitlist...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-red-500">
                    Failed to load waitlist.
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-text-500">
                    No waitlist entries found.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex flex-col">
                        <span className="text-text-950">{entry.fullName}</span>
                        <span className="text-[11px] text-text-500">{entry.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-950">
                      {formatDate(entry.createdDate)}
                    </td>
                    <td className="px-6 py-4 text-text-950">{entry.countryCode}{entry.phoneNumber}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
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
      )}
    </>
  );
}
