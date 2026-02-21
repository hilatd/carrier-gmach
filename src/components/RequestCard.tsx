import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { CarrierRequest } from "../types";
import { Badge, Box, Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";

export default function RequestCard({ request }: { request: CarrierRequest }) {
  const bg = useColorModeValue("white", "gray.800");

  const markHandled = async () => {
    if (!request.id) return;
    await updateDoc(doc(db, "requests", request.id), { status: "handled" });
  };

  const date = new Date(request.createdAt).toLocaleDateString("he-IL");

  return (
    <Box bg={bg} borderRadius="xl" p={5} boxShadow="md"
      borderRightWidth={4} borderRightColor={request.status === "open" ? "brand.500" : "gray.300"}>
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontWeight="bold" fontSize="lg">{request.parentName}</Text>
        <Text fontSize="sm" color="gray.400">{date}</Text>
      </Flex>
      <Text>📞 {request.phone}</Text>
      <Text>👶 {request.babyAge}</Text>
      <Text>🎽 {request.carrierType}</Text>
      {request.notes && <Text>📝 {request.notes}</Text>}
      <Flex justify="space-between" align="center" mt={4}>
        <Badge colorScheme={request.status === "open" ? "purple" : "gray"}>
          {request.status === "open" ? "פתוח" : "טופל"}
        </Badge>
        {request.status === "open" && (
          <Button size="sm" onClick={markHandled}>סמן כטופל</Button>
        )}
      </Flex>
    </Box>
  );
}