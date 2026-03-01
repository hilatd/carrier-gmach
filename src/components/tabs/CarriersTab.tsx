import { useState, useMemo } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import type { Carrier, Volunteer } from "../../types";
import { useCollection } from "../../hooks/useCollection";
import { useFilterSort } from "../../hooks/useFilterSort";
import { useIntl } from "react-intl";
import {
  Badge, Box, Button, FormControl, FormLabel,
  HStack, Input, Select, SimpleGrid, Text,
  useColorModeValue, useDisclosure, VStack,
} from "@chakra-ui/react";
import EditModal from "../EditModal";
import SearchBar from "../search/SearchBar";
import FilterDrawer from "../search/FilterDrawer";
import FilterSelect from "../search/FilterSelect";
import SortControl from "../search/SortControl";
import ResultsCount from "../search/ResultsCount";

const empty: Omit<Carrier, "id"> = {
  type: "",
  brand: "",
  color: "",
  state: "",
  volunteerId: "",
  notes: "",
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export default function CarriersTab() {
  const { formatMessage: t } = useIntl();
  const { data: carriers, loading } = useCollection<Carrier>("carriers");
  const { data: volunteers } = useCollection<Volunteer>("volunteers");
  const [form, setForm] = useState<Omit<Carrier, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800");

  const volunteerName = (id: string) =>
    volunteers.find((v) => v.id === id)?.name ?? "";

  // unique brands from data
  const uniqueBrands = useMemo(
    () => [...new Set(carriers.map((c) => c.brand).filter(Boolean))],
    [carriers]
  );

  const {
    filtered, search, setSearch,
    sortOrder, setSortOrder,
    pendingFilters, setPendingFilters,
    activeFilterCount, applyFilters, resetFilters,
  } = useFilterSort<Carrier>(carriers, {
    searchFields: (c) => [c.type, c.brand, c.color, c.state, volunteerName(c.volunteerId ?? "")],
    filters: [
      { key: "state",       match: (c, v) => c.state === v },
      { key: "type",        match: (c, v) => c.type === v },
      { key: "brand",       match: (c, v) => c.brand === v },
      { key: "volunteerId", match: (c, v) => c.volunteerId === v },
    ],
  });

  const openNew = () => {
    setForm({ ...empty, createdAt: Date.now(), updatedAt: Date.now() });
    setEditId(null);
    onEditOpen();
  };

  const openEdit = (c: Carrier) => {
    setForm(c);
    setEditId(c.id!);
    onEditOpen();
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, updatedAt: Date.now() };
    if (editId) await updateDoc(doc(db, "carriers", editId), data);
    else await addDoc(collection(db, "carriers"), { ...data, createdAt: Date.now() });
    setSaving(false);
    onEditClose();
  };

  const stateColor = (s: string) =>
    ({ תקין: "green", פגום: "red", בתיקון: "orange" }[s] ?? "gray");

  if (loading) return null;

  return (
    <Box>
      {/* Top bar */}
      <HStack mb={5} spacing={3} wrap="wrap">
        <Button onClick={openNew}>+ {t({ id: "common.add" })}</Button>
        <SearchBar value={search} onChange={setSearch} />
        <Button
          onClick={() => { onFilterOpen(); }}
          variant={activeFilterCount > 0 ? "solid" : "outline"}
          colorScheme={activeFilterCount > 0 ? "brand" : "gray"}
        >
          🔽 {t({ id: "common.filter" })}
          {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </Button>
      </HStack>

      <ResultsCount count={filtered.length} />

      {/* Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
        {filtered.map((c) => (
          <Box key={c.id} bg={bg} p={5} borderRadius="xl" boxShadow="md">
            <Text fontWeight="bold" fontSize="lg">{c.brand} — {c.type}</Text>
            <Text>🎨 {c.color}</Text>
            {c.volunteerId && <Text>👤 {volunteerName(c.volunteerId)}</Text>}
            <Badge mt={2} colorScheme={stateColor(c.state)}>{c.state}</Badge>
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

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={onFilterClose}
        onApply={() => { applyFilters(); onFilterClose(); }}
        onReset={() => { resetFilters(); onFilterClose(); }}
        activeFilterCount={activeFilterCount}
      >
        <SortControl value={sortOrder} onChange={setSortOrder} />
        <FilterSelect
          label={t({ id: "carrier.state" })}
          value={pendingFilters["state"] ?? ""}
          onChange={(v) => setPendingFilters({ ...pendingFilters, state: v })}
          options={[
            { label: "תקין", value: "תקין" },
            { label: "פגום", value: "פגום" },
            { label: "בתיקון", value: "בתיקון" },
          ]}
        />
        <FilterSelect
          label={t({ id: "carrier.type" })}
          value={pendingFilters["type"] ?? ""}
          onChange={(v) => setPendingFilters({ ...pendingFilters, type: v })}
          options={[
            { label: "Soft Structured (SSC)", value: "Soft Structured (SSC)" },
            { label: "Wrap", value: "Wrap" },
            { label: "Ring Sling", value: "Ring Sling" },
            { label: "Mei Dai", value: "Mei Dai" },
          ]}
        />
        <FilterSelect
          label={t({ id: "carrier.brand" })}
          value={pendingFilters["brand"] ?? ""}
          onChange={(v) => setPendingFilters({ ...pendingFilters, brand: v })}
          options={uniqueBrands.map((b) => ({ label: b, value: b }))}
        />
        <FilterSelect
          label={t({ id: "carrier.volunteer" })}
          value={pendingFilters["volunteerId"] ?? ""}
          onChange={(v) => setPendingFilters({ ...pendingFilters, volunteerId: v })}
          options={volunteers.map((v) => ({ label: v.name, value: v.id! }))}
        />
      </FilterDrawer>

      {/* Edit Modal */}
      <EditModal
        title={editId ? t({ id: "common.edit" }) : `+ ${t({ id: "common.add" })}`}
        isOpen={isEditOpen}
        onClose={onEditClose}
        onSave={handleSave}
        loading={saving}
      >
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>{t({ id: "carrier.type" })}</FormLabel>
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="">בחר</option>
              <option>Soft Structured (SSC)</option>
              <option>Wrap</option>
              <option>Ring Sling</option>
              <option>Mei Dai</option>
              <option>ארוג ארוך</option>
              <option>ילקוט</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>{t({ id: "carrier.brand" })}</FormLabel>
            <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          </FormControl>
          <FormControl>
            <FormLabel>🎨 {t({ id: "carrier.color" })}</FormLabel>
            <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
          </FormControl>
          <FormControl>
            <FormLabel>{t({ id: "carrier.state" })}</FormLabel>
            <Select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
              <option value="">בחר</option>
              <option>תקין</option>
              <option>פגום</option>
              <option>בתיקון</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>{t({ id: "carrier.volunteer" })}</FormLabel>
            <Select value={form.volunteerId} onChange={(e) => setForm({ ...form, volunteerId: e.target.value })}>
              <option value="">בחרי מתנדבת</option>
              {volunteers.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </Select>
          </FormControl>
        </VStack>
      </EditModal>
    </Box>
  );
}
