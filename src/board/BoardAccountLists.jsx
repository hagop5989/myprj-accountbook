import { Box, Button, Flex, Input, Td, Tr } from "@chakra-ui/react";
import React from "react";

function BoardAccountLists() {
  return (
    <Box>
      <Tr cursor={"pointer"} _hover={{ bgColor: "gray.200 " }}>
        <Td>{1}</Td>
        <Td>
          <Input type={"date"} />
        </Td>
        <Td>
          <Input
            type={"text"}
            minWidth={"150px"}
            value={income}
            onChange={handleIncomeChange}
          />
        </Td>
        <Td>
          <Input
            type={"text"}
            minWidth={"150px"}
            value={expense}
            onChange={handleExpenseChange}
          />
        </Td>
        <Td>
          <Box>
            <Flex>
              <MiniBox text={"급여"} />
              <MiniBox text={"여행"} />
              <MiniBox text={"간식"} />
              <MiniBox text={"식비"} />
              <MiniBox text={"예시"} />
            </Flex>
            <Flex>
              <MiniBox text={"예시"} />
              <MiniBox text={"예시"} />
              <MiniBox text={"예시"} />
              <MiniBox text={"예시"} />
              <MiniBox text={"예시"} />
            </Flex>
          </Box>
        </Td>
        <Td>
          <textarea />
        </Td>
        <Td>
          <Flex direction={"column"}>
            <Button m={"3px"}>추가</Button>
            <Button m={"3px"}>수정</Button>
            <Button m={"3px"}>삭제</Button>
          </Flex>
        </Td>
      </Tr>
    </Box>
  );
}
