import { Box, Flex, useToast } from "@chakra-ui/react";
import * as PropTypes from "prop-types";
import { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import { useNavigate } from "react-router-dom";
import { mytoast } from "./App.jsx";

function MyBox1({ text }) {
  return (
    <Box
      textAlign="center"
      fontSize="3rem"
      margin="30px"
      borderRadius="md"
      border="3px solid black"
      boxSize={"300px"}
      lineHeight={"300px"}
    >
      {text}
    </Box>
  );
}

MyBox1.propTypes = { children: PropTypes.node };

export function Page1() {
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const toast = useToast();

  if (!account.isLoggedIn()) {
    mytoast(toast, "로그인 필요!!", "error");
    account.logout();
    navigate("/login");
  }
  return (
    <Flex height={"100vh"} alignItems="center" justifyContent={"center"}>
      <Box>
        <Box>
          등록
          <Flex>
            <MyBox1 text={"내 계좌"}></MyBox1>
            <MyBox1 text={"내 카드"}></MyBox1>
          </Flex>
        </Box>
        <Box>page</Box>
      </Box>
    </Flex>
  );
}
