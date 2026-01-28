"use client";

import type { Column } from "@tanstack/react-table";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Option } from "./types";

const ALL_OPTION_VALUE = "__all";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: Option[];
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const columnFilterValue = column?.getFilterValue();

  const selectedValue = React.useMemo(() => {
    if (!columnFilterValue) return undefined;
    if (Array.isArray(columnFilterValue)) {
      const [first] = columnFilterValue;
      return first !== undefined && first !== null ? String(first) : undefined;
    }
    if (
      typeof columnFilterValue === "string" ||
      typeof columnFilterValue === "number"
    ) {
      return String(columnFilterValue);
    }
    return undefined;
  }, [columnFilterValue]);

  const handleSelectChange = React.useCallback(
    (value: string) => {
      if (!column) return;
      if (value === ALL_OPTION_VALUE) {
        column.setFilterValue(undefined);
        return;
      }
      column.setFilterValue(value ? [value] : undefined);
    },
    [column],
  );

  return (
    <Select
      value={selectedValue ?? ALL_OPTION_VALUE}
      onValueChange={handleSelectChange}
      disabled={!options.length && !selectedValue}
    >
      <SelectTrigger className="w-40 lg:w-56">
        <SelectValue placeholder={title ?? "Filter"} />
      </SelectTrigger>
      <SelectContent align="start">
        <SelectItem value={ALL_OPTION_VALUE}>All</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <span className="flex w-full items-center gap-2">
              {option.icon && <option.icon className="size-4" />}
              <span className="flex-1 truncate">{option.label}</span>
              {typeof option.count === "number" && (
                <span className="font-mono text-xs text-muted-foreground">
                  {option.count}
                </span>
              )}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
