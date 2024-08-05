import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Avatar,
  Box,
  Button,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useFetchUsersProfile from "../../../hooks/usersprofile/useFetchUsersProfile";
import {
  clearSelecetedUsersData,
  setSelectedUser,
} from "../../../redux-store/features/users/userSlice";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../hooks/hooks";
import useFollowUser from "../../../hooks/usersprofile/useFollowUser";
import useUnfollowUser from "../../../hooks/usersprofile/useUnfollowUser";
import SelectedUsersFollowers from "../../../components/users/SelectedUsersFollowers";
import SelectedUsersFollowing from "../../../components/users/SelectedUsersFollowing";
import { IoArrowBack } from "react-icons/io5";
import { setProfile } from "../../../redux-store/features/profile/profileSlice";
import useFetchCurrentUsersProfile from "../../../hooks/profile/useFetchCurrentUsersProfile";

const SelectedUsersProfileDetailsInMobile = React.memo(() => {
  const dispatch = useDispatch();
  const { userId } = useParams<{ userId: string }>();
  const { fetchUsersProfile } = useFetchUsersProfile();

  if (!userId) throw new Error("Something went wrong");

  const hasFetchedData = useRef(false);
  const selectedUserData = useAppSelector((state) => state.users.selectedUser);

  const currentUsersFollowing = useAppSelector(
    (state) => state.profile.following
  );

  const followersDisclosure = useDisclosure();
  const followingUsersDisclosure = useDisclosure();

  const [loading, setLoading] = useState(false);

  const { followUser } = useFollowUser();
  const { unfollowUser } = useUnfollowUser();

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

  const [isFollowing, setIsFollowing] = useState(
    currentUsersFollowing?.some((user) => user?.id === selectedUserData?.id)
  );

  useEffect(() => {
    setIsFollowing(
      currentUsersFollowing?.some((user) => user?.id === selectedUserData?.id)
    );
  }, [currentUsersFollowing, selectedUserData]);

  const { fetchCurrentUserProfile } = useFetchCurrentUsersProfile();

  const followOrUnfollowUserClick = useCallback(async () => {
    if (!selectedUserData) return;

    setLoading(true);

    try {
      if (isFollowing) {
        await unfollowUser(selectedUserData?.id);
      } else {
        await followUser(selectedUserData?.id);
      }

      const updatedUserData = await fetchUsersProfile(userId);
      dispatch(setSelectedUser(updatedUserData));

      const updatedCurrentUsersData = await fetchCurrentUserProfile();
      dispatch(setProfile(updatedCurrentUsersData));

      setIsFollowing(!isFollowing);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [
    isFollowing,
    selectedUserData,
    followUser,
    unfollowUser,
    fetchUsersProfile,
    fetchCurrentUserProfile,
    userId,
    dispatch,
  ]);

  const navigate = useNavigate();
  const location = useLocation();

  const handleMessageClick = useCallback(() => {
    navigate("/app/messagesinmobile", { state: { from: location } });
  }, [navigate, location]);

  return (
    <Box
      width={"100%"}
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box
        p={"5px 0 2px 15px"}
        width={"100%"}
        display={"flex"}
        alignItems={"center"}
        gap={"15px"}
        cursor={"pointer"}
      >
        <IoArrowBack size={"1.8rem"} onClick={() => window.history.back()} />
        <Heading fontSize={"2rem"} pb={"8px"}>
          {selectedUserData?.userName}
        </Heading>
      </Box>
      <Box
        height={"100px"}
        width={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        pl={"15px"}
      >
        <Box>
          <Avatar
            size={"lg"}
            crossOrigin="anonymous"
            src={
              selectedUserData?.profilePic
                ? `http://localhost:8000/uploads/profilePic/${selectedUserData?.profilePic}`
                : undefined
            }
            name={selectedUserData?.userName}
          />
        </Box>
        <Box width={"100%"}>
          <Box
            display={"flex"}
            justifyContent={"space-evenly"}
            alignItems={"center"}
          >
            <Box>
              <Text
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {selectedUserData?.postsCount}
              </Text>
              <Text>posts</Text>
            </Box>
            <Box cursor={"pointer"} onClick={followersDisclosure.onOpen}>
              <Text
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {selectedUserData?.followersCount}
              </Text>
              <Text> followers</Text>
            </Box>
            <Box onClick={followingUsersDisclosure.onOpen} cursor={"pointer"}>
              <Text
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {selectedUserData?.followingCount}
              </Text>
              <Text> following</Text>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        className="bio"
        px={"20px"}
        width={"100%"}
        height={"100%"}
        display={"flex"}
        flexDirection={"column"}
        gap={"4px"}
      >
        <Box>
          <Text fontWeight={"bold"}>{selectedUserData?.fullName}</Text>
        </Box>
        <Box>
          <Text>{selectedUserData?.bio}</Text>
        </Box>
      </Box>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        px={"20px"}
        my={"14px"}
      >
        <Button
          width={"48%"}
          onClick={followOrUnfollowUserClick}
          isLoading={loading}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
        <Button width={"48%"} onClick={handleMessageClick}>
          Message
        </Button>
      </Box>
      <SelectedUsersFollowers
        isOpen={followersDisclosure.isOpen}
        onClose={followersDisclosure.onClose}
      />
      <SelectedUsersFollowing
        isOpen={followingUsersDisclosure.isOpen}
        onClose={followingUsersDisclosure.onClose}
      />
    </Box>
  );
});

export default SelectedUsersProfileDetailsInMobile;
