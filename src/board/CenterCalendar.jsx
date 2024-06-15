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

const predefinedColors = [
  "#00aaff",
  "#ff0066",
  "#00cc99",
  "#ffcc00",
  "#6600cc",
  "#cc00cc",
  "#ff9900",
  "#3399ff",
  "#33cc33",
  "#cc3333",
  "#009999",
  "#ffcc99",
  "#cc6699",
  "#993399",
  "#6699cc",
];

const CenterCalendar = ({ month, year, setMonth, setYear }) => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [memo, setMemo] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#00aaff"); // 기본값 하늘색
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventColors, setEventColors] = useState({});

  useEffect(() => {
    const newEventColors = {};
    events.forEach((event) => {
      if (!eventColors[event.name]) {
        newEventColors[event.name] = selectedColor;
      } else {
        newEventColors[event.name] = eventColors[event.name];
      }
    });
    setEventColors(newEventColors);
  }, [events, selectedColor]);

  const handleDateClick = (day) => {
    const date = new Date(year, month, day);
    setSelectedDate(date);
    setStartDate(date); // 클릭한 날짜를 시작일자로 설정
    onOpen();
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setShowStartDatePicker(false);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setShowEndDatePicker(false);
  };

  const handleSaveEvent = () => {
    const overlappingEvents = events.filter(
      (event) =>
        startDate <= new Date(event.end) && endDate >= new Date(event.start),
    );

    if (overlappingEvents.length >= 3) {
      alert("일정은 최대 3개까지 추가할 수 있습니다.");
      return;
    }

    if (eventName && startDate && endDate) {
      const newEvent = {
        name: eventName,
        start: startDate,
        end: endDate,
        memo,
        color: selectedColor,
      };
      setEvents([...events, newEvent]);
      setEventName("");
      setStartDate(new Date());
      setEndDate(new Date());
      setMemo("");
      setSelectedColor("#00aaff");
      onClose();
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const renderDays = () => {
    const days = [];
    const eventMap = new Map();

    events.forEach((event) => {
      eachDayOfInterval({
        start: new Date(event.start),
        end: new Date(event.end),
      }).forEach((date) => {
        const key = format(date, "yyyy-MM-dd");
        if (!eventMap.has(key)) {
          eventMap.set(key, []);
        }
        eventMap.get(key).push({ ...event, color: event.color });
      });
    });

    const eventPositions = new Map(); // 이벤트 위치를 저장할 맵

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const today = new Date(); // 여기 추가

    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<DayBox key={`empty-${i}`} />);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = date.toDateString() === today.toDateString();
      const dayOfWeek = (firstDayIndex + i - 1) % 7;
      const formattedDate = format(date, "yyyy-MM-dd");
      const eventsForDay = eventMap.get(formattedDate) || [];

      // 이벤트 위치를 계산
      eventsForDay.forEach((event, index) => {
        const start = format(new Date(event.start), "yyyy-MM-dd");
        const end = format(new Date(event.end), "yyyy-MM-dd");

        // 기존 위치를 검사하여 새로운 위치를 계산
        let position = 0;
        while (true) {
          const overlapping = eventsForDay.some((e, idx) => {
            if (idx === index) return false;
            const eStart = format(new Date(e.start), "yyyy-MM-dd");
            const eEnd = format(new Date(e.end), "yyyy-MM-dd");
            return (
              eStart <= end &&
              eEnd >= start &&
              eventPositions.get(e.name) === position
            );
          });
          if (!overlapping) break;
          position++;
        }
        eventPositions.set(event.name, position);
      });

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
              offset={eventPositions.get(event.name) * 25}
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
                <Text>{event.memo}</Text>
                <Text>
                  {format(new Date(event.start), "yyyy-MM-dd")} -{" "}
                  {format(new Date(event.end), "yyyy-MM-dd")}
                </Text>{" "}
                {/* 여기를 수정 */}
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
              <Box width="100%">
                <Text>색상 선택</Text>
                <Box display="flex" flexWrap="wrap">
                  {predefinedColors.map((color, index) => (
                    <Box
                      key={index}
                      width="20px"
                      height="20px"
                      bg={color}
                      m="2px"
                      borderRadius="50%"
                      cursor="pointer"
                      border={
                        selectedColor === color ? "2px solid black" : "none"
                      }
                      onClick={() => handleColorChange(color)}
                    />
                  ))}
                </Box>
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
