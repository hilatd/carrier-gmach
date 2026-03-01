import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useLang } from "../i18n/useLang";
import { Box, Heading, Text, Spinner, useColorModeValue } from "@chakra-ui/react";
import { useIntl } from "react-intl";

export default function Legal() {
  const { lang } = useLang();
  const { formatMessage: t} = useIntl();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const bg = useColorModeValue("gray.50", "gray.900");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const snap = await getDoc(doc(db, "legal", lang));
      if (snap.exists()) setText(snap.data().text);
      setLoading(false);
    };
    fetch();
  }, [lang]);
  return (
    <Box bg={bg} minH="100vh" p={10} maxW="800px" mx="auto">
      <Heading mb={6}>{t({id:"legal.title"})} </Heading>
      {loading ? (
        <Spinner />
      ) : (
        <Text whiteSpace="pre-wrap" lineHeight={1.9}>{text}</Text>
      )}
    </Box>
  );
}