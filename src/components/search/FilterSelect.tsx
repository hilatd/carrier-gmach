import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { useIntl } from "react-intl";

interface Option { label: string; value: string; }

interface Props {
  label: string;
  value: string;
  options: Option[];
  onChange: (val: string) => void;
}

export default function FilterSelect({ label, value, options, onChange }: Props) {
  const { formatMessage: t } = useIntl();
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Select
        value={value}
        placeholder={t({ id: "common.all" })}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </Select>
    </FormControl>
  );
}