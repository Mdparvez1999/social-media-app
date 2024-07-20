import Hero from "./pages/hero/Hero";
import Home from "./pages/home/Home";
import { Routes, Route, Navigate } from "react-router-dom"; // Added Navigate for conditional redirect
import Profile from "./pages/profile/Profile";
import Signup from "./components/auth/signup/Signup";
import Login from "./components/auth/login/Login";
import { Box } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import ViewUserProfile from "./components/profile/edituserprofile/ViewUserProfileDetails";
import EditGeneralDetails from "./components/profile/edituserprofile/EditGeneralDetails";
import EditPassword from "./components/profile/edituserprofile/EditPassword";
import PrivacySettings from "./components/profile/edituserprofile/PrivacySettings";
import AdvancedAccountSettings from "./components/profile/edituserprofile/AdvancedAccountSettings";
import { useEffect } from "react";
import { fetchProfile } from "./redux-store/features/profile/profileSlice";
import UsersProfile from "./components/users/UsersProfile";
import { toast } from "react-toastify";
import Messages from "./pages/messages/Messages";

function App() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        dispatch(fetchProfile());
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    };

    loadUserData();
  }, [dispatch, currentUser]);

  return (
    <Box>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/app/*"
          element={currentUser ? <HeroRoutes /> : <Navigate to="/login" />}
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
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<Profile />} />

        <Route path="profiledata" element={<ViewUserProfile />}>
          <Route index element={<EditGeneralDetails />} />
          <Route path="generaldetails" element={<EditGeneralDetails />} />
          <Route path="passwordsettings" element={<EditPassword />} />
          <Route path="privacysettings" element={<PrivacySettings />} />
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
