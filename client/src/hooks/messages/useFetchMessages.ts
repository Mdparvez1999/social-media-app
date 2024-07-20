import { useCallback } from "react";
import { useAppDispatch } from "../hooks";
import { setMessages } from "../../redux-store/features/messages/messagesSlice";
import { toast } from "react-toastify";

const useFetchMessages = () => {
  const dispatch = useAppDispatch();

  const fetchAllMessages = useCallback(
    async (conversationId: string | undefined) => {
      try {
        const response = await fetch(
          `/api/messages/all-messages/${conversationId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const { data } = await response.json();

        dispatch(setMessages(data));
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        else toast.error("Something went wrong");
      }
    },
    [dispatch]
  );

  return { fetchAllMessages };
};

export default useFetchMessages;
