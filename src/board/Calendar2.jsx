import React, { useState } from "react";
import { Button, Select, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import {
  CalendarWrapper,
  DayBox,
  EmptyDayBox,
  LeftCalendarContainer,
  MonthYearSelector,
  SmallCalendarContainer,
} from "./StyledComponents";
import Calendar from "../Calendar.jsx";

const CenterCalendar = ({ month, year, setMonth, setYear }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<EmptyDayBox key={`empty-${i}`} />);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      let bg = "white";
      let color = "black";
      let label = "";

      days.push(
        <DayBox bg={bg} color={color} key={i}>
          <Text fontSize="xl">{i}</Text>
          <Text fontSize="sm">{label}</Text>
        </DayBox>,
      );
    }
    return days;
  };

  const handleMonthChange = (event) => {
    setMonth(parseInt(event.target.value));
  };

  const handleYearChange = (event) => {
    setYear(parseInt(event.target.value));
  };

  return (
    <VStack spacing={4} p={4}>
      <MonthYearSelector>
        <Select value={year} onChange={handleYearChange}>
          {[2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </Select>
        <Select value={month} onChange={handleMonthChange}>
          {[
            "1월",
            "2월",
            "3월",
            "4월",
            "5월",
            "6월",
            "7월",
            "8월",
            "9월",
            "10월",
            "11월",
            "12월",
          ].map((m, index) => (
            <option key={index} value={index}>
              {m}
            </option>
          ))}
        </Select>
      </MonthYearSelector>
      <SimpleGrid columns={7} spacing={1} w="full">
        {renderDays()}
      </SimpleGrid>
    </VStack>
  );
};

const CenterCalendar = ({ month, year, setMonth, setYear }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<EmptyDayBox key={`empty-${i}`} />);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <DayBox key={i}>
          <Text fontSize="lg">{i}</Text>
        </DayBox>,
      );
    }
    return days;
  };

  return (
    <SmallCalendarContainer>
      <MonthYearSelector>
        <Button onClick={() => setMonth(month === 0 ? 11 : month - 1)}>
          {"<"}
        </Button>
        <Text fontSize={"lg"} fontWeight={"bold"} mx={2}>
          {`${year}년 ${month + 1}월`}
        </Text>
        <Button onClick={() => setMonth(month === 11 ? 0 : month + 1)}>
          {">"}
        </Button>
      </MonthYearSelector>
      <SimpleGrid
        h={"700px"}
        fontWeight={"bold"}
        columns={7}
        spacing={1}
        w="full"
      >
        {renderDays()}
      </SimpleGrid>
    </SmallCalendarContainer>
  );
};

const CalendarContainer = () => {
  const [month, setMonth] = useState(7);
  const [year, setYear] = useState(2024);

  return (
    <CalendarWrapper>
      <CenterCalendar
        month={month}
        year={year}
        setMonth={setMonth}
        setYear={setYear}
      />
      <LeftCalendarContainer>
        <Calendar
          month={month}
          year={year}
          setMonth={setMonth}
          setYear={setYear}
        />
      </LeftCalendarContainer>
    </CalendarWrapper>
  );
};

export default CalendarContainer;
