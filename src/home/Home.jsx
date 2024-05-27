import { Box } from "@chakra-ui/react";
import Navbar from "../navbar/Navbar.jsx";
import { Outlet } from "react-router-dom";

export function Home() {
  return (
    <Box>
      <Box>
        <Navbar />
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}
