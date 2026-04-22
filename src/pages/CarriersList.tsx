import { useMemo } from "react";
import { useIntl } from "react-intl";
import { useCollection } from "../hooks/useCollection";
import type { Carrier } from "../types";
import {
  Box,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  useColorModeValue,
  Divider,
  Badge,
} from "@chakra-ui/react";

// accent color per carrier type — matches brand palette
const TYPE_ACCENT: Record<string, string> = {
  backpack: "purple",
  woven_wrap: "blue",
  elastic: "pink",
  mei_dai: "green",
  rings: "orange",
  accessories: "teal",
};

export default function CarriersList() {
  const { formatMessage: t } = useIntl();
  const { data: carriers, loading } = useCollection<Carrier>("carriers");

  const pageBg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const mutedCol = useColorModeValue("gray.500", "gray.400");
  const borderCol = useColorModeValue("gray.100", "gray.700");

  // only good-state carriers, grouped by type, brands counted and sorted
  const grouped = useMemo(() => {
    const good = carriers.filter((c) => c.state === "good");

    // group by type → brand → count
    const map = new Map<string, Map<string, number>>();
    for (const c of good) {
      if (!map.has(c.type)) map.set(c.type, new Map());
      const brandMap = map.get(c.type)!;
      const key = [c.brand, c.model].filter(Boolean).join(" – ");
      brandMap.set(key, (brandMap.get(key) ?? 0) + 1);
    }

    // sort types, then sort brands within each type
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([type, brandMap]) => ({
        type,
        brands: [...brandMap.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([brand, count]) => ({ brand, count })),
        total: [...brandMap.values()].reduce((s, n) => s + n, 0),
      }));
  }, [carriers]);

  if (loading) return null;

  return (
    <Box bg={pageBg} minH="100vh" py={{ base: 10, md: 16 }}>
      <Container maxW="680px" px={6}>
        {/* Page header */}
        <VStack align="start" spacing={2} mb={12}>
          <Text
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.12em"
            textTransform="uppercase"
            color={mutedCol}
          >
            {t({ id: "carriersList.eyebrow" })}
          </Text>
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="800"
            lineHeight={1.15}
            letterSpacing="-0.02em"
          >
            {t({ id: "carriersList.title" })}
          </Heading>
          <Text color={mutedCol} fontSize="md" maxW="460px" lineHeight={1.8} mt={1}>
            {t({ id: "carriersList.subtitle" })}
          </Text>
        </VStack>

        {/* Carrier type sections */}
        <VStack spacing={6} align="stretch">
          {grouped.map(({ type, brands, total }) => {
            const accent = TYPE_ACCENT[type] ?? "gray";
            return (
              <Box
                key={type}
                bg={cardBg}
                borderRadius="2xl"
                border="1px solid"
                borderColor={borderCol}
                overflow="hidden"
                transition="box-shadow 0.2s"
                _hover={{ boxShadow: "md" }}
              >
                {/* Type header */}
                <Box
                  px={6}
                  py={4}
                  borderBottomWidth={1}
                  borderColor={borderCol}
                  borderLeftWidth={4}
                  borderLeftColor={`${accent}.400`}
                >
                  <HStack justify="space-between" align="center">
                    <Heading as="h2" fontSize="lg" fontWeight="700" letterSpacing="-0.01em">
                      {t({ id: `catalog.${type}.name` })}
                    </Heading>
                    <Badge
                      colorScheme={accent}
                      variant="subtle"
                      fontSize="xs"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {total} {t({ id: total === 1 ? "carriersList.unit" : "carriersList.units" })}
                    </Badge>
                  </HStack>
                </Box>

                {/* Brand rows */}
                <VStack spacing={0} align="stretch" px={6} py={2}>
                  {brands.map(({ brand, count }, i) => (
                    <Box key={brand}>
                      <HStack
                        justify="space-between"
                        py={3}
                        _hover={{ color: `${accent}.500` }}
                        transition="color 0.15s"
                      >
                        <Text fontWeight="500" fontSize="sm">
                          {brand}
                        </Text>
                        <Text
                          fontSize="sm"
                          fontWeight="700"
                          color={`${accent}.500`}
                          minW="2ch"
                          textAlign="end"
                        >
                          {count}
                        </Text>
                      </HStack>
                      {i < brands.length - 1 && <Divider borderColor={borderCol} />}
                    </Box>
                  ))}
                </VStack>
              </Box>
            );
          })}
        </VStack>

        {/* Empty state */}
        {grouped.length === 0 && (
          <Text textAlign="center" color={mutedCol} mt={20} fontSize="lg">
            {t({ id: "carriersList.empty" })}
          </Text>
        )}

        {/* Footer note */}
        <Text fontSize="xs" color={mutedCol} textAlign="center" mt={14} lineHeight={1.8}>
          {t({ id: "carriersList.note" })}
        </Text>
      </Container>
    </Box>
  );
}
