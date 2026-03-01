import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { useIntl } from "react-intl";
import type { SortOrder } from "../../hooks/useFilterSort";

interface Props {
  value: SortOrder;
  onChange: (val: SortOrder) => void;
}

export default function SortControl({ value, onChange }: Props) {
  const { formatMessage: t } = useIntl();
  return (
    <FormControl>
      <FormLabel>{t({ id: "common.sort" })}</FormLabel>
      <Select value={value} onChange={(e) => onChange(e.target.value as SortOrder)}>
        <option value="desc">{t({ id: "common.sortNewest" })}</option>
        <option value="asc">{t({ id: "common.sortOldest" })}</option>
      </Select>
    </FormControl>
  );
}