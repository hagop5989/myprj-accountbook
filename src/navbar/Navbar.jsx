import React, { useContext, useEffect, useState } from "react";
import { Box, Flex, Spacer, VStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../LoginProvider.jsx";

function Navbar(props) {
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const [showBoxes, setShowBoxes] = useState(true);
  useEffect(() => {
    setShowBoxes(account.isLoggedIn());
  }, [account]);

  const navCss = {
    fontSize: "1.5rem",
    cursor: "pointer",
    _hover: { bgColor: "gray.100" },
    padding: "3px",
    borderRadius: "md",
  };

  return (
    <Box marginY={"0px"}>
      <Flex gap={3}>
        <Box
          {...navCss}
          mx={5}
          onClick={() => {
            navigate("/login");
          }}
        >
          <FontAwesomeIcon icon={faHouse} />
        </Box>
        <VStack display={showBoxes ? "block" : "none"}>
          <Flex gap={3}>
            <Box {...navCss} cursor={"default"} onClick={() => navigate("/")}>
              가계부 작성
            </Box>
            <Spacer w={1000} />
            <Box {...navCss} cursor={"default"}>
              {account.nickName}
              {"   "}
              <FontAwesomeIcon icon={faUser} />
            </Box>
            <Box onClick={() => navigate("/analysis")} {...navCss}>
              통계보기
            </Box>
            <Box
              ml={1}
              onClick={() => {
                navigate("/page1");
              }}
              {...navCss}
            >
              가계부설정
            </Box>
          </Flex>
        </VStack>
        <VStack display={!showBoxes ? "block" : "none"}>
          <Flex gap={5}>
            <Box onClick={() => navigate("/signup")} {...navCss}>
              회원가입
            </Box>

            <Box onClick={() => navigate("/logIn")} {...navCss}>
              로그인
            </Box>
          </Flex>
        </VStack>

        <VStack display={showBoxes ? "block" : "none"}>
          <Box
            onClick={() => {
              account.logout();
              navigate("/login");
            }}
            {...navCss}
          >
            로그아웃
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
}

export default Navbar;
