import { CheckIcon } from "@chakra-ui/icons";
import { useColorModeValue, VStack, HStack, Box, Button, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useIntl } from "react-intl";
import Legal from "../pages/Legal";

export default function LegalScroller({ onRead, isRead }: { onRead: () => void; isRead: boolean }) {
  const { formatMessage: t } = useIntl();
  const [hasScrolled, setHasScrolled] = useState(false);
  const boxBg = useColorModeValue("gray.50", "gray.700");
  const borderCol = useColorModeValue("gray.200", "gray.600");
  const checkBg = useColorModeValue("green.50", "green.900");

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 20;
    if (atBottom) setHasScrolled(true);
  };

  return (
    <VStack spacing={3} align="stretch">
      {/* Scroll hint */}
      {!hasScrolled && (
        <HStack fontSize="xs" color="brand.500" fontWeight="semibold" justify="center" spacing={1}>
          <Text>↓</Text>
          <Text>{t({ id: "legal.scrollHint" })}</Text>
          <Text>↓</Text>
        </HStack>
      )}

      {/* Legal text box */}
      <Box
        bg={boxBg}
        border="1px solid"
        borderColor={isRead ? "green.300" : hasScrolled ? "brand.300" : borderCol}
        borderRadius="xl"
        p={4}
        maxH="220px"
        overflowY="auto"
        fontSize="sm"
        lineHeight={1.9}
        transition="border-color 0.3s"
        onScroll={handleScroll}
        dir="rtl"
      >
        <Legal />
        {/* Confirm button at bottom of scroll */}
        {hasScrolled && !isRead && (
          <Button w="full" colorScheme="brand" size="sm" onClick={onRead} mt={2}>
            ✓ {t({ id: "legal.confirm" })}
          </Button>
        )}
      </Box>

      {/* Read confirmation */}
      {isRead && (
        <HStack bg={checkBg} borderRadius="lg" px={4} py={3} spacing={2}>
          <CheckIcon color="green.500" />
          <Text fontSize="sm" color="green.600" fontWeight="semibold">
            {t({ id: "legal.confirmed" })}
          </Text>
        </HStack>
      )}
    </VStack>
  );
}
