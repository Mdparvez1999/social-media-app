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
import { useEffect, useRef, useState } from "react";
import useFetchUsersProfile from "../../hooks/usersprofile/useFetchUsersProfile";
import {
  clearSelecetedUsersData,
  setSelectedUser,
  setSelectedUsersMessage,
} from "../../redux-store/features/users/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import useUnfollowUser from "../../hooks/usersprofile/useUnfollowUser";
import SelectedUsersFollowers from "./SelectedUsersFollowers";
import SelectedUsersFollowing from "./SelectedUsersFollowing";
import { setSelectedConversation } from "../../redux-store/features/messages/messagesSlice";
// import { setSelectedConversation } from "../../redux-store/features/messages/messagesSlice";

const UsersProfileDetails = () => {
  const dispatch = useDispatch();

  const { userId } = useParams<{ userId: string }>();

  const { fetchUsersProfile } = useFetchUsersProfile();

  if (!userId) throw new Error("Something went wrong");

  const hasFetchedData = useRef(false);

  useEffect(() => {
    const fetchSelectedUsersData = async () => {
      dispatch(clearSelecetedUsersData());
      try {
        const userdata = await fetchUsersProfile(userId);
        dispatch(setSelectedUser(userdata));
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        else toast.error("Something went wrong");
      }
    };

    if (!hasFetchedData.current) {
      fetchSelectedUsersData();
      hasFetchedData.current = true;
    }
  }, [userId, dispatch, fetchUsersProfile]);

  const selectedUserData = useAppSelector((state) => state.users.selectedUser);

  const currentUsersFollowing = useAppSelector(
    (state) => state.profile.following
  );

  const followedUser = currentUsersFollowing?.find(
    (user) => user.id === selectedUserData?.id
  );

  const followersDisclosure = useDisclosure();

  const followingUsersDisclosure = useDisclosure();

  const [loading, setLoading] = useState(false);

  const { followUser } = useFollowUser();

  const { unfollowUser } = useUnfollowUser();

  const followOrUnfollowUserClick = async () => {
    if (!selectedUserData) {
      toast.error("User data not found");
      return;
    }

    setLoading(true);
    try {
      if (followedUser) {
        await unfollowUser(selectedUserData?.id);
      } else {
        await followUser(selectedUserData?.id);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const conversations = useAppSelector((state) => state.messages.conversations);

  const handleMessageClick = () => {
    const existingConversation = conversations.filter(
      (conversation) => conversation.participants[0].id === selectedUserData?.id
    );

    if (existingConversation.length > 0)
      dispatch(setSelectedConversation(existingConversation[0]));
    else dispatch(setSelectedUsersMessage(selectedUserData));

    navigate("/app/messages");
  };

  return (
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
            {selectedUserData?.profilePic ? (
              <Avatar
                size={"2xl"}
                crossOrigin="anonymous"
                name={selectedUserData?.userName}
              />
            ) : (
              <Avatar
                size={"2xl"}
                crossOrigin="anonymous"
                name={selectedUserData?.userName}
                src={
                  selectedUserData?.profilePic
                    ? `http://localhost:8000/uploads/profilePic/${selectedUserData?.profilePic}`
                    : undefined
                }
              />
            )}
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
          >
            <Box>
              <Heading size={"lg"} fontWeight={"500"}>
                {selectedUserData?.userName}
              </Heading>
            </Box>
            <Box display={"flex"} gap={"20px"}>
              <Button onClick={followOrUnfollowUserClick} isLoading={loading}>
                {followedUser ? "Unfollow" : "Follow"}
              </Button>
              <Button onClick={handleMessageClick}>Message</Button>
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
