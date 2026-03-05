import { FormControl, FormLabel, RadioGroup, Stack, Radio } from "@chakra-ui/react";


interface Option { label: string; value: string; }

interface Props {
  label: string;
  value: string;
  options: Option[];
  onChange: (val: string) => void;
}

export default function FilterRadioButton({ label, value, options, onChange }: Props) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
       <RadioGroup onChange={onChange} value={value}>
      <Stack direction='row'>
        {options.map(option=>
            <Radio value={option.value}>{option.label}</Radio>
    )}
      </Stack>
    </RadioGroup>
    </FormControl>
  );
}