import { useRef, useState } from "react";
import { useIntl } from "react-intl";
import { Avatar, Button, Input, VStack, Text, Tooltip } from "@chakra-ui/react";

interface Props {
  currentUrl: string;
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
  disabled?: boolean;
  disabledTooltip?: string;
  name: string;
}

export default function ImageUpload({ currentUrl, onUpload, uploading, disabled, disabledTooltip, name  }: Props) {
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
        name={name}
        cursor={disabled ? "not-allowed" : "pointer"}
        opacity={disabled ? 0.5 : 1}
        onClick={() => !disabled && inputRef.current?.click()}
        _hover={{ opacity: disabled ? 0.5 : 0.8 }}
      />
      <Tooltip label={disabled ? disabledTooltip : undefined} isDisabled={!disabled}>
        <Button
          size="sm"
          variant="outline"
          isLoading={uploading}
          isDisabled={disabled}
          loadingText={t({ id: "image.uploading" })}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          {currentUrl
            ? t({ id: "image.change" })
            : t({ id: "image.upload" })}
        </Button>
      </Tooltip>
      <Input ref={inputRef} type="file" accept="image/*" display="none" onChange={handleChange} />
      {!disabled && <Text fontSize="xs" color="gray.400">JPG, PNG, WEBP</Text>}
    </VStack>
  );
}
