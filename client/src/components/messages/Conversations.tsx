import { Avatar, Box, Divider, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  setConversations,
  setSelectedConversation,
} from "../../redux-store/features/messages/messagesSlice";
import { toast } from "react-toastify";
import { IoArrowBackOutline } from "react-icons/io5";

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

        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }

        const data = await response.json();

        if (data.status === "error" || data.status === "fail")
          throw new Error(data.message);

        dispatch(setConversations(data.data));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
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
        {conversations?.map((conversation) => (
          <Box
            key={conversation.id}
            display={"flex"}
            gap={"18px"}
            mb={"24px"}
            cursor={"pointer"}
            onClick={() => dispatch(setSelectedConversation(conversation))}
          >
            <Avatar
              size={{ xs: "lg", md: "md" }}
              name={conversation.participants[0]?.userName}
              src={
                conversation.participants[0]?.profilePic !== null
                  ? `https://localhost:8000/uploads/profliePic/${conversation.participants[0]?.profilePic}`
                  : undefined
              }
              crossOrigin="anonymous"
            />
            <Text fontSize={{ xs: "1.4rem", md: "1.2rem" }} pt={"12px"}>
              {conversation.participants[0]?.userName}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Conversations;
