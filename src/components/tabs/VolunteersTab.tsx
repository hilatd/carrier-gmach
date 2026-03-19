import { useState } from "react";
import { addDoc, collection, doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import type { Volunteer } from "../../types";
import { useCollection } from "../../hooks/useCollection";
import { useFilterSort } from "../../hooks/useFilterSort";
import { useIntl } from "react-intl";
import { uploadVolunteerImage } from "../../utils/uploadImage";
import ImageUpload from "../ImageUpload";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Link,
  SimpleGrid,
  Text,
  Textarea,
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
  imageUrl: "",
  bio: "",
  isActive: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  deletedAt: null,
};

export default function VolunteersTab() {
  const { formatMessage: t } = useIntl();
  const { data: volunteers, loading } = useCollection<Volunteer>("volunteers");
  const [form, setForm] = useState<Omit<Volunteer, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800");

  const { filtered, search, setSearch } = useFilterSort<Volunteer>(volunteers, {
    searchFields: (v) => [v.name, v.phone, v.email, v.address, v.bio],
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

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadVolunteerImage(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, email: form.email.toLowerCase(), updatedAt: Date.now() };

    if (editId) {
      await updateDoc(doc(db, "volunteers", editId), data);
    } else {
      await addDoc(collection(db, "volunteers"), { ...data, createdAt: Date.now() });
    }

    // keep volunteer_emails lookup in sync
    await setDoc(doc(db, "volunteer_emails", data.email), {
      active: data.isActive,
    });

    setSaving(false);
    onClose();
  };

  const toggleActive = async (v: Volunteer) => {
    const newActive = !v.isActive;
    await updateDoc(doc(db, "volunteers", v.id!), {
      isActive: newActive,
      updatedAt: Date.now(),
    });
    // keep volunteer_emails lookup in sync
    await setDoc(doc(db, "volunteer_emails", v.email.toLowerCase()), {
      active: newActive,
    });
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
          <Box
            key={v.id}
            bg={bg}
            p={5}
            borderRadius="xl"
            boxShadow="md"
            opacity={v.isActive ? 1 : 0.5}
          >
            <HStack spacing={4} mb={3}>
              <Avatar src={v.imageUrl || undefined} name={v.name} size="md" />
              <Box>
                <Text fontWeight="bold" fontSize="lg">
                  {v.name}
                </Text>
                <Badge colorScheme={v.isActive ? "green" : "gray"}>
                  {v.isActive ? "פעילה" : "לא פעילה"}
                </Badge>
              </Box>
            </HStack>
            <Link href={`tel:${v.phone}`} color="brand.500" fontWeight="medium">
              📞 {v.phone}
            </Link>
            <Text>📧 {v.email}</Text>
            {v.bio && (
              <Text fontSize="sm" color="gray.500" mt={2} fontStyle="italic">
                💬 {v.bio}
              </Text>
            )}
            <HStack mt={3} spacing={2}>
              <Button size="xs" variant="outline" onClick={() => openEdit(v)}>
                {t({ id: "common.edit" })}
              </Button>
              <Button
                size="xs"
                variant="outline"
                colorScheme={v.isActive ? "red" : "green"}
                onClick={() => toggleActive(v)}
              >
                {v.isActive ? "השבתה" : "הפעלה"}
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
        title={editId ? t({ id: "volunteer.edit" }) : t({ id: "volunteer.new" })}
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        loading={saving || uploading}
      >
        <VStack spacing={4}>
          {/* Image upload */}
          <ImageUpload
            currentUrl={form.imageUrl}
            onUpload={handleImageUpload}
            uploading={uploading}
          />

          <FormControl>
            <FormLabel>{t({ id: "volunteer.name" })}</FormLabel>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "volunteer.phone" })}</FormLabel>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "volunteer.email" })}</FormLabel>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value.toLocaleLowerCase() })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "volunteer.address" })}</FormLabel>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "volunteer.bio" })}</FormLabel>
            <Textarea
              value={form.bio}
              placeholder={t({ id: "volunteer.bio.placeholder" })}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
            />
          </FormControl>

          <Checkbox
            isChecked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            colorScheme="brand"
          >
            {t({ id: "volunteer.isActive" })}
          </Checkbox>
        </VStack>
      </EditModal>
    </Box>
  );
}
