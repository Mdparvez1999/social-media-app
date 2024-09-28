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
  setFollowRequests,
  setProfile,
} from "../../redux-store/features/profile/profileSlice";
import useFetchCurrentUsersProfile from "../../hooks/profile/useFetchCurrentUsersProfile";
import useFetchFollowRequests from "../../hooks/profile/useFetchFollowRequests";
// import useFetchSentRequests from "../../hooks/profile/useFetchSentRequests";
import useFetchGetObjectProfilePicUrl from "../../hooks/profile/useFetchGetObjectProfilePicUrl";
import useFetchConversations from "../../hooks/messages/useFetchConversations";
import { setConversations } from "../../redux-store/features/messages/messagesSlice";

const Hero = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  // const currentUser = useAppSelector((state) => state.auth.currentUser);

  const { fetchFollowers } = useFetchFollowers();
  const { fetchFollowingUsers } = useFetchFollowingUsers();
  const { fetchCurrentUserProfile } = useFetchCurrentUsersProfile();
  const { fetchFollowRequests } = useFetchFollowRequests();
  // const { fetchSentRequests } = useFetchSentRequests();

  const { fetchGetObjectProfilePicUrl } = useFetchGetObjectProfilePicUrl();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [currentUsersProfileData, followRequestsData] = await Promise.all(
          [fetchCurrentUserProfile(), fetchFollowRequests()]
        );

        const profilePicUrl = await fetchGetObjectProfilePicUrl(
          currentUsersProfileData.profilePic
        );

        currentUsersProfileData.profilePic = profilePicUrl;
        dispatch(setProfile(currentUsersProfileData));
        dispatch(
          setFollowRequests(followRequestsData.data.followRequests || [])
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      }
    };

    loadUserData();
  }, [
    dispatch,
    fetchCurrentUserProfile,
    fetchFollowRequests,
    fetchGetObjectProfilePicUrl,
  ]);

  useEffect(() => {
    const loadUsersData = async () => {
      try {
        const followersData = await fetchFollowers();
        dispatch(setFollowers(followersData));

        const followingData = await fetchFollowingUsers();

        if (Array.isArray(followingData)) {
          dispatch(setFollowingUsers(followingData));
        } else {
          dispatch(setFollowingUsers([]));
        }
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        else toast.error("Something went wrong");
      }
    };

    loadUsersData();
  }, [dispatch, fetchFollowers, fetchFollowingUsers]);

  // useEffect(() => {
  //   const loadSentRequests = async () => {
  //     try {
  //       const sentRequestsData = await fetchSentRequests(currentUser?.id);
  //       dispatch(setSentRequests(sentRequestsData.sentRequests || []));
  //     } catch (error) {
  //       toast.error(
  //         error instanceof Error ? error.message : "Something went wrong"
  //       );
  //     }
  //   };

  //   loadSentRequests();
  // }, [dispatch, fetchSentRequests, currentUser?.id]);

  const { fetchConversations } = useFetchConversations();

  useEffect(() => {
    const fetchUserConversations = async () => {
      try {
        const conversationData = await fetchConversations();
        dispatch(setConversations(conversationData));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      }
    };

    fetchUserConversations();
  }, [dispatch, fetchConversations]);

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
