import { Avatar, Box, Divider, Heading, Text } from "@chakra-ui/react";
import { IoCall } from "react-icons/io5";
import { FaVideo } from "react-icons/fa6";
import MessageBody from "./MessageBody";
import MessaggeInput from "./MessaggeInput";
import { useAppSelector } from "../../hooks/hooks";
import { useMemo } from "react";

const MessageContainer = () => {
  const selectedConversation = useAppSelector(
    (state) => state.messages.selectedConversation
  );

  const memoizedConversation = useMemo(
    () => selectedConversation,
    [selectedConversation]
  );

  const profilePicUrl = memoizedConversation?.participants[0].profilePic
    ? `http://localhost:8000/uploads/profliePic/${memoizedConversation?.participants[0].profilePic}`
    : undefined;

  return (
    <Box height={"100vh"} width={"100%"}>
      {memoizedConversation ? (
        <>
          <Box
            className="header"
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            p={"10px 20px"}
          >
            <Box display={"flex"} gap={"14px"} alignItems={"center"}>
              <Avatar
                name={memoizedConversation?.participants[0].userName}
                src={profilePicUrl}
                crossOrigin="anonymous"
              />
              <Text fontSize={"1.2rem"} fontWeight={"500"}>
                {selectedConversation?.participants[0].userName}
              </Text>
            </Box>
            <Box
              display={"flex"}
              gap={"16px"}
              alignItems={"center"}
              pr={"10px"}
            >
              <IoCall size={"1.8rem"} />
              <FaVideo size={"1.9rem"} />
            </Box>
          </Box>
          <Divider />
          <Box maxHeight={"100%"}>
            <MessageBody />
          </Box>
          <Divider />
          <Box className="footer">
            <MessaggeInput />
          </Box>
        </>
      ) : (
        <>
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            gap={"10px"}
            pt={"250px"}
          >
            <Heading>Your messages</Heading>
            <Text fontSize={"1.2rem"}>send a message to your friends</Text>
          </Box>
        </>
      )}
    </Box>
  );
};

export default MessageContainer;
