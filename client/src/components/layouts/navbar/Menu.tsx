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

  const menuItems = [
    {
      label: "Home",
      icon: FaHome,
      to: "/app/home",
    },
    {
      label: "Search",
      icon: FaSearch,
      onClick: searchDisclosure.onOpen,
    },
    {
      label: "Create Post",
      icon: GoPlusCircle,
      onClick: createPostDisclosure.onOpen,
    },
    {
      label: "Notifications",
      icon: IoNotifications,
      onClick: notificationsDisclosure.onOpen,
    },
    {
      label: "Messages",
      icon: BsChatSquareDotsFill,
      to: "/app/messages",
    },
    {
      label: "Profile",
      icon: FaUserCircle,
      to: "/app/profile",
    },
    {
      label: "Logout",
      icon: FiLogOut,
      to: "/login",
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <Box width={"100%"} height={"100%"}>
        <UnorderedList
          display={"flex"}
          flexDirection={"column"}
          padding={"8px"}
          listStyleType={"none"}
          _hover={{ cursor: "pointer" }}
        >
          {menuItems.map(({ label, icon: Icon, to, onClick }) => (
            <ListItem key={label} width={"100%"} padding={"10px"} mb={"14px"}>
              <ChakraLink
                as={Link}
                to={to || "#"}
                display={"flex"}
                alignItems={"center"}
                color={"black"}
                fontSize={"1.2rem"}
                textAlign={"center"}
                _hover={{ textDecoration: "none" }}
                onClick={onClick}
              >
                <Box mr={"18px"}>
                  <Icon size={"1.5rem"} />
                </Box>
                {label}
              </ChakraLink>
            </ListItem>
          ))}
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
