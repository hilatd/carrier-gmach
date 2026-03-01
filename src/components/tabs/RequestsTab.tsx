import { useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import type { CarrierRequest, RequestStatus } from "../../types";
import { useCollection } from "../../hooks/useCollection";
import type { Client, Volunteer } from "../../types";
import {
  Badge,
  Box,
  Button,
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
} from "@chakra-ui/react";
import EditModal from "../EditModal";
import { useIntl } from "react-intl";

const STATUS_COLORS: Record<RequestStatus, string> = {
  open: "purple",
  pending: "yellow",
  handled: "green",
  closed: "gray",
};

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
};

function buildWhatsAppMessage(request: CarrierRequest, clientName: string): string {
  return encodeURIComponent(
    `🤱 בקשה חדשה בגמ״ח מנשאים!

👤 שם: ${request.clientId}
📞 טלפון: ${clientName}
👶 גיל תינוק: ${request.babyAge}
🎽 סוג מנשא: ${request.carriersRequested}
📝 הערות: ${request.notes || "אין"}

נא לצור קשר בהקדם 💜`
  );
}

export default function RequestsTab() {
  const { formatMessage: t} = useIntl();
  const { data: requests, loading } = useCollection<CarrierRequest>("requests");
  const { data: clients } = useCollection<Client>("clients");
  const { data: volunteers } = useCollection<Volunteer>("volunteers");
  const [form, setForm] = useState<Omit<CarrierRequest, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800");

  const openNew = () => {
    setForm({ ...empty, createdAt: Date.now(), updatedAt: Date.now() });
    setEditId(null);
    onOpen();
  };
  const openEdit = (r: CarrierRequest) => {
    setForm(r);
    setEditId(r.id!);
    onOpen();
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, updatedAt: Date.now() };
    if (editId) await updateDoc(doc(db, "requests", editId), data);
    else await addDoc(collection(db, "requests"), { ...data, createdAt: Date.now() });
    setSaving(false);
    onClose();
  };

  const markHandled = async (request: CarrierRequest) => {
    if (!request.id) return;
    await updateDoc(doc(db, "requests", request.id), { status: "handled" });
  };

  const clientName = (id: string) => clients.find((c) => c.id === id)?.name ?? id;
  const volunteerName = (id: string) => volunteers.find((v) => v.id === id)?.name ?? id;
  const volunteerPhone = (id: string) => volunteers.find((v) => v.id === id)?.phone ?? id;
  const openWhatsApp = (request: CarrierRequest) => {
    const msg = buildWhatsAppMessage(request, clientName(request.clientId));
    window.open(`https://wa.me/${volunteerPhone(request.handledBy)}?text=${msg}`, "_blank");
  };
  if (loading) return null;

  return (
    <Box>
      <Button mb={5} onClick={openNew}>
        + בקשה חדשה
      </Button>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
        {requests.map((r) => (
          <Box
            key={r.id}
            bg={bg}
            p={5}
            borderRadius="xl"
            boxShadow="md"
            borderRightWidth={4}
            borderRightColor={`${STATUS_COLORS[r.status]}.400`}
          >
            <Text fontWeight="bold">{clientName(r.clientId)}</Text>
            <Badge colorScheme={STATUS_COLORS[r.status]} mb={2}>
              {r.status}
            </Badge>
            <Text>
              👶 {r.babyAge} / {r.babyWeight}
            </Text>
            <Text>🎽 {r.carriersRequested}</Text>
            {r.handledBy && <Text>👤 {volunteerName(r.handledBy)}</Text>}
            {r.notes && (
              <Text fontSize="sm" color="gray.500">
                📝 {r.notes}
              </Text>
            )}
            <HStack>
              <Button
                size="sm"
                colorScheme="whatsapp"
                onClick={() => openWhatsApp(r)}
                leftIcon={<span>💬</span>}
              >
                {t({id: "common.whatsapp"})}
              </Button>
              {r.status === "open" && (
                <Button size="sm" onClick={() => markHandled(r)}>
                 {t({id: "requests.handeld"})}
                </Button>
              )}
            </HStack>
            <Button size="xs" mt={3} variant="outline" onClick={() => openEdit(r)}>
              {t({id: "common.edit"})}
            </Button>
          </Box>
        ))}
      </SimpleGrid>

      <EditModal
        title={editId ? "עריכת בקשה" : "בקשה חדשה"}
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        loading={saving}
      >
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>משאילה / Client</FormLabel>
            <Select
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            >
              <option value="">בחר משאילה</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>סטטוס / Status</FormLabel>
            <Select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as RequestStatus })}
            >
              {(["open", "pending", "handled", "waiting_list", "closed"] as RequestStatus[]).map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                )
              )}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>גיל תינוק / Baby Age</FormLabel>
            <Input
              value={form.babyAge}
              onChange={(e) => setForm({ ...form, babyAge: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>משקל תינוק / Baby Weight</FormLabel>
            <Input
              value={form.babyWeight}
              onChange={(e) => setForm({ ...form, babyWeight: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>ניסיון / Experience</FormLabel>
            <Input
              value={form.carriersExperience}
              onChange={(e) => setForm({ ...form, carriersExperience: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>מנשא מבוקש / Requested</FormLabel>
            <Input
              value={form.carriersRequested}
              onChange={(e) => setForm({ ...form, carriersRequested: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>מקור / Source</FormLabel>
            <Input
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>מטופל ע״י / Handled By</FormLabel>
            <Select
              value={form.handledBy}
              onChange={(e) => setForm({ ...form, handledBy: e.target.value })}
            >
              <option value="">בחר מתנדב</option>
              {volunteers.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>הערות / Notes</FormLabel>
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
