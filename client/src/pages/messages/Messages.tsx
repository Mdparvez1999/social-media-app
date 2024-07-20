import { Box } from "@chakra-ui/react";
import Conversations from "../../components/messages/Conversations";
import MessageContainer from "../../components/messages/MessageContainer";
import MessageFromUserProfile from "../../components/messageFromUserProfile/MessageFromUserProfile";
import { useAppSelector } from "../../hooks/hooks";
import useListenMessages from "../../hooks/messages/useListenMessages";

const Messages = () => {
  const selectedUsersMessage = useAppSelector(
    (state) => state.users.selectedUsersMessage
  );

  useListenMessages();

  return (
    <Box height={"100vh"} width={"100%"} display={"flex"}>
      <Box flex={1.3} borderRight={"1px solid #f2f2f2"}>
        <Conversations />
      </Box>
      <Box flex={4}>
        {selectedUsersMessage ? (
          <MessageFromUserProfile />
        ) : (
          <MessageContainer />
        )}
      </Box>
    </Box>
  );
};

export default Messages;
