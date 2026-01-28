"use client";

import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import {
  debounce,
  createParser,
  parseAsInteger,
  parseAsString,
  throttle,
  useQueryStates,
  type SingleParserBuilder,
} from "nuqs";
import { ExtendedColumnSort, type QueryKeys } from "@/registry/data-table/types";

const PAGE_KEY = "page";
const PER_PAGE_KEY = "perPage";
const SORT_KEY = "sort";
const FILTERS_KEY = "filters";
const JOIN_OPERATOR_KEY = "joinOperator";
const ARRAY_SEPARATOR = ",";
const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;

type FilterValue = string | string[] | null;

type SortingItem = {
  id: string;
  desc: boolean;
};

const isSortingItem = (value: unknown): value is SortingItem => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as SortingItem).id === "string" &&
    typeof (value as SortingItem).desc === "boolean"
  );
};

function parseSortingQuery<TData>(
  value: string | null,
  validIds: Set<string>,
  fallback: ExtendedColumnSort<TData>[],
) {
  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value);
    if (
      !Array.isArray(parsed) ||
      parsed.some((item) => !isSortingItem(item) || !validIds.has(item.id))
    ) {
      return fallback;
    }

    return parsed as ExtendedColumnSort<TData>[];
  } catch {
    return fallback;
  }
}

const normalizeFilterValue = (value: FilterValue): FilterValue => {
  if (value === null) return null;

  if (Array.isArray(value)) {
    const normalized = value.map((item) => item.trim()).filter(Boolean);
    return normalized.length > 0 ? normalized : null;
  }

  return value === "" ? null : value;
};

const areColumnFiltersEqual = (
  a: ColumnFiltersState,
  b: ColumnFiltersState,
) => {
  if (a.length !== b.length) return false;

  return a.every((filter, index) => {
    const other = b[index];
    if (!other || filter.id !== other.id) return false;

    if (Array.isArray(filter.value) && Array.isArray(other.value)) {
      const current = filter.value as unknown[];
      const next = other.value as unknown[];
      if (current.length !== next.length) return false;
      return current.every((value, idx) => value === next[idx]);
    }

    return JSON.stringify(filter.value) === JSON.stringify(other.value);
  });
};

export interface UseDataTableProps<TData>
  extends Omit<
    TableOptions<TData>,
    | "state"
    | "pageCount"
    | "getCoreRowModel"
    | "manualFiltering"
    | "manualPagination"
    | "manualSorting"
  >,
  Required<Pick<TableOptions<TData>, "pageCount">> {
  initialState?: Omit<Partial<TableState>, "sorting"> & {
    sorting?: ExtendedColumnSort<TData>[];
  };
  queryKeys?: Partial<QueryKeys>;
  history?: "push" | "replace";
  debounceMs?: number;
  throttleMs?: number;
  clearOnDefault?: boolean;
  enableAdvancedFilter?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  startTransition?: React.TransitionStartFunction;
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const {
    columns,
    pageCount = -1,
    initialState,
    queryKeys,
    history = "replace",
    debounceMs = DEBOUNCE_MS,
    throttleMs = THROTTLE_MS,
    clearOnDefault = false,
    enableAdvancedFilter = false,
    scroll = false,
    shallow = true,
    startTransition,
    ...tableProps
  } = props;
  const pageKey = queryKeys?.page ?? PAGE_KEY;
  const perPageKey = queryKeys?.perPage ?? PER_PAGE_KEY;
  const sortKey = queryKeys?.sort ?? SORT_KEY;
  const filtersKey = queryKeys?.filters ?? FILTERS_KEY;
  const joinOperatorKey = queryKeys?.joinOperator ?? JOIN_OPERATOR_KEY;

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {});

  const queryStateOptions = React.useMemo(
    () => ({
      history,
      shallow,
      scroll,
      startTransition,
      clearOnDefault,
      limitUrlUpdates: throttle(throttleMs),
      urlKeys: {
        page: pageKey,
        perPage: perPageKey,
        sort: sortKey,
      },
    }),
    [
      history,
      shallow,
      scroll,
      startTransition,
      clearOnDefault,
      throttleMs,
      pageKey,
      perPageKey,
      sortKey,
    ],
  );

  const defaultPage = React.useMemo(
    () => (initialState?.pagination?.pageIndex ?? 0) + 1,
    [initialState?.pagination?.pageIndex],
  );
  const defaultPageSize = React.useMemo(
    () => initialState?.pagination?.pageSize ?? 10,
    [initialState?.pagination?.pageSize],
  );
  const defaultSorting = React.useMemo(
    () => initialState?.sorting ?? [],
    [initialState?.sorting],
  );
  const defaultSortingString = React.useMemo(
    () => JSON.stringify(defaultSorting),
    [defaultSorting],
  );

  const [queryState, setQueryState] = useQueryStates(
    {
      page: parseAsInteger.withDefault(defaultPage),
      perPage: parseAsInteger.withDefault(defaultPageSize),
      sort: parseAsString.withDefault(defaultSortingString),
    },
    queryStateOptions,
  );

  const page = React.useMemo(() => {
    return queryState.page > 0 ? queryState.page : defaultPage;
  }, [queryState.page, defaultPage]);

  const perPage = React.useMemo(() => {
    return queryState.perPage > 0 ? queryState.perPage : defaultPageSize;
  }, [queryState.perPage, defaultPageSize]);

  const pagination: PaginationState = React.useMemo(() => {
    return {
      pageIndex: page - 1,
      pageSize: perPage,
    };
  }, [page, perPage]);

  const setPaginationQuery = React.useCallback(
    (nextPagination: PaginationState) => {
      void setQueryState({
        page: nextPagination.pageIndex + 1,
        perPage: nextPagination.pageSize,
      });
    },
    [setQueryState],
  );

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      const next =
        typeof updaterOrValue === "function"
          ? updaterOrValue(pagination)
          : updaterOrValue;

      setPaginationQuery(next);
    },
    [pagination, setPaginationQuery],
  );

  const columnIds = React.useMemo(() => {
    return new Set(
      columns.map((column) => column.id).filter(Boolean) as string[],
    );
  }, [columns]);

  const sorting = React.useMemo(() => {
    return parseSortingQuery<TData>(
      queryState.sort,
      columnIds,
      defaultSorting,
    );
  }, [queryState.sort, columnIds, defaultSorting]);

  const updateSortingQuery = React.useCallback(
    (nextSorting: ExtendedColumnSort<TData>[]) => {
      const serialized = JSON.stringify(nextSorting);
      void setQueryState({ sort: serialized });
    },
    [setQueryState],
  );

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      const next =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sorting)
          : updaterOrValue;

      const normalized = next
        .filter((item): item is ExtendedColumnSort<TData> => {
          return Boolean(item.id) && columnIds.has(String(item.id));
        })
        .map((item) => ({
          id: item.id as Extract<keyof TData, string>,
          desc: Boolean(item.desc),
        }));

      updateSortingQuery(normalized);
    },
    [sorting, updateSortingQuery, columnIds],
  );

  const filterableColumns = React.useMemo(() => {
    if (enableAdvancedFilter) return [];

    return columns.filter((column) => column.enableColumnFilter);
  }, [columns, enableAdvancedFilter]);

  const filterParsers = React.useMemo(() => {
    if (enableAdvancedFilter) return {};

    return filterableColumns.reduce<
      Record<string, SingleParserBuilder<FilterValue>>
    >(
      (acc, column) => {
        const key = column.id;
        if (!key) return acc;

        const hasOptions = Boolean(column.meta?.options);
        const parser = createParser<FilterValue>({
          parse: (value) => {
            if (!hasOptions) return value;

            const parsed = value
              .split(ARRAY_SEPARATOR)
              .map((item) => item.trim())
              .filter(Boolean);

            return parsed.length > 0 ? parsed : null;
          },
          serialize: (value) => {
            if (value === null) return "";
            return Array.isArray(value) ? value.join(ARRAY_SEPARATOR) : value;
          },
          eq: (a, b) => {
            if (a === b) return true;
            if (Array.isArray(a) && Array.isArray(b)) {
              return (
                a.length === b.length && a.every((item, index) => item === b[index])
              );
            }
            return false;
          },
        });

        acc[key] = parser;
        return acc;
      },
      {},
    );
  }, [filterableColumns, enableAdvancedFilter]);

  const filterQueryOptions = React.useMemo(
    () => ({
      history,
      shallow,
      scroll,
      startTransition,
      clearOnDefault,
      limitUrlUpdates: shallow ? throttle(throttleMs) : debounce(debounceMs),
    }),
    [
      history,
      shallow,
      scroll,
      startTransition,
      clearOnDefault,
      debounceMs,
      throttleMs,
    ],
  );

  const [filterQuery, setFilterQuery] = useQueryStates(
    filterParsers,
    filterQueryOptions,
  );

  const filterValues = React.useMemo(() => {
    if (enableAdvancedFilter) return {};

    return filterableColumns.reduce<Record<string, FilterValue>>(
      (acc, column) => {
        const key = column.id;
        if (!key) return acc;

        const rawValue = filterQuery[key] ?? null;
        acc[key] = normalizeFilterValue(rawValue as FilterValue);

        return acc;
      },
      {},
    );
  }, [filterableColumns, enableAdvancedFilter, filterQuery]);

  const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
    if (enableAdvancedFilter) return [];

    const hasFilterParams = Object.values(filterValues).some((value) => value !== null);

    if (!hasFilterParams && initialState?.columnFilters) return initialState.columnFilters;

    return Object.entries(filterValues).reduce<ColumnFiltersState>(
      (filters, [key, value]) => {
        if (value !== null) {
          const processedValue = Array.isArray(value)
            ? value
            : typeof value === "string" && /[^a-zA-Z0-9]/.test(value)
              ? value.split(/[^a-zA-Z0-9]+/).filter(Boolean)
              : [value];

          filters.push({
            id: key,
            value: processedValue,
          });
        }
        return filters;
      },
      [],
    );
  }, [filterValues, enableAdvancedFilter, initialState?.columnFilters]);

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);

  React.useEffect(() => {
    setColumnFilters((previous) => {
      return areColumnFiltersEqual(previous, initialColumnFilters)
        ? previous
        : initialColumnFilters;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync columnFilters to URL query params
  React.useEffect(() => {
    if (enableAdvancedFilter) return;

    const filterUpdates = columnFilters.reduce<
      Record<string, string | string[] | null>
    >((acc, filter) => {
      if (filterableColumns.find((column) => column.id === filter.id)) {
        acc[filter.id] = filter.value as string | string[];
      }
      return acc;
    }, {});

    // Mark removed filters as null
    Object.keys(filterValues).forEach((key) => {
      if (!columnFilters.some((filter) => filter.id === key)) {
        filterUpdates[key] = null;
      }
    });

    void setQueryState({ page: 1 }, filterQueryOptions);
    void setFilterQuery(filterUpdates, filterQueryOptions);
  }, [columnFilters, enableAdvancedFilter, filterableColumns, filterValues, setQueryState, setFilterQuery, filterQueryOptions]);

  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      if (enableAdvancedFilter) return;
      setColumnFilters(updaterOrValue);
    },
    [enableAdvancedFilter],
  );

  const table = useReactTable({
    ...tableProps,
    columns,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    meta: {
      ...tableProps.meta,
      queryKeys: {
        page: pageKey,
        perPage: perPageKey,
        sort: sortKey,
        filters: filtersKey,
        joinOperator: joinOperatorKey,
      },
    },
  });

  return { table, shallow, debounceMs, throttleMs };
}
