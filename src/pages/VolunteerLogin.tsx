import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Box, Button, Heading, Text, VStack, useColorModeValue, Alert, AlertIcon } from "@chakra-ui/react";
import { useState } from "react";

const provider = new GoogleAuthProvider();

async function isVolunteer(email: string): Promise<boolean> {
  const q = query(collection(db, "volunteers"), where("email", "==", email));
  const snap = await getDocs(q);
  return !snap.empty;
}

export default function VolunteerLogin() {
  const navigate = useNavigate();
  const bg = useColorModeValue("white", "gray.800");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email ?? "";

      const volunteer = await isVolunteer(email);
      if (!volunteer) {
        await signOut(auth);
        setError("המשתמשת אינה מתנדבת רשומה / This account is not an authorized volunteer.");
        setLoading(false);
        return;
      }

      navigate("/dashboard");
    } catch {
      setError("שגיאה בהתחברות / Login failed");
    }
    setLoading(false);
  };

  return (
    <Box minH="80vh" display="flex" alignItems="center" justifyContent="center">
      <VStack bg={bg} p={10} borderRadius="2xl" boxShadow="lg" spacing={5} minW="320px">
        <Heading size="lg">כניסת מתנדבות 🔐</Heading>
        <Text color="gray.500">Volunteer access only</Text>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Button onClick={handleGoogleLogin} isLoading={loading} width="full" size="lg" variant="outline">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            width={20} style={{ marginLeft: "10px" }} />
          התחבר עם Google
        </Button>
      </VStack>
    </Box>
  );
}