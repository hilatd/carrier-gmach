import { useState } from "react";

export interface FilterField<T> {
  key: string;
  match: (item: T, value: string) => boolean;
}

export interface FilterConfig<T> {
  searchFields: (item: T) => string[];
  filters: FilterField<T>[];
}

export function useFilterSort<T>(data: T[], config: FilterConfig<T>) {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [pendingFilters, setPendingFilters] = useState<Record<string, string>>({});

  const applyFilters = () => setActiveFilters(pendingFilters);
  const resetFilters = () => {
    setPendingFilters({});
    setActiveFilters({});
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  let result = [...data];

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter((item) => config.searchFields(item).join(" ").toLowerCase().includes(q));
  }

  config.filters.forEach(({ key, match }) => {
    const val = activeFilters[key];
    if (val) result = result.filter((item) => match(item, val));
  });

  return {
    filtered: result,
    search,
    setSearch,
    pendingFilters,
    setPendingFilters,
    activeFilters,
    activeFilterCount,
    applyFilters,
    resetFilters,
  };
}
