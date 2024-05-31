import { Box, Flex } from "@chakra-ui/react";
import Navbar from "../navbar/Navbar.jsx";
import { Outlet } from "react-router-dom";

export function Home() {
  return (
    <Box mx={100} my={5}>
      <Flex bgColor="gray.200">
        <Navbar />
      </Flex>
      <Box mt={2}>
        <Outlet />
      </Box>
    </Box>
  );
}
