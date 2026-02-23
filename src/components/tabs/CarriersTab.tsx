import { useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import type { Carrier } from "../../types";
import { useCollection } from "../../hooks/useCollection";
import {
  Badge, Box, Button, FormControl, FormLabel, Input,
  Select, SimpleGrid, Text, useColorModeValue, useDisclosure, VStack
} from "@chakra-ui/react";
import EditModal from "../EditModal";

const empty: Omit<Carrier, "id"> = { type:"", brand:"", color:"", state:"", createdAt: Date.now(), updatedAt: Date.now() };

export default function CarriersTab() {
  const { data: carriers, loading } = useCollection<Carrier>("carriers");
  const [form, setForm] = useState<Omit<Carrier,"id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800");

  const openNew = () => { setForm({ ...empty, createdAt: Date.now(), updatedAt: Date.now() }); setEditId(null); onOpen(); };
  const openEdit = (c: Carrier) => { setForm(c); setEditId(c.id!); onOpen(); };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, updatedAt: Date.now() };
    if (editId) await updateDoc(doc(db, "carriers", editId), data);
    else await addDoc(collection(db, "carriers"), { ...data, createdAt: Date.now() });
    setSaving(false);
    onClose();
  };

  const stateColor = (s: string) => ({ "תקין":"green", "פגום":"red", "בתיקון":"orange" }[s] ?? "gray");

  if (loading) return null;

  return (
    <Box>
      <Button mb={5} onClick={openNew}>+ הוסף מנשא</Button>
      <SimpleGrid columns={{ base:1, md:2, lg:3 }} spacing={5}>
        {carriers.map(c => (
          <Box key={c.id} bg={bg} p={5} borderRadius="xl" boxShadow="md">
            <Text fontWeight="bold" fontSize="lg">{c.brand} — {c.type}</Text>
            <Text>🎨 {c.color}</Text>
            <Badge mt={2} colorScheme={stateColor(c.state)}>{c.state}</Badge>
            <Button size="xs" mt={3} variant="outline" onClick={() => openEdit(c)}>עריכה</Button>
          </Box>
        ))}
      </SimpleGrid>

      <EditModal title={editId ? "עריכת מנשא" : "מנשא חדש"} isOpen={isOpen} onClose={onClose} onSave={handleSave} loading={saving}>
        <VStack spacing={4}>
          <FormControl><FormLabel>סוג / Type</FormLabel>
            <Select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="">בחר</option>
              <option>Soft Structured (SSC)</option>
              <option>Wrap</option>
              <option>Ring Sling</option>
              <option>Mei Dai</option>
            </Select>
          </FormControl>
          <FormControl><FormLabel>מותג / Brand</FormLabel>
            <Input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} />
          </FormControl>
          <FormControl><FormLabel>צבע / Color</FormLabel>
            <Input value={form.color} onChange={e => setForm({...form, color: e.target.value})} />
          </FormControl>
          <FormControl><FormLabel>מצב / State</FormLabel>
            <Select value={form.state} onChange={e => setForm({...form, state: e.target.value})}>
              <option value="">בחר</option>
              <option>תקין</option>
              <option>פגום</option>
              <option>בתיקון</option>
            </Select>
          </FormControl>
        </VStack>
      </EditModal>
    </Box>
  );
}