import { useState } from "react";

export type SortOrder = "asc" | "desc";

export interface SortField<T> {
  key: string;
  label: string;
  getValue: (item: T) => number | string;
}

export function useSort<T>(data: T[], fields: SortField<T>[]) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [sortField, setSortField] = useState<string>(fields[0]?.key ?? "");

  const currentField = fields.find((f) => f.key === sortField);

  const sorted = [...data].sort((a, b) => {
    const aVal = currentField?.getValue(a) ?? 0;
    const bVal = currentField?.getValue(b) ?? 0;

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "desc" ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    }

    return sortOrder === "desc"
      ? (bVal as number) - (aVal as number)
      : (aVal as number) - (bVal as number);
  });

  return {
    sorted,
    sortOrder,
    setSortOrder,
    sortField,
    setSortField,
    sortFields: fields,
  };
}
