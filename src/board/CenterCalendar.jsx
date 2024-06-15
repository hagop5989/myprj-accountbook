import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Select,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import {
  CalendarWrapper,
  DayBox,
  DayLabelBox,
  EmptyDayBox,
  LeftCalendarContainer,
  MonthYearSelector,
  SmallCalendarContainer,
  TodayDayBox,
} from "./StyledComponents";
import Calendar from "../Calendar.jsx";
/* CenterCalendar.jsx 파일  */
const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

const CenterCalendar = ({ month, year, setMonth, setYear }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const today = new Date();

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<EmptyDayBox key={`empty-${i}`} />);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday =
        i === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();
      const dayOfWeek = (firstDayIndex + i - 1) % 7;
      days.push(
        <DayBox key={i} as={isToday ? TodayDayBox : Box}>
          <Text
            fontSize="lg"
            color={dayOfWeek === 0 ? "red" : dayOfWeek === 6 ? "blue" : "black"}
          >
            {i}
          </Text>
        </DayBox>,
      );
    }
    return days;
  };

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i);
  }

  const handleTodayClick = () => {
    const today = new Date();
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  };

  return (
    <SmallCalendarContainer>
      <Flex>
        <Button onClick={handleTodayClick}>오늘</Button>
        <Spacer w={"600px"} />
        <MonthYearSelector>
          <Button onClick={() => setMonth(month === 0 ? 11 : month - 1)}>
            {"<"}
          </Button>

          <Select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </Select>
          <Select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i).map((m) => (
              <option key={m} value={m}>
                {`${m + 1}월`}
              </option>
            ))}
          </Select>
          <Button onClick={() => setMonth(month === 11 ? 0 : month + 1)}>
            {">"}
          </Button>
        </MonthYearSelector>
      </Flex>
      <SimpleGrid columns={7} spacing={1} w="full">
        {daysOfWeek.map((day, index) => (
          <DayLabelBox
            key={index}
            color={index === 0 ? "red" : index === 6 ? "blue" : "black"}
          >
            {day}
          </DayLabelBox>
        ))}
      </SimpleGrid>
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

function SideBar() {
  return null;
}

const CalendarContainer = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const handleDateClick = (date) => {
    setMonth(date.getMonth());
    setYear(date.getFullYear());
  };

  return (
    <Box>
      <SideBar />
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
            onDateClick={handleDateClick}
          />
        </LeftCalendarContainer>
      </CalendarWrapper>
    </Box>
  );
};

export default CalendarContainer;
