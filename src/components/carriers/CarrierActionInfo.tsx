import { useMemo, useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import type { Action, Client } from "../../types";
import { ACTION_STATUS_COLORS } from "../../utils/actionOptions";
import {
  Badge, Box, Button, Divider, Drawer, DrawerBody,
  DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay,
  HStack, Text, useColorModeValue, VStack,
} from "@chakra-ui/react";

interface Props {
  carrierId: string;
  actions: Action[];
  clients: Client[];
}

export default function CarrierActionInfo({ carrierId, actions, clients }: Props) {
  const { formatMessage: t, formatDate } = useIntl();
  const [isHistoryDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [isWaitingListDrawerOpen, setWaitingListDrawerOpen] = useState(false);
  const dividerColor = useColorModeValue("gray.200", "gray.600");
  const historyBg = useColorModeValue("gray.50", "gray.700");

  const clientName = (id: string) =>
    clients.find((c) => c.id === id)?.name ?? "";

  // current = most recent non-closed/returned action for this carrier
  const currentAction = useMemo(() =>
    actions
      .filter((a) => a.carrierId === carrierId && a.status === "lending")
      .sort((a, b) => b.createdAt - a.createdAt)[0] ?? null,
    [actions, carrierId]
  );

  // history = all closed/returned actions sorted newest first
  const historyActions = useMemo(() =>
    actions
      .filter((a) => a.carrierId === carrierId && (a.status === "closed" || a.status === "returned"))
      .sort((a, b) => b.createdAt - a.createdAt),
    [actions, carrierId]
  );
  const waitingListActions = useMemo(() =>
    actions
      .filter((a) => a.carrierId === carrierId && (a.status === "waiting_list" || a.status === "open"))
      .sort((a, b) => b.createdAt - a.createdAt),
    [actions, carrierId]
  );

  return (
    <>
      <Divider borderColor={dividerColor} my={3} />

      {/* Current action inline */}
      {currentAction ? (
        <Box>
          <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={1}>
            {t({ id: "carrier.currentAction" })}
          </Text>
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" fontWeight="semibold">
                👤 {clientName(currentAction.clientId)}
              </Text>
              <Text fontSize="xs" color="gray.500">
                📅 {formatDate(currentAction.dateReturned, {
                  day: "2-digit", month: "2-digit", year: "numeric"
                })}
              </Text>
            </VStack>
            <Badge colorScheme={ACTION_STATUS_COLORS[currentAction.status]}>
              {t({ id: `action.status.${currentAction.status}` })}
            </Badge>
          </HStack>
        </Box>
      ) : (
        <Text fontSize="sm" color="gray.400">
          {t({ id: "carrier.noActiveAction" })}
        </Text>
      )}

      {/* History button — only show if there's history */}
      {historyActions.length > 0 && (
        <Button
          size="xs"
          variant="ghost"
          colorScheme="brand"
          mt={2}
          mb={2}
          onClick={() => setHistoryDrawerOpen(true)}
        >
          📋 {t({ id: "carrier.history" })} ({historyActions.length})
        </Button>
      )}
      {waitingListActions.length > 0 && (
        <Button
          size="xs"
          variant="ghost"
          colorScheme="brand"
          mt={2}
          mb={2}
          onClick={() => setWaitingListDrawerOpen(true)}
        >
          📋 {t({ id: "carrier.waitingList" })} ({waitingListActions.length})
        </Button>
      )}

      {/* History Drawer */}
      <Drawer
        isOpen={isHistoryDrawerOpen}
        placement="right"
        onClose={() => setHistoryDrawerOpen(false)}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {t({ id: "carrier.history" })}
          </DrawerHeader>
          <DrawerBody>
            {historyActions.length === 0 ? (
              <Text color="gray.400">{t({ id: "carrier.historyEmpty" })}</Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {historyActions.map((a) => (
                  <Box
                    key={a.id}
                    bg={historyBg}
                    p={4}
                    borderRadius="lg"
                    borderLeftWidth={4}
                    borderLeftColor={`${ACTION_STATUS_COLORS[a.status]}.400`}
                  >
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="bold">{clientName(a.clientId)}</Text>
                      <Badge colorScheme={ACTION_STATUS_COLORS[a.status]}>
                        {t({ id: `action.status.${a.status}` })}
                      </Badge>
                    </HStack>

                    <Text fontSize="sm">
                      📅 <FormattedMessage
                        id="action.returnDate"
                        values={{
                          date: formatDate(a.dateReturned, {
                            day: "2-digit", month: "2-digit", year: "numeric"
                          })
                        }}
                      />
                    </Text>

                    <Badge mt={2} colorScheme={a.paid ? "green" : "red"}>
                      {t({ id: a.paid ? "common.paid" : "common.unpaid" })}
                    </Badge>

                    {a.notes && (
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        📝 {a.notes}
                      </Text>
                    )}

                    <Text fontSize="xs" color="gray.400" mt={2}>
                      {formatDate(a.createdAt, {
                        day: "2-digit", month: "2-digit", year: "numeric"
                      })}
                    </Text>
                  </Box>
                ))}
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Waiting List Drawer */}
      <Drawer
        isOpen={isWaitingListDrawerOpen}
        placement="right"
        onClose={() => setWaitingListDrawerOpen(false)}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {t({ id: "carrier.waitingList" })}
          </DrawerHeader>
          <DrawerBody>
            {waitingListActions.length === 0 ? (
              <Text color="gray.400">{t({ id: "carrier.waitingList" })}</Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {waitingListActions.map((a) => (
                  <Box
                    key={a.id}
                    bg={historyBg}
                    p={4}
                    borderRadius="lg"
                    borderLeftWidth={4}
                    borderLeftColor={`${ACTION_STATUS_COLORS[a.status]}.400`}
                  >
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="bold">{clientName(a.clientId)}</Text>
                      <Badge colorScheme={ACTION_STATUS_COLORS[a.status]}>
                        {t({ id: `action.status.${a.status}` })}
                      </Badge>
                    </HStack>


                    {a.notes && (
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        📝 {a.notes}
                      </Text>
                    )}

                    <Text fontSize="xs" color="gray.400" mt={2}>
                      {formatDate(a.createdAt, {
                        day: "2-digit", month: "2-digit", year: "numeric"
                      })}
                    </Text>
                  </Box>
                ))}
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}