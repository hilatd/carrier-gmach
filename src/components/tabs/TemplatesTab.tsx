import { useIntl } from "react-intl";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import type { Template } from "../../types";
import { DB_NAME } from "../../const";
import { useCollection } from "../../hooks/useCollection";
import {
  Box,
  HStack,
  Button,
  SimpleGrid,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  Badge,
} from "@chakra-ui/react";
import EditModal from "../EditModal";
import ResultsCount from "../search/ResultsCount";
import SearchBar from "../search/SearchBar";
import { useFilterSort } from "../../hooks/useFilterSort";
import { useState } from "react";
import { db } from "../../firebase";

const empty: Omit<Template, "id"> = {
  text: "",
  comment: "",
  name: "",
  labels: ["other"],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  deletedAt: null,
};
export default function TemplatesTab() {
  const { formatMessage: t } = useIntl();
  const { data: templates, loading } = useCollection<Template>(DB_NAME.TEMPLATE);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Omit<Template, "id">>(empty);
  const { filtered, search, setSearch } = useFilterSort<Template>(templates, {
    searchFields: (t) => [t.text],
    filters: [],
  });
  const openNew = () => {
    setForm({ ...empty, createdAt: Date.now(), updatedAt: Date.now() });
    setEditId(null);
    onOpen();
  };

  const openEdit = (tmplt: Template) => {
    setForm(tmplt);
    setEditId(tmplt.id!);
    onOpen();
  };
  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, updatedAt: Date.now() };
    if (editId) await updateDoc(doc(db, DB_NAME.TEMPLATE, editId), data);
    else await addDoc(collection(db, DB_NAME.TEMPLATE), { ...data, createdAt: Date.now() });
    setSaving(false);
    onClose();
  };

  if (loading) return null;
  return (
    <Box>
      <HStack mb={5} spacing={3} wrap="wrap">
        <Button onClick={openNew}>+ {t({ id: "template.add" })}</Button>
        <SearchBar value={search} onChange={setSearch} />
      </HStack>

      <ResultsCount count={filtered.length} />

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
        {filtered.map((tmplt) => (
          <Box key={tmplt.id} bg={bg} p={5} borderRadius="xl" boxShadow="md">
            <HStack spacing={4} mb={3}>
              <Box>
                <Text fontWeight="bold" fontSize="lg">
                  {tmplt.name}
                </Text>
              </Box>
            </HStack>

            <Text fontSize="sm" color="gray.500" mt={2} fontStyle="italic">
              💬 {tmplt.text}
            </Text>

            {tmplt.labels.map((l)=> <Badge>{l}</Badge>)}

            <HStack mt={3} spacing={2}>
              <Button size="xs" variant="outline" onClick={() => openEdit(tmplt)}>
                {t({ id: "common.edit" })}
              </Button>
            </HStack>
          </Box>
        ))}
      </SimpleGrid>

      {filtered.length === 0 && (
        <Text textAlign="center" color="gray.400" mt={10}>
          {t({ id: "common.noResults" })}
        </Text>
      )}

      <EditModal
        title={editId ? t({ id: "template.edit" }) : t({ id: "template.new" })}
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        loading={saving}
      >
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>{t({ id: "template.name" })}</FormLabel>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "template.text" })}</FormLabel>
            <Textarea
              value={form.text}
              placeholder={t({ id: "template.text.placeholder" })}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              rows={3}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "template.comment" })}</FormLabel>
            <Input
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            />
          </FormControl>
        </VStack>
      </EditModal>
    </Box>
  );
}
