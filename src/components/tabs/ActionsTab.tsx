import { useState, useMemo } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import type { Action, ActionStatus, Carrier, Client, Volunteer } from "../../types";
import { useCollection } from "../../hooks/useCollection";
import { useFilterSort } from "../../hooks/useFilterSort";
import { ACTION_STATUSES, ACTION_STATUS_COLORS } from "../../utils/actionOptions";
import { useIntl, FormattedMessage } from "react-intl";
import {
  Badge, Box, Button, Checkbox, FormControl, FormLabel,
  HStack, Input, Select, SimpleGrid, Text, Textarea,
  useColorModeValue, useDisclosure, VStack,
} from "@chakra-ui/react";
import EditModal from "../EditModal";
import SearchBar from "../search/SearchBar";
import FilterDrawer from "../search/FilterDrawer";
import FilterSelect from "../search/FilterSelect";
import SortControl from "../search/SortControl";
import ResultsCount from "../search/ResultsCount";

const defaultReturnDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.getTime();
};
const empty: Omit<Action, "id"> = {
  clientId: "",
  carrierId: "",
  takenFrom: "",
  lastContactBy: "",
  status: "open",
  dateReturned: defaultReturnDate(),
  paid: false,
  notes: "",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  OriginalDateReturn: 0,
  additionalFee: 0,
  totalFee: 0,
};

export default function ActionsTab() {
  const { formatMessage: t, formatDate } = useIntl();
  const { data: actions, loading } = useCollection<Action>("actions");
  const { data: clients } = useCollection<Client>("clients");
  const { data: volunteers } = useCollection<Volunteer>("volunteers");
  const { data: carriers } = useCollection<Carrier>("carriers");
  const [form, setForm] = useState<Omit<Action, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800");

  const clientName  = (id: string) => clients.find((c) => c.id === id)?.name ?? "";
  const volunteerName = (id: string) => volunteers.find((v) => v.id === id)?.name ?? "";
  const carrierLabel = (id: string) => {
    const c = carriers.find((c) => c.id === id);
    return c ? `${c.brand} — ${t({ id: `carrier.type.${c.type}` })} (${c.color})` : "";
  };

  const uniqueClients = useMemo(
    () => clients.map((c) => ({ label: c.name, value: c.id! })),
    [clients]
  );

  const {
    filtered, search, setSearch,
    sortOrder, setSortOrder,
    pendingFilters, setPendingFilters,
    activeFilterCount, applyFilters, resetFilters,
  } = useFilterSort<Action>(actions, {
    searchFields: (a) => [
      clientName(a.clientId),
      carrierLabel(a.carrierId),
      volunteerName(a.takenFrom),
      volunteerName(a.lastContactBy),
      t({ id: `action.status.${a.status}` }),
      a.notes,
    ],
    filters: [
      { key: "status",   match: (a, v) => a.status === v },
      { key: "clientId", match: (a, v) => a.clientId === v },
      { key: "paid",     match: (a, v) => String(a.paid) === v },
      { key: "takenFrom", match: (a, v) => a.takenFrom === v },
    ],
  });

  const openNew = () => {
    setForm({ ...empty, createdAt: Date.now(), updatedAt: Date.now() });
    setEditId(null);
    onEditOpen();
  };

  const openEdit = (a: Action) => {
    setForm(a);
    setEditId(a.id!);
    onEditOpen();
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, updatedAt: Date.now() };
    if (editId) await updateDoc(doc(db, "actions", editId), data);
    else await addDoc(collection(db, "actions"), { ...data, createdAt: Date.now() });
    setSaving(false);
    onEditClose();
  };

  if (loading) return null;

  return (
    <Box>
      {/* Top bar */}
      <HStack mb={5} spacing={3} wrap="wrap">
        <Button onClick={openNew}>+ {t({ id: "action.new" })}</Button>
        <SearchBar value={search} onChange={setSearch} />
        <Button
          onClick={onFilterOpen}
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
        {filtered.map((a) => (
          <Box
            key={a.id}
            bg={bg}
            p={5}
            borderRadius="xl"
            boxShadow="md"
            borderRightWidth={4}
            borderRightColor={`${ACTION_STATUS_COLORS[a.status]}.400`}
          >
            <Text fontWeight="bold" fontSize="lg">{clientName(a.clientId)}</Text>

            <Badge colorScheme={ACTION_STATUS_COLORS[a.status]} mb={2}>
              {t({ id: `action.status.${a.status}` })}
            </Badge>

            <Text>🎽 {carrierLabel(a.carrierId)}</Text>

            <Text>
              📅 <FormattedMessage
                id="action.returnDate"
                values={{ date: formatDate(a.dateReturned, { day: "2-digit", month: "2-digit", year: "numeric" }) }}
              />
            </Text>

            <Text>
              👤 <FormattedMessage
                id="action.takenFromLabel"
                values={{ name: volunteerName(a.takenFrom) }}
              />
            </Text>

            <Badge colorScheme={a.paid ? "green" : "red"}>
              {t({ id: a.paid ? "common.paid" : "common.unpaid" })}
            </Badge>

            {a.notes && (
              <Text fontSize="sm" color="gray.500" mt={1}>📝 {a.notes}</Text>
            )}

            <Button size="xs" mt={3} variant="outline" onClick={() => openEdit(a)}>
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
          label={t({ id: "action.status" })}
          value={pendingFilters["status"] ?? ""}
          onChange={(v) => setPendingFilters({ ...pendingFilters, status: v })}
          options={ACTION_STATUSES.map((s) => ({
            value: s,
            label: t({ id: `action.status.${s}` }),
          }))}
        />

        <FilterSelect
          label={t({ id: "action.client" })}
          value={pendingFilters["clientId"] ?? ""}
          onChange={(v) => setPendingFilters({ ...pendingFilters, clientId: v })}
          options={uniqueClients}
        />

        <FilterSelect
          label={t({ id: "action.takenFrom" })}
          value={pendingFilters["takenFrom"] ?? ""}
          onChange={(v) => setPendingFilters({ ...pendingFilters, takenFrom: v })}
          options={volunteers.map((v) => ({ label: v.name, value: v.id! }))}
        />

        <FilterSelect
          label={t({ id: "action.paid" })}
          value={pendingFilters["paid"] ?? ""}
          onChange={(v) => setPendingFilters({ ...pendingFilters, paid: v })}
          options={[
            { label: t({ id: "common.paid" }),   value: "true" },
            { label: t({ id: "common.unpaid" }), value: "false" },
          ]}
        />
      </FilterDrawer>

      {/* Edit Modal */}
      <EditModal
        title={editId ? t({ id: "action.edit" }) : t({ id: "action.new" })}
        isOpen={isEditOpen}
        onClose={onEditClose}
        onSave={handleSave}
        loading={saving}
      >
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>{t({ id: "action.client" })}</FormLabel>
            <Select
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            >
              <option value="">{t({ id: "action.select.client" })}</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "action.carrier" })}</FormLabel>
            <Select
              value={form.carrierId}
              onChange={(e) => setForm({ ...form, carrierId: e.target.value })}
            >
              <option value="">{t({ id: "action.select.carrier" })}</option>
              {carriers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.brand} — {t({ id: `carrier.type.${c.type}` })} ({c.color})
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "action.status" })}</FormLabel>
            <Select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ActionStatus })}
            >
              {ACTION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t({ id: `action.status.${s}` })}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "action.takenFrom" })}</FormLabel>
            <Select
              value={form.takenFrom}
              onChange={(e) => setForm({ ...form, takenFrom: e.target.value })}
            >
              <option value="">{t({ id: "action.select.volunteer" })}</option>
              {volunteers.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "action.lastContactBy" })}</FormLabel>
            <Select
              value={form.lastContactBy}
              onChange={(e) => setForm({ ...form, lastContactBy: e.target.value })}
            >
              <option value="">{t({ id: "action.select.volunteer" })}</option>
              {volunteers.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "action.dateReturned" })}</FormLabel>
            <Input
              type="date"
              value={new Date(form.dateReturned).toISOString().split("T")[0]}
              onChange={(e) =>
                setForm({ ...form, dateReturned: new Date(e.target.value).getTime() })
              }
            />
          </FormControl>

          <Checkbox
            isChecked={form.paid}
            onChange={(e) => setForm({ ...form, paid: e.target.checked })}
          >
            {t({ id: "action.paid" })}
          </Checkbox>

          <FormControl>
            <FormLabel>{t({ id: "action.notes" })}</FormLabel>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </FormControl>
        </VStack>
      </EditModal>
    </Box>
  );
}