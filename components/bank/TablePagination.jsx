"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

export default function TablePagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Show up to 5 page buttons centred around current page
  const getPageNumbers = () => {
    const delta = 2;
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);
    const pages = [];
    for (let i = left; i <= right; i++) pages.push(i);
    return pages;
  };

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t"
      id="pagination-container"
      data-testid="pagination-container"
    >
      {/* Showing X–Y of Z */}
      <span
        className="text-sm text-muted-foreground whitespace-nowrap"
        id="pagination-page-info"
        data-testid="pagination-page-info"
      >
        Showing {startItem}–{endItem} of {totalItems}
      </span>

      {/* Page buttons */}
      <div className="flex items-center gap-1" id="pagination-controls">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          id="pagination-first"
          data-testid="pagination-first"
          aria-label="First page"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          id="pagination-prev"
          data-testid="pagination-prev"
          aria-label="Previous page"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPageNumbers().map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            id={`pagination-page-${page}`}
            data-testid={`pagination-page-${page}`}
            data-page={page === currentPage ? "current" : page}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          id="pagination-next"
          data-testid="pagination-next"
          aria-label="Next page"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          id="pagination-last"
          data-testid="pagination-last"
          aria-label="Last page"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Rows per page */}
      <div
        className="flex items-center gap-2"
        id="rows-per-page-container"
      >
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Rows per page
        </span>
        <Select
          value={String(itemsPerPage)}
          onValueChange={(v) => {
            onItemsPerPageChange(Number(v));
            onPageChange(1);
          }}
        >
          <SelectTrigger
            className="h-8 w-[70px]"
            id="rows-per-page"
            data-testid="rows-per-page-select"
            aria-label="Rows per page"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
