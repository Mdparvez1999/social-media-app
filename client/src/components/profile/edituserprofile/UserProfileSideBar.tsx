import { Box, Heading, ListItem, UnorderedList } from "@chakra-ui/react";
import { MdSecurity } from "react-icons/md";
import { RiChatPrivateLine } from "react-icons/ri";
import { IoSettingsOutline, IoOptionsOutline } from "react-icons/io5";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useLogout from "../../../hooks/auth/useLogout";
import { toast } from "react-toastify";
import { FiLogOut } from "react-icons/fi";

interface UserProfileSideBarProps {
  onClose: () => void;
}

const UserProfileSideBar = ({ onClose }: UserProfileSideBarProps) => {
  const { logoutUser } = useLogout();
  const handleLogout = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      await logoutUser();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <>
      <Heading
        display={{ xs: "none", md: "block" }}
        fontSize={"1.4rem"}
        fontWeight={"500"}
        m={"20px"}
        p={"8px"}
      >
        Settings
      </Heading>
      <UnorderedList
        width={"100%"}
        listStyleType={"none"}
        padding={{ xs: "0", md: "8px" }}
      >
        <ListItem
          mb={{ xs: "20px", md: "16px" }}
          width={"100%"}
          onClick={onClose}
        >
          <ChakraLink
            as={Link}
            to={"/app/profiledata/generaldetails"}
            display={"flex"}
            alignItems={"center"}
            fontSize={{ xs: "1.5rem", md: "1.3rem" }}
            fontWeight={"500"}
            _hover={{ textDecoration: "none" }}
            m={"10px 0"}
          >
            <Box mr={{ xs: "20px", md: "15px" }}>
              <IoSettingsOutline />
            </Box>
            General
          </ChakraLink>
        </ListItem>

        <ListItem
          mb={{ xs: "20px", md: "16px" }}
          width={"100%"}
          onClick={onClose}
        >
          <ChakraLink
            as={Link}
            to={"/app/profiledata/passwordsettings"}
            display={"flex"}
            alignItems={"center"}
            fontSize={{ xs: "1.5rem", md: "1.3rem" }}
            fontWeight={"500"}
            _hover={{ textDecoration: "none" }}
          >
            <Box mr={{ xs: "20px", md: "15px" }}>
              <MdSecurity />
            </Box>
            Password
          </ChakraLink>
        </ListItem>

        <ListItem
          mb={{ xs: "20px", md: "16px" }}
          width={"100%"}
          onClick={onClose}
        >
          <ChakraLink
            as={Link}
            to={"/app/profiledata/privacysettings"}
            display={"flex"}
            alignItems={"center"}
            fontSize={{ xs: "1.5rem", md: "1.3rem" }}
            fontWeight={"500"}
            _hover={{ textDecoration: "none" }}
          >
            <Box mr={{ xs: "20px", md: "15px" }}>
              <RiChatPrivateLine />
            </Box>
            Privacy
          </ChakraLink>
        </ListItem>

        <ListItem
          mb={{ xs: "20px", md: "16px" }}
          width={"100%"}
          onClick={onClose}
        >
          <ChakraLink
            as={Link}
            to={"/app/profiledata/advancedsettings"}
            display={"flex"}
            alignItems={"center"}
            fontSize={{ xs: "1.5rem", md: "1.3rem" }}
            fontWeight={"500"}
            _hover={{ textDecoration: "none" }}
          >
            <Box mr={{ xs: "20px", md: "15px" }}>
              <IoOptionsOutline />
            </Box>
            Advanced
          </ChakraLink>
        </ListItem>

        <ListItem
          width={"100%"}
          mb={"14px"}
          display={{ xs: "block", md: "none" }}
        >
          <ChakraLink
            as={Link}
            to={"/login"}
            onClick={handleLogout}
            display={"flex"}
            alignItems={"center"}
            fontSize={{ xs: "1.5rem", md: "1.3rem" }}
            fontWeight={"500"}
            _hover={{ textDecoration: "none" }}
          >
            <Box mr={{ xs: "20px", md: "15px" }}>
              <FiLogOut size={"1.5rem"} />
            </Box>
            Logout
          </ChakraLink>
        </ListItem>
      </UnorderedList>
    </>
  );
};

export default UserProfileSideBar;
