import { Box, Text } from "@chakra-ui/react";
import useFetchMessages from "../../hooks/messages/useFetchMessages";
import { useEffect, useMemo, useRef } from "react";
import { useAppSelector } from "../../hooks/hooks";
import "react-chat-elements/dist/main.css";
import { ITextMessageProps, MessageList } from "react-chat-elements";

const MessageBody = () => {
  const { fetchAllMessages } = useFetchMessages();

  const selectedConversation = useAppSelector(
    (state) => state.messages.selectedConversation
  );

  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const messages = useAppSelector((state) => state.messages.messages);

  useEffect(() => {
    if (selectedConversation) {
      fetchAllMessages(selectedConversation.id);
    }
  }, [selectedConversation, fetchAllMessages]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const formattedMessages = useMemo((): (ITextMessageProps & {
    type: "text";
  })[] => {
    return messages
      .slice()
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      .map((message) => {
        const isSentByCurrentUser = message?.sender.id === currentUser?.id;

        return {
          position: isSentByCurrentUser ? "right" : "left",
          type: "text",
          text: message.message,
          date: new Date(message.createdAt),
          title: message.sender.userName,
          id: message.id,
          focus: false,
          titleColor: "#000",
          forwarded: false,
          replyButton: false,
          removeButton: false,
          retracted: false,
          reply: null,
          status: "sent",
          notch: false,
        };
      });
  }, [messages, currentUser]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [formattedMessages]);

  return (
    <Box
      p={{ xs: "0px", md: 4 }}
      overflowY="auto"
      height="calc(100vh - 130px)"
      display="flex"
      flexDirection="column"
      ref={containerRef}
    >
      {messages?.length > 0 ? (
        <MessageList
          className="message-list"
          toBottomHeight={"100%"}
          referance={null}
          lockable={true}
          dataSource={formattedMessages}
        />
      ) : (
        <Text display={"flex"} justifyContent={"center"} mt={"200px"}>
          Send a message to start the conversation
        </Text>
      )}
    </Box>
  );
};

export default MessageBody;
