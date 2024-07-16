import { Box, Divider } from "@chakra-ui/react";
import UsersProfileDetails from "./UsersProfileDetails";
import SelectedUsersProfilePosts from "./SelectedUsersProfilePosts";
import { useEffect } from "react";
import useFetchSelectedUsersFollowing from "../../hooks/usersprofile/useFetchSelectedUsersFollowing";
import UseFetchSelectedUsersFollowers from "../../hooks/usersprofile/useFetchSelectedUsersFollowers";

const UsersProfile = () => {
  const { fetchSelectedUsersFollowing } = useFetchSelectedUsersFollowing();

  const { fetchSelectedUsersFollowers } = UseFetchSelectedUsersFollowers();

  useEffect(() => {
    fetchSelectedUsersFollowing();
    fetchSelectedUsersFollowers();
  }, [fetchSelectedUsersFollowing, fetchSelectedUsersFollowers]);
  
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
