import React from "react";
import { Box, Flex, Spacer } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Navbar(props) {
  let navigate = useNavigate();
  const navCss = {
    fontSize: "1.5rem",
    cursor: "pointer",
    _hover: { bgColor: "gray.200" },
    // border: "0.5px solid black",
  };
  return (
    <Box>
      <Flex gap={3}>
        <Box {...navCss} onClick={navigate("/")}>
          <FontAwesomeIcon icon={faHouse} />
        </Box>
        <Box {...navCss}>부</Box>
        <Box {...navCss}>설정</Box>

        <Spacer />
        <Box {...navCss}>
          <FontAwesomeIcon icon={faUser} />
        </Box>

        <Box
          onClick={() => {
            navigate("/page1");
          }}
          {...navCss}
        >
          정보설정
        </Box>

        <Box {...navCss}>내역보기</Box>

        <Box {...navCss}>회원가입</Box>

        <Box {...navCss}>로그인</Box>

        <Box {...navCss}>로그아웃</Box>
      </Flex>
    </Box>
  );
}

export default Navbar;
