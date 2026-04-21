import { useState, useMemo } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import type { Action, ActionStatus, Carrier, Client, Volunteer } from "../../types";
import { useCollection } from "../../hooks/useCollection";
import { useFilterSort } from "../../hooks/useFilterSort";
import { ACTION_STATUSES, ACTION_STATUS_COLORS } from "../../utils/actionOptions";
import { useIntl, FormattedMessage } from "react-intl";
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  VStack,
  Link,
} from "@chakra-ui/react";
import EditModal from "../EditModal";
import SearchBar from "../search/SearchBar";
import FilterDrawer from "../search/FilterDrawer";
import FilterSelect from "../search/FilterSelect";
import SortControl from "../search/SortControl";
import ResultsCount from "../search/ResultsCount";
import SearchableSelect from "../search/SearchableSelect";
import { useLendingCarriers } from "../../hooks/useLendingCarriers";

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
  dateReturned: 0,
  dateTaken: Date.now(),
  returnedTo: "",
  paid: false,
  notes: "",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  OriginalDateReturn: 0,
  additionalFee: 0,
  totalFee: 0,
  deletedAt: null,
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
  const [carrierConflict, setCarrierConflict] = useState(false);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800");
  const showMoreDetails = (status: ActionStatus) => status === "lending" || status === "returned";
  const returnDateForStatus: Partial<Record<ActionStatus, () => number>> = {
    lending: defaultReturnDate,
    returned: Date.now,
  };
  const lendingCarrierIds = useLendingCarriers(actions, editId);
  const clientName = (id: string) => clients.find((c) => c.id === id)?.name ?? "";
  const clientPhone = (id: string) => clients.find((v) => v.id === id)?.phone ?? "";

  const volunteerName = (id: string) => volunteers.find((v) => v.id === id)?.name ?? "";
  const carrierLabel = (id: string) => {
    const c = carriers.find((c) => c.id === id);
    return c
      ? `${t({ id: `carrier.type.${c.type}` })}: ${c.brand} - ${c.model || ""}  (${c.color})`
      : "";
  };

  const uniqueClients = useMemo(
    () => clients.map((c) => ({ label: c.name, value: c.id! })),
    [clients]
  );

  const {
    filtered,
    search,
    setSearch,
    sortOrder,
    setSortOrder,
    pendingFilters,
    setPendingFilters,
    activeFilterCount,
    applyFilters,
    resetFilters,
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
      { key: "status", match: (a, v) => a.status === v },
      { key: "clientId", match: (a, v) => a.clientId === v },
      { key: "paid", match: (a, v) => String(a.paid) === v },
      { key: "takenFrom", match: (a, v) => a.takenFrom === v },
    ],
  });

  const openNew = () => {
    setForm({
      ...empty,
      dateReturned: 0,
      dateTaken: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setEditId(null);
    onEditOpen();
  };

  const openEdit = (a: Action) => {
    setForm(a);
    setEditId(a.id!);
    onEditOpen();
  };

  const handleSave = async () => {
    if (form.status === "lending" && lendingCarrierIds.has(form.carrierId)) {
      setCarrierConflict(true);
      return;
    }
    setCarrierConflict(false);
    setSaving(true);
    const data = { ...form, updatedAt: Date.now() };
    if (editId) {
      await updateDoc(doc(db, "actions", editId), data);
      const c = carriers.find((c) => c.id === data.carrierId);
      if (data?.returnedTo !== c?.volunteerId) {
        await updateDoc(doc(db, "carriers", data.carrierId), {
          volunteerId: data.returnedTo,
          updatedAt: Date.now(),
        });
      }
    } else await addDoc(collection(db, "actions"), { ...data, createdAt: Date.now() });

    setSaving(false);
    onEditClose();
  };

  const openWhatsApp = (action: Action) => {
    window.open(`https://wa.me/${clientPhone(action.clientId)}`, "_blank");
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
            onClick={() => openEdit(a)}
            key={a.id}
            bg={bg}
            p={5}
            borderRadius="xl"
            boxShadow="md"
            borderRightWidth={4}
            borderRightColor={`${ACTION_STATUS_COLORS[a.status]}.400`}
          >
            <HStack justify="space-between">
              <Text fontWeight="bold" fontSize="lg">
                {clientName(a.clientId)}
              </Text>
              <Link href={`tel:${clientPhone(a.clientId)}`} color="brand.500" fontWeight="medium">
                📞 {clientPhone(a.clientId)}
              </Link>
              <Button size="xs" mt={3} variant="outline" onClick={() => openEdit(a)}>
                {t({ id: "common.edit" })}
              </Button>
            </HStack>
            <Badge colorScheme={ACTION_STATUS_COLORS[a.status]} mb={2}>
              {t({ id: `action.status.${a.status}` })}
            </Badge>
            <Text>🎽 {carrierLabel(a.carrierId)}</Text>
            {showMoreDetails(a.status) && (
              <>
                <Text>
                  📅{" "}
                  <FormattedMessage
                    id="action.startDate"
                    values={{
                      date: formatDate(a.dateTaken, {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }),
                    }}
                  />
                </Text>

                <Text>
                  📅{" "}
                  <FormattedMessage
                    id="action.returnDate"
                    values={{
                      date: formatDate(a.dateReturned, {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }),
                    }}
                  />
                </Text>

                <Text>
                  👤{" "}
                  <FormattedMessage
                    id="action.takenFromLabel"
                    values={{ name: volunteerName(a.takenFrom) }}
                  />
                </Text>

                <Badge colorScheme={a.paid ? "green" : "red"}>
                  {t({ id: a.paid ? "common.paid" : "common.unpaid" })}
                </Badge>
              </>
            )}
            {a.notes && (
              <Text fontSize="sm" color="gray.500" mt={1}>
                📝 {a.notes}
              </Text>
            )}
            <Button size="sm" onClick={() => openWhatsApp(a)} leftIcon={<span>💬</span>}>
              {t({ id: "common.whatsapp" })}
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
        onApply={() => {
          applyFilters();
          onFilterClose();
        }}
        onReset={() => {
          resetFilters();
          onFilterClose();
        }}
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
            { label: t({ id: "common.paid" }), value: "true" },
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
          {/* replace the client FormControl */}
          <SearchableSelect
            label={t({ id: "action.client" })}
            value={form.clientId}
            onChange={(v) => setForm({ ...form, clientId: v })}
            placeholder={t({ id: "action.select.client" })}
            options={clients.map((c) => ({ label: c.name, value: c.id! }))}
          />
          <FormControl>
            <FormLabel>{t({ id: "action.status" })}</FormLabel>
            <Select
              value={form.status}
              onChange={(e) => {
                const newStatus = e.target.value as ActionStatus;
                setForm({
                  ...form,
                  status: newStatus,
                  // auto-set return date when switching to lending, clear otherwise
                  dateReturned: returnDateForStatus[newStatus]?.() ?? 0,
                });
              }}
            >
              {ACTION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t({ id: `action.status.${s}` })}
                </option>
              ))}
            </Select>
          </FormControl>
          {/* replace the carrier FormControl */}
          <SearchableSelect
            label={t({ id: "action.carrier" })}
            value={form.carrierId}
            onChange={(v) => {
              setForm({ ...form, carrierId: v });
              setCarrierConflict(false);
            }}
            placeholder={t({ id: "action.select.carrier" })}
            options={carriers.map((c) => ({
              value: c.id!,
              label: `${t({ id: `carrier.type.${c.type}` })}: ${c.brand} - ${c.model || ""} (${c.color})`,
              disabled: form.status === "lending" && lendingCarrierIds.has(c.id!),
            }))}
          />
          {carrierConflict && (
            <Alert status="error" borderRadius="lg" fontSize="sm">
              <AlertIcon />
              {t({ id: "action.error.carrierInUse" })}
            </Alert>
          )}

          <FormControl>
            <FormLabel>{t({ id: "action.takenFrom" })}</FormLabel>
            <Select
              value={form.takenFrom}
              onChange={(e) => setForm({ ...form, takenFrom: e.target.value })}
            >
              <option value="">{t({ id: "action.select.volunteer" })}</option>
              {volunteers.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
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
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>{t({ id: "action.returnedTo" })}</FormLabel>
            <Select
              value={form.returnedTo}
              onChange={(e) => setForm({ ...form, returnedTo: e.target.value })}
            >
              <option value="">{t({ id: "action.select.volunteer" })}</option>
              {volunteers.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>{t({ id: "action.dateTaken" })}</FormLabel>
            <Input
              type="date"
              value={
                form?.dateTaken ? new Date(form?.dateTaken).toISOString().split("T")[0] : undefined
              }
              onChange={(e) => setForm({ ...form, dateTaken: new Date(e.target.value).getTime() })}
            />
          </FormControl>
          {showMoreDetails(form.status) && (
            <FormControl>
              <FormLabel>{t({ id: "action.dateReturned" })}</FormLabel>
              <Input
                type="date"
                value={
                  form.dateReturned ? new Date(form.dateReturned).toISOString().split("T")[0] : ""
                }
                onChange={(e) =>
                  setForm({ ...form, dateReturned: new Date(e.target.value).getTime() })
                }
              />
            </FormControl>
          )}

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
