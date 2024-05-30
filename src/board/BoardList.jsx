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
  const [inputRow, setInputRow] = useState({
    date: "",
    income: "",
    expense: "",
    how: "",
    categories: [],
  });
  const [dbRows, setDbRows] = useState([]);
  const [postSuccess, setPostSuccess] = useState(false);
  const [clickedList, setClickedList] = useState([]);

  const formatNumber = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleInputChange = (field, value) => {
    setInputRow((prevRow) => ({
      ...prevRow,
      [field]: value,
    }));
  };

  const handleIncomeChange = (event) => {
    const input = event.target.value;
    const plainNumber = input.replace(/,/g, "");
    if (!isNaN(plainNumber)) {
      const formattedNumber = formatNumber(plainNumber);
      handleInputChange("income", formattedNumber);
    }
  };

  const handleExpenseChange = (event) => {
    const input = event.target.value;
    const plainNumber = input.replace(/,/g, "");
    if (!isNaN(plainNumber)) {
      const formattedNumber = formatNumber(plainNumber);
      handleInputChange("expense", formattedNumber);
    }
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

  function handleRowAdd() {
    const newRow = {
      ...inputRow,
      income: parseInt(inputRow.income.replace(/,/g, "")),
      expense: parseInt(inputRow.expense.replace(/,/g, "")),
      categories: clickedList,
    };
    axios
      .post("/api/board/addRow", newRow)
      .then((res) => {
        setPostSuccess(!postSuccess);
      })
      .catch((e) => console.error({ e }))
      .finally(() => {
        setInputRow({
          date: "",
          income: "",
          expense: "",
          how: "",
          categories: [],
        });
        setClickedList([]);
      });
  }

  function handleRowUpdate(row) {
    const updatedRow = {
      ...row,
      income: parseInt(row.income.replace(/,/g, "")),
      expense: parseInt(row.expense.replace(/,/g, "")),
    };
    axios
      .put("/api/board/updateRow", updatedRow)
      .then(() => {
        setDbRows((prevRows) =>
          prevRows.map((r) => (r.id === row.id ? updatedRow : r)),
        );
      })
      .catch((e) => console.error(e));
  }
  function handleRowDelete(row) {
    axios
      .delete("/api/board/deleteRow", {
        params: {
          rowId: row.id,
        },
      })
      .then(() => {
        setPostSuccess(!postSuccess);
      })
      .catch((e) => console.error(e));
  }

  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((res) => {
        setDbRows(
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
            <Tr bgColor={""} _hover={{ bgColor: "gray.100 " }}>
              <Td>{dbRows.length + 1}</Td>
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
                    value={inputRow.income}
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
                    value={inputRow.expense}
                    color={"red"}
                    onChange={handleExpenseChange}
                  />
                </InputGroup>
              </Td>
              <Td>
                <MiniBoxGroup
                  items={["급여", "여행", "간식", "식비"]}
                  clickedList={clickedList}
                  handleMiniBoxChange={handleMiniBoxChange}
                />
                <MiniBoxGroup
                  items={["예시1", "예시2", "예시3", "예시4"]}
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
                formatNumber={formatNumber}
                handleRowUpdate={handleRowUpdate}
                handleRowDelete={handleRowDelete}
                MiniBox={MiniBox}
              />
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

const Row = ({
  row,
  formatNumber,
  handleRowUpdate,
  handleRowDelete,
  MiniBox,
}) => {
  const [editRow, setEditRow] = useState({ ...row });

  const handleEditChange = (field, value) => {
    setEditRow((prevRow) => ({
      ...prevRow,
      [field]: value,
    }));
  };

  const handleIncomeChange = (event) => {
    const input = event.target.value;
    const plainNumber = input.replace(/,/g, "");
    if (!isNaN(plainNumber)) {
      const formattedNumber = formatNumber(plainNumber);
      handleEditChange("income", formattedNumber);
    }
  };

  const handleExpenseChange = (event) => {
    const input = event.target.value;
    const plainNumber = input.replace(/,/g, "");
    if (!isNaN(plainNumber)) {
      const formattedNumber = formatNumber(plainNumber);
      handleEditChange("expense", formattedNumber);
    }
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
    <Tr bgColor={""} _hover={{ bgColor: "gray.100 " }}>
      <Td>
        <Checkbox
          border={"1px solid lightgray"}
          onChange={(e) => {
            console.log("Row ID:", editRow.id, "Checked:", e.target.checked);
          }}
        />
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
            value={editRow.income}
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
            value={editRow.expense}
            onChange={handleExpenseChange}
          />
        </InputGroup>
      </Td>
      <Td>
        <MiniBoxGroup
          items={["급여", "여행", "간식", "식비"]}
          clickedList={editRow.categories}
          handleMiniBoxChange={handleCategoryChange}
        />
        <MiniBoxGroup
          items={["예시1", "예시2", "예시3", "예시4"]}
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
