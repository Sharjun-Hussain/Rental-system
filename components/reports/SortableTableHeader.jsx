import React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SortableTableHeader({
  column,
  label,
  sortConfig,
  onSort,
  className,
}) {
  const isSorted = sortConfig.key === column;
  const direction = sortConfig.direction;

  return (
    <TableHead className={cn("cursor-pointer select-none", className)}>
      <Button
        variant="ghost"
        onClick={() => onSort(column)}
        className={cn("h-8 flex items-center gap-1 font-medium p-0", className)}
      >
        {label}
        <span className="ml-1">
          {isSorted ? (
            direction === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          )}
        </span>
      </Button>
    </TableHead>
  );
}
