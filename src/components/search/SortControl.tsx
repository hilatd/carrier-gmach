import { useIntl } from "react-intl";
import { FormControl, FormLabel, HStack, Select, Button } from "@chakra-ui/react";

export type SortOrder = "asc" | "desc";

export interface SortField<T> {
  key: string;
  label: string;
  getValue: (item: T) => number | string;
}

interface Props<T> {
  value: SortOrder;
  onChange: (v: SortOrder) => void;
  sortField?: string;
  onSortFieldChange?: (v: string) => void;
  sortFields?: SortField<T>[];
}

export default function SortControl<T>({
  value,
  onChange,
  sortField,
  onSortFieldChange,
  sortFields,
}: Props<T>) {
  const { formatMessage: t } = useIntl();
  return (
    <FormControl>
      <FormLabel>{t({ id: "common.sort" })}</FormLabel>
      <HStack>
        {sortFields && sortFields.length > 0 && onSortFieldChange && (
          <Select value={sortField} onChange={(e) => onSortFieldChange(e.target.value)} size="sm">
            {sortFields.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label}
              </option>
            ))}
          </Select>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => onChange(value === "desc" ? "asc" : "desc")}
        >
          {value === "desc" ? "↓ " : "↑ "}
          {t({ id: value === "desc" ? "common.sort.newest" : "common.sort.oldest" })}
        </Button>
      </HStack>
    </FormControl>
  );
}
