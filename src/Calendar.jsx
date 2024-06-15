import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Badge,
  Box,
  Button,
  ChakraProvider,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";

/* Calendar.jsx 파일(왼쪽 Calendar 부분)  */

const Calendar = ({ onDateClick }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [memo, setMemo] = useState("");
  const [events, setEvents] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onDateClick(date); // 이 부분 추가
    onOpen();
  };

  const calculateHours = (start, end) => {
    const startHour = parseInt(start.split(":")[0]);
    const startMinute = parseInt(start.split(":")[1]);
    const endHour = parseInt(end.split(":")[0]);
    const endMinute = parseInt(end.split(":")[1]);

    const totalStartMinutes = startHour * 60 + startMinute;
    const totalEndMinutes = endHour * 60 + endMinute;

    return (totalEndMinutes - totalStartMinutes) / 60;
  };

  const handleSaveEvent = () => {
    if (eventName && startTime && endTime) {
      const hours = calculateHours(startTime, endTime);
      const newEvent = {
        name: eventName,
        date: format(selectedDate, "yyyy-MM-dd"),
        start: startTime,
        end: endTime,
        hours,
        memo,
        confirmed: false,
      };
      setEvents([...events, newEvent]);
      setEventName("");
      setStartTime("");
      setEndTime("");
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

  return (
    <ChakraProvider>
      <Box mt={"10px"} ml="-733px" display="flex" width="95vw" height="80vh">
        <Box width="70%">
          <Box>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateClick}
              inline
              calendarClassName="full-width-calendar"
            />
          </Box>
        </Box>
        <Box
          width="15%"
          mt={"-47px"}
          p={4}
          bg="gray.100"
          overflowY="auto"
          borderRadius={"15px"}
        >
          <Text fontSize="20px" fontWeight={"bold"}>
            오늘의 일정
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
                  <Text>{event.name}</Text>
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
                  {event.start} - {event.end} 약({parseInt(event.hours)} 시간)
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
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              {startTime && endTime && (
                <Text>
                  소요 시간: {calculateHours(startTime, endTime)} 시간
                </Text>
              )}
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

export default Calendar;
