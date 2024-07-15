import { Box, Divider } from "@chakra-ui/react";
import ProfileDetails from "../../components/profile/ProfileDetails";
import ProfilePosts from "../../components/profile/ProfilePosts";
import { useEffect } from "react";
import useFetchFollowers from "../../hooks/profile/useFetchFollowers";
import useFetchFollowingUsers from "../../hooks/profile/useFetchFollowingUsers";

const Profile = () => {
  const { fetchFollowers } = useFetchFollowers();

  const { fetchFollowingUsers } = useFetchFollowingUsers();

  useEffect(() => {
    fetchFollowers();
    fetchFollowingUsers();
  }, [fetchFollowers, fetchFollowingUsers]);

  return (
    <Box
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
    >
      <ProfileDetails />
      <Divider />
      <ProfilePosts />
    </Box>
  );
};

export default Profile;
