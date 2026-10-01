import { createIcon } from "@chakra-ui/react";

export const FilterIcon = createIcon({
  displayName: "FilterIcon",
  viewBox: "0 0 24 24",
  path: <path fill="currentColor" d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />,
});

export const SortIcon = createIcon({
  displayName: "SortIcon",
  viewBox: "0 0 24 24",
  path: <path fill="currentColor" d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />,
});
