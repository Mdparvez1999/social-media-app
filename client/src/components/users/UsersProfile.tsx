import { Box, Divider, useBreakpointValue } from "@chakra-ui/react";
import UsersProfileDetails from "./UsersProfileDetails";
import SelectedUsersProfilePosts from "./SelectedUsersProfilePosts";
import SelectedUsersProfileInMobile from "../mobileComponents/selectedUsersProfileInMobile/SelectedUsersProfileInMobile";

const UsersProfile = () => {
  const isMobile = useBreakpointValue({ xs: true, md: false });
  return (
    <Box
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
    >
      {isMobile ? (
        <SelectedUsersProfileInMobile />
      ) : (
        <>
          <UsersProfileDetails />
          <Divider />
          <SelectedUsersProfilePosts />
        </>
      )}
    </Box>
  );
};

export default UsersProfile;
