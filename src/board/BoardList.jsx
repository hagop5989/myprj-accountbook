import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

function BoardList(props) {
  // 1000 단위 포맷터 시작
  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");

  const formatNumber = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleIncomeChange = (event) => {
    const input = event.target.value;
    const plainNumber = input.replace(/,/g, ""); // Remove existing commas
    if (!isNaN(plainNumber)) {
      // Check if the input is a number
      const formattedNumber = formatNumber(plainNumber);
      setIncome(formattedNumber);
    }
  };

  const handleExpenseChange = (event) => {
    const input = event.target.value;
    const plainNumber = input.replace(/,/g, ""); // Remove existing commas
    if (!isNaN(plainNumber)) {
      // Check if the input is a number
      const formattedNumber = formatNumber(plainNumber);
      setExpense(formattedNumber);
    }
  };
  // 1000 단위 포맷터 끝

  // 미니박스 시작
  function MiniBox({ text }) {
    const [boxColor, setBoxColor] = useState("");
    const [checked, setChecked] = useState(false);

    function changeBoxColor() {
      const newChecked = !checked;
      setChecked(newChecked);
      if (newChecked) {
        setBoxColor("coral");
      } else {
        setBoxColor("");
      }
    }
    // 미니박스 끝

    return (
      <Box
        aria-valuetext={text}
        onClick={changeBoxColor}
        bgColor={boxColor}
        boxSize={"50px"}
        border={"1px solid black"}
        borderRadius={"5px"}
        textAlign="center"
        lineHeight={"50px"}
        margin={"2px"}
      >
        {text}
      </Box>
    );
  }

  return (
    <Box>
      <Box>회원목록</Box>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>날짜</Th>
              <Th>수입</Th>
              <Th>지출</Th>
              <Th>카테고리</Th>
              <Th>방법</Th>
              <Th>입력/수정</Th>
            </Tr>
          </Thead>
          <Tbody>
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
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default BoardList;
