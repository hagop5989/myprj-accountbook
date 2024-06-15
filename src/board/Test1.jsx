import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import Calendar2 from "./Calendar2.jsx";
import Sidebar from "./Sidebar.jsx";

function Test1(props) {
  return (
    <Box>
      <Flex>
        <Sidebar />
        <Calendar2 />
      </Flex>
    </Box>
  );
}

export default Test1;
