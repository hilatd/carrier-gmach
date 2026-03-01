import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import VolunteerLogin from "./pages/VolunteerLogin";
import Dashboard from "./pages/Dashboard";
import Legal from './pages/Legal';

export default function App() {
  return (
    <BrowserRouter>
      <Box minH="100vh">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<VolunteerLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/legal" element={<Legal />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}
