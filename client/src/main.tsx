import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./redux-store/store.ts";
import SocketContextProvider from "./context/socketContext.tsx";

const theme = extendTheme({
  breakpoints: {
    xs: "20em",
    sm: "30em", // 480px
    md: "48em", // 768px
    lg: "62em", // 992px
    xl: "80em", // 1280px
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Router>
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </Provider>
    </ChakraProvider>
    <ToastContainer
      position="top-center"
      autoClose={2000}
      newestOnTop={false}
      closeOnClick
      draggable
      pauseOnHover={false}
    />
  </Router>
);
