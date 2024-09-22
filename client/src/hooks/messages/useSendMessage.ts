import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setMessages } from "../../redux-store/features/messages/messagesSlice";
import { toast } from "react-toastify";

const useSendMessage = () => {
  const dispatch = useAppDispatch();

  const selectedConversation = useAppSelector(
    (state) => state.messages.selectedConversation
  );
  const messages = useAppSelector((state) => state.messages.messages);

  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async (message: string) => {
    if (message.trim() === "") return toast.error("Message cannot be empty");
    setLoading(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/messages/send-message/${selectedConversation?.participants.id}`,
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

      if (data.status === "error" || data.status === "fail")
        throw new Error(data.message);

      dispatch(setMessages([...messages, data.data.message]));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMessage };
};

export default useSendMessage;
