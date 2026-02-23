import { Box, Heading, Text, SimpleGrid, VStack, Icon, useColorModeValue } from "@chakra-ui/react";
import { EditIcon, PhoneIcon, StarIcon } from "@chakra-ui/icons";
import RequestForm from "../components/RequestForm";

export default function Home() {
  const heroBg = useColorModeValue("brand.500", "brand.800");
  const sectionBg = useColorModeValue("white", "gray.800");
  const pageBg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box bg={pageBg} minH="100vh">
      {/* Hero */}
      <Box bg={heroBg} color="white" textAlign="center" py={16} px={6}>
        <Heading size="2xl" mb={3}>🤱 גמ״ח מנשאים</Heading>
        <Text fontSize="xl" opacity={0.9} mb={4}>Baby Carrier Lending Library</Text>
        <Text fontSize="md" maxW="480px" mx="auto" lineHeight={1.8}>
         גמ"ח הנשיאה שלנו פועל בירושלים לטובת קהילת הנשיאה המקומית.<br />
          We lend baby carriers for free to families in our community.
        </Text>
        <Text fontSize="sm" maxW="480px"  mx="auto">
 שמחות שפנית אלינו!<br />
ההשאלה מהגמ"ח היא חינם לתקופה של חודש, וניתנת להארכה לאחר אישורנו ובתשלום של 20 ש"ח על כל חודש נוסף.  <br />
הכסף משמש אותנו לתחזוקה של הגמ"ח ורכישת מנשאים חדשים במידת הצורך. <br />
הגמ"ח מופעל בהתנדבות מלאה! אנו משתדלות לתת מענה בהקדם האפשרי, אבל זה יכול לקחת יום-יומיים ואפילו קצת יותר אנא היאזרו בסבלנות.<br />
מוזמנים למלא פרטים ונחזור אליכם בהקדם :)
        </Text>
      </Box>

      {/* How it works */}
      <Box py={12} px={6} textAlign="center">
        <Heading size="lg" mb={8}>איך זה עובד? / How it works</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} maxW="700px" mx="auto">
          {[
            { icon: EditIcon,  he: "מלאי טופס",        en: "Fill the form below" },
            { icon: PhoneIcon, he: "מתנדבת תיצור קשר",   en: "A volunteer contacts you" },
            { icon: StarIcon,  he: "בואי לקחת את המנשא",         en: "Receive a carrier" },
          ].map((step, i) => (
            <VStack key={i} bg={sectionBg} p={6} borderRadius="xl"
              boxShadow="md" spacing={2}>
              <Icon as={step.icon} boxSize={7} color="brand.500" />
              <Text fontWeight="bold">{step.he}</Text>
              <Text fontSize="sm" color="gray.500">{step.en}</Text>
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