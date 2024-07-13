import { Box, Divider } from "@chakra-ui/react";
import UsersProfileDetails from "./UsersProfileDetails";
import SelectedUsersProfilePosts from "./SelectedUsersProfilePosts";

const UsersProfile = () => {
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
