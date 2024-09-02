import { Box, Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import useSendMessage from "../../hooks/messages/useSendMessage";
import { toast } from "react-toastify";

const MessaggeInput = () => {
  const [message, setMessage] = useState<string>("");

  const { loading, sendMessage } = useSendMessage();

  const handleSendMessage = async () => {
    if (!message.trim()) return; // Prevent sending empty messages
    try {
      await sendMessage(message);
      setMessage("");
    } catch (error) {
      toast.error("Something went wrong");
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
        flex={1}
        mr={2}
        placeholder="Type something..."
        value={message}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMessage(e.target.value)
        }
      />
      <Button
        size={"md"}
        flexShrink={0}
        isLoading={loading}
        onClick={handleSendMessage}
      >
        Send
      </Button>
    </Box>
  );
};

export default MessaggeInput;
