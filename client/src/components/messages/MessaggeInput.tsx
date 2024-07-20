import { Box, Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import useSendMessage from "../../hooks/messages/useSendMessage";
import { toast } from "react-toastify";

const MessaggeInput = () => {
  const [message, setMessage] = useState<string>("");

  const { loading, sendMessage } = useSendMessage();
  const handleSendMessage = async () => {
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

export default MessaggeInput;
