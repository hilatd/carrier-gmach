import { Box, Heading, Text, SimpleGrid, VStack, Icon, useColorModeValue } from "@chakra-ui/react";
import { EditIcon, PhoneIcon, StarIcon } from "@chakra-ui/icons";
import { useIntl } from "react-intl";
import RequestForm from "../components/RequestForm";

export default function Home() {
  const { formatMessage: t } = useIntl();
  const heroBg = useColorModeValue("brand.500", "brand.800");
  const sectionBg = useColorModeValue("white", "gray.800");
  const pageBg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box bg={pageBg} minH="100vh">
      {/* Hero */}
      <Box bg={heroBg} color="white" textAlign="center" py={16} px={6}>
        <Heading size="2xl" mb={3}>
          🤱 {t({ id: "home.subtitle" })}
        </Heading>
        <Text fontSize="sm" maxW="480px" mx="auto">
         {t({id:"home.desc"}, { br: <br /> })}
        </Text>
      </Box>

      {/* How it works */}
      <Box py={12} px={6} textAlign="center">
        <Heading size="lg" mb={8}>
         {t({id:"home.how"})}
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} maxW="700px" mx="auto">
          {[
            { icon: EditIcon, title: "home.step1.title", en: "Fill the form below" },
            { icon: PhoneIcon, title: "home.step2.title", en: "A volunteer contacts you" },
            { icon: StarIcon, title: "home.step3.title", en: "Receive a carrier" },
          ].map((step, i) => (
            <VStack key={i} bg={sectionBg} p={6} borderRadius="xl" boxShadow="md" spacing={2}>
              <Icon as={step.icon} boxSize={7} color="brand.500" />
              <Text fontWeight="bold">{t({id: step.title})}</Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Box>

      {/* Request Form */}
      <Box pb={16} px={6}>
        <RequestForm />
      </Box>
    </Box>
  );
}
