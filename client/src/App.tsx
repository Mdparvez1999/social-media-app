import Hero from "./pages/hero/Hero";
import Home from "./pages/home/Home";
import { Routes, Route } from "react-router-dom";
import Search from "./pages/search/Search";
import Notifications from "./pages/notifications/Notifications";
import Profile from "./pages/profile/Profile";
import Chats from "./pages/chats/Chats";
import Signup from "./components/auth/signup/Signup";
import Login from "./components/auth/login/Login";
import { useAuthContext } from "./contexts/AuthContext";
import { Box } from "@chakra-ui/react";

function App() {
  const { currentUser } = useAuthContext();
  return (
    <>
      <Box>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" loader element={<Login />} />
          <Route path="/app" element={currentUser ? <Hero /> : <Login />}>
            <Route path="home" element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="chats" element={<Chats />} />
          </Route>
        </Routes>
      </Box>
    </>
  );
}

export default App;
