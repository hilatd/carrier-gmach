import { useState } from "react";
import { useIntl } from "react-intl";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { AddIcon, CheckIcon, CopyIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { db } from "../../firebase";
import { DB_NAME } from "../../const";
import type { Template } from "../../types";
import { useCollection } from "../../hooks/useCollection";
import { useFilterSort } from "../../hooks/useFilterSort";
import { TEMPLATE_LABELS, labelColor, type TemplateLabel } from "../../utils/templateOptions";
import EditModal from "../EditModal";
import ListToolbar from "../search/ListToolbars";

const empty: Omit<Template, "id"> = {
  text: "",
  comment: "",
  name: "",
  labels: ["other"],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  deletedAt: null,
};

function TemplateCard({ template, onEdit }: { template: Template; onEdit: () => void }) {
  const { formatMessage: t } = useIntl();
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const bg = useColorModeValue("white", "gray.800");
  const textBg = useColorModeValue("gray.50", "gray.700");
  const isLong = template.text.length > 160;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(template.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      toast({ status: "error", title: t({ id: "template.copyFailed" }), duration: 3000 });
    }
  };

  return (
    <VStack  onClick={onEdit} align="stretch" spacing={3} bg={bg} p={5} borderRadius="xl" boxShadow="md">
      <HStack justify="space-between" align="start">
        <Text fontWeight="bold" fontSize="lg">
          {template.name}
        </Text>
        <IconButton
          aria-label={t({ id: "common.edit" })}
          icon={<EditIcon />}
          size="sm"
          variant="ghost"
          onClick={onEdit}
        />
      </HStack>

      <Wrap spacing={1}>
        {(template.labels ?? []).map((label) => (
          <WrapItem key={label}>
            <Badge colorScheme={labelColor(label)} borderRadius="full" px={2}>
              {t({ id: `template.label.${label}` })}
            </Badge>
          </WrapItem>
        ))}
      </Wrap>

      <Box bg={textBg} borderRadius="lg" p={3}>
        <Text fontSize="sm" whiteSpace="pre-wrap" noOfLines={expanded ? undefined : 4}>
          {template.text}
        </Text>
        {isLong && (
          <Button
            variant="link"
            size="xs"
            colorScheme="brand"
            mt={2}
            onClick={() => setExpanded((v) => !v)}
          >
            {t({ id: expanded ? "template.showLess" : "template.showMore" })}
          </Button>
        )}
      </Box>

      {template.comment && (
        <Text fontSize="xs" color="gray.500">
          {template.comment}
        </Text>
      )}

      <Button
        onClick={copy}
        colorScheme={copied ? "green" : "brand"}
        leftIcon={copied ? <CheckIcon /> : <CopyIcon />}
      >
        {t({ id: copied ? "template.copied" : "template.copy" })}
      </Button>
    </VStack>
  );
}

export default function TemplatesTab() {
  const { formatMessage: t } = useIntl();
  const { data: templates, loading } = useCollection<Template>(DB_NAME.TEMPLATE);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [activeLabel, setActiveLabel] = useState<TemplateLabel | null>(null);
  const [form, setForm] = useState<Omit<Template, "id">>(empty);

  const { filtered, search, setSearch } = useFilterSort<Template>(templates, {
    searchFields: (tmpl) => [
      tmpl.name,
      tmpl.text,
      tmpl.comment,
      ...(tmpl.labels ?? []).map((l) => t({ id: `template.label.${l}` })),
    ],
    filters: [],
  });

  const displayed = activeLabel
    ? filtered.filter((tmpl) => tmpl.labels?.includes(activeLabel))
    : filtered;

  const openNew = () => {
    setForm({ ...empty, createdAt: Date.now(), updatedAt: Date.now() });
    setEditId(null);
    setAttempted(false);
    onOpen();
  };

  const openEdit = (tmpl: Template) => {
    setForm(tmpl);
    setEditId(tmpl.id!);
    setAttempted(false);
    onOpen();
  };

  const toggleLabel = (label: TemplateLabel) =>
    setForm((prev) => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter((l) => l !== label)
        : [...prev.labels, label],
    }));

  const handleSave = async () => {
    setAttempted(true);
    if (!form.name.trim() || !form.text.trim()) return;

    setSaving(true);
    const now = Date.now();
    const data = {
      ...form,
      labels: form.labels.length ? form.labels : ["other"],
      updatedAt: now,
    };

    try {
      if (editId) await updateDoc(doc(db, DB_NAME.TEMPLATE, editId), data);
      else await addDoc(collection(db, DB_NAME.TEMPLATE), { ...data, createdAt: now });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <Box>
      <ListToolbar search={search} onSearchChange={setSearch} count={displayed.length}>
        <Button
          size="sm"
          borderRadius="full"
          flexShrink={0}
          variant={activeLabel === null ? "solid" : "outline"}
          colorScheme={activeLabel === null ? "brand" : "gray"}
          onClick={() => setActiveLabel(null)}
        >
          {t({ id: "template.filter.all" })}
        </Button>
        {TEMPLATE_LABELS.map((label) => (
          <Button
            key={label}
            size="sm"
            borderRadius="full"
            flexShrink={0}
            variant={activeLabel === label ? "solid" : "outline"}
            colorScheme={activeLabel === label ? labelColor(label) : "gray"}
            onClick={() => setActiveLabel(activeLabel === label ? null : label)}
          >
            {t({ id: `template.label.${label}` })}
          </Button>
        ))}
      </ListToolbar>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5} pb={24}>
        {displayed.map((tmpl) => (
          <TemplateCard key={tmpl.id} template={tmpl} onEdit={() => openEdit(tmpl)} />
        ))}
      </SimpleGrid>

      {displayed.length === 0 && (
        <Text textAlign="center" color="gray.400" mt={10}>
          {t({ id: "common.noResults" })}
        </Text>
      )}

      <Button
        position="fixed"
        insetInlineEnd={5}
        bottom={{ base: "88px", md: 8 }}
        zIndex="docked"
        size="lg"
        borderRadius="full"
        boxShadow="lg"
        leftIcon={<AddIcon boxSize={3} />}
        onClick={openNew}
      >
        {t({ id: "common.add" })}
      </Button>

      <EditModal
        title={editId ? t({ id: "common.edit" }) : t({ id: "template.new" })}
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        loading={saving}
      >
        <VStack spacing={4}>
          <FormControl isRequired isInvalid={attempted && !form.name.trim()}>
            <FormLabel>{t({ id: "template.name" })}</FormLabel>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <FormErrorMessage>{t({ id: "form.error.required" })}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "template.labels" })}</FormLabel>
            <Wrap spacing={2}>
              {TEMPLATE_LABELS.map((label) => {
                const selected = form.labels.includes(label);
                return (
                  <WrapItem key={label}>
                    <Button
                      size="sm"
                      borderRadius="full"
                      variant={selected ? "solid" : "outline"}
                      colorScheme={selected ? labelColor(label) : "gray"}
                      onClick={() => toggleLabel(label)}
                    >
                      {t({ id: `template.label.${label}` })}
                    </Button>
                  </WrapItem>
                );
              })}
            </Wrap>
          </FormControl>

          <FormControl isRequired isInvalid={attempted && !form.text.trim()}>
            <FormLabel>{t({ id: "template.text" })}</FormLabel>
            <Textarea
              value={form.text}
              placeholder={t({ id: "template.text.placeholder" })}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              rows={8}
            />
            <FormErrorMessage>{t({ id: "form.error.required" })}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "template.comment" })}</FormLabel>
            <Input
              value={form.comment}
              placeholder={t({ id: "template.comment.placeholder" })}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            />
          </FormControl>
        </VStack>
      </EditModal>
    </Box>
  );
}
