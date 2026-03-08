import { Box, Heading, Text, SimpleGrid, VStack, Icon, useColorModeValue } from "@chakra-ui/react";
import { EditIcon, PhoneIcon, StarIcon } from "@chakra-ui/icons";
import { useIntl } from "react-intl";
import RequestForm from "../components/RequestForm";
import CarrierCatalog from "../components/CarrierCatalog";
import AboutUs from "../components/AboutUs";

const IMAGE_URL =
  "https://res.cloudinary.com/dfyt2knn6/image/upload/v1772996721/Gemini_Generated_Image_6o92c86o92c86o92_wq5j8i.png";

export default function Home() {
  const { formatMessage: t } = useIntl();
  const sectionBg = useColorModeValue("white", "gray.800");
  const pageBg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box bg={pageBg} minH="100vh">
      {/* ── Hero ── */}
      <Box
        position="relative"
        minH={{ base: "480px", md: "560px" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        {/* Background image — full cover, separate from content */}
        <Box
          position="absolute"
          inset={0}
          bgImage={`url(${IMAGE_URL})`}
          bgSize="cover"
          bgPosition="center"
          bgRepeat="no-repeat"
          // subtle zoom on mount for life
          sx={{
            animation: "heroZoom 12s ease-in-out infinite alternate",
            "@keyframes heroZoom": {
              from: { transform: "scale(1)" },
              to: { transform: "scale(1.04)" },
            },
          }}
        />

        {/* Gradient overlay — blends image into brand color */}
        <Box
          position="absolute"
          inset={0}
          bgGradient={useColorModeValue(
            "linear(to-b, rgba(109,76,142,0.7) 0%, rgba(255,255,255,0.3) 60%, gray.50 100%)",
            "linear(to-b, rgba(30,16,48,0.85) 0%, rgba(30,16,48,0.5) 60%, gray.900 100%)"
          )}
        />

        {/* Hero content */}
        <VStack
          position="relative"
          zIndex={1}
          spacing={5}
          textAlign="center"
          px={6}
          maxW="620px"
          mx="auto"
        >
          <Heading
            size={{ base: "xl", md: "2xl" }}
            color="white"
            textShadow="0 2px 12px rgba(0,0,0,0.4)"
            lineHeight={1.3}
          >
            {t({ id: "home.subtitle" })}
          </Heading>
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color="whiteAlpha.900"
            lineHeight={1.9}
            textShadow="0 1px 6px rgba(0,0,0,0.3)"
            maxW="520px"
          >
            {t({ id: "home.desc" }, { br: <br /> })}
          </Text>
        </VStack>
      </Box>

      {/* ── How it works ── */}
      <Box py={14} px={6} textAlign="center">
        <Heading size="lg" mb={10}>
          {t({ id: "home.how" })}
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} maxW="700px" mx="auto">
          {[
            { icon: EditIcon, title: "home.step1.title", num: "01" },
            { icon: PhoneIcon, title: "home.step2.title", num: "02" },
            { icon: StarIcon, title: "home.step3.title", num: "03" },
          ].map((step) => (
            <VStack
              key={step.num}
              bg={sectionBg}
              p={7}
              borderRadius="2xl"
              boxShadow="md"
              spacing={3}
              position="relative"
              overflow="hidden"
              _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
              transition="all 0.2s"
            >
              {/* large faded step number in background */}
              <Text
                position="absolute"
                top={2}
                right={3}
                fontSize="5xl"
                fontWeight="black"
                color="brand.500"
                opacity={0.08}
                lineHeight={1}
                userSelect="none"
              >
                {step.num}
              </Text>
              <Icon as={step.icon} boxSize={8} color="brand.500" />
              <Text fontWeight="bold" fontSize="md">
                {t({ id: step.title })}
              </Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Box>

      {/* ── Request Form ── */}
      <Box pb={16} px={6}>
        <RequestForm />
      </Box>

      <CarrierCatalog />
      <AboutUs />
    </Box>
  );
}
