import { Box, Divider, useBreakpointValue } from "@chakra-ui/react";
import ProfileDetails from "../../components/profile/ProfileDetails";
import ProfilePosts from "../../components/posts/ProfilePosts";
import MobileProfileDetails from "../../components/mobileComponents/MobileProfile/MobileProfileDetails";
import ProfilePostsMobile from "../../components/mobileComponents/MobileProfile/ProfilePostsMobile";

const Profile = () => {
  const isMobile = useBreakpointValue({ xs: true, md: false });
  return (
    <Box
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
    >
      {isMobile ? (
        <>
          <MobileProfileDetails />
          <Divider />
          <ProfilePostsMobile />
        </>
      ) : (
        <>
          <ProfileDetails />
          <Divider />
          <ProfilePosts />
        </>
      )}
    </Box>
  );
};

export default Profile;
