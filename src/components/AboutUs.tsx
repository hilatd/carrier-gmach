import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useIntl } from "react-intl";
import type { Volunteer } from "../types";
import {
  Avatar,
  Box,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
  Collapse,
  Button,
} from "@chakra-ui/react";

function VolunteerCard({ v }: { v: Volunteer }) {
  const [expanded, setExpanded] = useState(false);
  const needsExpand = (v.bio?.length ?? 0) > 80;

  return (
    <VStack spacing={3} textAlign="center">
      <Avatar
        src={v.imageUrl || undefined}
        name={v.name}
        size="xl"
        border="3px solid"
        borderColor="brand.400"
        boxShadow="md"
      />
      <Box>
        <Text fontWeight="bold" fontSize="sm">
          {v.name}
        </Text>
        {v.bio && (
          <Box>
            <Collapse startingHeight="3.6em" in={expanded}>
              <Text fontSize="xs" color="gray.500" fontStyle="italic" mt={1} lineHeight={1.6}>
                {v.bio}
              </Text>
            </Collapse>
            {needsExpand && (
              <Button
                variant="link"
                size="xs"
                colorScheme="brand"
                mt={1}
                onClick={() => setExpanded((p) => !p)}
              >
                {expanded ? "▲" : "▼"}
              </Button>
            )}
          </Box>
        )}
      </Box>
    </VStack>
  );
}

export default function AboutUs() {
  const { formatMessage: t } = useIntl();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const pageBg = useColorModeValue("purple.50", "gray.900");

  useEffect(() => {
    const fetch = async () => {
      const q = query(
        collection(db, "volunteers"),
        where("isActive", "==", true),
        where("deletedAt", "==", null)
      );
      const snap = await getDocs(q);
      setVolunteers(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Volunteer));
    };
    fetch();
  }, []);

  if (volunteers.length === 0) return null;

  return (
    <Box bg={pageBg} py={16} px={6}>
      <VStack spacing={3} mb={12} textAlign="center">
        <Heading size="lg">{t({ id: "aboutUs.title" })}</Heading>
        <Text color="gray.500" maxW="560px">
          {t({ id: "aboutUs.subtitle" })}
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={8} maxW="900px" mx="auto">
        {volunteers.map((v) => (
          <VolunteerCard key={v.id} v={v} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
