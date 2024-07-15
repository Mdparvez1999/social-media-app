import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthContextProvider } from "./contexts/AuthContext.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./redux-store/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Router>
    <ChakraProvider>
      <Provider store={store}>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
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
  // </React.StrictMode>
);
