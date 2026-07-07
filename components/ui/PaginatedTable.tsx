"use client";

import { useState, useEffect, useMemo, ReactNode } from "react";
import { Card, CardContent } from "./Card";
import { Pagination } from "./Pagination";
import { PerPageSelect } from "./PerPageSelect";
import { Input } from "./Input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginatedTableProps<T> {
  data: T[];
  searchFields: (keyof T | string)[];
  searchPlaceholder?: string;
  children: (items: T[]) => ReactNode;
  className?: string;
  onDataChange?: (items: T[]) => void;
}

export function PaginatedTable<T extends Record<string, any>>({
  data,
  searchFields,
  searchPlaceholder = "Search...",
  children,
  className,
  onDataChange,
}: PaginatedTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Helper to get nested value from object
  const getNestedValue = (obj: any, path: string): any => {
    if (!obj) return "";
    if (typeof obj === "string" || typeof obj === "number") return obj;

    const keys = path.split(".");
    let current = obj;

    for (const key of keys) {
      if (current === null || current === undefined) return "";
      current = current[key];
    }

    return current;
  };

  // Filter data
  const filteredData = useMemo(() => {
    if (!debouncedSearch.trim()) return data;

    return data.filter((item) => {
      return searchFields.some((field) => {
        const fieldStr = String(field);
        let value;

        if (fieldStr.includes(".")) {
          // Handle nested paths like "manufacturers.name"
          value = getNestedValue(item, fieldStr);
        } else {
          // Handle direct properties
          value = item[field as keyof T];
        }

        if (value === null || value === undefined) return false;
        return String(value)
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());
      });
    });
  }, [data, debouncedSearch, searchFields]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, perPage]);

  const totalPages = Math.ceil(filteredData.length / perPage);

  // Reset to page 1 when data changes
  useEffect(() => {
    if (!isInitialLoad) {
      setCurrentPage(1);
    }
    setIsInitialLoad(false);
  }, [data]);

  // Notify parent of data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(paginatedData);
    }
  }, [paginatedData, onDataChange]);

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
  };

  return (
    <Card className={cn(className)}>
      <CardContent className="pt-6">
        {/* Search and Per Page */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9 pr-9"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <PerPageSelect value={perPage} onChange={setPerPage} />
        </div>

        {/* Table Content */}
        {children(paginatedData)}

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {debouncedSearch ? (
              <>
                No results found for "
                <strong className="text-foreground">{debouncedSearch}</strong>"
              </>
            ) : (
              "No data available"
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredData.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </CardContent>
    </Card>
  );
}
