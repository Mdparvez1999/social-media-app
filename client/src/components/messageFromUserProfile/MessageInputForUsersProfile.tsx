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
    if (message.trim() === "") return toast.error("Message cannot be empty");
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/messages/send-message/${selectedUsersMessage?.id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      const data = await response.json();

      console.log(data);

      if (data.status === "error" || data.status === "fail")
        throw new Error(data.message);

      dispatch(setMessages([...messages, data.message]));

      if (data.conversation) {
        dispatch(addConversation(data.conversation));
        dispatch(setSelectedConversation(data.conversation));
      }

      setMessage("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
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
        disabled={!message.trim()}
      >
        Send
      </Button>
    </Box>
  );
};

export default MessageInputForUsersProfile;
