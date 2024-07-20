import { Box, Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  addConversation,
  setMessages,
  setSelectedConversation,
} from "../../redux-store/features/messages/messagesSlice";

const MessageInputForUsersProfile = () => {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const selectedUsersMessage = useAppSelector(
    (state) => state.users.selectedUsersMessage
  );

  const messages = useAppSelector((state) => state.messages.messages);

  const handleSendMessage = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/messages/send-message/${selectedUsersMessage?.id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      const { data } = await response.json();

      if (data.status === "error" || data.status === "fail")
        throw new Error(data.message);

      dispatch(setMessages([...messages, data.message]));

      if (data.conversation) {
        dispatch(addConversation(data.conversation));
        dispatch(setSelectedConversation(data.conversation));
      }
      
      setMessage("");
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      p={"10px 20px"}
      width={"100%"}
    >
      <Input
        width={"85%"}
        placeholder="Type something..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        size={"md"}
        width={"12%"}
        isLoading={loading}
        onClick={handleSendMessage}
      >
        Send
      </Button>
    </Box>
  );
};

export default MessageInputForUsersProfile;
