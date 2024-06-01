import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { customAxios as axios } from "../customInstance.jsx";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../LoginProvider.jsx";

export function Login() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  function handleLogin() {
    axios
      .post("/api/member/token", loginMember)
      .then((res) => {
        account.login(res.data.token);
        mytoast("로그인 되었습니다", "success");
        navigate("/");
      })
      .catch(() => {})
      .finally(() => {});
  }

  function handleLoginMember(field, e) {
    setLoginMember((member) => ({
      ...member,
      [field]: e.target.value.trim(),
    }));
  }

  const [loginMember, setLoginMember] = useState({
    nickName: "",
    password: "",
    email: "",
  });

  const toast = useToast();
  function mytoast(text, status) {
    toast({
      description: text,
      status: status,
      position: "top",
      duration: "700",
    });
  }

  return (
    <Box>
      <Heading>로그인</Heading>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"30%"}>
          <FormControl>
            <FormLabel>아이디(닉네임)</FormLabel>
            <InputGroup>
              <Input
                value={loginMember.nickName}
                placeholder={"공백은 입력불가 합니다."}
                onChange={(e) => handleLoginMember("nickName", e)}
              />
              <InputRightElement w={75} mr={1}></InputRightElement>
            </InputGroup>
            비밀번호
            <Input
              value={loginMember.password}
              type={"password"}
              onChange={(e) => handleLoginMember("password", e)}
            />
            <FormLabel>이메일</FormLabel>
            <InputGroup>
              <Input
                value={loginMember.email}
                placeholder={"abc@abc.com"}
                onChange={(e) => handleLoginMember("email", e)}
              />
            </InputGroup>
            <Flex justifyContent="center">
              <Button
                onClick={handleLogin}
                colorScheme={"purple"}
                w={120}
                my={3}
              >
                로그인
              </Button>
            </Flex>
          </FormControl>
        </Center>
      </Flex>
    </Box>
  );
}
