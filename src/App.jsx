import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./home/Home.jsx";
import { Page1 } from "./Page1.jsx";
import BoardList from "./board/BoardList.jsx";
import "./App.css";
import Analysis from "./board/Analysis.jsx";

const theme = extendTheme({
  fonts: {
    body: "GmarketSansMedium, sans-serif",
    heading: "GmarketSansMedium, sans-serif",
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { index: true, element: <BoardList /> },
      { path: "page1", element: <Page1 /> },
      { path: "page", element: <Page1 /> },
      { path: "analysis", element: <Analysis /> },
    ],
  },
]);

function App() {
  return (
    <>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </>
  );
}

export default App;
