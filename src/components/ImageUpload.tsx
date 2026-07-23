import { useRef, useState } from "react";
import { useIntl } from "react-intl";
import { Avatar, Box, Button, HStack, Input, Text, Tooltip } from "@chakra-ui/react";

interface Props {
  currentUrl: string;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
  uploading: boolean;
  disabled?: boolean;
  name: string;
  disabledTooltip?: string;
}

export default function ImageUpload({
  currentUrl,
  onUpload,
  onDelete,
  uploading,
  disabled,
  name,
  disabledTooltip,
}: Props) {
  const { formatMessage: t } = useIntl();
  const inputRef = useRef<HTMLInputElement>(null);
  const [deleting, setDeleting] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const preview = localPreview ?? currentUrl;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalPreview(URL.createObjectURL(file));
    await onUpload(file);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete();
      setLocalPreview("");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
      <Avatar
        size="xl"
        src={preview || undefined}
        name={name}
        cursor={disabled ? "not-allowed" : "pointer"}
        opacity={disabled ? 0.5 : 1}
        onClick={() => !disabled && inputRef.current?.click()}
        _hover={{ opacity: disabled ? 0.5 : 0.8 }}
      />

      <HStack spacing={2}>
        <Tooltip label={disabled ? disabledTooltip : undefined} isDisabled={!disabled}>
          <Button
            size="sm"
            variant="outline"
            isLoading={uploading}
            isDisabled={disabled}
            loadingText={t({ id: "image.uploading" })}
            onClick={() => !disabled && inputRef.current?.click()}
          >
            {preview ? t({ id: "image.change" }) : t({ id: "image.upload" })}
          </Button>
        </Tooltip>

        {preview && (
          <Button
            size="sm"
            variant="ghost"
            colorScheme="red"
            isLoading={deleting}
            isDisabled={disabled}
            onClick={handleDelete}
          >
            {t({ id: "image.delete" })}
          </Button>
        )}
      </HStack>

      <Input ref={inputRef} type="file" accept="image/*" display="none" onChange={handleChange} />
      {!disabled && (
        <Text fontSize="xs" color="gray.400">
          JPG, PNG, WEBP
        </Text>
      )}
    </Box>
  );
}
