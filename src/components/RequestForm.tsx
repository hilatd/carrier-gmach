import { useState, type SyntheticEvent } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useIntl } from "react-intl";
import type { CarrierRequest, Client } from "../types";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Textarea,
  VStack,
  Text,
  useColorModeValue,
  Checkbox,
  Link,
  HStack,
  Circle,
  Divider,
  Progress,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { sendConfirmationEmail } from "../utils/sendConfirmationEmail";
import { logError } from "../utils/logError";

// ─── Phone validation & formatting ────────────────────────────────────────────
function normalizePhone(raw: string): string {
  // strip everything except digits
  const digits = raw.replace(/\D/g, "");
  // remove leading 0 or 972
  const local = digits.startsWith("972")
    ? digits.slice(3)
    : digits.startsWith("0")
      ? digits.slice(1)
      : digits;
  return local;
}

function isValidIsraeliPhone(raw: string): boolean {
  const local = normalizePhone(raw);
  // Israeli mobile: 9 digits starting with 5
  return /^5\d{8}$/.test(local);
}

function toE164(raw: string): string {
  return `972${normalizePhone(raw)}`;
}

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS = ["personal", "baby", "carrier", "confirm"] as const;
type Step = (typeof STEPS)[number];

interface FormState {
  name: string;
  email: string;
  phone: string;
  babyAge: string;
  babyWeight: string;
  carriersExperience: string;
  carriersRequested: string;
  source: string;
  notes: string;
  legal: boolean;
}

const empty: FormState = {
  name: "",
  email: "",
  phone: "",
  babyAge: "",
  babyWeight: "",
  carriersExperience: "",
  carriersRequested: "",
  source: "",
  notes: "",
  legal: false,
};

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  const active = useColorModeValue("brand.500", "brand.300");
  const done = useColorModeValue("brand.400", "brand.500");
  const inactive = useColorModeValue("gray.200", "gray.600");

  return (
    <VStack spacing={2} w="full">
      <Progress
        value={(current / (total - 1)) * 100}
        size="xs"
        colorScheme="brand"
        w="full"
        borderRadius="full"
        bg={inactive}
      />
      <HStack w="full" justify="space-between" px={1}>
        {Array.from({ length: total }).map((_, i) => (
          <Circle
            key={i}
            size="24px"
            bg={i < current ? done : i === current ? active : inactive}
            transition="all 0.3s"
          >
            {i < current ? (
              <CheckIcon color="white" boxSize="10px" />
            ) : (
              <Text fontSize="10px" fontWeight="bold" color={i === current ? "white" : "gray.400"}>
                {i + 1}
              </Text>
            )}
          </Circle>
        ))}
      </HStack>
    </VStack>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function RequestForm() {
  const { formatMessage: t } = useIntl();
  const [form, setForm] = useState<FormState>(empty);
  const [step, setStep] = useState<Step>("personal");
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const bg = useColorModeValue("white", "gray.800");
  const borderCol = useColorModeValue("gray.100", "gray.700");
  const mutedCol = useColorModeValue("gray.500", "gray.400");
  const summaryBg = useColorModeValue("gray.50", "gray.700");
  const stepIndex = STEPS.indexOf(step);

  const set = (field: keyof FormState, value: string | boolean) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  // ─── Validation per step ───────────────────────────────────────────────────
  function validateStep(): boolean {
    const e: typeof errors = {};
    if (step === "personal") {
      if (!form.name.trim()) e.name = t({ id: "form.error.required" });
      if (!form.phone.trim()) e.phone = t({ id: "form.error.required" });
      else if (!isValidIsraeliPhone(form.phone)) e.phone = t({ id: "form.error.phone" });
      if (!form.email.trim()) e.email = t({ id: "form.error.required" });
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        e.email = t({ id: "form.error.email" });
    }
    if (step === "baby") {
      if (!form.babyAge.trim()) e.babyAge = t({ id: "form.error.required" });
      if (!form.babyWeight.trim()) e.babyWeight = t({ id: "form.error.required" });
    }
    if (step === "carrier") {
      if (!form.carriersExperience.trim()) e.carriersExperience = t({ id: "form.error.required" });
      if (!form.carriersRequested.trim()) e.carriersRequested = t({ id: "form.error.required" });
    }
    if (step === "confirm") {
      if (!form.legal) e.legal = t({ id: "form.error.legal" });
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const next = () => {
    if (!validateStep()) return;
    setStep(STEPS[stepIndex + 1]);
  };

  const back = () => setStep(STEPS[stepIndex - 1]);

  // ─── Submit ────────────────────────────────────────────────────────────────
  async function addOrGetClient(client: Client): Promise<string> {
    const colRef = collection(db, "clients");
    const q = query(colRef, where("email", "==", client.email.toLocaleLowerCase()));
    const snap = await getDocs(q);
    if (!snap.empty) return snap.docs[0].id;
    const newDoc = await addDoc(colRef, client);
    return newDoc.id;
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);
    try {
      const client: Client = {
        address: "",
        name: form.name,
        phone: toE164(form.phone),
        email: form.email.toLocaleLowerCase(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deletedAt: null,
      };
      const clientId = await addOrGetClient(client);
      const request: CarrierRequest = {
        clientId,
        status: "open",
        notes: form.notes,
        babyAge: form.babyAge,
        babyWeight: form.babyWeight,
        carriersExperience: form.carriersExperience,
        carriersRequested: form.carriersRequested,
        source: form.source,
        handledBy: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deletedAt: null,
      };
      await addDoc(collection(db, "requests"), request);
      await sendConfirmationEmail({ name: form.name, email: form.email });
      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      // error log
      // Firestore failed — do NOT show success
      const errorDetails = {
        type: "submission_failure",
        name: form.name,
        email: form.email,
        phone: form.phone,
        error: String(err),
        timestamp: Date.now(),
      };
      await logError(errorDetails).catch(console.error);
      setSubmitError(t({ id: "form.error.submit" }));
    } finally {
      setLoading(false);
    }
  };

  // ─── Success screen ────────────────────────────────────────────────────────
  if (submitted)
    return (
      <Box
        maxW="500px"
        mx="auto"
        textAlign="center"
        py={16}
        px={8}
        bg={bg}
        borderRadius="2xl"
        boxShadow="lg"
      >
        <Circle size="72px" bg="brand.500" mx="auto" mb={6}>
          <CheckIcon color="white" boxSize={7} />
        </Circle>
        <Heading size="md" mb={3} color="brand.500">
          {t({ id: "form.success.title" })}
        </Heading>
        <Text color={mutedCol} lineHeight={1.8}>
          {t({ id: "form.success" })}
        </Text>
      </Box>
    );

  const stepTitles: Record<Step, string> = {
    personal: t({ id: "form.step.personal" }),
    baby: t({ id: "form.step.baby" }),
    carrier: t({ id: "form.step.carrier" }),
    confirm: t({ id: "form.step.confirm" }),
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      bg={bg}
      maxW="500px"
      mx="auto"
      p={{ base: 6, md: 8 }}
      borderRadius="2xl"
      boxShadow="lg"
      border="1px solid"
      borderColor={borderCol}
    >
      {/* Header */}
      <VStack spacing={4} mb={8}>
        <Heading size="md" textAlign="center">
          {t({ id: "form.title" })}
        </Heading>
        <StepIndicator current={stepIndex} total={STEPS.length} />
        <Text fontSize="sm" fontWeight="semibold" color="brand.500">
          {stepTitles[step]}
        </Text>
      </VStack>

      <VStack spacing={5}>
        {/* ── Step 1: Personal ── */}
        {step === "personal" && (
          <>
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel>{t({ id: "form.parentName" })}</FormLabel>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                autoComplete="name"
                autoFocus
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.phone}>
              <FormLabel>{t({ id: "form.phone" })}</FormLabel>
              <InputGroup>
                <InputLeftAddon>🇮🇱 +972</InputLeftAddon>
                <Input
                  type="tel"
                  inputMode="tel"
                  placeholder="05X-XXX-XXXX"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  autoComplete="tel"
                />
              </InputGroup>
              <FormHelperText>{t({ id: "form.phone.helper" })}</FormHelperText>
              <FormErrorMessage>{errors.phone}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel>{t({ id: "form.email" })}</FormLabel>
              <Input
                type="email"
                inputMode="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
          </>
        )}

        {/* ── Step 2: Baby ── */}
        {step === "baby" && (
          <>
            <FormControl isRequired isInvalid={!!errors.babyAge}>
              <FormLabel>{t({ id: "form.babyAge" })}</FormLabel>
              <Input
                inputMode="text"
                placeholder={t({ id: "form.babyAge.placeholder" })}
                value={form.babyAge}
                onChange={(e) => set("babyAge", e.target.value)}
                autoFocus
              />
              <FormErrorMessage>{errors.babyAge}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.babyWeight}>
              <FormLabel>{t({ id: "form.babyWeight" })}</FormLabel>
              <Input
                inputMode="decimal"
                placeholder={t({ id: "form.babyWeight.placeholder" })}
                value={form.babyWeight}
                onChange={(e) => set("babyWeight", e.target.value)}
              />
              <FormErrorMessage>{errors.babyWeight}</FormErrorMessage>
            </FormControl>
          </>
        )}

        {/* ── Step 3: Carrier ── */}
        {step === "carrier" && (
          <>
            <FormControl isRequired isInvalid={!!errors.carriersExperience}>
              <FormLabel>{t({ id: "form.experience" })}</FormLabel>
              <Input
                value={form.carriersExperience}
                onChange={(e) => set("carriersExperience", e.target.value)}
                autoFocus
              />
              <FormErrorMessage>{errors.carriersExperience}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.carriersRequested}>
              <FormLabel>{t({ id: "form.carrierType" })}</FormLabel>
              <Input
                value={form.carriersRequested}
                onChange={(e) => set("carriersRequested", e.target.value)}
              />
              <FormErrorMessage>{errors.carriersRequested}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>{t({ id: "form.source" })}</FormLabel>
              <Select
                value={form.source}
                onChange={(e) => set("source", e.target.value)}
                placeholder={t({ id: "form.source.options.placeholder" })}
              >
                <option value="facebook">{t({ id: "form.source.options.facebook" })}</option>
                <option value="carryWithLove">
                  {t({ id: "form.source.options.carrierGroup" })}
                </option>
                <option value="whatsapp">{t({ id: "form.source.options.whatsapp" })}</option>
                <option value="friend">{t({ id: "form.source.options.friend" })}</option>
                <option value="other">{t({ id: "form.source.options.other" })}</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>{t({ id: "form.notes" })}</FormLabel>
              <Textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={3}
                inputMode="text"
                resize="none"
              />
            </FormControl>
          </>
        )}

        {/* ── Step 4: Confirm ── */}
        {step === "confirm" && (
          <>
            {/* Summary */}
            <Box w="full" bg={summaryBg} borderRadius="xl" p={4} fontSize="sm">
              <VStack align="stretch" spacing={2} divider={<Divider />}>
                <HStack justify="space-between">
                  <Text color={mutedCol}>{t({ id: "form.parentName" })}</Text>
                  <Text fontWeight="semibold">{form.name}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color={mutedCol}>{t({ id: "form.phone" })}</Text>
                  <Text fontWeight="semibold" dir="ltr">
                    +{toE164(form.phone)}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color={mutedCol}>{t({ id: "form.email" })}</Text>
                  <Text fontWeight="semibold" noOfLines={1}>
                    {form.email}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color={mutedCol}>{t({ id: "form.babyAge" })}</Text>
                  <Text fontWeight="semibold">{form.babyAge}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color={mutedCol}>{t({ id: "form.babyWeight" })}</Text>
                  <Text fontWeight="semibold">{form.babyWeight}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color={mutedCol}>{t({ id: "form.carrierType" })}</Text>
                  <Text fontWeight="semibold">{form.carriersRequested}</Text>
                </HStack>
              </VStack>
            </Box>

            {/* Legal */}
            <FormControl isRequired isInvalid={!!errors.legal}>
              <Checkbox
                isChecked={form.legal}
                onChange={(e) => set("legal", e.target.checked)}
                colorScheme="brand"
                alignItems="flex-start"
              >
                <Text as="span" fontSize="sm" lineHeight={1.6}>
                  {t({ id: "form.agreement.prefix" })}{" "}
                  <Link
                    href="/legal"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="brand.500"
                    textDecoration="underline"
                    fontWeight="semibold"
                  >
                    {t({ id: "form.agreement.link" })}
                  </Link>
                </Text>
              </Checkbox>
              <FormErrorMessage>{errors.legal}</FormErrorMessage>
            </FormControl>
          </>
        )}
        {submitError && (
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            {submitError}
          </Alert>
        )}

        {/* ── Navigation buttons ── */}
        <HStack w="full" spacing={3} pt={2}>
          {stepIndex > 0 && (
            <Button flex={1} variant="outline" onClick={back} isDisabled={loading}>
              {t({ id: "form.back" })}
            </Button>
          )}
          {stepIndex < STEPS.length - 1 ? (
            <Button flex={1} onClick={next}>
              {t({ id: "form.next" })}
            </Button>
          ) : (
            <Button
              flex={1}
              type="submit"
              isLoading={loading}
              loadingText={t({ id: "form.submitting" })}
            >
              {t({ id: "form.submit" })}
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
}
