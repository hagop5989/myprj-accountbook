import { Button, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Page1 } from "./Page1.jsx";
import BoardList from "./board/BoardList.jsx";
import "./App.css";
import Analysis from "./board/Analysis.jsx";
import React, { useState } from "react";
import { Signup } from "./login/Signup.jsx";
import { Login } from "./login/Login.jsx";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import { LoginProvider } from "./LoginProvider.jsx";
import axios from "axios";
import { Home } from "./home/Home.jsx";

// axios interceptor 설정
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const chakraTheme = extendTheme({
  fonts: {
    body: "GmarketSansMedium, sans-serif",
    heading: "GmarketSansMedium, sans-serif",
  },
});

const lightTheme = {
  body: "#FFF",
  text: "#000",
};

const darkTheme = {
  body: "#000",
  text: "#FFF",
};

const themes = {
  light: lightTheme,
  dark: darkTheme,
};

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.body};
  color: ${(props) => props.theme.text};
  min-height: 100vh;
`;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { index: true, element: <BoardList /> },
      { path: "page1", element: <Page1 /> },
      { path: "page", element: <Page1 /> },
      { path: "analysis", element: <Analysis /> },
      { path: "signup", element: <Signup /> },
      { path: "logIn", element: <Login /> },
    ],
  },
]);

function App() {
  const [themeMode, setThemeMode] = useState("light");

  const toggleTheme = () => {
    setThemeMode((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <LoginProvider>
      <ChakraProvider theme={chakraTheme}>
        <EmotionThemeProvider theme={themes[themeMode]}>
          <Wrapper>
            <Button bgColor={"gray.100"} onClick={toggleTheme}>
              화면모드 전환
            </Button>
            <RouterProvider router={router} />
          </Wrapper>
        </EmotionThemeProvider>
      </ChakraProvider>
    </LoginProvider>
  );
}

export default App;
