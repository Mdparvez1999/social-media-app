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
import SelectedUsersProfileDetailsInMobileSkeleton from "../../../mobileComponentSkeletons/SelectedUsersProfileDetailsInMobileSkeleton";

const SelectedUsersProfileDetailsInMobile = React.memo(() => {
  const dispatch = useDispatch();

  const followersDisclosure = useDisclosure();
  const followingUsersDisclosure = useDisclosure();

  const { userId } = useParams<{ userId: string }>();

  const { fetchUsersProfile } = useFetchUsersProfile();

  if (!userId) throw new Error("Something went wrong");

  const hasFetchedData = useRef(false);

  const selectedUserData = useAppSelector((state) => state.users.selectedUser);
  const currentUsersFollowing = useAppSelector(
    (state) => state.profile.following
  );

  const [loading, setLoading] = useState<boolean>(false);

  const { followUser } = useFollowUser();
  const { unfollowUser } = useUnfollowUser();

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (selectedUserData && currentUsersFollowing) {
      setIsFollowing(
        currentUsersFollowing?.some((user) => user?.id === selectedUserData?.id)
      );
    }
  }, [selectedUserData, currentUsersFollowing]);

  useEffect(() => {
    const fetchSelectedUsersData = async () => {
      setLoading(true);
      dispatch(clearSelecetedUsersData());
      try {
        const userdata = await fetchUsersProfile(userId);
        dispatch(setSelectedUser(userdata.data));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
        hasFetchedData.current = true;
      }
    };

    if (!hasFetchedData.current) {
      fetchSelectedUsersData();
    }
  }, [userId, dispatch, fetchUsersProfile, isFollowing]);

  const { fetchCurrentUserProfile } = useFetchCurrentUsersProfile();

  const followOrUnfollowUserClick = useCallback(async () => {
    if (!selectedUserData) return;

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
      setLoading(false);
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

  const navigate = useNavigate();
  const location = useLocation();

  const handleMessageClick = useCallback(() => {
    navigate("/app/messagesinmobile", { state: { from: location } });
  }, [navigate, location]);

  return loading ? (
    <SelectedUsersProfileDetailsInMobileSkeleton />
  ) : (
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
        alignItems={"center"}
        gap={"15px"}
        px={"20px"}
        my={"16px"}
      >
        <Button
          onClick={followOrUnfollowUserClick}
          isLoading={loading}
          width={"160px"}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
        <Button onClick={handleMessageClick} w={"160px"}>
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
