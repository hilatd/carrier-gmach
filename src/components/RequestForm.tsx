import { useState, type SyntheticEvent } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import type { CarrierRequest, Client } from "../types";
import {
  Box, Button, FormControl, FormLabel, Heading, Input,
  Select, Textarea, VStack, Text, useColorModeValue,
  Checkbox
} from "@chakra-ui/react";

export default function RequestForm() {
  const [form, setForm] = useState({ name:"", email:"", phone:"", babyAge:"", carrierType:"", notes:"", carriersExperience: "", babyWeight: "",
      carriersRequested: "",
      source: "", legal: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const bg = useColorModeValue("white", "gray.800");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement >) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function addOrGetClient(client: Client) {
  const colRef = collection(db, "clients");
  const q = query(colRef, where("email", "==", client.email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // Record exists! Return the first matching ID
    const existingDoc = querySnapshot.docs[0];
    return existingDoc.id;
  } else {
    // Record doesn't exist! Add it
    const newDoc = await addDoc(colRef, { client });
    return newDoc.id;
  }
}

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!form.legal) return;
    setLoading(true);
    const client: Client = { address: "", name: form.name, phone: form.phone, email: form.email, createdAt: Date.now(), updatedAt: Date.now()};
    const clientId = await addOrGetClient(client);
    const request: CarrierRequest = {
      ...form, clientId, status: "open", createdAt: Date.now(),
      babyWeight: "",
      carriersRequested: "",
      source: "",
      handledBy: "",
      updatedAt: 0
    };
    await addDoc(collection(db, "requests"), request);
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) return (
    <Text textAlign="center" fontSize="xl" color="brand.500" py={12}>
      ✅ הבקשה נשלחה! מתנדבת תיצור איתך קשר בקרוב 💜
    </Text>
  );

  return (
    <Box as="form" onSubmit={handleSubmit} bg={bg} maxW="500px" mx="auto"
      p={8} borderRadius="2xl" boxShadow="lg">
      <Heading size="md" mb={6} textAlign="center">פתיחת בקשה / Open a Request</Heading>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>שם ההורה / Parent Name</FormLabel>
          <Input name="name" value={form.name} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>טלפון / Phone</FormLabel>
          <Input type="phone" name="phone" value={form.phone} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>אימייל / Email</FormLabel>
          <Input type="email" name="email" value={form.email} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>גיל התינוק / Baby Age</FormLabel>
          <Input name="babyAge" placeholder="e.g. 3 months" value={form.babyAge} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>משקל התינוק / Baby Weight</FormLabel>
          <Input name="babyWeight" placeholder="e.g. 11 kg" value={form.babyWeight} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>ניסיון קודם במנשאים/ Carriers Experience</FormLabel>
          <Input name="carriersExperience" placeholder="" value={form.carriersExperience} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>מנשאים מבוקשים/ Carriers Requested </FormLabel>
          <Input name="carriersRequested" placeholder="" value={form.carriersRequested} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>סוג מנשא / Carrier Type</FormLabel>
          <Select name="carrierType" value={form.carrierType} onChange={handleChange} placeholder="-- בחר / Select --">
            <option value="soft-structured">Soft Structured (SSC)</option>
            <option value="wrap">Wrap / עטיפה</option>
            <option value="ring-sling">Ring Sling</option>
            <option value="meh-dai">Mei Dai</option>
            <option value="any">כל סוג / Any</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel> איך שמעתם עלינו? / How did you hear about us?</FormLabel>
          <Select name="source" value={form.source} onChange={handleChange} placeholder="-- בחר / Select --">
            <option value="facebook">faceBook / פייסבוק</option>
            <option value="carryWithLove">קבוצת נשיאה</option>
            <option value="whatsapp">קבוצה בוואטסאפ</option>
            <option value="friend">מפה לאוזן</option>
            <option value="other">אחר</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>הערות / Notes</FormLabel>
          <Textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>מכימה לתנאי השימוש / I agree to the terms</FormLabel>
          <Checkbox name="legalAgreement" onChange={handleChange} />
        </FormControl>
        <Button type="submit" isLoading={loading} width="full" size="lg">
          שליחת בקשה / Submit
        </Button>
      </VStack>
    </Box>
  );
}