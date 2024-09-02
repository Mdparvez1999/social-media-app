import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  setConversations,
  setSelectedConversation,
} from "../../../redux-store/features/messages/messagesSlice";
import { toast } from "react-toastify";
import { Avatar, Box, Divider, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import ConversationsInMobileSkeleton from "../../../mobileComponentSkeletons/ConversationsInMobileSkeleton";

interface ParticipantsState {
  id: string;
  userName: string;
  fullName: string;
  profilePic: string;
}

interface ConversationsState {
  id: string;
  isGroup: boolean;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  participants: ParticipantsState[];
}

const ConversationsInMobile = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);

  const conversations = useAppSelector((state) => state.messages.conversations);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/messages/conversations", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (data.status === "error" || data.status === "fail") return;

        dispatch(setConversations(data.data));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [dispatch]);

  const location = useLocation();
  const navigate = useNavigate();

  const handleConversationClick = (conversation: ConversationsState) => {
    dispatch(setSelectedConversation(conversation));
    navigate("/app/messagecontainer", { state: { from: location } });
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
            onClick={() => handleConversationClick(conversation)}
          >
            <Avatar
              size={{ xs: "lg", md: "md" }}
              name={conversation.participants[0]?.userName}
              src={
                conversation.participants[0]?.profilePic !== null
                  ? `https://localhost:8000/uploads/profilePic/${conversation.participants[0]?.profilePic}`
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

export default ConversationsInMobile;
