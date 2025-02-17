import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import Hero from "./pages/hero/Hero";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Signup from "./components/auth/signup/Signup";
import Login from "./components/auth/login/Login";
import { useAppSelector } from "./hooks/hooks";
import ViewUserProfile from "./components/profile/edituserprofile/ViewUserProfileDetails";
import EditGeneralDetails from "./components/profile/edituserprofile/EditGeneralDetails";
import EditPassword from "./components/profile/edituserprofile/EditPassword";
import AdvancedAccountSettings from "./components/profile/edituserprofile/AdvancedAccountSettings";

import UsersProfile from "./components/users/UsersProfile";
import Messages from "./pages/messages/Messages";
import ViewCurrentUsersPostsInMobile from "./components/mobileComponents/MobileProfile/ViewCurrentUsersPostsInMobile";
import SearchInMobile from "./pages/search/SearchInMobile";
import NotificationsInMobile from "./pages/notifications/NotificationsInMobile";
import ViewSelectedUsersPostInMobile from "./components/mobileComponents/selectedUsersProfileInMobile/ViewSelectedUsersPostInMobile";
import MessageContainerForMobile from "./components/mobileComponents/mobileMessages/MessageContainerForMobile";
import MessageContainer from "./components/messages/MessageContainer";
import MessageContainerBox from "./components/messages/MessageContainerBox";
import MessageComponent from "./components/mobileComponents/mobileMessages/MessageComponent";
import { useEffect } from "react";

function App() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const userData = localStorage.getItem("currentUser");

  useEffect(() => {
    const expirationTime = localStorage.getItem("expirationTime");

    if (expirationTime) {
      const currentTime = new Date().getTime();
      const expirationTimeObj = new Date(expirationTime);

      if (currentTime > expirationTimeObj.getTime()) {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        localStorage.removeItem("expirationTime");
        window.location.href = "/login"; // Redirect to login
      }
    }
  }, []);

  return (
    <Box>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/app/*"
          element={
            currentUser && userData ? <HeroRoutes /> : <Navigate to="/login" />
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Box>
  );
}

function HeroRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Hero />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="usersprofile/:userId" element={<UsersProfile />} />

        <Route path="messages" element={<Messages />}>
          <Route index element={<MessageContainerBox />} />
          <Route path=":conversationId" element={<MessageContainer />} />
        </Route>

        <Route path="messagesinmobile" element={<MessageComponent />} />

        <Route
          path="messagecontainer/:conversationId"
          element={<MessageContainerForMobile />}
        />

        <Route path="search" element={<SearchInMobile />} />
        <Route path="notifications" element={<NotificationsInMobile />} />
        <Route path="profile" element={<Profile />} />

        <Route
          path="viewpost/:postId"
          element={<ViewCurrentUsersPostsInMobile />}
        />

        <Route
          path="viewselecteduserspost/:postId"
          element={<ViewSelectedUsersPostInMobile />}
        />

        <Route path="profiledata" element={<ViewUserProfile />}>
          <Route index element={<EditGeneralDetails />} />
          <Route path="generaldetails" element={<EditGeneralDetails />} />
          <Route path="passwordsettings" element={<EditPassword />} />
          <Route
            path="advancedsettings"
            element={<AdvancedAccountSettings />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
