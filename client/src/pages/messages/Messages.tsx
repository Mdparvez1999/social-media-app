import { Box } from "@chakra-ui/react";
import Conversations from "../../components/messages/Conversations";
import useListenMessages from "../../hooks/messages/useListenMessages";
import { Outlet } from "react-router-dom";

const Messages = () => {
  useListenMessages();

  return (
    <Box height={"100vh"} width={"100%"} display={"flex"}>
      <Box flex={1.3} borderRight={"1px solid #f2f2f2"}>
        <Conversations />
      </Box>

      <Box flex={4}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Messages;
