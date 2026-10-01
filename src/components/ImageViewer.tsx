import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Image,
  useDisclosure,
  Box,
} from "@chakra-ui/react";

interface Props {
  src: string;
  name?: string;
  trigger: React.ReactNode;
}

export default function ImageViewer({ src, name, trigger }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box onClick={onOpen} cursor="zoom-in" display="inline-block">
        {trigger}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
        <ModalOverlay bg="blackAlpha.900" backdropFilter="blur(8px)" />
        <ModalContent
          bg="transparent"
          boxShadow="none"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={onClose}
        >
          <ModalCloseButton
            color="white"
            size="lg"
            top={4}
            right={4}
            zIndex={10}
            bg="blackAlpha.500"
            borderRadius="full"
            _hover={{ bg: "blackAlpha.700" }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          />
          <Image
            src={src}
            alt={name}
            maxH="90vh"
            maxW="90vw"
            objectFit="contain"
            borderRadius="xl"
            onClick={(e) => e.stopPropagation()}
          />
        </ModalContent>
      </Modal>
    </>
  );
}
