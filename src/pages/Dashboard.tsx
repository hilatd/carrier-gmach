import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../hooks/useAuthState";
import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from "@chakra-ui/react";
import RequestsTab from "../components/tabs/RequestsTab";
import ActionsTab from "../components/tabs/ActionsTab";
import CarriersTab from "../components/tabs/CarriersTab";
import ClientsTab from "../components/tabs/ClientsTab";
import VolunteersTab from "../components/tabs/VolunteersTab";
import { useIntl } from "react-intl";

export default function Dashboard() {
  const { formatMessage: t} = useIntl(); 
  const { user, loading } = useAuthState();
  const navigate = useNavigate();
  const bg = useColorModeValue("gray.50", "gray.900");

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading]);

  if (loading) return null;

  return (
    <Box bg={bg} minH="100vh" p={6}>
      <Heading mb={6}>{t({id: "dashboard.title"})}</Heading>
      <Tabs colorScheme="brand" isLazy>
        <TabList mb={6}>
          <Tab>📋 {t({id: "dashboard.requests"})}</Tab>
          <Tab>📦 {t({id: "dashboard.actions"})}</Tab>
          <Tab>🎽 {t({id: "dashboard.carriers"})}</Tab>
          <Tab>👤 {t({id: "dashboard.clients"})}</Tab>
          <Tab>👤 {t({id: "dashboard.volunteers"})}</Tab>
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
  );
}
