import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Table,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";

function BoardList(props) {
  const [incomeForm, setIncomeForm] = useState("");
  const [expenseForm, setExpenseForm] = useState("");

  const [date, setDate] = useState("");
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [how, setHow] = useState("");
  const [categories, setCategories] = useState([]);
  const [rows, setRows] = useState([]);
  const [boardList, setBoardList] = useState([]);

  const formatNumber = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleIncomeChange = (event) => {
    const input = event.target.value;
    setIncome(input);
    const plainNumber = input.replace(/,/g, "");
    if (!isNaN(plainNumber)) {
      const formattedNumber = formatNumber(plainNumber);
      setIncomeForm(formattedNumber);
    }
  };

  const handleExpenseChange = (event) => {
    const input = event.target.value;
    setExpense(input);
    const plainNumber = input.replace(/,/g, "");
    if (!isNaN(plainNumber)) {
      const formattedNumber = formatNumber(plainNumber);
      setExpenseForm(formattedNumber);
    }
  };

  const handleCategoryChange = (text) => {
    setCategories((prevCategories) => {
      if (prevCategories.includes(text)) {
        return prevCategories.filter((category) => category !== text);
      } else {
        return [...prevCategories, text];
      }
    });
  };

  const MiniBox = ({ text }) => {
    const isSelected = categories.includes(text);

    const changeBoxColor = () => {
      handleCategoryChange(text);
    };

    return (
      <Box
        aria-valuetext={text}
        onClick={changeBoxColor}
        bgColor={isSelected ? "coral" : ""}
        boxSize={"50px"}
        border={"1px solid black"}
        borderRadius={"5px"}
        textAlign="center"
        lineHeight={"50px"}
        margin={"2px"}
        cursor={"pointer"}
      >
        {text}
      </Box>
    );
  };

  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((res) => {
        setBoardList(res.data.boardList);
        setRows(
          res.data.boardList.map((board) => ({
            ...board,
            income: formatNumber(board.income.toString()), // 숫자에 쉼표 추가하여 포맷팅
            expense: formatNumber(board.expense.toString()), // 숫자에 쉼표 추가하여 포맷팅
          })),
        );
      })
      .catch((e) => console.error("Error fetching board list:", e));
  }, []); // 의존성 배열을 빈 배열로 설정하여 한 번만 실행되도록 함

  function handleRowAdd() {
    const newRow = {
      date,
      income: parseInt(income.replace(/,/g, "")), // 쉼표 제거 후 숫자로 변환
      expense: parseInt(expense.replace(/,/g, "")), // 쉼표 제거 후 숫자로 변환
      how,
      categories,
    };
    axios
      .post("/api/board/addRow", newRow)
      .then((res) => {
        setRows((prevRows) => [
          ...prevRows,
          {
            ...newRow,
            income: formatNumber(newRow.income.toString()), // 숫자에 쉼표 추가하여 포맷팅
            expense: formatNumber(newRow.expense.toString()), // 숫자에 쉼표 추가하여 포맷팅
          },
        ]);
        setDate("");
        setIncome("");
        setIncomeForm("");
        setExpense("");
        setExpenseForm("");
        setHow("");
        setCategories([]);
      })
      .catch((e) => console.error({ e }))
      .finally();
  }

  function handleRowDelete() {
    axios
      .post("/api/deleteRow")
      .then((res) => {})
      .catch()
      .finally();
  }

  return (
    <Box>
      <Box>회원목록</Box>
      <Box>
        <Table>
          <Thead>
            <Tr bgColor={"gray.50"}>
              <Th fontSize={"1rem"}>#</Th>
              <Th fontSize={"1rem"}>날짜</Th>
              <Th fontSize={"1rem"}>수입</Th>
              <Th fontSize={"1rem"}>지출</Th>
              <Th fontSize={"1rem"}>카테고리</Th>
              <Th fontSize={"1rem"}>방법</Th>
              <Th fontSize={"1rem"}>입력</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row, index) => (
              <Tr
                key={index}
                cursor={"pointer"}
                _hover={{ bgColor: "gray.100 " }}
              >
                <Td>{index + 1}</Td>
                <Td datatype={"date"}>{row.date}</Td>
                <Td color="blue.500">{row.income}</Td>
                <Td color="red.500">{row.expense}</Td>
                <Td>{row.categories.join(", ")}</Td>
                <Td>{row.how}</Td>
                <Td> </Td>
              </Tr>
            ))}
            <Tr cursor={"pointer"} _hover={{ bgColor: "gray.100 " }}>
              <Td>{rows.length + 1}</Td>
              <Td>
                <Input
                  type={"date"}
                  defaultValue="2024-01-01"
                  onChange={(e) => setDate(e.target.value)}
                />
              </Td>
              <Td>
                <InputGroup>
                  <InputLeftAddon color="blue" children="+" />
                  <Input
                    type={"text"}
                    width={"150px"}
                    value={incomeForm}
                    color={"blue"}
                    onChange={handleIncomeChange}
                  />
                </InputGroup>
              </Td>
              <Td>
                <InputGroup>
                  <InputLeftAddon color={"red"} children="-" />
                  <Input
                    type={"text"}
                    width={"150px"}
                    value={expenseForm}
                    color={"red"}
                    onChange={handleExpenseChange}
                  />
                </InputGroup>
              </Td>
              <Td>
                <Box>
                  <Flex>
                    <MiniBox text={"급여"} />
                    <MiniBox text={"여행"} />
                    <MiniBox text={"간식"} />
                    <MiniBox text={"식비"} />
                    <MiniBox text={"예시1"} />
                    <MiniBox text={"예시2"} />
                    <MiniBox text={"예시3"} />
                  </Flex>
                </Box>
              </Td>
              <Td>
                <Textarea onChange={(e) => setHow(e.target.value)} />
              </Td>
              <Td>
                <Flex direction={"column"}>
                  <Button colorScheme={"blue"} m={"3px"} onClick={handleRowAdd}>
                    입력
                  </Button>
                  <Button
                    colorScheme={"red"}
                    m={"3px"}
                    onClick={handleRowDelete}
                  >
                    삭제
                  </Button>
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
