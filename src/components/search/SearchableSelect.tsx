import { useState, useMemo } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useIntl } from "react-intl";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string; disabled?: boolean }[];
  placeholder?: string;
}

export default function SearchableSelect({ label, value, onChange, options, placeholder }: Props) {
  const [typedQuery, setTypedQuery] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const bg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("brand.50", "gray.700");
  const borderCol = useColorModeValue("gray.200", "gray.600");

  const { formatMessage: t } = useIntl();

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";
  // show what the user is typing, fall back to the selected label
  const query = typedQuery ?? selectedLabel;

  const filtered = useMemo(
    () => options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())),
    [options, query]
  );

  const pick = (val: string) => {
    onChange(val);
    setTypedQuery(null); // clear typed query — selectedLabel takes over
    setOpen(false);
  };

  const clear = () => {
    onChange("");
    setTypedQuery(null);
  };

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Box position="relative">
        <InputGroup>
          <Input
            value={query}
            placeholder={placeholder}
            autoComplete="off"
            onChange={(e) => {
              setTypedQuery(e.target.value);
              setOpen(true);
              if (!e.target.value) onChange("");
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
          />
          {value && (
            <InputRightElement>
              <IconButton
                aria-label="clear"
                icon={<CloseIcon boxSize="10px" />}
                size="xs"
                variant="ghost"
                onClick={clear}
              />
            </InputRightElement>
          )}
        </InputGroup>

        {open && filtered.length > 0 && (
          <Box
            position="absolute"
            top="100%"
            left={0}
            right={0}
            zIndex={10}
            bg={bg}
            border="1px solid"
            borderColor={borderCol}
            borderRadius="lg"
            boxShadow="lg"
            maxH="200px"
            overflowY="auto"
            mt={1}
          >
            {filtered.map((o) => (
              <Box
                key={o.value}
                px={4}
                py={3}
                cursor={o.disabled ? "not-allowed" : "pointer"}
                opacity={o.disabled ? 0.4 : 1}
                fontSize="sm"
                fontWeight={o.value === value ? "bold" : "normal"}
                bg={o.value === value ? hoverBg : undefined}
                _hover={{ bg: o.disabled ? undefined : hoverBg }}
                onMouseDown={() => !o.disabled && pick(o.value)}
              >
                {o.label}
                {o.disabled && (
                  <Text as="span" fontSize="xs" color="red.400" ms={2}>
                    {t({ id: "action.error.carrierInUse.short" })}
                  </Text>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </FormControl>
  );
}
