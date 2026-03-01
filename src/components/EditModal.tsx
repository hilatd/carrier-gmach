import { useIntl } from "react-intl";
import type { ReactNode } from "react";
import { useLang } from "../i18n/useLang";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, ModalFooter, Button,
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent dir={dir}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter gap={3} flexDirection={dir === "rtl" ? "row-reverse" : "row"}>
          <Button variant="ghost" onClick={onClose}>
            {t({ id: "common.cancel" })}
          </Button>
          <Button isLoading={loading} onClick={onSave}>
            {t({ id: "common.save" })}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}