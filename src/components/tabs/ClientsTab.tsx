import { useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import type { Client } from "../../types";
import { useCollection } from "../../hooks/useCollection";
import {
  Box, Button, FormControl, FormLabel, Input,
  SimpleGrid, Text, useColorModeValue, useDisclosure, VStack
} from "@chakra-ui/react";
import EditModal from "../EditModal";

const empty: Omit<Client,"id"> = { name:"", phone:"", email:"", address:"", createdAt: Date.now(), updatedAt: Date.now() };

export default function ClientsTab() {
  const { data: clients, loading } = useCollection<Client>("clients");
  const [form, setForm] = useState<Omit<Client,"id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800");

  const openNew = () => { setForm({ ...empty, createdAt: Date.now(), updatedAt: Date.now() }); setEditId(null); onOpen(); };
  const openEdit = (c: Client) => { setForm(c); setEditId(c.id!); onOpen(); };

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
      <Button mb={5} onClick={openNew}>+ הוסף משאילה</Button>
      <SimpleGrid columns={{ base:1, md:2, lg:3 }} spacing={5}>
        {clients.map(c => (
          <Box key={c.id} bg={bg} p={5} borderRadius="xl" boxShadow="md">
            <Text fontWeight="bold" fontSize="lg">{c.name}</Text>
            <Text>📞 {c.phone}</Text>
            <Text>📧 {c.email}</Text>
            <Text>📍 {c.address}</Text>
            <Button size="xs" mt={3} variant="outline" onClick={() => openEdit(c)}>עריכה</Button>
          </Box>
        ))}
      </SimpleGrid>

      <EditModal title={editId ? "עריכת משאילה" : "משאילה חדש"} isOpen={isOpen} onClose={onClose} onSave={handleSave} loading={saving}>
        <VStack spacing={4}>
          {(["name","phone","email","address"] as const).map(f => (
            <FormControl key={f}>
              <FormLabel>{f}</FormLabel>
              <Input value={form[f]} onChange={e => setForm({...form, [f]: e.target.value})} />
            </FormControl>
          ))}
        </VStack>
      </EditModal>
    </Box>
  );
}