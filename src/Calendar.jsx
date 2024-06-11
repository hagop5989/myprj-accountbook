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

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [employeeName, setEmployeeName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [memo, setMemo] = useState("");
  const [events, setEvents] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDateClick = (date) => {
    setSelectedDate(date);
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
    if (employeeName && startTime && endTime) {
      const hours = calculateHours(startTime, endTime);
      const newEvent = {
        name: employeeName,
        date: format(selectedDate, "yyyy-MM-dd"),
        start: startTime,
        end: endTime,
        hours,
        memo,
        confirmed: false,
      };
      setEvents([...events, newEvent]);
      setEmployeeName("");
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
      <Box display="flex" width="100vw" height="100vh">
        <Box width="70%" p={4}>
          <Box height="100%">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateClick}
              inline
              calendarClassName="full-width-calendar"
            />
          </Box>
        </Box>
        <Box width="30%" p={4} bg="gray.100" overflowY="auto">
          <Text fontSize="2xl" mb={4}>
            Scheduled Events
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
                    onClick={() => handleConfirm(index)}
                    cursor="pointer"
                  >
                    {event.confirmed ? "Confirmed" : "Unconfirmed"}
                  </Badge>
                </HStack>
                <Text>{event.date}</Text>
                <Text>
                  {event.start} - {event.end} ({event.hours} hours)
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
          <ModalHeader>Add Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Employee Name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
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
                  Estimated Hours: {calculateHours(startTime, endTime)} hours
                </Text>
              )}
              <Textarea
                placeholder="Memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSaveEvent}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default Calendar;
