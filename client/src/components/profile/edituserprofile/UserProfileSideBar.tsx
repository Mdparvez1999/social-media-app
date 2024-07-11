import { Heading, ListItem, UnorderedList } from "@chakra-ui/react";
import { MdSecurity } from "react-icons/md";
import { RiChatPrivateLine } from "react-icons/ri";
import { IoSettingsOutline, IoOptionsOutline } from "react-icons/io5";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const userProfileSideBar = () => {
  return (
    <>
      <Heading fontSize={"1.4rem"} fontWeight={"500"} m={"20px"} p={"8px"}>
        Settings
      </Heading>
      <UnorderedList width={"100%"} listStyleType={"none"} padding={"8px"}>
        <ListItem mb={"16px"}>
          <ChakraLink
            as={Link}
            to={"/app/profiledata/generaldetails"}
            display={"flex"}
            alignItems={"center"}
            fontSize={"1.3rem"}
            fontWeight={"500"}
            _hover={{ textDecoration: "none" }}
            m={"10px 0"}
          >
            <IoSettingsOutline style={{ marginRight: "15px" }} />
            General
          </ChakraLink>
        </ListItem>
        <ListItem mb={"16px"}>
          <ChakraLink
            as={Link}
            to={"/app/profiledata/passwordsettings"}
            display={"flex"}
            alignItems={"center"}
            fontSize={"1.3rem"}
            fontWeight={"500"}
            _hover={{ textDecoration: "none" }}
            m={"10px 0"}
          >
            <MdSecurity style={{ marginRight: "15px" }} />
            Password
          </ChakraLink>
        </ListItem>
        <ListItem mb={"16px"}>
          <ChakraLink
            as={Link}
            to={"/app/profiledata/privacysettings"}
            display={"flex"}
            alignItems={"center"}
            fontSize={"1.3rem"}
            fontWeight={"500"}
            _hover={{ textDecoration: "none" }}
            m={"10px 0"}
          >
            <RiChatPrivateLine style={{ marginRight: "15px" }} />
            Privacy
          </ChakraLink>
        </ListItem>

        <ListItem mb={"16px"}>
          <ChakraLink
            as={Link}
            to={"/app/profiledata/advancedsettings"}
            display={"flex"}
            alignItems={"center"}
            fontSize={"1.3rem"}
            fontWeight={"500"}
            _hover={{ textDecoration: "none" }}
            m={"10px 0"}
          >
            <IoOptionsOutline style={{ marginRight: "15px" }} />
            Advanced
          </ChakraLink>
        </ListItem>
      </UnorderedList>
    </>
  );
};

export default userProfileSideBar;
