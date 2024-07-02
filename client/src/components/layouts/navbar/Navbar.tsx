import { Box } from "@chakra-ui/react";
import Logo from "./Logo";
import Menu from "./Menu";

const Navbar = () => {
  return (
    <Box
      borderRight={"1px solid #f2f2f2"}
      height={"100vh"}
      width={"220px"}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
    >
      <Logo />
      <Menu />
    </Box>
  );
};

export default Navbar;
