import { useState, type SyntheticEvent } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useIntl } from "react-intl";
import type { CarrierRequest, Client } from "../types";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
  VStack,
  Text,
  useColorModeValue,
  Checkbox,
} from "@chakra-ui/react";

export default function RequestForm() {
  const { formatMessage: t } = useIntl();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    babyAge: "",
    notes: "",
    carriersExperience: "",
    babyWeight: "",
    carriersRequested: "",
    source: "",
    legal: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const bg = useColorModeValue("white", "gray.800");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
    setLoading(true);
    const client: Client = {
      address: "",
      name: form.name,
      phone: form.phone,
      email: form.email,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const clientId = await addOrGetClient(client);
    const request: CarrierRequest = {
      ...form,
      clientId,
      status: "open",
      createdAt: Date.now(),
      babyWeight: "",
      carriersRequested: "",
      source: "",
      handledBy: "",
      updatedAt: 0,
    };
    await addDoc(collection(db, "requests"), request);
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted)
    return (
      <Text textAlign="center" fontSize="xl" color="brand.500" py={12}>
        {t({id:"form.success"})}
      </Text>
    );

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      bg={bg}
      maxW="500px"
      mx="auto"
      p={8}
      borderRadius="2xl"
      boxShadow="lg"
    >
      <Heading size="md" mb={6} textAlign="center">
        {t({id:"form.title"})}
      </Heading>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>{t({id:"form.parentName"})}</FormLabel>
          <Input name="name" value={form.name} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>{t({id:"form.phone"})}</FormLabel>
          <Input type="phone" name="phone" value={form.phone} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>{t({id:"form.email"})}</FormLabel>
          <Input type="email" name="email" value={form.email} onChange={handleChange} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>{t({id: "form.babyAge"})}</FormLabel>
          <Input
            name="babyAge"
            placeholder={t({id: "form.babyAge.placeholder"})}
            value={form.babyAge}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>{t({id: "form.babyWeight"})}</FormLabel>
          <Input
            name="babyWeight"
            placeholder={t({id: "form.babyWeight.placeholder"})}
            value={form.babyWeight}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>{t({id: "form.experience"})}</FormLabel>
          <Input
            name="carriersExperience"
            placeholder=""
            value={form.carriersExperience}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>{t({id: "form.carrierType"})}</FormLabel>
          <Input
            name="carriersRequested"
            placeholder=""
            value={form.carriersRequested}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>{t({id: "form.source"})}</FormLabel>
          <Select
            name="source"
            value={form.source}
            onChange={handleChange}
            placeholder={t({id: "form.source.options.placeholder"})}
          >
            <option value="facebook">{t({id: "form.source.options.facebook"})}</option>
            <option value="carryWithLove">{t({id: "form.source.options.carrierGroup"})}</option>
            <option value="whatsapp">{t({id: "form.source.options.whatsapp"})}</option>
            <option value="friend">{t({id: "form.source.options.friend"})}</option>
            <option value="other">{t({id: "form.source.options.other"})}</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>{t({id: "form.notes"})}</FormLabel>
          <Textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>{t({id: "form.agreement"})}</FormLabel>
          <Checkbox name="legalAgreement" checked={form.legal} />
        </FormControl>
        <Button type="submit" isLoading={loading} width="full" size="lg">
          {t({id: "form.submit"})}
        </Button>
      </VStack>
    </Box>
  );
}
