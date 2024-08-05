import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/layouts/navbar/Navbar";
import MobileNavbar from "../../components/mobileComponents/MobileNavbar/MobileNavbar";
import { Box } from "@chakra-ui/react";
import { useAppDispatch } from "../../hooks/hooks";
import useFetchFollowers from "../../hooks/profile/useFetchFollowers";
import useFetchFollowingUsers from "../../hooks/profile/useFetchFollowingUsers";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  setFollowers,
  setFollowingUsers,
  setProfile,
} from "../../redux-store/features/profile/profileSlice";
import useFetchCurrentUsersProfile from "../../hooks/profile/useFetchCurrentUsersProfile";

const Hero = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();

  const { fetchFollowers } = useFetchFollowers();
  const { fetchFollowingUsers } = useFetchFollowingUsers();

  const { fetchCurrentUserProfile } = useFetchCurrentUsersProfile();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUsersProfileData = await fetchCurrentUserProfile();
        dispatch(setProfile(currentUsersProfileData));
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    };

    loadUserData();
  }, [dispatch, fetchCurrentUserProfile]);

  useEffect(() => {
    const loadUsersData = async () => {
      try {
        const followersData = await fetchFollowers();
        dispatch(setFollowers(followersData));

        const followingData = await fetchFollowingUsers();
        dispatch(setFollowingUsers(followingData));
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        else toast.error("Something went wrong");
      }
    };

    loadUsersData();
  }, [dispatch, fetchFollowers, fetchFollowingUsers]);

  const isMessagePage =
    location.pathname.startsWith("/app/messagesinmobile") ||
    location.pathname.startsWith("/app/messagecontainer");

  return (
    <>
      <Box display={{ xs: "none", md: "block" }}>
        <Box display={"flex"}>
          <Box
            position={"fixed"}
            top={0}
            left={0}
            width={"220px"}
            zIndex={"1000"}
            boxShadow={"md"}
          >
            <Navbar />
          </Box>
          <Box marginLeft="200px" width="calc(100% - 200px)" pl={"20px"}>
            <Outlet />
          </Box>
        </Box>
      </Box>

      <Box display={{ xs: "block", md: "none" }}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          height={"100%"}
          width={"100%"}
        >
          <Box>
            <Outlet />
          </Box>
          <Box
            position={"fixed"}
            bottom={0}
            left={0}
            width={"100%"}
            zIndex={"1000"}
          >
            {isMessagePage ? null : <MobileNavbar />}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Hero;
