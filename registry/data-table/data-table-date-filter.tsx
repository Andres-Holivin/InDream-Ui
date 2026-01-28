"use client";

import type { Column } from "@tanstack/react-table";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/format";

type DateSelection = Date[] | DateRange;

function getIsDateRange(value: unknown): value is DateRange {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function createEmptySelection(isRange?: boolean): DateSelection {
  return isRange
    ? { from: undefined, to: undefined }
    : [];
}

function parseAsDate(timestamp: number | string | undefined): Date | undefined {
  if (!timestamp) return undefined;
  const numericTimestamp =
    typeof timestamp === "string" ? Number(timestamp) : timestamp;
  const date = new Date(numericTimestamp);
  return !Number.isNaN(date.getTime()) ? date : undefined;
}

function parseColumnFilterValue(value: unknown) {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === "number" || typeof item === "string") {
        return item;
      }
      return undefined;
    });
  }

  if (typeof value === "string" || typeof value === "number") {
    return [value];
  }

  return [];
}

interface DataTableDateFilterProps<TData> {
  column: Column<TData, unknown>;
  title?: string;
  multiple?: boolean;
}

export function DataTableDateFilter<TData>({
  column,
  title,
  multiple,
}: DataTableDateFilterProps<TData>) {
  const [open, setOpen] = React.useState(false);
  const columnFilterValue = column.getFilterValue();

  const selectedDates = React.useMemo<DateSelection>(() => {
    if (!columnFilterValue) {
      return createEmptySelection(multiple);
    }

    if (multiple) {
      const timestamps = parseColumnFilterValue(columnFilterValue);
      return {
        from: parseAsDate(timestamps[0]),
        to: parseAsDate(timestamps[1]),
      };
    }

    const timestamps = parseColumnFilterValue(columnFilterValue);
    const date = parseAsDate(timestamps[0]);
    return date ? [date] : [];
  }, [columnFilterValue, multiple]);

  const [pendingSelection, setPendingSelection] = React.useState<DateSelection>(() =>
    createEmptySelection(multiple),
  );

  React.useEffect(() => {
    if (open) {
      setPendingSelection(selectedDates);
    }
  }, [open, selectedDates]);

  const handleSelect = React.useCallback(
    (date: Date | DateRange | undefined) => {
      if (!date) {
        setPendingSelection(createEmptySelection(multiple));
        return;
      }

      if (multiple && getIsDateRange(date)) {
        setPendingSelection({
          from: date.from,
          to: date.to,
        });
        return;
      }

      if (!multiple && date instanceof Date) {
        setPendingSelection(date ? [date] : []);
      }
    },
    [multiple],
  );

  const serializeSelection = React.useCallback(
    (selection: DateSelection) => {
      if (multiple) {
        if (!getIsDateRange(selection)) return undefined;
        const from = selection.from?.getTime();
        const to = selection.to?.getTime();
        return from || to ? [from, to] : undefined;
      }

      if (!Array.isArray(selection) || selection.length === 0) return undefined;
      const date = selection[0];
      return date instanceof Date ? date.getTime() : undefined;
    },
    [multiple],
  );

  const handleApply = React.useCallback(() => {
    const value = serializeSelection(pendingSelection);
    column.setFilterValue(value);
    setOpen(false);
  }, [column, pendingSelection, serializeSelection]);

  const handleClear = React.useCallback(() => {
    setPendingSelection(createEmptySelection(multiple));
    column.setFilterValue([]);
    setOpen(false);
  }, [column, multiple]);

  const hasValue = React.useMemo(() => {
    if (multiple) {
      if (!getIsDateRange(selectedDates)) return false;
      return selectedDates.from || selectedDates.to;
    }
    if (!Array.isArray(selectedDates)) return false;
    return selectedDates.length > 0;
  }, [multiple, selectedDates]);

  const formatDateRange = React.useCallback((range: DateRange) => {
    if (!range.from && !range.to) return "";
    if (range.from && range.to) {
      return `${formatDate(range.from)} - ${formatDate(range.to)}`;
    }
    return formatDate(range.from ?? range.to);
  }, []);

  const label = React.useMemo(() => {
    if (multiple) {
      if (!getIsDateRange(selectedDates)) return title ?? "Date";
      const hasSelectedDates = selectedDates.from || selectedDates.to;
      if (!hasSelectedDates) return `All ${title?.toLowerCase() ?? "dates"}`;
      return formatDateRange(selectedDates);
    }

    if (!Array.isArray(selectedDates) || selectedDates.length === 0) {
      return `All ${title?.toLowerCase() ?? "dates"}`;
    }
    return formatDate(selectedDates[0]);
  }, [selectedDates, multiple, formatDateRange, title]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-40 lg:w-56 p-2 justify-start gap-2 font-normal"
        >
          <CalendarIcon className="size-4" />
          <span className="truncate text-left">
            {
              label?
                <span  className="text-muted-foreground">{label}</span>
                :
                <span>{`All ${title?.toLowerCase() ?? "dates"}`}</span>
            }
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="space-y-4">
          {multiple ? (
            <Calendar
              autoFocus
              captionLayout="dropdown"
              mode="range"
              numberOfMonths={2}
              selected={
                getIsDateRange(pendingSelection)
                  ? pendingSelection
                  : { from: undefined, to: undefined }
              }
              onSelect={handleSelect}
            />
          ) : (
            <Calendar
              captionLayout="dropdown"
              mode="single"
              selected={
                !getIsDateRange(pendingSelection)
                  ? pendingSelection[0]
                  : undefined
              }
              onSelect={handleSelect}
            />
          )}
          <Separator />
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={handleClear}
              disabled={!hasValue}
            >
              Clear
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
