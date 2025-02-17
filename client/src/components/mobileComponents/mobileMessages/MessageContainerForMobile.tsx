import { IoArrowBackOutline, IoCall } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  clearConversation,
  setSelectedConversation,
} from "../../../redux-store/features/messages/messagesSlice";
import { Avatar, Box, Divider, Heading, Text, Spinner } from "@chakra-ui/react";
import { FaVideo } from "react-icons/fa";
import MessageBody from "../../messages/MessageBody";
import MessaggeInput from "../../messages/MessaggeInput";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useFetchSingleConversation from "../../../hooks/messages/useFetchSingleConversation";
import { toast } from "react-toastify";

const MessageContainerForMobile = () => {
  const dispatch = useAppDispatch();

  const selectedConversation = useAppSelector(
    (state) => state.messages.selectedConversation
  );

  const [loading, setLoading] = useState<boolean>(false);

  const { fetchSingleConversation } = useFetchSingleConversation();

  const navigate = useNavigate();
  const location = useLocation();

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

  const handleBackClick = () => {
    dispatch(clearConversation());
    if (location.state?.from) {
      navigate(location.state.from, { replace: true });
    } else {
      navigate(-1);
    }
  };

  const memoizedConversation = useMemo(
    () => selectedConversation,
    [selectedConversation]
  );

  if (!selectedConversation) return;

  const profilePicUrl = memoizedConversation?.participant.profilePic
    ? memoizedConversation?.participant.profilePic
    : undefined;

  return (
    <Box height={"100vh"} width={"100%"}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Spinner size="xl" />
        </Box>
      ) : selectedConversation ? (
        <>
          <Box
            className="header"
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            p={"10px 20px"}
          >
            <Box display={"flex"} gap={"14px"} alignItems={"center"}>
              <IoArrowBackOutline
                onClick={handleBackClick}
                size={"1.7rem"}
                cursor={"pointer"}
              />
              <Avatar
                crossOrigin="anonymous"
                src={profilePicUrl}
                name={selectedConversation?.participant.userName}
              />
              <Text fontSize={"1.2rem"} fontWeight={"500"}>
                {selectedConversation?.participant.userName}
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
          <Box
            flex="1"
            overflowY="auto"
            maxHeight="calc(100vh - 120px)"
            p="10px"
          >
            <MessageBody />
          </Box>
          <Divider />
          <Box
            className="footer"
            position="fixed"
            bottom="0"
            left="0"
            width="100%"
            bg="white"
            p="4px 0px"
            boxShadow="0 -2px 10px rgba(0, 0, 0, 0.1)"
          >
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

export default MessageContainerForMobile;
