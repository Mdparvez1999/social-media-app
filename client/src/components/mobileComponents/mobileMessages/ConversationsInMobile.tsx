import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  ConversationsState,
  setConversations,
  setSelectedConversation,
} from "../../../redux-store/features/messages/messagesSlice";
import { toast } from "react-toastify";
import { Avatar, Box, Divider, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import ConversationsInMobileSkeleton from "../../../mobileComponentSkeletons/ConversationsInMobileSkeleton";
import useFetchConversations from "../../../hooks/messages/useFetchConversations";

const ConversationsInMobile = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);

  const conversations = useAppSelector((state) => state.messages.conversations);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const { fetchConversations } = useFetchConversations();

  useEffect(() => {
    const fetchUserConversations = async () => {
      setLoading(true);
      try {
        const conversationData = await fetchConversations();
        dispatch(setConversations(conversationData));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserConversations();
  }, [dispatch, fetchConversations]);

  const location = useLocation();
  const navigate = useNavigate();

  const handleConversationClick = (conversation: ConversationsState) => {
    dispatch(setSelectedConversation(conversation));
    navigate(`/app/messagecontainer/${conversation.id}`, {
      state: { from: location },
    });
  };

  const handleBackClick = () => {
    navigate("/app/home");
  };

  return loading ? (
    <ConversationsInMobileSkeleton />
  ) : (
    <Box
      height={"100%"}
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box
        p={"8px 0px 0px 20px"}
        mb={"8px"}
        display={"flex"}
        alignItems={"center"}
        gap={"10px"}
      >
        <IoArrowBackOutline
          onClick={handleBackClick}
          size={"2rem"}
          cursor={"pointer"}
        />
        <Text fontSize={"2rem"} fontWeight={"600"} pl={"10px"} pb={"10px"}>
          {currentUser?.userName}
        </Text>
      </Box>
      <Divider width={"90%"} m={"0 auto"} />
      <Box
        fontSize={{ xs: "1.4rem", md: "1.2rem" }}
        fontWeight={"500"}
        p={"10px 24px"}
      >
        <Text>Messages</Text>
      </Box>
      <Box maxHeight={"100vh"} width={"100%"} p={"10px 22px"}>
        {conversations.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="60vh"
            textAlign="center"
            padding="20px"
          >
            <Text fontSize="1.2rem" fontWeight="600" mb="10px">
              No Conversations Yet
            </Text>
            <Text fontSize="1.1rem" color="gray.600">
              Start a new conversation by following users or sending a message.
            </Text>
          </Box>
        ) : (
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
                name={conversation.participants?.userName}
                src={
                  conversation.participants?.profilePic !== null
                    ? conversation.participants?.profilePic
                    : undefined
                }
                crossOrigin="anonymous"
              />
              <Text fontSize={{ xs: "1.4rem", md: "1.2rem" }} pt={"12px"}>
                {conversation.participants?.userName}
              </Text>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default ConversationsInMobile;
