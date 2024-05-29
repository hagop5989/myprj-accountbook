import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
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
  const [postSuccess, setPostSuccess] = useState(false);
  const [checked, setChecked] = useState(false);

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
      >
        {text}
      </Box>
    );
  };

  function handleRowAdd() {
    const newRow = {
      date,
      income: parseInt(income.replace(/,/g, "")),
      expense: parseInt(expense.replace(/,/g, "")),
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
            income: formatNumber(newRow.income.toString()),
            expense: formatNumber(newRow.expense.toString()),
          },
        ]);
        setPostSuccess(!postSuccess);
      })
      .catch((e) => console.error({ e }))
      .finally(() => {
        setDate("");
        setIncome(0);
        setIncomeForm("");
        setExpense(0);
        setExpenseForm("");
        setHow("");
        setCategories([]);
      });
  }

  function handleRowDelete(row) {
    axios
      .delete("/api/board/deleteRow", {
        params: {
          rowId: row.id,
        },
      })
      .then((res) => {
        setPostSuccess(!postSuccess);
      })
      .catch((e) => console.error(e));
  }

  function handleRowUpdate(row) {
    const newRow = {
      date: row.date,
      income: parseInt(row.income.replace(/,/g, "")),
      expense: parseInt(row.expense.replace(/,/g, "")),
      how: row.how,
      stringCategories: row.stringCategories,
    };
    axios
      .put("/api/updateRow", newRow)
      .then((res) => {})
      .catch()
      .finally();
  }

  function handleCheck(id, checked) {
    setChecked(checked);

    console.log("Row ID:", id, "Checked:", checked);
  }

  useEffect(() => {
    console.log("useEffect working!");
    axios
      .get("/api/board/list")
      .then((res) => {
        setBoardList(res.data.boardList);
        setRows(
          res.data.boardList.map((board) => ({
            ...board,
            income: formatNumber(board.income.toString()),
            expense: formatNumber(board.expense.toString()),
          })),
        );
      })
      .catch((e) => console.error("Error fetching board list:", e));
  }, [postSuccess]);

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
            {/* 입력 부분 */}
            <Tr bgColor={""} _hover={{ bgColor: "gray.100 " }}>
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
                  </Flex>
                  <Flex>
                    <MiniBox text={"예시1"} />
                    <MiniBox text={"예시2"} />
                    <MiniBox text={"예시3"} />
                    <MiniBox text={"예시4"} />
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
                </Flex>
              </Td>
            </Tr>
            {/* 출력 부분 */}
            {rows.map((row, index) => (
              <Tr key={index} _hover={{ bgColor: "gray.100 " }}>
                <Td>
                  <Checkbox
                    border={"1px solid lightgray"}
                    onChange={(e) => {
                      handleCheck(e.target.checked, row.id);
                    }}
                  />
                </Td>
                <Td datatype={"date"}>{row.date}</Td>
                <Td color="blue.500">{row.income}</Td>
                <Td color="red.500">{row.expense}</Td>
                <Td>{row.stringCategories}</Td>
                <Td>{row.how}</Td>
                <Td>
                  <Button
                    colorScheme={"green"}
                    m={"3px"}
                    onClick={() => handleRowUpdate(row)}
                  >
                    수정
                  </Button>
                  <Button
                    colorScheme={"red"}
                    m={"3px"}
                    onClick={() => handleRowDelete(row)}
                  >
                    삭제
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default BoardList;
