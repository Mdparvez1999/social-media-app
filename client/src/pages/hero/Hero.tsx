import { Outlet } from "react-router-dom";
import Navbar from "../../components/layouts/navbar/Navbar";
import { Box } from "@chakra-ui/react";

const Hero = () => {
  return (
    <Box display={"flex"}>
      <Box
        position={"fixed"}
        top={0}
        left={0}
        width={"220px"}
        zIndex={"1000"}
        boxShadow={"md"}
      >
        <Navbar />
      </Box>
      <Box marginLeft="200px" width="calc(100% - 200px)" pl={"20px"}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Hero;
