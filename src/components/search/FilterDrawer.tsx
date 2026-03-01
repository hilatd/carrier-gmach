import type { ReactNode } from "react";
import { useIntl } from "react-intl";
import {
  Button,
  Drawer, DrawerBody, DrawerCloseButton,
  DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay,
  HStack, VStack,
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  activeFilterCount: number;
  children: ReactNode;
}

export default function FilterDrawer({
  isOpen, onClose, onApply, onReset, activeFilterCount, children,
}: Props) {
  const { formatMessage: t } = useIntl();

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent borderTopRadius="2xl" maxH="85vh">
        <DrawerCloseButton />
        <DrawerHeader>{t({ id: "common.filter" })}</DrawerHeader>
        <DrawerBody overflowY="auto">
          <VStack spacing={4} align="stretch">
            {children}
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <HStack w="full" spacing={3}>
            <Button variant="outline" onClick={onReset} flex={1}>
              {t({ id: "common.reset" })}
            </Button>
            <Button onClick={onApply} flex={1}>
              {t({ id: "common.apply" })}
              {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </Button>
          </HStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}