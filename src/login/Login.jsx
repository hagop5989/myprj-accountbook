import { Box } from "@chakra-ui/react";
import { customAxios as axios } from "../customInstance.jsx";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../LoginProvider.jsx";
import KakaoMap from "./KakaoMap.jsx";
import { JobsList2 } from "./JobDetail.jsx";

function handleMap() {
  return (
    <Box>
      <KakaoMap />
    </Box>
  );
}

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
      .catch((e) => {
        if (e.response.status === 403) {
          mytoast(`로그인 실패 !\n 입력 값을 확인 해주세요.`, "error");
        }
      })
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

  function mytoast(text, status) {
    toast({
      description: <Box whiteSpace="pre-line">{text}</Box>,
      status: status,
      position: "top",
      duration: "700",
    });
  }

  return (
    <Box>
      {/*<Heading>로그인</Heading>*/}
      {/*<Flex justifyContent={"center"} alignItems={"center"}>*/}
      {/*  <Center w={"30%"}>*/}
      {/*    <FormControl>*/}
      {/*      <FormLabel>아이디(닉네임)</FormLabel>*/}
      {/*      <InputGroup>*/}
      {/*        <Input*/}
      {/*          value={loginMember.nickName}*/}
      {/*          placeholder={"공백은 입력불가 합니다."}*/}
      {/*          onChange={(e) => handleLoginMember("nickName", e)}*/}
      {/*        />*/}
      {/*        <InputRightElement w={75} mr={1}></InputRightElement>*/}
      {/*      </InputGroup>*/}
      {/*      비밀번호*/}
      {/*      <Input*/}
      {/*        value={loginMember.password}*/}
      {/*        type={"password"}*/}
      {/*        onChange={(e) => handleLoginMember("password", e)}*/}
      {/*      />*/}
      {/*      <FormLabel>이메일</FormLabel>*/}
      {/*      <InputGroup>*/}
      {/*        <Input*/}
      {/*          value={loginMember.email}*/}
      {/*          placeholder={"abc@abc.com"}*/}
      {/*          onChange={(e) => handleLoginMember("email", e)}*/}
      {/*        />*/}
      {/*      </InputGroup>*/}
      {/*      <Flex justifyContent="center">*/}
      {/*        <Button*/}
      {/*          onClick={handleLogin}*/}
      {/*          colorScheme={"purple"}*/}
      {/*          w={120}*/}
      {/*          my={3}*/}
      {/*        >*/}
      {/*          로그인*/}
      {/*        </Button>*/}
      {/*      </Flex>*/}
      {/*    </FormControl>*/}
      {/*  </Center>*/}
      {/*</Flex>*/}
      <Box>
        <JobsList2 />
      </Box>
    </Box>
  );
}
