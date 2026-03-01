import { useState, useMemo } from "react";

export interface FilterField<T> {
  key: string;
  match: (item: T, value: string) => boolean;
}

export interface FilterConfig<T> {
  searchFields: (item: T) => string[];
  filters: FilterField<T>[];
}

export type SortOrder = "asc" | "desc";

export function useFilterSort<T extends { createdAt: number }>(
  data: T[],
  config: FilterConfig<T>
) {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [pendingFilters, setPendingFilters] = useState<Record<string, string>>({});

  const applyFilters = () => setActiveFilters(pendingFilters);

  const resetFilters = () => {
    setPendingFilters({});
    setActiveFilters({});
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filtered = useMemo(() => {
    let result = [...data];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        config.searchFields(item).join(" ").toLowerCase().includes(q)
      );
    }

    config.filters.forEach(({ key, match }) => {
      const val = activeFilters[key];
      if (val) result = result.filter((item) => match(item, val));
    });

    result.sort((a, b) =>
      sortOrder === "desc"
        ? b.createdAt - a.createdAt
        : a.createdAt - b.createdAt
    );

    return result;
  // config is intentionally excluded — it's stable per call site
  }, [data, search, activeFilters, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    filtered,
    search, setSearch,
    sortOrder, setSortOrder,
    pendingFilters, setPendingFilters,
    activeFilters,
    activeFilterCount,
    applyFilters,
    resetFilters,
  };
}