import styled from "@emotion/styled";
import { Box, HStack, VStack } from "@chakra-ui/react";
/* StyledComponents.jsx 파일 (Calendar 들의 CSS 파트)  */

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
  width: 300px;
  align-items: center;
`;

export const DayBox = styled(Box)`
  background-color: ${(props) => props.bg || "white"};
  color: ${(props) => props.color || "black"};
  font-weight: 500;
  height: 115px;
  padding: 8px;
  margin: 1px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  text-indent: 5px;
`;

export const EmptyDayBox = styled(Box)`
  background-color: transparent;
  color: transparent;
`;

export const TodayDayBox = styled(Box)`
  background-color: lightgray;
  color: black;
  padding: 8px;
  margin: 1px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border: 2px solid gray; /* Highlight border for today */
`;

export const DayLabelBox = styled(Box)`
  background-color: white;
  font-size: 13px;
  color: ${(props) => props.color || "black"};
  padding: 5px;
  margin: 1px;
  //border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-weight: bold;
`;
