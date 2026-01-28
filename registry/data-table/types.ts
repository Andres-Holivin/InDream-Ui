import type * as React from "react";
import type { ColumnDef, ColumnFiltersState, ColumnSort, Row, RowData } from "@tanstack/react-table";
import type { UseDataTableProps } from "@/hooks/use-data-table";
import { DataTableConfig } from "@/lib/data-table-config";
import { FilterItemSchema } from "@/lib/parsers";

declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: TData is used in the TableMeta interface
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    queryKeys?: QueryKeys;
  }

  // biome-ignore lint/correctness/noUnusedVariables: TData and TValue are used in the ColumnMeta interface
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
    placeholder?: string;
    variant?: FilterVariant;
    options?: Option[];
    range?: [number, number];
    unit?: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  }
}

export type RemoteTableQueryState<TData> = {
  page: number;
  perPage: number;
  sorting: ExtendedColumnSort<TData>[];
  columnFilters: ColumnFiltersState;
};

export type RemoteDataTableSkeletonOptions = {
  rowCount?: number;
  cellWidths?: string[];
  withPagination?: boolean;
  withViewOptions?: boolean;
};

export interface RemoteDataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  pagination?: RemotePaginationMeta;
  pageCount?: number;
  isLoading?: boolean;
  refetching?: () => void;
  isFetching?: boolean;
  initialState?: UseDataTableProps<TData>["initialState"];
  queryKeys?: UseDataTableProps<TData>["queryKeys"];
  enableAdvancedFilter?: UseDataTableProps<TData>["enableAdvancedFilter"];
  onQueryChange?: (state: RemoteTableQueryState<TData>) => void;
  actionBar?: React.ReactNode;
  toolbarChildren?: React.ReactNode;
  toolbarClassName?: string;
  skeleton?: RemoteDataTableSkeletonOptions;
  className?: string;
  onRowClick?: (row: Row<TData>) => void;
}


export interface QueryKeys {
  page: string;
  perPage: string;
  sort: string;
  filters: string;
  joinOperator: string;
}

export interface Option {
  label: string;
  value: string;
  count?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export type FilterOperator = DataTableConfig["operators"][number];
export type FilterVariant = DataTableConfig["filterVariants"][number];
export type JoinOperator = DataTableConfig["joinOperators"][number];

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: Extract<keyof TData, string>;
}

export interface ExtendedColumnFilter<TData> extends FilterItemSchema {
  id: Extract<keyof TData, string>;
}


export type RemotePaginationMeta = {
  page: number;
  limit: number;
  total: number;
};
