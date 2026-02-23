import { useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import type { Action, ActionStatus, Carrier, Client, Volunteer } from "../../types";
import { useCollection } from "../../hooks/useCollection";
import {
  Badge, Box, Button, Checkbox, FormControl, FormLabel,
  Input, Select, SimpleGrid, Text, Textarea,
  useColorModeValue, useDisclosure, VStack
} from "@chakra-ui/react";
import EditModal from "../EditModal";

const STATUS_COLORS: Record<ActionStatus, string> = {
  open: "purple", lending: "yellow", returned: "green", waiting_list: "orange", closed: "gray"
};

const empty: Omit<Action,"id"> = {
  clientId: "", carrierId: "", takenFrom: "", lastContactBy: "", status: "open",
  dateReturned: Date.now(), paid: false, notes: "",
  createdAt: Date.now(), updatedAt: Date.now(),
  OriginalDateReturn: 0,
  additionalFee: 0,
  totalFee: 0
};

export default function ActionsTab() {
  const { data: actions, loading } = useCollection<Action>("actions");
  const { data: clients } = useCollection<Client>("clients");
  const { data: volunteers } = useCollection<Volunteer>("volunteers");
  const { data: carriers } = useCollection<Carrier>("carriers");
  const [form, setForm] = useState<Omit<Action,"id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800");

  const openNew = () => { setForm({ ...empty, createdAt: Date.now(), updatedAt: Date.now() }); setEditId(null); onOpen(); };
  const openEdit = (a: Action) => { setForm(a); setEditId(a.id!); onOpen(); };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, updatedAt: Date.now() };
    if (editId) await updateDoc(doc(db, "actions", editId), data);
    else await addDoc(collection(db, "actions"), { ...data, createdAt: Date.now() });
    setSaving(false);
    onClose();
  };

  const clientName = (id: string) => clients.find(c => c.id === id)?.name ?? id;
  const volunteerName = (id: string) => volunteers.find(v => v.id === id)?.name ?? id;
  const carrierLabel = (id: string) => { const c = carriers.find(c => c.id === id); return c ? `${c.brand} ${c.type}` : id; };

  if (loading) return null;

  return (
    <Box>
      <Button mb={5} onClick={openNew}>+ השאלה חדשה</Button>
      <SimpleGrid columns={{ base:1, md:2, lg:3 }} spacing={5}>
        {actions.map(a => (
          <Box key={a.id} bg={bg} p={5} borderRadius="xl" boxShadow="md"
            borderRightWidth={4} borderRightColor={`${STATUS_COLORS[a.status]}.400`}>
            <Text fontWeight="bold">{clientName(a.clientId)}</Text>
            <Badge colorScheme={STATUS_COLORS[a.status]} mb={2}>{a.status}</Badge>
            <Text>🎽 {carrierLabel(a.carrierId)}</Text>
            <Text>📅 החזרה: {new Date(a.dateReturned).toLocaleDateString("he-IL")}</Text>
            <Text>👤 נלקח מ: {volunteerName(a.takenFrom)}</Text>
            <Badge colorScheme={a.paid ? "green" : "red"}>{a.paid ? "שולם" : "לא שולם"}</Badge>
            <Button size="xs" mt={3} variant="outline" onClick={() => openEdit(a)}>עריכה</Button>
          </Box>
        ))}
      </SimpleGrid>

      <EditModal title={editId ? "עריכת השאלה" : "השאלה חדשה"} isOpen={isOpen} onClose={onClose} onSave={handleSave} loading={saving}>
        <VStack spacing={4}>
          <FormControl><FormLabel>משאילה / Client</FormLabel>
            <Select value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})}>
              <option value="">בחרי משאילה</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </FormControl>
          <FormControl><FormLabel>מנשא / Carrier</FormLabel>
            <Select value={form.carrierId} onChange={e => setForm({...form, carrierId: e.target.value})}>
              <option value="">בחרי מנשא</option>
              {carriers.map(c => <option key={c.id} value={c.id}>{c.brand} — {c.type} ({c.color})</option>)}
            </Select>
          </FormControl>
          <FormControl><FormLabel>סטטוס / Status</FormLabel>
            <Select value={form.status} onChange={e => setForm({...form, status: e.target.value as ActionStatus})}>
              {(["open","pending","handled","waiting_list","closed"] as ActionStatus[]).map(s =>
                <option key={s} value={s}>{s}</option>)}
            </Select>
          </FormControl>
          <FormControl><FormLabel>נלקח מ / Taken From</FormLabel>
            <Select value={form.takenFrom} onChange={e => setForm({...form, takenFrom: e.target.value})}>
              <option value="">בחרי מתנדבת</option>
              {volunteers.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </Select>
          </FormControl>
          <FormControl><FormLabel>קשר אחרון ע״י / Last Contact By</FormLabel>
            <Select value={form.lastContactBy} onChange={e => setForm({...form, lastContactBy: e.target.value})}>
              <option value="">בחרי מתנדבת</option>
              {volunteers.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </Select>
          </FormControl>
          <FormControl><FormLabel>תאריך החזרה / Return Date</FormLabel>
            <Input type="date" value={new Date(form.dateReturned).toISOString().split("T")[0]}
              onChange={e => setForm({...form, dateReturned: new Date(e.target.value).getTime()})} />
          </FormControl>
          <Checkbox isChecked={form.paid} onChange={e => setForm({...form, paid: e.target.checked})}>
            שולם / Paid
          </Checkbox>
          <FormControl><FormLabel>הערות / Notes</FormLabel>
            <Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          </FormControl>
        </VStack>
      </EditModal>
    </Box>
  );
}