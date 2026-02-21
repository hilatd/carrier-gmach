import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { useAuthState } from "../hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import RequestCard from "../components/RequestCard";
import type { CarrierRequest } from "../types";
import { Box, Button, Heading, HStack, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";

export default function Dashboard() {
  const { user, loading } = useAuthState();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<CarrierRequest[]>([]);
  const [filter, setFilter] = useState<"all" | "open" | "handled">("open");
  const bg = useColorModeValue("gray.50", "gray.900");

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading]);

  useEffect(() => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
    return onSnapshot(q, snap => {
      setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() } as CarrierRequest)));
    });
  }, []);

  const filtered = requests.filter(r => filter === "all" || r.status === filter);

  if (loading) return <Text textAlign="center" pt={20}>טוען...</Text>;

  return (
    <Box bg={bg} minH="100vh" p={6}>
      <Heading mb={6}>לוח בקשות / Requests Dashboard</Heading>
      <HStack mb={6} spacing={3}>
        {(["open","handled","all"] as const).map(f => (
          <Button key={f} onClick={() => setFilter(f)}
            variant={filter === f ? "solid" : "outline"} size="sm">
            {f === "open" ? "פתוחות" : f === "handled" ? "טופלו" : "הכל"}
          </Button>
        ))}
      </HStack>
      {filtered.length === 0
        ? <Text>אין בקשות / No requests</Text>
        : <SimpleGrid columns={{ base:1, md:2, lg:3 }} spacing={5}>
            {filtered.map(r => <RequestCard key={r.id} request={r} />)}
          </SimpleGrid>
      }
    </Box>
  );
}