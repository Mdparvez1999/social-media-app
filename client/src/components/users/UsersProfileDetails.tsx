import {
  Avatar,
  Box,
  Button,
  Heading,
  Text,
  useDisclosure,
  WrapItem,
} from "@chakra-ui/react";
import { useAppSelector } from "../../hooks/hooks";
import useFollowUser from "../../hooks/usersprofile/useFollowUser";
import { toast } from "react-toastify";
import { useCallback, useEffect, useRef, useState } from "react";
import useFetchUsersProfile from "../../hooks/usersprofile/useFetchUsersProfile";
import {
  clearSelecetedUsersData,
  setSelectedUser,
} from "../../redux-store/features/users/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import useUnfollowUser from "../../hooks/usersprofile/useUnfollowUser";
import SelectedUsersFollowers from "./SelectedUsersFollowers";
import SelectedUsersFollowing from "./SelectedUsersFollowing";
import {
  addConversation,
  setSelectedConversation,
} from "../../redux-store/features/messages/messagesSlice";
import useFetchCurrentUsersProfile from "../../hooks/profile/useFetchCurrentUsersProfile";
import { setProfile } from "../../redux-store/features/profile/profileSlice";
import UsersProfileDetailsSkeleton from "../../skeletons/UsersProfileDetailsSkeleton";
import useFetchGetObjectProfilePicUrl from "../../hooks/profile/useFetchGetObjectProfilePicUrl";
import useFetchCreateConversation from "../../hooks/messages/useFetchCreateConversation";

const UsersProfileDetails = () => {
  const dispatch = useDispatch();
  const followersDisclosure = useDisclosure();
  const followingUsersDisclosure = useDisclosure();
  const { userId } = useParams<{ userId: string }>();

  const { fetchUsersProfile } = useFetchUsersProfile();
  const { fetchCurrentUserProfile } = useFetchCurrentUsersProfile();
  const { followUser } = useFollowUser();
  const { unfollowUser } = useUnfollowUser();
  const navigate = useNavigate();

  if (!userId) throw new Error("Something went wrong");

  const hasFetchedData = useRef(false);

  const selectedUserData = useAppSelector((state) => state.users.selectedUser);
  const currentUsersFollowing = useAppSelector(
    (state) => state.profile.following
  );
  const conversations = useAppSelector((state) => state.messages.conversations);

  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    if (selectedUserData) {
      setPageLoading(false);
    }
  }, [selectedUserData]);

  useEffect(() => {
    if (selectedUserData && currentUsersFollowing) {
      setIsFollowing(
        currentUsersFollowing?.some((user) => user?.id === selectedUserData?.id)
      );
    }
  }, [selectedUserData, currentUsersFollowing]);

  const { fetchGetObjectProfilePicUrl } = useFetchGetObjectProfilePicUrl();

  useEffect(() => {
    const fetchSelectedUsersData = async () => {
      setPageLoading(true);
      dispatch(clearSelecetedUsersData());
      try {
        const userdata = await fetchUsersProfile(userId);

        const profilePicUrl = await fetchGetObjectProfilePicUrl(
          userdata.data.profilePic
        );

        userdata.data.profilePic = profilePicUrl;

        dispatch(setSelectedUser(userdata.data));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setPageLoading(false);
        hasFetchedData.current = true;
      }
    };

    if (!hasFetchedData.current) {
      fetchSelectedUsersData();
    }
  }, [
    userId,
    dispatch,
    fetchUsersProfile,
    isFollowing,
    fetchGetObjectProfilePicUrl,
  ]);

  const followOrUnfollowUserClick = useCallback(async () => {
    if (!selectedUserData) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(selectedUserData.id);
        setIsFollowing(false);
      } else {
        await followUser(selectedUserData.id);
        setIsFollowing(true);
      }

      const updatedUsersData = await fetchUsersProfile(userId);
      dispatch(setSelectedUser(updatedUsersData.data));

      const updatedCurrentUsersData = await fetchCurrentUserProfile();
      dispatch(setProfile(updatedCurrentUsersData.data));
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setFollowLoading(false);
    }
  }, [
    selectedUserData,
    isFollowing,
    fetchUsersProfile,
    fetchCurrentUserProfile,
    followUser,
    unfollowUser,
    userId,
    dispatch,
  ]);

  const { createConversation } = useFetchCreateConversation();

  const handleMessageClick = async () => {
    const existingConversation = conversations.find(
      (conversation) => conversation.participant.id === selectedUserData?.id
    );

    if (existingConversation) {
      dispatch(setSelectedConversation(existingConversation));
      navigate(`/app/messages/${existingConversation?.id}`);
    } else {
      try {
        const conversation = await createConversation(
          selectedUserData?.id as string
        );

        dispatch(setSelectedConversation(conversation));
        dispatch(addConversation(conversation));
        navigate(`/app/messages/${conversation?.id}`);
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };

  return pageLoading ? (
    <UsersProfileDetailsSkeleton />
  ) : (
    <>
      <Box
        width={"70%"}
        minHeight={"45vh"}
        display={"flex"}
        justifyContent={"space-evenly"}
        padding={"35px"}
        mx={"80px"}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          margin={"15px"}
        >
          <WrapItem>
            <Avatar
              size={"2xl"}
              crossOrigin="anonymous"
              src={selectedUserData?.profilePic}
              name={selectedUserData?.userName}
            />
          </WrapItem>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          width={"58%"}
          minHeight={"100%"}
          padding={"15px"}
          mx={"35px"}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mb={"20px"}
            width={"90%"}
            gap={"14px"}
          >
            <Box>
              <Heading size={"lg"} fontWeight={"500"}>
                {selectedUserData?.userName}
              </Heading>
            </Box>
            <Box display={"flex"} gap={"20px"}>
              <Button
                onClick={followOrUnfollowUserClick}
                isLoading={followLoading}
                width={"100px"}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>

              <Button onClick={handleMessageClick} width={"100px"}>
                Message
              </Button>
            </Box>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"flex-start"}
            gap={"60px"}
            alignItems={"center"}
            mb={"30px"}
          >
            <Text>{selectedUserData?.postsCount} posts</Text>
            <Text cursor={"pointer"} onClick={followersDisclosure.onOpen}>
              {selectedUserData?.followersCount} followers
            </Text>
            <Text cursor={"pointer"} onClick={followingUsersDisclosure.onOpen}>
              {selectedUserData?.followingCount} following
            </Text>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"flex-start"}
            alignItems={"center"}
          >
            <Text>{selectedUserData?.fullName}</Text>
          </Box>
          <Box mt={"20px"}>
            <Text>Bio</Text>
            <Text fontSize={"18px"}>
              {selectedUserData?.bio ? selectedUserData.bio : "add bio"}
            </Text>
          </Box>
        </Box>
      </Box>
      <SelectedUsersFollowers
        isOpen={followersDisclosure.isOpen}
        onClose={followersDisclosure.onClose}
      />
      <SelectedUsersFollowing
        isOpen={followingUsersDisclosure.isOpen}
        onClose={followingUsersDisclosure.onClose}
      />
    </>
  );
};

export default UsersProfileDetails;
