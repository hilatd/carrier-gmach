import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../hooks/useAuthState";
import {
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  useBreakpointValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import RequestsTab from "../components/tabs/RequestsTab";
import ActionsTab from "../components/tabs/ActionsTab";
import CarriersTab from "../components/tabs/CarriersTab";
import ClientsTab from "../components/tabs/ClientsTab";
import VolunteersTab from "../components/tabs/VolunteersTab";
import { useIntl } from "react-intl";

const TABS = [
  { emoji: "📋", labelId: "dashboard.requests" },
  { emoji: "📦", labelId: "dashboard.actions" },
  { emoji: "🎽", labelId: "dashboard.carriers" },
  { emoji: "👤", labelId: "dashboard.clients" },
  { emoji: "🙋", labelId: "dashboard.volunteers" },
];

export default function Dashboard() {
  const { formatMessage: t } = useIntl();
  const { user, loading } = useAuthState();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);

  // ── All hooks at the top, no conditions ──
  const bg = useColorModeValue("gray.50", "gray.900");
  const navBg = useColorModeValue("white", "gray.800");
  const activeCol = useColorModeValue("brand.500", "brand.300");
  const inactiveCol = useColorModeValue("gray.400", "gray.500");
  const borderCol = useColorModeValue("gray.200", "gray.700");
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading]);

  if (loading) return null;

  return (
    <Box bg={bg} minH="100vh">
      {/* ── Desktop: regular tabs ── */}
      {!isMobile && (
        <Box p={6}>
          <Heading mb={6}>{t({ id: "dashboard.title" })}</Heading>
          <Tabs index={tabIndex} onChange={setTabIndex} colorScheme="brand" isLazy>
            <TabList mb={6}>
              {TABS.map((tab) => (
                <Tab key={tab.labelId}>
                  {tab.emoji} {t({ id: tab.labelId })}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              <TabPanel p={0}>
                <RequestsTab />
              </TabPanel>
              <TabPanel p={0}>
                <ActionsTab />
              </TabPanel>
              <TabPanel p={0}>
                <CarriersTab />
              </TabPanel>
              <TabPanel p={0}>
                <ClientsTab />
              </TabPanel>
              <TabPanel p={0}>
                <VolunteersTab />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      )}

      {/* ── Mobile: content + bottom nav ── */}
      {isMobile && (
        <>
          <Box p={4} pb="80px">
            {tabIndex === 0 && <RequestsTab />}
            {tabIndex === 1 && <ActionsTab />}
            {tabIndex === 2 && <CarriersTab />}
            {tabIndex === 3 && <ClientsTab />}
            {tabIndex === 4 && <VolunteersTab />}
          </Box>

          <Flex
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            bg={navBg}
            borderTopWidth={1}
            borderTopColor={borderCol}
            zIndex={100}
            justify="space-around"
            align="center"
            h="64px"
            boxShadow="0 -2px 10px rgba(0,0,0,0.08)"
          >
            {TABS.map((tab, i) => (
              <Flex
                key={tab.labelId}
                direction="column"
                align="center"
                justify="center"
                flex={1}
                h="full"
                cursor="pointer"
                onClick={() => setTabIndex(i)}
                color={tabIndex === i ? activeCol : inactiveCol}
                transition="color 0.15s"
              >
                <Text fontSize="22px" lineHeight={1}>
                  {tab.emoji}
                </Text>
                <Text
                  fontSize="10px"
                  fontWeight={tabIndex === i ? "bold" : "normal"}
                  mt="2px"
                  noOfLines={1}
                >
                  {t({ id: tab.labelId })}
                </Text>
              </Flex>
            ))}
          </Flex>
        </>
      )}
    </Box>
  );
}
