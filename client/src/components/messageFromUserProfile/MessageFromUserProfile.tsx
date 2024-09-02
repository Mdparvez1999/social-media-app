import { Avatar, Box, Divider, Heading, Text } from "@chakra-ui/react";
import { FaVideo } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { useAppSelector } from "../../hooks/hooks";
import MessageInputForUsersProfile from "./MessageInputForUsersProfile";
import MessageBodyForUsersProfile from "./MessageBodyForUsersProfile";

const MessageFromUserProfile = () => {
  // Selecting necessary data from the Redux store
  const selectedUsersMessage = useAppSelector(
    (state) => state.users.selectedUsersMessage
  );
  const selectedConversation = useAppSelector(
    (state) => state.messages.selectedConversation
  );

  return (
    <Box height="100vh" width="100%">
      {selectedUsersMessage ? (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p="10px 20px"
          >
            <Box display="flex" gap="14px" alignItems="center">
              <Avatar />
              <Text fontSize="1.2rem" fontWeight="500">
                {selectedConversation
                  ? selectedConversation.participants[0].userName
                  : selectedUsersMessage.userName}
              </Text>
            </Box>
            <Box display="flex" gap="16px" alignItems="center" pr="10px">
              <IoCall size="1.8rem" />
              <FaVideo size="1.9rem" />
            </Box>
          </Box>

          <Divider />

          <Box flex="1" maxHeight="calc(100vh - 100px)" overflowY="auto">
            <MessageBodyForUsersProfile />
          </Box>

          <Divider />

          <Box>
            <MessageInputForUsersProfile />
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="10px"
          pt="250px"
        >
          <Heading>Your messages</Heading>
          <Text fontSize="1.2rem">Send a message to your friends</Text>
        </Box>
      )}
    </Box>
  );
};

export default MessageFromUserProfile;
