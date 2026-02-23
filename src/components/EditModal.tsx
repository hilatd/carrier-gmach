import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, ModalFooter, Button
} from "@chakra-ui/react";

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
  loading?: boolean;
}

export default function EditModal({ title, isOpen, onClose, onSave, children, loading }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose}>ביטול</Button>
          <Button isLoading={loading} onClick={onSave}>שמור</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}