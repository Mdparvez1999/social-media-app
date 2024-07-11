import { Box } from "@chakra-ui/react";
import UserProfileDetails from "./UserProfileDetails";
import UserProfileSidebar from "./UserProfileSideBar";

const ViewUserProfile = () => {
  return (
    <Box width={"100%"} display={"flex"} minHeight={"100%"}>
      <Box flex={1} borderRight={"1px solid #f2f2f2"}>
        <UserProfileSidebar />
      </Box>
      <Box flex={4}>
        <UserProfileDetails />
      </Box>
    </Box>
  );
};

export default ViewUserProfile;
