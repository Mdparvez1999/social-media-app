import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./redux-store/store.ts";
import SocketContextProvider from "./context/socketContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Router>
    <ChakraProvider>
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
