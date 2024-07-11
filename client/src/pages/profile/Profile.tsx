import { Box, Divider } from "@chakra-ui/react";
import ProfileDetails from "../../components/profile/ProfileDetails";
import ProfilePosts from "../../components/profile/ProfilePosts";

const Profile = () => {
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
