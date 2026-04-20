import { useState, useMemo } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import type { CarrierRequest, RequestStatus } from "../../types";
import { useCollection } from "../../hooks/useCollection";
import type { Client, Volunteer } from "../../types";
import { useFilterSort } from "../../hooks/useFilterSort";
import { useCurrentVolunteer } from "../../hooks/useCurrentVolunteer";
import { useIntl } from "react-intl";
import {
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

const STATUS_COLORS: Record<RequestStatus, string> = {
  open: "purple",
  pending: "yellow",
  handled: "green",
  closed: "gray",
};

const REQUEST_STATUSES: RequestStatus[] = ["open", "pending", "handled", "closed"];

const empty: Omit<CarrierRequest, "id"> = {
  clientId: "",
  status: "open",
  notes: "",
  babyAge: "",
  babyWeight: "",
  carriersExperience: "",
  carriersRequested: "",
  source: "",
  handledBy: "",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  deletedAt: null,
};

function buildWhatsAppMessage(volunteer: Volunteer, clientName: string): string {
  return encodeURIComponent(
    `היי ${clientName}
נעים מאוד, אני ${volunteer.name},
מתנדבת מגמ"ח המנשאים הקהילתי - ירושלים 🦘
עברתי עכשיו על הפנייה שהשארת לנו.
זה עדיין רלוונטי לכם?
אם כן, אני כאן כדי לייעץ, לענות על שאלות ולהפנות אותך לתיאום איסוף🤍`
  );
}

export default function RequestsTab() {
  const { formatMessage: t } = useIntl();
  const currentVolunteer = useCurrentVolunteer();
  const { data: requests, loading } = useCollection<CarrierRequest>("requests");
  const { data: clients } = useCollection<Client>("clients");
  const { data: volunteers } = useCollection<Volunteer>("volunteers");
  const [form, setForm] = useState<Omit<CarrierRequest, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [unhandledOnly, setUnhandledOnly] = useState(true); // ← default checked
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800");

  const clientName = (id: string) => clients.find((c) => c.id === id)?.name ?? "";
  const volunteerName = (id: string) => volunteers.find((v) => v.id === id)?.name ?? "";
  const clientPhone = (id: string) => clients.find((v) => v.id === id)?.phone ?? "";

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
  } = useFilterSort<CarrierRequest>(requests, {
    searchFields: (r) => [
      clientName(r.clientId),
      volunteerName(r.handledBy),
      r.babyAge,
      r.babyWeight,
      r.carriersRequested,
      r.carriersExperience,
      r.source,
      r.notes,
      t({ id: `status.${r.status}` }),
    ],
    filters: [
      { key: "status", match: (r, v) => r.status === v },
      { key: "clientId", match: (r, v) => r.clientId === v },
      { key: "handledBy", match: (r, v) => r.handledBy === v },
    ],
  });

  // apply unhandled checkbox on top of filter/search results
  const displayed = useMemo(
    () =>
      unhandledOnly
        ? filtered.filter((r) => r.status !== "handled" && r.status !== "closed")
        : filtered,
    [filtered, unhandledOnly]
  );

  const openNew = () => {
    setForm({ ...empty, createdAt: Date.now(), updatedAt: Date.now() });
    setEditId(null);
    onEditOpen();
  };

  const openEdit = (r: CarrierRequest) => {
    setForm(r);
    setEditId(r.id!);
    onEditOpen();
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, updatedAt: Date.now() };
    if (editId) await updateDoc(doc(db, "requests", editId), data);
    else await addDoc(collection(db, "requests"), { ...data, createdAt: Date.now() });
    setSaving(false);
    onEditClose();
  };

  /*  const markHandled = async (request: CarrierRequest) => {
    if (!request.id) return;
    await updateDoc(doc(db, "requests", request.id), { status: "handled" });
  }; */

  const openWhatsApp = (request: CarrierRequest) => {
    if (!currentVolunteer) return;
    const msg = buildWhatsAppMessage(currentVolunteer, clientName(request.clientId));
    window.open(`https://wa.me/${clientPhone(request.clientId)}?text=${msg}`, "_blank");
  };

  if (loading) return null;

  return (
    <Box>
      {/* Top bar */}
      <HStack mb={4} spacing={3} wrap="wrap">
        <Button onClick={openNew}>+ {t({ id: "request.new" })}</Button>
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

      {/* Unhandled checkbox */}
      <Checkbox
        mb={4}
        isChecked={unhandledOnly}
        onChange={(e) => setUnhandledOnly(e.target.checked)}
        colorScheme="brand"
        fontWeight="medium"
      >
        {t({ id: "request.showUnhandled" })}
      </Checkbox>

      <ResultsCount count={displayed.length} />

      {/* Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
        {displayed.map((r) => (
          <Box
            key={r.id}
            bg={bg}
            p={5}
            borderRadius="xl"
            boxShadow="md"
            borderRightWidth={4}
            borderRightColor={`${STATUS_COLORS[r.status]}.400`}
            onClick={() => openEdit(r)}
          >
            <HStack justify="space-between" mb={1}>
              <HStack justify="flex-start">
                <Text fontWeight="bold">{clientName(r.clientId)}</Text>
                <Link href={`tel:${clientPhone(r.clientId)}`} color="brand.500" fontWeight="medium">
                  📞 {clientPhone(r.clientId)}
                </Link>
              </HStack>
              <Text fontSize="xs" color="gray.400">
                {new Date(r.createdAt).toLocaleDateString("he-IL")}
              </Text>
            </HStack>

            <Badge colorScheme={STATUS_COLORS[r.status]} mb={2}>
              {t({ id: `status.${r.status}` })}
            </Badge>

            <Text>
              👶{t({ id: "request.babyAge" })} {r.babyAge}
            </Text>
            <Text>
              🍼 {t({ id: "request.babyWeight" })} {r.babyWeight}
            </Text>
            <Text>🎽 {r.carriersRequested}</Text>
            <Text>🎒 {r.carriersExperience}</Text>
            {r.handledBy && <Text>👤 {volunteerName(r.handledBy)}</Text>}
            {r.notes && (
              <Text fontSize="sm" color="gray.500">
                📝 {r.notes}
              </Text>
            )}

            <HStack mt={3} wrap="wrap" spacing={2}>
              <Button size="sm" onClick={() => openWhatsApp(r)} leftIcon={<span>💬</span>}>
                {t({ id: "common.whatsapp" })}
              </Button>
              {/*{(r.status === "open" || r.status === "pending") && (
                <Button size="sm" onClick={() => markHandled(r)}>
                  {t({ id: "requests.handled" })}
                </Button>
              )}*/}
              <Button size="xs" variant="outline" onClick={() => openEdit(r)}>
                {t({ id: "common.edit" })}
              </Button>
            </HStack>
          </Box>
        ))}
      </SimpleGrid>

      {displayed.length === 0 && (
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
          label={t({ id: "request.status" })}
          value={pendingFilters["status"] ?? ""}
          onChange={(v) => setPendingFilters({ ...pendingFilters, status: v })}
          options={REQUEST_STATUSES.map((s) => ({
            value: s,
            label: t({ id: `status.${s}` }),
          }))}
        />

        <FilterSelect
          label={t({ id: "request.client" })}
          value={pendingFilters["clientId"] ?? ""}
          onChange={(v) => setPendingFilters({ ...pendingFilters, clientId: v })}
          options={uniqueClients}
        />

        <FilterSelect
          label={t({ id: "request.handledBy" })}
          value={pendingFilters["handledBy"] ?? ""}
          onChange={(v) => setPendingFilters({ ...pendingFilters, handledBy: v })}
          options={volunteers.map((v) => ({ label: v.name, value: v.id! }))}
        />
      </FilterDrawer>

      {/* Edit Modal */}
      <EditModal
        title={editId ? t({ id: "request.edit" }) : t({ id: "request.new" })}
        isOpen={isEditOpen}
        onClose={onEditClose}
        onSave={handleSave}
        loading={saving}
      >
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>{t({ id: "request.client" })}</FormLabel>
            <Select
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            >
              <option value="">{t({ id: "request.select.client" })}</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "request.status" })}</FormLabel>
            <Select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as RequestStatus })}
            >
              {REQUEST_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t({ id: `status.${s}` })}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "request.babyAge" })}</FormLabel>
            <Input
              value={form.babyAge}
              onChange={(e) => setForm({ ...form, babyAge: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "request.babyWeight" })}</FormLabel>
            <Input
              value={form.babyWeight}
              onChange={(e) => setForm({ ...form, babyWeight: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "request.experience" })}</FormLabel>
            <Input
              value={form.carriersExperience}
              onChange={(e) => setForm({ ...form, carriersExperience: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "request.requested" })}</FormLabel>
            <Input
              value={form.carriersRequested}
              onChange={(e) => setForm({ ...form, carriersRequested: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "request.source" })}</FormLabel>
            <Input
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>{t({ id: "request.handledBy" })}</FormLabel>
            <Select
              value={form.handledBy}
              onChange={(e) => setForm({ ...form, handledBy: e.target.value })}
            >
              <option value="">{t({ id: "request.select.volunteer" })}</option>
              {volunteers.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>{t({ id: "request.notes" })}</FormLabel>
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
