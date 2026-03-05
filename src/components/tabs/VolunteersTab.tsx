import { useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import type { Volunteer } from "../../types";
import { useCollection } from "../../hooks/useCollection";
import { useFilterSort } from "../../hooks/useFilterSort";
import { useIntl } from "react-intl";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  SimpleGrid,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import EditModal from "../EditModal";
import SearchBar from "../search/SearchBar";
import ResultsCount from "../search/ResultsCount";

const empty: Omit<Volunteer, "id"> = {
  name: "",
  phone: "",
  email: "",
  address: "",
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export default function VolunteersTab() {
  const { formatMessage: t } = useIntl();
  const { data: volunteers, loading } = useCollection<Volunteer>("volunteers");
  const [form, setForm] = useState<Omit<Volunteer, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800");

  const { filtered, search, setSearch } = useFilterSort<Volunteer>(volunteers, {
    searchFields: (v) => [v.name, v.phone, v.email, v.address],
    filters: [],
  });

  const openNew = () => {
    setForm({ ...empty, createdAt: Date.now(), updatedAt: Date.now() });
    setEditId(null);
    onOpen();
  };

  const openEdit = (v: Volunteer) => {
    setForm(v);
    setEditId(v.id!);
    onOpen();
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, updatedAt: Date.now() };
    if (editId) await updateDoc(doc(db, "volunteers", editId), data);
    else await addDoc(collection(db, "volunteers"), { ...data, createdAt: Date.now() });
    setSaving(false);
    onClose();
  };

  if (loading) return null;

  return (
    <Box>
      <HStack mb={5} spacing={3} wrap="wrap">
        <Button onClick={openNew}>+ {t({ id: "volunteer.add" })}</Button>
        <SearchBar value={search} onChange={setSearch} />
      </HStack>

      <ResultsCount count={filtered.length} />

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
        {filtered.map((v) => (
          <Box key={v.id} bg={bg} p={5} borderRadius="xl" boxShadow="md">
            <Text fontWeight="bold" fontSize="lg">
              {v.name}
            </Text>
            <Text>📞 {v.phone}</Text>
            <Text>📧 {v.email}</Text>
            <Text>📍 {v.address}</Text>
            <Button size="xs" mt={3} variant="outline" onClick={() => openEdit(v)}>
              {t({ id: "common.edit" })}
            </Button>
          </Box>
        ))}
      </SimpleGrid>

      {filtered.length === 0 && (
        <Text textAlign="center" color="gray.400" mt={10}>
          {t({ id: "common.noResults" })}
        </Text>
      )}

      <EditModal
        title={editId ? t({ id: "volunteer.edit" }) : t({ id: "volunteer.new" })}
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        loading={saving}
      >
        <VStack spacing={4}>
          {(["name", "phone", "email", "address"] as const).map((f) => (
            <FormControl key={f}>
              <FormLabel>{t({ id: `volunteer.${f}` })}</FormLabel>
              <Input value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
            </FormControl>
          ))}
        </VStack>
      </EditModal>
    </Box>
  );
}
