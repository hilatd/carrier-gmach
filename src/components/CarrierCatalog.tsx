import { useIntl } from "react-intl";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  Divider,
  Link,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

interface CarrierInfo {
  key: string;
  imageUrl: string;
  color: string;
}

const CARRIERS: CarrierInfo[] = [
  {
    key: "backpack",
    color: "purple",
    imageUrl:
      "https://res.cloudinary.com/dfyt2knn6/image/upload/v1772994176/backpack-carrier_tlobad.png",
  },
  {
    key: "woven_wrap",
    color: "blue",
    imageUrl: "https://res.cloudinary.com/dfyt2knn6/image/upload/v1772994177/woven-wrap_lknvib.png",
  },
  {
    key: "elastic",
    color: "pink",
    imageUrl:
      "https://res.cloudinary.com/dfyt2knn6/image/upload/v1772994176/elastic-wrap_wesl4b.png",
  },
  {
    key: "mei_dai",
    color: "green",
    imageUrl: "https://res.cloudinary.com/dfyt2knn6/image/upload/v1772994177/mei-dai_bysa9r.png",
  },
  {
    key: "rings",
    color: "orange",
    imageUrl: "https://res.cloudinary.com/dfyt2knn6/image/upload/v1772994176/ring-sling_xepcwc.png",
  },
  {
    key: "accessories",
    color: "teal",
    imageUrl:
      "https://res.cloudinary.com/dfyt2knn6/image/upload/v1772994175/accessories_bxeztk.png",
  },
];

function CarrierCard({ carrier }: { carrier: CarrierInfo }) {
  const { formatMessage: t } = useIntl();
  const bg = useColorModeValue("white", "gray.800");
  const borderCol = useColorModeValue(`${carrier.color}.200`, `${carrier.color}.700`);
  return (
    <Box
      bg={bg}
      borderRadius="2xl"
      boxShadow="md"
      overflow="hidden"
      borderWidth={1}
      borderColor={borderCol}
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
    >
      {/* Image */}
      <Box
        h="180px"
        bgImage={`url(${carrier.imageUrl})`}
        bgSize="cover"
        bgPosition="center"
        position="relative"
      >
        <Box
          position="absolute"
          top={3}
          right={3}
          bg="white"
          borderRadius="full"
          w="36px"
          h="36px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="20px"
          boxShadow="sm"
        ></Box>
      </Box>

      {/* Content */}
      <VStack align="stretch" p={5} spacing={3}>
        <Box>
          <Heading size="sm" mb={1}>
            {t({ id: `catalog.${carrier.key}.name` })}
          </Heading>
          <Text fontSize="xs" color="gray.500">
            {t({ id: `catalog.${carrier.key}.example` })}
          </Text>
        </Box>

        {/* Meta badges */}
        <HStack wrap="wrap" spacing={2}>
          <Badge colorScheme={carrier.color} variant="subtle" px={2} py={1} borderRadius="md">
            👶 {t({ id: `catalog.${carrier.key}.age` })}
          </Badge>
          <Badge colorScheme="gray" variant="subtle" px={2} py={1} borderRadius="md">
            {t({ id: `catalog.${carrier.key}.difficulty` })}
          </Badge>
        </HStack>

        <Text fontSize="sm" fontWeight="semibold" color={`${carrier.color}.500`}>
          ✨ {t({ id: "catalog.best" })}: {t({ id: `catalog.${carrier.key}.best` })}
        </Text>

        <Divider />

        {/* Pros & Cons */}
        <Grid templateColumns="1fr 1fr" gap={2}>
          <GridItem>
            <List spacing={1}>
              {[1, 2, 3].map((i) => (
                <ListItem key={i} fontSize="xs" display="flex" alignItems="flex-start">
                  <ListIcon as={CheckIcon} color="green.400" mt="3px" flexShrink={0} />
                  {t({ id: `catalog.${carrier.key}.pro${i}` })}
                </ListItem>
              ))}
            </List>
          </GridItem>
          <GridItem>
            <List spacing={1}>
              {[1, 2].map((i) => (
                <ListItem key={i} fontSize="xs" display="flex" alignItems="flex-start">
                  <ListIcon as={CloseIcon} color="red.400" mt="3px" flexShrink={0} boxSize="8px" />
                  {t({ id: `catalog.${carrier.key}.con${i}` })}
                </ListItem>
              ))}
            </List>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
}

export default function CarrierCatalog() {
  const { formatMessage: t } = useIntl();
  const sectionBg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box bg={sectionBg} py={16} px={6}>
      <VStack spacing={3} mb={10} textAlign="center">
        <Heading size="lg">{t({ id: "catalog.title" })}</Heading>
        <Text color="gray.500" maxW="560px">
          {t({ id: "catalog.subtitle" })}
        </Text>
      </VStack>

      <Text as="span" fontSize="sm" lineHeight={1.6}>
        {t({ id: "catalog.link.title" })}{" "}
        <Link
          href="/carriersList"
          rel="noopener noreferrer"
          color="brand.500"
          textDecoration="underline"
          fontWeight="semibold"
        >
          {t({ id: "catalog.link.click" })}
        </Link>
      </Text>
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
        gap={6}
        maxW="1100px"
        mx="auto"
      >
        {CARRIERS.map((carrier) => (
          <CarrierCard key={carrier.key} carrier={carrier} />
        ))}
      </Grid>
    </Box>
  );
}
