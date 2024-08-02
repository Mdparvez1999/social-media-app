import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import UserProfileDetails from "./UserProfileDetails";
import UserProfileSidebar from "./UserProfileSideBar";
import { GiHamburgerMenu } from "react-icons/gi";
import SideBarMenuForMobile from "./SideBarMenuForMobile";

const ViewUserProfile = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Box display={{ xs: "block", md: "none" }}>
        <Box
          width={"100%"}
          p={"10px 20px"}
          display={"flex"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          border={"1px solid #f2f2f2"}
          boxShadow={"2px 4px 6px #f2f2f2"}
        >
          <Button>
            <GiHamburgerMenu size={"1.5rem"} onClick={onOpen} />
          </Button>
          <Text fontWeight={"bold"} fontSize={"1.5rem"} pl={"60px"}>
            Edit Profile
          </Text>
        </Box>
      </Box>
      <Box width={"100%"} display={"flex"} minHeight={"100%"}>
        <Box
          flex={1}
          borderRight={"1px solid #f2f2f2"}
          display={{ xs: "none", md: "block" }}
        >
          <UserProfileSidebar onClose={onClose} />
        </Box>
        <Box flex={4}>
          <UserProfileDetails />
        </Box>
      </Box>
      <SideBarMenuForMobile isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default ViewUserProfile;
