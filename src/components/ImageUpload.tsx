import { useRef, useState } from "react";
import { useIntl } from "react-intl";
import { Avatar, Button, Input, VStack, Text } from "@chakra-ui/react";

interface Props {
  currentUrl: string;
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
}

export default function ImageUpload({ currentUrl, onUpload, uploading }: Props) {
  const { formatMessage: t } = useIntl();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(currentUrl);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // show local preview immediately
    setPreview(URL.createObjectURL(file));
    await onUpload(file);
  };

  return (
    <VStack spacing={3}>
      <Avatar
        size="xl"
        src={preview || undefined}
        name="volunteer"
        cursor="pointer"
        onClick={() => inputRef.current?.click()}
        _hover={{ opacity: 0.8 }}
      />
      <Button
        size="sm"
        variant="outline"
        isLoading={uploading}
        loadingText={t({ id: "volunteer.image.uploading" })}
        onClick={() => inputRef.current?.click()}
      >
        {currentUrl ? t({ id: "volunteer.image.change" }) : t({ id: "volunteer.image.upload" })}
      </Button>
      <Input ref={inputRef} type="file" accept="image/*" display="none" onChange={handleChange} />
      <Text fontSize="xs" color="gray.400">
        JPG, PNG, WEBP
      </Text>
    </VStack>
  );
}
