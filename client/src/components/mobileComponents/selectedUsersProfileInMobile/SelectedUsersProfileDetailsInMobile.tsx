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
import { useEffect, useRef, useState } from "react";
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

const SelectedUsersProfileDetailsInMobile = () => {
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
    if (!selectedUserData) return;

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

  const location = useLocation();

  const handleMessageClick = () => {
    navigate("/app/messagesinmobile", { state: { from: location } });
  };

  return (
    <Box
      width={"100%"}
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box p={"5px 0 2px 15px"} width={"100%"}>
        <Heading fontSize={"2rem"}>{selectedUserData?.userName}</Heading>
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
          {followedUser ? "Unfollow" : "follow"}
        </Button>
        <Button width={"48%"} onClick={handleMessageClick}>
          message
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
};

export default SelectedUsersProfileDetailsInMobile;
