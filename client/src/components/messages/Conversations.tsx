import { Avatar, Box, Divider, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  setConversations,
  setSelectedConversation,
} from "../../redux-store/features/messages/messagesSlice";
import { toast } from "react-toastify";

const Conversations = () => {
  const dispatch = useAppDispatch();

  const conversations = useAppSelector((state) => state.messages.conversations);

  const currentUser = useAppSelector((state) => state.auth.currentUser);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch("/api/messages/conversations", {
          method: "GET",
          credentials: "include",
        });

        const { data } = await response.json();

        if (data.status === "error" || data.status === "fail")
          throw new Error(data.message);

        dispatch(setConversations(data));
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        else toast.error("Something went wrong");
      }
    };

    fetchConversations();
  }, [dispatch]);

  return (
    <Box
      height={"100%"}
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box p={"12px 24px"} mb={"20px"}>
        <Text fontSize={"2rem"} fontWeight={"600"}>
          {currentUser?.userName}
        </Text>
      </Box>
      <Divider width={"90%"} m={"0 auto"} />
      <Box fontSize={"1.2rem"} fontWeight={"500"} p={"10px 24px"}>
        <Text>messages</Text>
      </Box>
      <Box maxHeight={"100vh"} width={"100%"} p={"10px 22px"}>
        {conversations?.map((conversation) => (
          <Box
            key={conversation.id}
            display={"flex"}
            alignItems={"center"}
            gap={"15px"}
            mb={"24px"}
            cursor={"pointer"}
            onClick={() => dispatch(setSelectedConversation(conversation))}
          >
            <Avatar
              size={"md"}
              name={conversation.participants[0]?.userName}
              src={`/https://localhost:8000/uploads/profliePic/${conversation.participants[0]?.profilePic}`}
              crossOrigin="anonymous"
            />
            <Text fontSize={"1.2rem"}>
              {conversation.participants[0]?.userName}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Conversations;
