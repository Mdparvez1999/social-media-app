import {
  Avatar,
  Box,
  Center,
  Divider,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { IoCall } from "react-icons/io5";
import { FaVideo } from "react-icons/fa6";
import MessageBody from "./MessageBody";
import MessaggeInput from "./MessaggeInput";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useFetchSingleConversation from "../../hooks/messages/useFetchSingleConversation";
import { setSelectedConversation } from "../../redux-store/features/messages/messagesSlice";
import { toast } from "react-toastify";

const MessageContainer = () => {
  const dispatch = useAppDispatch();

  const selectedConversation = useAppSelector(
    (state) => state.messages.selectedConversation
  );

  const [loading, setLoading] = useState<boolean>(false);

  const { fetchSingleConversation } = useFetchSingleConversation();

  const conversationId = useParams().conversationId;

  useEffect(() => {
    const fetchSelectedConversation = async () => {
      setLoading(true);
      try {
        const conversationData = await fetchSingleConversation(
          conversationId as string
        );
        dispatch(setSelectedConversation(conversationData));
      } catch (error) {
        error instanceof Error
          ? toast.error(error.message)
          : toast.error("Something went wrong");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 600);
      }
    };

    if (!selectedConversation) {
      fetchSelectedConversation();
    }
  }, [dispatch, fetchSingleConversation, selectedConversation, conversationId]);

  const memoizedConversation = useMemo(
    () => selectedConversation,
    [selectedConversation]
  );

  const profilePicUrl = memoizedConversation?.participants.profilePic
    ? memoizedConversation?.participants.profilePic
    : undefined;

  return (
    <Box height={"100vh"} width={"100%"}>
      {loading ? (
        <Center height="100%">
          <Spinner size="xl" />
        </Center>
      ) : memoizedConversation ? (
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
                name={memoizedConversation?.participants.userName}
                src={profilePicUrl}
                crossOrigin="anonymous"
              />
              <Text fontSize={"1.2rem"} fontWeight={"500"}>
                {selectedConversation?.participants.userName}
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
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          gap={"10px"}
          pt={"250px"}
        >
          <Heading>Your messages</Heading>
          <Text fontSize={"1.2rem"}>Send a message to your friends</Text>
        </Box>
      )}
    </Box>
  );
};

export default MessageContainer;
