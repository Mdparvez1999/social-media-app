import { useCallback } from "react";
import { useAppDispatch } from "../hooks";
import { setMessages } from "../../redux-store/features/messages/messagesSlice";
import { toast } from "react-toastify";

const useFetchMessages = () => {
  const dispatch = useAppDispatch();

  const fetchAllMessages = useCallback(
    async (conversationId: string | undefined) => {
      if (!conversationId) return;
      try {
        const response = await fetch(
          `/api/messages/all-messages/${conversationId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (data.status === "fail" || data.status === "error")
          throw new Error(data.message);

        dispatch(setMessages(data.data));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      }
    },
    [dispatch]
  );

  return { fetchAllMessages };
};

export default useFetchMessages;
