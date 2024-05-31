import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function Analysis(props) {
  const [dbRows, setDbRows] = useState([]);
  const [postSuccess, setPostSuccess] = useState(false);
  const toast = useToast();

  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((res) => {
        setDbRows(
          res.data.boardList.map((board) => ({
            ...board,
            income: Number(board.income),
            expense: Number(board.expense),
            date: new Date(board.date),
          })),
        );
      })
      .catch((e) => console.error("Error fetching board list:", e));
  }, [postSuccess]);

  const getMonthlyData = () => {
    const monthlyData = {};

    dbRows.forEach((row) => {
      const month = row.date.getMonth() + 1;
      const year = row.date.getFullYear();
      const key = `${year}-${String(month).padStart(2, "0")}`;

      if (!monthlyData[key]) {
        monthlyData[key] = { month: key, income: 0, expense: 0, total: 0 };
      }

      monthlyData[key].income += row.income;
      monthlyData[key].expense += row.expense;
      monthlyData[key].total += row.income - row.expense;
    });

    const currentYear = new Date().getFullYear();
    for (let month = 1; month <= 12; month++) {
      const key = `${currentYear}-${String(month).padStart(2, "0")}`;
      if (!monthlyData[key]) {
        monthlyData[key] = { month: key, income: 0, expense: 0, total: 0 };
      }
    }

    return Object.values(monthlyData).sort(
      (a, b) => new Date(a.month) - new Date(b.month),
    );
  };

  return (
    <Box>
      <Button
        m={2}
        fontWeight={"medium"}
        colorScheme={"blue"}
        onClick={() => setPostSuccess(!postSuccess)}
      >
        새로고침
      </Button>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={getMonthlyData()}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#8884d8" />
          <Bar dataKey="expense" fill="#82ca9d" />
          <Bar dataKey="total" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
      <Table>
        <Thead>
          <Tr bgColor={"gray.50"}>
            <Th fontSize={"1rem"}>날짜</Th>
            <Th fontSize={"1rem"}>수입</Th>
            <Th fontSize={"1rem"}>지출</Th>
            <Th fontSize={"1rem"}>총합</Th>
          </Tr>
        </Thead>
        <Tbody>
          {dbRows.map((row) => (
            <Tr key={row.id}>
              <Td>{row.date.toISOString().split("T")[0]}</Td>
              <Td>{row.income.toLocaleString()}</Td>
              <Td>{row.expense.toLocaleString()}</Td>
              <Td>{(row.income - row.expense).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default Analysis;
