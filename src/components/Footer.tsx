import { Box, Link } from "@chakra-ui/react";
import { useIntl } from "react-intl";

export default function Footer() {
  const { formatMessage: t } = useIntl();
  return (
    <Box as="footer" textAlign="center" py={4} fontSize="xs" color="gray.400">
      © {new Date().getFullYear()} {t({ id: "nav.title" })}, Hilat Doron —{" "} 
      <Link href="https://creativecommons.org/licenses/by-nc/4.0/" isExternal color="brand.400">
        CC BY-NC 4.0
      </Link>
    </Box>
  );
}
