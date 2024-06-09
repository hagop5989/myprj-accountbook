import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { customAxios as axios } from "../customInstance.jsx";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const [newMember, setNewMember] = useState({
    nickName: "",
    password: "",
    email: "",
  });
  const [passwordCheck, setPasswordCheck] = useState("");
  const isCheckedPassword = newMember.password === passwordCheck;
  const [emailCheck, setEmailCheck] = useState(false);
  const [nickNameCheck, setNickNameCheck] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  function mytoast(text, status) {
    toast({
      description: text,
      status: status,
      position: "top",
      duration: "700",
    });
  }

  function handleSignupEmailCheck() {
    axios
      .get(`/api/member/signupCheck?email=${newMember.email}`)
      .then(() => {
        mytoast("회원가입 가능합니다.", "info");
        setEmailCheck(true);
      })
      .catch((e) => {
        if (e.response.status === 400) {
          mytoast("중복되는 값입니다.", "error");
          setEmailCheck(false);
        }
      })
      .finally(() => {});
  }

  function handleSignupNickNameCheck() {
    axios
      .get(`/api/member/signupCheck?nickName=${newMember.nickName}`)
      .then(() => {
        mytoast("회원가입 가능합니다.", "info");
        setNickNameCheck(true);
      })
      .catch((e) => {
        if (e.response.status === 400) {
          mytoast("중복되는 값입니다.", "error");
          setNickNameCheck(false);
        }
      })
      .finally(() => {});
  }

  function handleSetMember(field, e) {
    setNewMember((member) => ({
      ...member,
      [field]: e.target.value.trim(),
    }));
  }

  function handleSignup() {
    axios
      .post("/api/member/signup", newMember)
      .then(() => {
        mytoast("회원가입 완료되었습니다.", "success");
      })
      .catch((e) => {
        if (e.response.status === 400) {
          mytoast("입력 값을 다시 확인해주세요", "error");
        }
      })
      .finally(() => {
        setNewMember({
          nickName: "",
          password: "",
          email: "",
        });
        setPasswordCheck("");
        navigate("/");
      });
  }

  return (
    <Box>
      <Heading>회원가입</Heading>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Center w={"30%"}>
          <FormControl>
            <FormLabel>아이디(닉네임)</FormLabel>
            <InputGroup>
              <Input
                placeholder={"공백은 입력불가 합니다."}
                value={newMember.nickName}
                onChange={(e) => {
                  handleSetMember("nickName", e);
                  setNickNameCheck(false);
                }}
              />
              <InputRightElement w={75} mr={1}>
                <Button
                  onClick={handleSignupNickNameCheck}
                  bgColor={"blue.400"}
                  color={"white"}
                  fontWeight={"medium"}
                >
                  중복확인
                </Button>
              </InputRightElement>
            </InputGroup>
            비밀번호
            <Input
              type={"password"}
              value={newMember.password}
              onChange={(e) => handleSetMember("password", e)}
            />
            비밀번호 확인
            <Input
              type={"text"}
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
            {!isCheckedPassword && (
              <FormHelperText>비밀번호 일치여부를 확인해주세요.</FormHelperText>
            )}
            <FormLabel>이메일</FormLabel>
            <InputGroup>
              <Input
                value={newMember.email}
                placeholder={"abc@abc.com"}
                onChange={(e) => {
                  handleSetMember("email", e);
                  setEmailCheck(false);
                }}
              />
              <InputRightElement w={75} mr={1}>
                <Button
                  onClick={handleSignupEmailCheck}
                  bgColor={"blue.400"}
                  color={"white"}
                  fontWeight={"medium"}
                >
                  중복확인
                </Button>
              </InputRightElement>
            </InputGroup>
            <Flex justifyContent="center">
              <Button
                isDisabled={!emailCheck || !nickNameCheck}
                onClick={handleSignup}
                colorScheme={"purple"}
                w={120}
                my={3}
              >
                회원가입
              </Button>
            </Flex>
          </FormControl>
        </Center>
      </Flex>
    </Box>
  );
}
