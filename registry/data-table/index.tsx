import * as React from "react";

import { DataTable as DiceDataTable } from "@/registry/data-table/data-table";
import { DataTableSkeleton } from "@/registry/data-table/data-table-skeleton";
import { DataTableToolbar } from "@/registry/data-table/data-table-toolbar";
import type {
  ExtendedColumnSort,
  RemoteDataTableProps,
  RemotePaginationMeta,
  RemoteTableQueryState,
} from "@/registry/data-table/types";
import { useDataTable } from "@/hooks/use-data-table";
import {
  DATA_TABLE_FILTER_DEBOUNCE_MS,
  DEFAULT_REMOTE_PAGINATION,
} from "@/lib/constants";
import { useDebouncedValue } from "@/hooks/use-debounce";

const getPageCountFromPagination = (pagination?: RemotePaginationMeta) => {
  if (!pagination) return null;
  if (typeof pagination.total === "number" && pagination.total >= 0) {
    const safeLimit =
      pagination.limit > 0 ? pagination.limit : DEFAULT_REMOTE_PAGINATION.limit;
    return Math.max(1, Math.ceil(pagination.total / safeLimit));
  }
  return null;
};

export function FullDataTable<TData>({
  columns,
  data,
  pagination,
  pageCount,
  isLoading = false,
  isFetching = false,
  initialState,
  refetching,
  queryKeys,
  enableAdvancedFilter,
  onQueryChange,
  actionBar,
  toolbarChildren,
  toolbarClassName,
  skeleton,
  className,
  onRowClick,
}: RemoteDataTableProps<TData>) {
  const filterableColumnsCount = React.useMemo(
    () => columns.filter((column) => column.enableColumnFilter).length,
    [columns]
  );

  const resolvedPageCount = React.useMemo(() => {
    const paginationCount = getPageCountFromPagination(pagination);
    if (paginationCount && paginationCount > 0) return paginationCount;
    if (pageCount && pageCount > 0) return pageCount;
    return 1;
  }, [pagination, pageCount]);

  const { table } = useDataTable<TData>({
    data,
    columns,
    pageCount: resolvedPageCount,
    initialState,
    queryKeys,
    enableAdvancedFilter,
  });

  const tableState = table.getState();

  const queryState = React.useMemo<RemoteTableQueryState<TData>>(
    () => ({
      page: tableState.pagination.pageIndex + 1,
      perPage: tableState.pagination.pageSize,
      sorting: tableState.sorting as ExtendedColumnSort<TData>[],
      columnFilters: tableState.columnFilters,
    }),
    [
      tableState.pagination.pageIndex,
      tableState.pagination.pageSize,
      tableState.sorting,
      tableState.columnFilters,
    ]
  );

  const debouncedQueryState = useDebouncedValue(
    queryState,
    DATA_TABLE_FILTER_DEBOUNCE_MS
  );

  React.useEffect(() => {
    onQueryChange?.(debouncedQueryState);
  }, [debouncedQueryState, onQueryChange]);

  const shouldShowSkeleton = isLoading && data.length === 0;

  if (shouldShowSkeleton) {
    return (
      <DataTableSkeleton
        columnCount={columns.length || 1}
        filterCount={filterableColumnsCount}
        rowCount={skeleton?.rowCount}
        cellWidths={skeleton?.cellWidths}
        withPagination={skeleton?.withPagination}
        withViewOptions={skeleton?.withViewOptions}
      />
    );
  }

  return (
    <DiceDataTable
      table={table}
      actionBar={actionBar}
      className={className}
      onRowClick={onRowClick}
    >
      <DataTableToolbar
        table={table}
        className={toolbarClassName}
        isFetching={isFetching}
        refetching={refetching}
      >
        {toolbarChildren}
      </DataTableToolbar>
    </DiceDataTable>
  );
}

export { DataTableToolbar, DataTableSkeleton };
export type {
  RemoteTableQueryState,
  RemoteDataTableProps,
} from "@/registry/data-table/types";
