import styled from "@emotion/styled";
import { Box, HStack, VStack } from "@chakra-ui/react";

export const CalendarWrapper = styled(Box)`
  display: flex;
`;

export const SmallCalendarContainer = styled(VStack)`
  width: 1000px;
  padding: 8px;
`;

export const LeftCalendarContainer = styled(Box)`
  flex: 1;
  margin-left: -529px;
  margin-top: 21px;
  padding: 16px;
`;

export const MonthYearSelector = styled(HStack)`
  justify-content: space-between;
  align-items: center;
`;

export const DayBox = styled(Box)`
  background-color: ${(props) => props.bg || "white"};
  color: ${(props) => props.color || "black"};
  padding: 8px;
  margin: 1px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  text-indent: 10px;
`;

export const EmptyDayBox = styled(Box)`
  background-color: transparent;
  color: transparent;
`;
