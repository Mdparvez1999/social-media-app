import { Avatar, Box, Divider, Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  ConversationsState,
  setSelectedConversation,
} from "../../redux-store/features/messages/messagesSlice";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Conversations = () => {
  const dispatch = useAppDispatch();

  const conversations = useAppSelector((state) => state.messages.conversations);

  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const navigate = useNavigate();

  const handleConversationClick = (conversation: ConversationsState) => {
    if (!conversation) return;
    dispatch(setSelectedConversation(conversation));
    navigate(`/app/messages/${conversation.id}`);
  };

  return (
    <Box
      height={"100%"}
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box p={"12px 24px"} mb={"20px"}>
        <Box display={{ xs: "block", md: "none" }}>
          <IoArrowBackOutline size={"1.7rem"} />
        </Box>
        <Text fontSize={"2rem"} fontWeight={"600"}>
          {currentUser?.userName}
        </Text>
      </Box>
      <Divider width={"90%"} m={"0 auto"} />
      <Box
        fontSize={{ xs: "1.4rem", md: "1.2rem" }}
        fontWeight={"500"}
        p={"10px 24px"}
      >
        <Text>messages</Text>
      </Box>
      <Box maxHeight={"100vh"} width={"100%"} p={"10px 22px"}>
        {conversations && conversations.length > 0 ? (
          conversations.map((conversation) => (
            <Box
              key={conversation.id}
              display={"flex"}
              gap={"18px"}
              mb={"24px"}
              cursor={"pointer"}
              onClick={() => handleConversationClick(conversation)}
            >
              <Avatar
                size={{ xs: "lg", md: "md" }}
                name={conversation.participant.userName}
                src={
                  conversation.participant?.profilePic !== null
                    ? conversation.participant?.profilePic
                    : undefined
                }
                crossOrigin="anonymous"
              />
              <Text fontSize={{ xs: "1.4rem", md: "1.2rem" }} pt={"12px"}>
                {conversation.participant?.userName}
              </Text>
            </Box>
          ))
        ) : (
          <Text
            fontSize={{ xs: "1.3rem", md: "1.2rem" }}
            color={"gray.700"}
            textAlign={"center"}
            mt={"20px"}
          >
            No conversations yet.
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default Conversations;
