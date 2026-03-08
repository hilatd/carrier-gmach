import { useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import type { Client } from "../../types";
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
  Link,
} from "@chakra-ui/react";
import EditModal from "../EditModal";
import SearchBar from "../search/SearchBar";
import ResultsCount from "../search/ResultsCount";

const empty: Omit<Client, "id"> = {
  name: "",
  phone: "",
  email: "",
  address: "",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  deletedAt: null,
};

export default function ClientsTab() {
  const { formatMessage: t } = useIntl();
  const { data: clients, loading } = useCollection<Client>("clients");
  const [form, setForm] = useState<Omit<Client, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800");

  const { filtered, search, setSearch } = useFilterSort<Client>(clients, {
    searchFields: (c) => [c.name, c.phone, c.email, c.address],
    filters: [],
  });

  const openNew = () => {
    setForm({ ...empty, createdAt: Date.now(), updatedAt: Date.now() });
    setEditId(null);
    onOpen();
  };

  const openEdit = (c: Client) => {
    setForm(c);
    setEditId(c.id!);
    onOpen();
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, updatedAt: Date.now() };
    if (editId) await updateDoc(doc(db, "clients", editId), data);
    else await addDoc(collection(db, "clients"), { ...data, createdAt: Date.now() });
    setSaving(false);
    onClose();
  };

  if (loading) return null;

  return (
    <Box>
      <HStack mb={5} spacing={3} wrap="wrap">
        <Button onClick={openNew}>+ {t({ id: "client.add" })}</Button>
        <SearchBar value={search} onChange={setSearch} />
      </HStack>

      <ResultsCount count={filtered.length} />

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
        {filtered.map((c) => (
          <Box key={c.id} bg={bg} p={5} borderRadius="xl" boxShadow="md">
            <Text fontWeight="bold" fontSize="lg">
              {c.name}
            </Text>
            <Link href={`tel:${c.phone}`} color="brand.500" fontWeight="medium">
              📞 {c.phone}
            </Link>
            <Text>📧 {c.email}</Text>
            <Text>📍 {c.address}</Text>
            <Button size="xs" mt={3} variant="outline" onClick={() => openEdit(c)}>
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
        title={editId ? t({ id: "client.edit" }) : t({ id: "client.new" })}
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        loading={saving}
      >
        <VStack spacing={4}>
          {(["name", "phone", "email", "address"] as const).map((f) => (
            <FormControl key={f}>
              <FormLabel>{t({ id: `client.${f}` })}</FormLabel>
              <Input value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
            </FormControl>
          ))}
        </VStack>
      </EditModal>
    </Box>
  );
}
