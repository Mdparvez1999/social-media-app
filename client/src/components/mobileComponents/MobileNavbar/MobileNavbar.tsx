import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaSearch, FaUserCircle } from "react-icons/fa";
import { GoPlusCircle } from "react-icons/go";
import { IoNotifications } from "react-icons/io5";
import {
  Box,
  ListItem,
  UnorderedList,
  useDisclosure,
  Link as ChakraLink,
} from "@chakra-ui/react";
import CreatePost from "../../../pages/create post/CreatePost";

const Menu = () => {
  const createPostDisclosure = useDisclosure();

  const location = useLocation();

  const navigate = useNavigate();

  const handleNavigateToSearch = () => {
    navigate("/app/search", { state: { from: location } });
  };

  const handleNavigateToNotifications = () => {
    navigate("/app/notifications", { state: { from: location } });
  };

  return (
    <>
      <Box
        width={"100%"}
        height={"100%"}
        bg={"white"}
        borderTop={"1px solid #f2f2f2"}
      >
        <UnorderedList
          display={"flex"}
          padding={"5px"}
          listStyleType={"none"}
          _hover={{ cursor: "pointer" }}
        >
          <ListItem width={"100%"} padding={"10px"}>
            <ChakraLink
              as={Link}
              to={"/app/home"}
              _hover={{ textDecoration: "none" }}
            >
              <FaHome size={"1.5rem"} />
            </ChakraLink>
          </ListItem>

          <ListItem
            width={"100%"}
            padding={"10px"}
            onClick={handleNavigateToSearch}
          >
            <ChakraLink as={Link} _hover={{ textDecoration: "none" }}>
              <FaSearch size={"1.5rem"} />
            </ChakraLink>
          </ListItem>

          <ListItem width={"100%"} padding={"10px"}>
            <ChakraLink
              as={Link}
              to={"#"}
              onClick={createPostDisclosure.onOpen}
              _hover={{ textDecoration: "none" }}
            >
              <GoPlusCircle size={"1.5rem"} />
            </ChakraLink>
          </ListItem>

          <ListItem
            width={"100%"}
            padding={"10px"}
            onClick={handleNavigateToNotifications}
          >
            <ChakraLink as={Link} _hover={{ textDecoration: "none" }}>
              <IoNotifications size={"1.5rem"} />
            </ChakraLink>
          </ListItem>

          <ListItem width={"100%"} padding={"10px"}>
            <ChakraLink
              as={Link}
              to={"/app/profile"}
              _hover={{ textDecoration: "none" }}
            >
              <FaUserCircle size={"1.5rem"} />
            </ChakraLink>
          </ListItem>
        </UnorderedList>
      </Box>
      <CreatePost
        isOpen={createPostDisclosure.isOpen}
        onClose={createPostDisclosure.onClose}
      />
    </>
  );
};

export default Menu;
