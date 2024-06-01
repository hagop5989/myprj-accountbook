import React, { useContext, useEffect, useState } from "react";
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
  useToast,
} from "@chakra-ui/react";
import { customAxios as axios } from "../customInstance.jsx";
import { LoginContext } from "../LoginProvider.jsx";
import { useNavigate } from "react-router-dom";

function BoardList(props) {
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const [inputRow, setInputRow] = useState({
    date: "",
    income: 0,
    expense: 0,
    how: "",
    categories: [],
    rowSum: 0,
  });
  const [dbRows, setDbRows] = useState([]);
  const [clickedList, setClickedList] = useState([]);
  const toast = useToast();

  useEffect(() => {
    if (account == null || !account.isLoggedIn()) {
      navigate("/login");
    }
    fetchBoardList();
  }, []);

  const fetchBoardList = () => {
    axios
      .get("/api/board/list")
      .then((res) => {
        setDbRows(
          res.data.boardList.map((board) => ({
            ...board,
            income: Number(board.income),
            expense: Number(board.expense),
          })),
        );
      })
      .catch((e) => console.error("Error fetching board list:", e));
  };

  const handleRowAdd = () => {
    const newRow = {
      ...inputRow,
      categories: clickedList,
      rowSum: inputRow.income - inputRow.expense,
    };
    axios
      .post("/api/board/addRow", newRow)
      .then((res) => {
        fetchBoardList();
        toast({
          description: "입력 완료 되었습니다!",
          status: "success",
          position: "top",
        });
      })
      .catch((e) => console.error({ e }))
      .finally(() => {
        setInputRow({
          date: "",
          income: 0,
          expense: 0,
          how: "",
          categories: [],
        });
        setClickedList([]);
      });
  };

  const handleRowUpdate = (row) => {
    const updatedRow = { ...row };
    axios
      .put("/api/board/updateRow", updatedRow)
      .then(() => {
        fetchBoardList();
        toast({
          description: "수정 완료 되었습니다!",
          status: "info",
          position: "top",
        });
      })
      .catch((e) => console.error(e));
  };

  const handleRowDelete = (row) => {
    axios
      .delete("/api/board/deleteRow", {
        params: { rowId: row.id },
      })
      .then(() => {
        fetchBoardList();
        toast({
          description: "삭제 완료 되었습니다!",
          status: "error",
          position: "top",
        });
      })
      .catch((e) => console.error(e));
  };

  const handleInputChange = (field, value) => {
    setInputRow((prevRow) => ({
      ...prevRow,
      [field]: value,
    }));
  };

  const handleIncomeChange = (event) => {
    const value = parseFloat(event.target.value.replace(/,/g, "")) || 0;
    handleInputChange("income", value);
  };

  const handleExpenseChange = (event) => {
    const value = parseFloat(event.target.value.replace(/,/g, "")) || 0;
    handleInputChange("expense", value);
  };

  const handleMiniBoxChange = (text) => {
    setClickedList((prevList) => {
      if (prevList.includes(text)) {
        return prevList.filter((item) => item !== text);
      } else {
        return [...prevList, text];
      }
    });
  };

  const MiniBox = ({ text, clickedList, handleMiniBoxChange }) => {
    const isSelected = clickedList.includes(text);

    return (
      <Box
        aria-valuetext={text}
        onClick={() => handleMiniBoxChange(text)}
        bgColor={isSelected ? "blue.100 " : ""}
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

  const MiniBoxGroup = ({ items, clickedList, handleMiniBoxChange }) => {
    return (
      <Flex>
        {items.map((item) => (
          <MiniBox
            key={item}
            text={item}
            clickedList={clickedList}
            handleMiniBoxChange={handleMiniBoxChange}
          />
        ))}
      </Flex>
    );
  };

  return (
    <Box>
      <Button m={2} fontWeight={"medium"} colorScheme={"blue"}>
        일괄 저장
      </Button>
      <Button fontWeight={"medium"} colorScheme={"red"}>
        일괄 삭제
      </Button>
      <Box>
        <Table>
          <Thead>
            <Tr bgColor={"gray.50"}>
              <Th fontSize={"1rem"}>선택</Th>
              <Th fontSize={"1rem"}>날짜</Th>
              <Th fontSize={"1rem"}>수입</Th>
              <Th fontSize={"1rem"}>지출</Th>
              <Th fontSize={"1rem"}>합계</Th>
              <Th fontSize={"1rem"}>카테고리</Th>
              <Th fontSize={"1rem"}>방법</Th>
              <Th fontSize={"1rem"}>입력</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr bgColor={""} _hover={{ bgColor: "gray.100 " }}>
              <Td>입력</Td>
              <Td>
                <Input
                  type={"date"}
                  value={inputRow.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                />
              </Td>
              <Td>
                <InputGroup>
                  <InputLeftAddon color="blue" children="+" />
                  <Input
                    type={"text"}
                    width={"150px"}
                    value={inputRow.income.toLocaleString()}
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
                    value={inputRow.expense.toLocaleString()}
                    color={"red"}
                    onChange={handleExpenseChange}
                  />
                </InputGroup>
              </Td>
              <Td>{(inputRow.income - inputRow.expense).toLocaleString()}</Td>
              <Td>
                <MiniBoxGroup
                  items={["급여", "여행", "간식", "식비", "예시1", "예시2"]}
                  clickedList={clickedList}
                  handleMiniBoxChange={handleMiniBoxChange}
                />
              </Td>
              <Td>
                <Textarea
                  value={inputRow.how}
                  onChange={(e) => handleInputChange("how", e.target.value)}
                />
              </Td>
              <Td>
                <Flex direction={"column"}>
                  <Button colorScheme={"blue"} m={"3px"} onClick={handleRowAdd}>
                    입력
                  </Button>
                </Flex>
              </Td>
            </Tr>
            {dbRows.map((row) => (
              <Row
                key={row.id}
                row={row}
                handleRowUpdate={handleRowUpdate}
                handleRowDelete={handleRowDelete}
                MiniBoxGroup={MiniBoxGroup}
              />
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

const Row = ({ row, handleRowUpdate, handleRowDelete, MiniBoxGroup }) => {
  const [editRow, setEditRow] = useState({ ...row });

  const handleEditChange = (field, value) => {
    setEditRow((prevRow) => ({
      ...prevRow,
      [field]: value,
    }));
  };

  const handleIncomeChange = (event) => {
    const value = parseFloat(event.target.value.replace(/,/g, "")) || 0;
    handleEditChange("income", value);
  };

  const handleExpenseChange = (event) => {
    const value = parseFloat(event.target.value.replace(/,/g, "")) || 0;
    handleEditChange("expense", value);
  };

  const handleCategoryChange = (text) => {
    setEditRow((prevRow) => {
      const newCategories = prevRow.categories.includes(text)
        ? prevRow.categories.filter((category) => category !== text)
        : [...prevRow.categories, text];
      return {
        ...prevRow,
        categories: newCategories,
      };
    });
  };

  return (
    <Tr bgColor={""} _hover={{ bgColor: "gray.100 " }}>
      <Td>
        <Checkbox border={"1px solid lightgray"} onChange={(e) => {}} />
      </Td>
      <Td>
        <Input
          type={"date"}
          value={editRow.date}
          onChange={(e) => handleEditChange("date", e.target.value)}
        />
      </Td>
      <Td>
        <InputGroup>
          <InputLeftAddon color="blue" children="+" />
          <Input
            type={"text"}
            width={"150px"}
            color={"blue"}
            value={editRow.income.toLocaleString()}
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
            color={"red"}
            value={editRow.expense.toLocaleString()}
            onChange={handleExpenseChange}
          />
        </InputGroup>
      </Td>
      <Td>{Number(editRow.income - editRow.expense).toLocaleString()}</Td>
      <Td>
        <MiniBoxGroup
          items={["급여", "여행", "간식", "식비", "예시1", "예시2"]}
          clickedList={editRow.categories}
          handleMiniBoxChange={handleCategoryChange}
        />
      </Td>
      <Td>
        <Textarea
          value={editRow.how}
          onChange={(e) => handleEditChange("how", e.target.value)}
        />
      </Td>
      <Td>
        <Flex direction={"column"}>
          <Button
            colorScheme={"blue"}
            m={"3px"}
            onClick={() => handleRowUpdate(editRow)}
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
        </Flex>
      </Td>
    </Tr>
  );
};

export default BoardList;
