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
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
  Text,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface Props {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  options: Option[];
  placeholder?: string;
}

export default function SearchableMultiSelect({
  label,
  values,
  onChange,
  options,
  placeholder,
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const bg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("brand.50", "gray.700");
  const borderCol = useColorModeValue("gray.200", "gray.600");
  const tagBg = useColorModeValue("brand.50", "brand.900");

  const filtered = useMemo(
    () =>
      options.filter(
        (o) => o.label.toLowerCase().includes(query.toLowerCase()) && !values.includes(o.value)
      ),
    [options, query, values]
  );

  const pick = (val: string) => {
    onChange([...values, val]);
    setQuery("");
  };

  const remove = (val: string) => {
    onChange(values.filter((v) => v !== val));
  };

  const selectedOptions = options.filter((o) => values.includes(o.value));

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Box position="relative">
        {/* Selected tags */}
        {selectedOptions.length > 0 && (
          <Wrap mb={2} spacing={1}>
            {selectedOptions.map((o) => (
              <WrapItem key={o.value}>
                <Tag size="sm" bg={tagBg} colorScheme="brand" borderRadius="full">
                  <TagLabel>{o.label}</TagLabel>
                  <TagCloseButton onClick={() => remove(o.value)} />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        )}

        {/* Search input */}
        <InputGroup>
          <Input
            value={query}
            placeholder={values.length === 0 ? placeholder : "הוסיפי עוד..."}
            autoComplete="off"
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
          />
          {query && (
            <InputRightElement>
              <IconButton
                aria-label="clear"
                icon={<CloseIcon boxSize="10px" />}
                size="xs"
                variant="ghost"
                onClick={() => setQuery("")}
              />
            </InputRightElement>
          )}
        </InputGroup>

        {/* Dropdown */}
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
                _hover={{ bg: o.disabled ? undefined : hoverBg }}
                onMouseDown={() => !o.disabled && pick(o.value)}
              >
                {o.label}
                {o.disabled && (
                  <Text as="span" fontSize="xs" color="red.400" ms={2}>
                    (מושאל)
                  </Text>
                )}
              </Box>
            ))}
          </Box>
        )}

        {open && filtered.length === 0 && query && (
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
            px={4}
            py={3}
            fontSize="sm"
            color="gray.400"
            mt={1}
          >
            אין תוצאות
          </Box>
        )}
      </Box>
    </FormControl>
  );
}
