import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Box, Button, Heading, Text, VStack, useColorModeValue } from "@chakra-ui/react";

const provider = new GoogleAuthProvider();

export default function VolunteerLogin() {
  const navigate = useNavigate();
  const bg = useColorModeValue("white", "gray.800");

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch {
      alert("שגיאה בהתחברות / Login failed");
    }
  };

  return (
    <Box minH="80vh" display="flex" alignItems="center" justifyContent="center">
      <VStack bg={bg} p={10} borderRadius="2xl" boxShadow="lg" spacing={5} minW="300px">
        <Heading size="lg">כניסת מתנדבים 🔐</Heading>
        <Text color="gray.500">Volunteer access only</Text>
        <Button onClick={handleGoogleLogin} width="full" size="lg" variant="outline">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            width={20} style={{ marginLeft: "10px" }} />
          התחבר עם Google
        </Button>
      </VStack>
    </Box>
  );
}