import { Box, Divider } from "@chakra-ui/react";
import UsersProfileDetails from "./UsersProfileDetails";
import SelectedUsersProfilePosts from "./SelectedUsersProfilePosts";
import { useAppDispatch } from "../../hooks/hooks";
import useFetchSelectedUsersFollowing from "../../hooks/usersprofile/useFetchSelectedUsersFollowing";
import UseFetchSelectedUsersFollowers from "../../hooks/usersprofile/useFetchSelectedUsersFollowers";
import {
  setSelectedUsersFollowers,
  setSelectedUsersFollowing,
} from "../../redux-store/features/users/userSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";

const UsersProfile = () => {
  const dispatch = useAppDispatch();
  const { fetchSelectedUsersFollowing } = useFetchSelectedUsersFollowing();

  const { fetchSelectedUsersFollowers } = UseFetchSelectedUsersFollowers();

  useEffect(() => {
    const loadUsersData = async () => {
      try {
        const followersData = await fetchSelectedUsersFollowers();
        dispatch(setSelectedUsersFollowers(followersData));

        const followingData = await fetchSelectedUsersFollowing();
        dispatch(setSelectedUsersFollowing(followingData));
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        else toast.error("Something went wrong");
      }
    };
    loadUsersData();
  }, [dispatch, fetchSelectedUsersFollowing, fetchSelectedUsersFollowers]);
  return (
    <Box
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
    >
      <UsersProfileDetails />
      <Divider />
      <SelectedUsersProfilePosts />
    </Box>
  );
};

export default UsersProfile;
