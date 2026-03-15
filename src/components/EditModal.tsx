import { useIntl } from "react-intl";
import type { ReactNode } from "react";
import { useLang } from "../i18n/useLang";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
  Button,
  Text,
  HStack,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  children: ReactNode;
  loading?: boolean;
}

export default function EditModal({ title, isOpen, onClose, onSave, children, loading }: Props) {
  const { formatMessage: t } = useIntl();
  const { lang } = useLang();
  const dir = lang === "he" ? "rtl" : "ltr";
  const headerBg = useColorModeValue("white", "gray.800");
  const borderCol = useColorModeValue("gray.100", "gray.700");

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="bottom" size="full">
      <DrawerOverlay backdropFilter="blur(4px)" />
      <DrawerContent
        dir={dir}
        borderTopRadius="2xl"
        maxH="92dvh"
        display="flex"
        flexDirection="column"
      >
        {/* Drag handle */}
        <Box pt={3} pb={1} display="flex" justifyContent="center">
          <Box w="40px" h="4px" borderRadius="full" bg={borderCol} />
        </Box>

        {/* Header */}
        <DrawerHeader
          bg={headerBg}
          borderBottomWidth={1}
          borderColor={borderCol}
          px={5}
          py={4}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexShrink={0}
        >
          <Text fontWeight="bold" fontSize="lg">
            {title}
          </Text>
          <DrawerCloseButton position="static" />
        </DrawerHeader>

        {/* Scrollable body */}
        <DrawerBody px={5} py={6} overflowY="auto" flex={1}>
          {children}
        </DrawerBody>

        {/* Sticky footer */}
        <DrawerFooter
          borderTopWidth={1}
          borderColor={borderCol}
          px={5}
          py={4}
          bg={headerBg}
          flexShrink={0}
        >
          <HStack w="full" spacing={3} flexDirection={dir === "rtl" ? "row-reverse" : "row"}>
            <Button flex={1} variant="outline" onClick={onClose} size="lg">
              {t({ id: "common.cancel" })}
            </Button>
            <Button flex={2} isLoading={loading} onClick={onSave} size="lg">
              {t({ id: "common.save" })}
            </Button>
          </HStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
