import Hero from "./pages/hero/Hero";
import Home from "./pages/home/Home";
import { Routes, Route } from "react-router-dom";
import Profile from "./pages/profile/Profile";
import Chats from "./pages/chats/Chats";
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

function App() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchProfile());
    }
  }, [dispatch, currentUser]);

  return (
    <>
      <Box>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" loader element={<Login />} />
          <Route path="/app" element={currentUser ? <Hero /> : <Login />}>
            <Route path="home" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="usersprofile" element={<UsersProfile />} />
            <Route path="chats" element={<Chats />} />

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
      </Box>
    </>
  );
}

export default App;
