import { IoArrowBackOutline, IoCall } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { clearConversation } from "../../../redux-store/features/messages/messagesSlice";
import { Avatar, Box, Divider, Heading, Text } from "@chakra-ui/react";
import { FaVideo } from "react-icons/fa";
import MessageBody from "../../messages/MessageBody";
import MessaggeInput from "../../messages/MessaggeInput";
import { useLocation, useNavigate } from "react-router-dom";

const MessageContainerForMobile = () => {
  const dispatch = useAppDispatch();
  const selectedConversation = useAppSelector(
    (state) => state.messages.selectedConversation
  );

  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    dispatch(clearConversation());
    if (location.state?.from) {
      navigate(location.state.from, { replace: true });
    } else {
      navigate(-1);
    }
  };
  return (
    <Box height={"100vh"} width={"100%"}>
      {selectedConversation ? (
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
                src={
                  selectedConversation?.participants[0].profilePic !== null
                    ? `http://localhost:8000/uploads/profilePic/${selectedConversation?.participants[0].profilePic}`
                    : undefined
                }
                name={selectedConversation?.participants[0].userName}
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

export default MessageContainerForMobile;
