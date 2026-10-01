import type { ReactNode } from "react";
import { Box, Circle, HStack, IconButton, VStack } from "@chakra-ui/react";
import { useIntl } from "react-intl";
import type { SortOrder } from "../../hooks/useSort";
import { FilterIcon } from "../icons";
import SearchBar from "./SearchBar";
import SortMenu from "./SortMenu";
import ResultsCount from "./ResultsCount";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  onFilterOpen: () => void;
  activeFilterCount: number;
  count: number;
  sort?: {
    order: SortOrder;
    onOrderChange: (v: SortOrder) => void;
    field: string;
    onFieldChange: (v: string) => void;
    fields: { key: string; label: string }[];
  };
  children?: ReactNode; // quick-toggle pills
}

export default function ListToolbar({
  search,
  onSearchChange,
  onFilterOpen,
  activeFilterCount,
  count,
  sort,
  children,
}: Props) {
  const { formatMessage: t } = useIntl();
  const hasFilters = activeFilterCount > 0;

  return (
    <VStack align="stretch" spacing={3} mb={4}>
      <HStack spacing={2}>
        <Box flex={1} minW={0}>
          <SearchBar value={search} onChange={onSearchChange} />
        </Box>

        <Box position="relative">
          <IconButton
            aria-label={t({ id: "common.filter" })}
            icon={<FilterIcon boxSize={5} />}
            variant={hasFilters ? "solid" : "outline"}
            colorScheme={hasFilters ? "brand" : "gray"}
            onClick={onFilterOpen}
          />
          {hasFilters && (
            <Circle
              size="18px"
              position="absolute"
              top="-6px"
              insetInlineEnd="-6px"
              bg="white"
              color="gray.800"
              fontSize="xs"
              fontWeight="bold"
              boxShadow="sm"
              pointerEvents="none"
            >
              {activeFilterCount}
            </Circle>
          )}
        </Box>

        {sort && <SortMenu {...sort} />}
      </HStack>

      <HStack justify="space-between" spacing={3}>
        <HStack spacing={2} overflowX="auto" sx={{ scrollbarWidth: "none" }}>
          {children}
        </HStack>
        <Box flexShrink={0}>
          <ResultsCount count={count} />
        </Box>
      </HStack>
    </VStack>
  );
}
