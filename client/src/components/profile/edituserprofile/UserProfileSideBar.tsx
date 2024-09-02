import { Box, Heading, ListItem, UnorderedList } from "@chakra-ui/react";
import { MdSecurity } from "react-icons/md";
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
      toast.error("Logout failed. Please try again.");
    }
  };

  const profileSideBarItems = [
    {
      to: "/app/profiledata/generaldetails",
      label: "General",
      icon: IoOptionsOutline,
    },
    {
      to: "/app/profiledata/passwordsettings",
      label: "Password",
      icon: MdSecurity,
    },
    {
      to: "/app/profiledata/advancedsettings",
      label: "Advanced",
      icon: IoSettingsOutline,
    },
    {
      to: "/app/profiledata/logout",
      label: "Logout",
      icon: FiLogOut,
      onClick: handleLogout,
    },
  ];

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
        {profileSideBarItems.map(({ to, label, icon: Icon, onClick }) => (
          <ListItem
            mb={{ xs: "20px", md: "16px" }}
            width={"100%"}
            onClick={onClose}
          >
            <ChakraLink
              as={Link}
              to={to}
              display={"flex"}
              alignItems={"center"}
              fontSize={{ xs: "1.5rem", md: "1.3rem" }}
              fontWeight={"500"}
              _hover={{ textDecoration: "none" }}
              m={"10px 0"}
              onClick={onClick}
            >
              <Box mr={{ xs: "20px", md: "15px" }}>
                <Icon />
              </Box>
              {label}
            </ChakraLink>
          </ListItem>
        ))}
      </UnorderedList>
    </>
  );
};

export default UserProfileSideBar;
