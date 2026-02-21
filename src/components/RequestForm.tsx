import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { CarrierRequest } from "../types";
import {
  Box, Button, FormControl, FormLabel, Heading, Input,
  Select, Textarea, VStack, Text, useColorModeValue
} from "@chakra-ui/react";

export default function RequestForm() {
  const [form, setForm] = useState({ parentName:"", phone:"", babyAge:"", carrierType:"", notes:"" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const bg = useColorModeValue("white", "gray.800");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const request: CarrierRequest = { ...form, status: "open", createdAt: Date.now() };
    await addDoc(collection(db, "requests"), request);
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) return (
    <Text textAlign="center" fontSize="xl" color="brand.500" py={12}>
      ✅ הבקשה נשלחה! מתנדב יצור איתך קשר בקרוב 💜
    </Text>
  );

  return (
    <Box as="form" onSubmit={handleSubmit} bg={bg} maxW="500px" mx="auto"
      p={8} borderRadius="2xl" boxShadow="lg">
      <Heading size="md" mb={6} textAlign="center">פתיחת בקשה / Open a Request</Heading>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>שם ההורה / Parent Name</FormLabel>
          <Input name="parentName" value={form.parentName} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>טלפון / Phone</FormLabel>
          <Input name="phone" value={form.phone} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>גיל התינוק / Baby Age</FormLabel>
          <Input name="babyAge" placeholder="e.g. 3 months" value={form.babyAge} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
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
          <FormLabel>הערות / Notes</FormLabel>
          <Textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
        </FormControl>
        <Button type="submit" isLoading={loading} width="full" size="lg">
          שליחת בקשה / Submit
        </Button>
      </VStack>
    </Box>
  );
}