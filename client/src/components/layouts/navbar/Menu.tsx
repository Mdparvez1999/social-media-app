import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaUserCircle } from "react-icons/fa";
import { GoPlusCircle } from "react-icons/go";
import { IoNotifications } from "react-icons/io5";
import { BsChatSquareDotsFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";
import useLogout from "../../../hooks/auth/useLogout";
import {
  Box,
  ListItem,
  UnorderedList,
  useDisclosure,
  Link as ChakraLink,
} from "@chakra-ui/react";
import CreatePost from "../../../pages/create post/CreatePost";
import Notifications from "../../../pages/notifications/Notifications";
import Search from "../../../pages/search/Search";

const Menu = () => {
  const createPostDisclosure = useDisclosure();

  const notificationsDisclosure = useDisclosure();

  const searchDisclosure = useDisclosure();

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
      <Box width={"100%"} height={"100%"}>
        <UnorderedList
          display={"flex"}
          flexDirection={"column"}
          listStyleImage={"none"}
          padding={"8px"}
          listStyleType={"none"}
          _hover={{ cursor: "pointer" }}
        >
          <ListItem width={"100%"} padding={"10px"} mb={"14px"}>
            <ChakraLink
              as={Link}
              to={"/app/home"}
              display={"flex"}
              alignItems={"center"}
              color={"black"}
              fontSize={"1.2rem"}
              textAlign={"center"}
              _hover={{ textDecoration: "none" }}
            >
              <Box mr={"18px"}>
                <FaHome size={"1.5rem"} />
              </Box>
              <span>Home</span>
            </ChakraLink>
          </ListItem>

          <ListItem width={"100%"} padding={"10px"} mb={"14px"}>
            <ChakraLink
              as={Link}
              to={"#"}
              display={"flex"}
              alignItems={"center"}
              color={"black"}
              fontSize={"1.2rem"}
              textAlign={"center"}
              _hover={{ textDecoration: "none" }}
              onClick={searchDisclosure.onOpen}
            >
              <Box mr={"18px"}>
                <FaSearch size={"1.5rem"} />
              </Box>
              Search
            </ChakraLink>
          </ListItem>

          <ListItem width={"100%"} padding={"10px"} mb={"14px"}>
            <ChakraLink
              as={Link}
              to={"#"}
              onClick={createPostDisclosure.onOpen}
              display={"flex"}
              alignItems={"center"}
              color={"black"}
              fontSize={"1.2rem"}
              textAlign={"center"}
              _hover={{ textDecoration: "none" }}
            >
              <Box mr={"18px"}>
                <GoPlusCircle size={"1.5rem"} />
              </Box>
              Create Post
            </ChakraLink>
          </ListItem>

          <ListItem width={"100%"} padding={"10px"} mb={"14px"}>
            <ChakraLink
              as={Link}
              to={"#"}
              display={"flex"}
              alignItems={"center"}
              color={"black"}
              fontSize={"1.2rem"}
              textAlign={"center"}
              _hover={{ textDecoration: "none" }}
              onClick={notificationsDisclosure.onOpen}
            >
              <Box mr={"18px"}>
                <IoNotifications size={"1.5rem"} />
              </Box>
              Notifications
            </ChakraLink>
          </ListItem>

          <ListItem width={"100%"} padding={"10px"} mb={"14px"}>
            <ChakraLink
              as={Link}
              to={"/app/messages"}
              display={"flex"}
              alignItems={"center"}
              color={"black"}
              fontSize={"1.2rem"}
              textAlign={"center"}
              _hover={{ textDecoration: "none" }}
            >
              <Box mr={"18px"}>
                <BsChatSquareDotsFill size={"1.5rem"} />
              </Box>
              Messages
            </ChakraLink>
          </ListItem>

          <ListItem width={"100%"} padding={"10px"} mb={"14px"}>
            <ChakraLink
              as={Link}
              to={"/app/profile"}
              display={"flex"}
              alignItems={"center"}
              color={"black"}
              fontSize={"1.2rem"}
              textAlign={"center"}
              _hover={{ textDecoration: "none" }}
            >
              <Box mr={"18px"}>
                <FaUserCircle size={"1.5rem"} />
              </Box>
              Profile
            </ChakraLink>
          </ListItem>

          <ListItem width={"100%"} padding={"10px"} mb={"14px"}>
            <ChakraLink
              as={Link}
              to={"/login"}
              onClick={handleLogout}
              display={"flex"}
              alignItems={"center"}
              color={"black"}
              fontSize={"1.2rem"}
              textAlign={"center"}
              _hover={{ textDecoration: "none" }}
            >
              <Box mr={"18px"}>
                <FiLogOut size={"1.5rem"} />
              </Box>
              Logout
            </ChakraLink>
          </ListItem>
        </UnorderedList>
      </Box>
      <CreatePost
        isOpen={createPostDisclosure.isOpen}
        onClose={createPostDisclosure.onClose}
      />
      <Notifications
        isOpen={notificationsDisclosure.isOpen}
        onClose={notificationsDisclosure.onClose}
      />

      <Search
        isOpen={searchDisclosure.isOpen}
        onClose={searchDisclosure.onClose}
      />
    </>
  );
};

export default Menu;
