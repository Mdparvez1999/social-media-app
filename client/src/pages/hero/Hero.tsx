import { Outlet } from "react-router-dom";
import Navbar from "../../components/layouts/navbar/Navbar";
import { Box } from "@chakra-ui/react";

const Hero = () => {
  return (
    <Box display={"flex"}>
      <div>
        <Navbar />
      </div>
      <Outlet />
    </Box>
  );
};

export default Hero;
