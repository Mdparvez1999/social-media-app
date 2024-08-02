import { Box, Divider } from "@chakra-ui/react";
import MobileProfileDetails from "../../components/mobileComponents/MobileProfile/MobileProfileDetails";
import ProfilePostsMobile from "../../components/mobileComponents/MobileProfile/ProfilePostsMobile";

const MobileProfile = () => {
  return (
    <Box
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
    >
      <MobileProfileDetails />
      <Divider />
      <ProfilePostsMobile />
    </Box>
  );
};

export default MobileProfile;
