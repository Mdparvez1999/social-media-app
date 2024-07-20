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
    setLoading(true);
    try {
      const response = await fetch(
        `/api/messages/send-message/${selectedConversation?.participants[0].id}`,
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
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMessage };
};

export default useSendMessage;
