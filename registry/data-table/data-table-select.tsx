import { type Table, type Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { type Dispatch, type SetStateAction } from "react";
import { handleDataTableSelection } from "@/lib/data-table";

interface DataTableSelectHeaderProps<TData> {
  table: Table<TData>;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
}

export function DataTableSelectHeader<TData extends { transactionId: string }>({
  table,
  selectedIds,
  setSelectedIds,
}: DataTableSelectHeaderProps<TData>) {
  const pageRows = table.getRowModel().rows;
  const currentIds = pageRows.map((r) => r.original.transactionId);
  const isAllSelected =
    currentIds.length > 0 && currentIds.every((id) => selectedIds.includes(id));
  const isSomeSelected =
    currentIds.some((id) => selectedIds.includes(id)) && !isAllSelected;

  return (
    <Checkbox
      checked={isAllSelected || (isSomeSelected && "indeterminate")}
      onCheckedChange={(value) => {
        const checked = !!value;
        setSelectedIds((prev) => {
          if (checked) {
            const toAdd = currentIds.filter((id) => !prev.includes(id));
            return [...prev, ...toAdd];
          }
          return prev.filter((id) => !currentIds.includes(id));
        });
      }}
      aria-label="Select all"
      className="mr-2 border-black"
    />
  );
}

interface DataTableSelectCellProps<TData> {
  row: Row<TData>;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
}

export function DataTableSelectCell<TData extends { transactionId: string }>({
  row,
  selectedIds,
  setSelectedIds,
}: DataTableSelectCellProps<TData>) {
  return (
    <Checkbox
      checked={selectedIds.includes(row.original.transactionId)}
      onCheckedChange={() =>
        handleDataTableSelection(row.original.transactionId, setSelectedIds)
      }
      aria-label="Select row"
      className="mr-2 border-black"
      onClick={(event) => event.stopPropagation()}
    />
  );
}
