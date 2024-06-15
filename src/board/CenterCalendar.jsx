import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  ChakraProvider,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Spacer,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { eachDayOfInterval, format } from "date-fns";
import {
  CalendarWrapper,
  DayBox,
  DayLabelBox,
  EventBox,
  LeftCalendarContainer,
  MonthYearSelector,
  SmallCalendarContainer,
  TodayDayBox,
} from "./StyledComponents";
import Calendar from "../Calendar.jsx";
import DatePicker from "react-datepicker";

const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

const CenterCalendar = ({ month, year, setMonth, setYear }) => {
  // 상태 관리 추가
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const today = new Date();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [memo, setMemo] = useState("");
  const [events, setEvents] = useState([]);
  const [eventColors, setEventColors] = useState({});

  useEffect(() => {
    const newEventColors = {};
    events.forEach((event) => {
      if (!eventColors[event.name]) {
        newEventColors[event.name] = generateColor();
      } else {
        newEventColors[event.name] = eventColors[event.name];
      }
    });
    setEventColors(newEventColors);
  }, [events]);

  const handleDateClick = (day) => {
    const date = new Date(year, month, day);
    setSelectedDate(date); // 올바른 날짜로 설정
    onOpen();
  };

  // 날짜 선택 후 달력이 사라지도록 핸들러 수정
  const handleStartDateChange = (date) => {
    setStartDate(date);
    setShowStartDatePicker(false);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setShowEndDatePicker(false);
  };

  const handleSaveEvent = () => {
    if (eventName && startDate && endDate) {
      const newEvent = {
        name: eventName,
        start: startDate,
        end: endDate,
        memo,
      };
      setEvents([...events, newEvent]);
      setEventName("");
      setStartDate(new Date());
      setEndDate(new Date());
      setMemo("");
      onClose();
    }
  };

  const handleConfirm = (index) => {
    const updatedEvents = events.map((event, i) =>
      i === index ? { ...event, confirmed: !event.confirmed } : event,
    );
    setEvents(updatedEvents);
  };

  const generateColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 70%)`;
  };

  /* Center Calendar 핵심 로직 */

  const renderDays = () => {
    const days = [];
    const eventMap = new Map();
    const eventColors = new Map();

    // 고유한 색상을 생성하는 함수
    const generateColor = () => {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 70%, 70%)`;
    };

    // 각 이벤트에 고유한 색상을 할당
    events.forEach((event) => {
      if (!eventColors[event.name]) {
        eventColors[event.name] = generateColor();
      }
      eachDayOfInterval({
        start: new Date(event.start),
        end: new Date(event.end),
      }).forEach((date) => {
        const key = format(date, "yyyy-MM-dd");
        if (!eventMap.has(key)) {
          eventMap.set(key, []);
        }
        eventMap.get(key).push({ ...event, color: eventColors[event.name] });
      });
    });

    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<DayBox key={`empty-${i}`} />);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = date.toDateString() === today.toDateString();
      const dayOfWeek = (firstDayIndex + i - 1) % 7;
      const formattedDate = format(date, "yyyy-MM-dd");
      const eventsForDay = eventMap.get(formattedDate) || [];
      days.push(
        <DayBox
          key={i}
          as={isToday ? TodayDayBox : Box}
          onClick={() => handleDateClick(i)}
          hasEvents={eventsForDay.length > 0}
        >
          <Text
            fontSize="lg"
            color={dayOfWeek === 0 ? "red" : dayOfWeek === 6 ? "blue" : "black"}
          >
            {i}
          </Text>
          {eventsForDay.map((event, index) => (
            <EventBox
              key={index}
              isEventStart={
                format(new Date(event.start), "yyyy-MM-dd") === formattedDate
              }
              isEventEnd={
                format(new Date(event.end), "yyyy-MM-dd") === formattedDate
              }
              isEventInRange={
                format(new Date(event.start), "yyyy-MM-dd") !== formattedDate &&
                format(new Date(event.end), "yyyy-MM-dd") !== formattedDate
              }
              offset={index * 25}
              bgColor={event.color}
            >
              {format(new Date(event.start), "yyyy-MM-dd") === formattedDate
                ? event.name
                : ""}
            </EventBox>
          ))}
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
    <ChakraProvider>
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
      <Box mt={"10px"} display="flex" height="80vh">
        <Box width="10%">
          <LeftCalendarContainer>
            <Calendar
              month={month}
              year={year}
              setMonth={setMonth}
              setYear={setYear}
              onDateClick={handleDateClick}
            />
          </LeftCalendarContainer>
        </Box>
        <Box
          width="300px"
          p={4}
          bg="gray.100"
          overflowY="auto"
          borderRadius={"15px"}
        >
          <Text fontSize="20px" fontWeight={"bold"}>
            일정
          </Text>
          <VStack spacing={4}>
            {events.map((event, index) => (
              <Box
                key={index}
                p={4}
                bg="white"
                borderRadius="md"
                boxShadow="md"
                width="100%"
              >
                <HStack justifyContent="space-between">
                  <Text mb={1} fontWeight={"bold"}>
                    {event.name}
                  </Text>
                  <Badge
                    colorScheme={event.confirmed ? "blue" : "red"}
                    borderRadius={"5px"}
                    onClick={() => handleConfirm(index)}
                    cursor="pointer"
                  >
                    {event.confirmed ? "확인됨" : "미확인"}
                  </Badge>
                </HStack>
                <Text>{event.date}</Text>
                <Text>
                  {event.start} - {event.end}
                </Text>
                <Text>{event.memo}</Text>
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>일정 추가</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="일정 이름"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
              <Box width="100%">
                <Text>시작일자</Text>
                <Input
                  value={format(startDate, "yyyy-MM-dd")}
                  readOnly
                  onClick={() => setShowStartDatePicker(true)}
                />
                {showStartDatePicker && (
                  <DatePicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="yyyy-MM-dd"
                    inline
                  />
                )}
              </Box>
              <Box width="100%">
                <Text>종료일자</Text>
                <Input
                  value={format(endDate, "yyyy-MM-dd")}
                  readOnly
                  onClick={() => setShowEndDatePicker(true)}
                />
                {showEndDatePicker && (
                  <DatePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="yyyy-MM-dd"
                    inline
                  />
                )}
              </Box>
              <Textarea
                placeholder="메모"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSaveEvent}>
              저장
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

const CalendarContainer = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  return (
    <CalendarWrapper>
      <CenterCalendar
        month={month}
        year={year}
        setMonth={setMonth}
        setYear={setYear}
      />
    </CalendarWrapper>
  );
};

export default CalendarContainer;
