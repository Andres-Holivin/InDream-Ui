"use client";

import type { Column, Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import * as React from "react";

import { DataTableDateFilter } from "@/registry/data-table/data-table-date-filter";
import { DataTableFacetedFilter } from "@/registry/data-table/data-table-faceted-filter";
import { DataTableSliderFilter } from "@/registry/data-table/data-table-slider-filter";
import { DataTableViewOptions } from "@/registry/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconRefresh } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

interface DataTableToolbarProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  isFetching?: boolean;
  refetching?: () => void;
}

export function DataTableToolbar<TData>({
  table,
  children,
  isFetching,
  className,
  refetching,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const isSorting = table.getState().sorting.length > 0;

  const columns = React.useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table],
  );

  const onReset = React.useCallback(() => {
    table.setColumnFilters([]);
    table.setSorting([]);
  }, [table]);

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        "flex w-full flex-col items-start gap-y-4 p-1",
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {columns.map((column) => (
          <DataTableToolbarFilter key={column.id} column={column} />
        ))}
        {(isFiltered || isSorting) && (
          <div className="flex flex-col gap-1">
            <Label className="text-xs invisible">Filters applied</Label>
            <Button
              aria-label="Reset filters"
              variant="outline"
              className="border-dashed"
              onClick={onReset}
            >
              <X />
              Reset
            </Button>
          </div>
        )}
        {isFetching && (
          <Spinner className="ml-2" aria-label="Loading" />
        )}
      </div>
      <div className="flex self-end justify-end items-center gap-2">
        {children}
        <DataTableViewOptions table={table} align="end" />
        <Button
          variant="outline"
          size="icon"
          disabled={isFetching}
          onClick={refetching}
          aria-label="Refetch data"
        >
          <IconRefresh />
        </Button>
      </div>
    </div>
  );
}
interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>;
}

function DataTableToolbarFilter<TData>({
  column,
}: DataTableToolbarFilterProps<TData>) {
  {
    const columnMeta = column.columnDef.meta;

    const onFilterRender = React.useCallback(() => {
      if (!columnMeta?.variant) return null;

      switch (columnMeta.variant) {
        case "text":
          return (
            <div className="flex flex-col gap-1">
              {columnMeta.label ? <Label className="text-xs">{columnMeta.label}</Label> : null}
              <Input
                placeholder={columnMeta.placeholder ?? columnMeta.label}
                value={(column.getFilterValue() as string) ?? ""}
                onChange={(event) => column.setFilterValue(event.target.value)}
                className="w-40 lg:w-56"
              />
            </div>
          );

        case "number":
          return (
            <div className="flex flex-col gap-1">
              {columnMeta.label ? <Label>{columnMeta.label}</Label> : null}
              <div className="relative">
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder={columnMeta.placeholder ?? columnMeta.label}
                  value={(column.getFilterValue() as string) ?? ""}
                  onChange={(event) => column.setFilterValue(event.target.value)}
                  className={cn("w-40 lg:w-56", columnMeta.unit && "pr-8")}
                />
                {columnMeta.unit && (
                  <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm">
                    {columnMeta.unit}
                  </span>
                )}
              </div>
            </div>
          );

        case "range":
          return (
            <div className="flex flex-col gap-1">
              {columnMeta.label ? <Label className="text-xs">{columnMeta.label}</Label> : null}
              <DataTableSliderFilter
                column={column}
                title={columnMeta.label ?? column.id}
              />
            </div>
          );

        case "date":
        case "dateRange":
          return (
            <div className="flex flex-col gap-1">
              {columnMeta.label ? <Label className="text-xs">{columnMeta.label}</Label> : null}
              <DataTableDateFilter
                column={column}
                title={columnMeta.label ?? column.id}
                multiple={columnMeta.variant === "dateRange"}
              />
            </div>
          );

        case "select":
        case "multiSelect":
          return (
            <div className="flex flex-col gap-1">
              {columnMeta.label ? <Label className="text-xs">{columnMeta.label}</Label> : null}
              <DataTableFacetedFilter
                column={column}
                title={columnMeta.label ?? column.id}
                options={columnMeta.options ?? []}
              />
            </div>
          );

        default:
          return null;
      }
    }, [column, columnMeta]);

    return onFilterRender();
  }
}
