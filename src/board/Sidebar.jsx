import React from "react";
import { Box, Button, Checkbox, Text, VStack } from "@chakra-ui/react";

/* Sidebar.jsx 파일  */
export const Sidebar = () => {
  return (
    <Box>
      <VStack
        spacing={4}
        borderRadius={"15px"}
        align="start"
        p={4}
        w="250px"
        h="85vh"
        bg="gray.100"
        borderRight="1px solid #e2e8f0"
      >
        <Text fontSize="xl" fontWeight="bold">
          나의 캘린더
        </Text>
        <Box h={"250px"}></Box>
        <Button colorScheme="teal">일정 만들기</Button>
        <Button colorScheme="teal" variant="outline">
          할 일 만들기
        </Button>
        <Box>
          <Text fontWeight="bold" mb={2}>
            2024년 8월
          </Text>
          <Box border="1px solid #e2e8f0" borderRadius="md" p={2}>
            <Text>달력 (간단한 달력 구현)</Text>
          </Box>
        </Box>
        <Box>
          <Text fontWeight="bold" mb={2}>
            톡캘린더
          </Text>
          <Checkbox defaultischecked={"true"}>내 캘린더</Checkbox>
          <Checkbox>할 일</Checkbox>
          <Checkbox>친구 생일</Checkbox>
        </Box>
        <Box>
          <Text fontWeight="bold" mb={2}>
            구독 캘린더
          </Text>
          <Checkbox>대한민국 기념일</Checkbox>
        </Box>
        <Box>
          <Text fontWeight="bold">설정</Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;
