import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import UserProfileDetails from "./UserProfileDetails";
import UserProfileSidebar from "./UserProfileSideBar";
import { GiHamburgerMenu } from "react-icons/gi";
import SideBarMenuForMobile from "./SideBarMenuForMobile";
import { RxCross2 } from "react-icons/rx";

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
          <Button onClick={onOpen} variant={"ghost"} _hover={{ bg: "none" }}>
            <GiHamburgerMenu size={"1.5rem"} />
          </Button>
          <Text fontWeight={"bold"} fontSize={"1.5rem"} pl={"60px"}>
            Edit Profile
          </Text>
          <Button
            ml={"auto"}
            variant={"ghost"}
            onClick={() => window.history.back()}
            _hover={{ bg: "none" }}
          >
            <RxCross2 size={"1.5rem"} onClick={onClose} />
          </Button>
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
