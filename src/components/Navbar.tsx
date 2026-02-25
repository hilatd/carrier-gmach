import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Flex, Button, Link, useColorMode, IconButton, useColorModeValue } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthState } from "../hooks/useAuthState";

export default function Navbar() {
  const { user } = useAuthState();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("brand.500", "brand.800");

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <Flex as="nav" bg={bg} px={6} py={3} align="center" justify="space-between" color="white">
      <Link
        as={RouterLink}
        to="/"
        fontWeight="bold"
        fontSize="xl"
        _hover={{ textDecoration: "none", opacity: 0.85 }}
      >
        🤱 גמ״ח מנשאים
      </Link>
      <Flex gap={3} align="center">
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="ghost"
          color="white"
          _hover={{ bg: "whiteAlpha.200" }}
          size="sm"
        />
        {user ? (
          <>
            <Link as={RouterLink} to="/dashboard" color="white" _hover={{ opacity: 0.8 }}>
              לוח בקשות
            </Link>
            <Button onClick={handleLogout} variant="outline" colorScheme="whiteAlpha" size="sm">
              התנתק
            </Button>
          </>
        ) : (
          <Link as={RouterLink} to="/login" color="white" _hover={{ opacity: 0.8 }}>
            כניסת מתנדבים
          </Link>
        )}
      </Flex>
    </Flex>
  );
}
