import React from "react";
import { Box, Flex, Spacer } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Navbar(props) {
  const navigate = useNavigate();
  const navCss = {
    fontSize: "1.5rem",
    cursor: "pointer",
    _hover: { bgColor: "gray.200" },
    padding: "3px",
    borderRadius: "md",
  };
  return (
    <Box marginY={"20px"}>
      <Flex gap={3}>
        <Box {...navCss} mx={5}>
          <FontAwesomeIcon icon={faHouse} />
        </Box>

        <Box {...navCss} cursor={"default"} onClick={() => navigate("/")}>
          가계부 작성
        </Box>

        <Spacer w={900} />
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

        <Box onClick={() => navigate("/analysis")} {...navCss}>
          통계보기
        </Box>

        <Box {...navCss}>회원가입</Box>

        <Box {...navCss}>로그인</Box>

        <Box {...navCss}>로그아웃</Box>
      </Flex>
    </Box>
  );
}

export default Navbar;
