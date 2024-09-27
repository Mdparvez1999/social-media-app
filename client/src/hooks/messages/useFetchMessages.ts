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
          `${
            import.meta.env.VITE_BACKEND_API_BASE_URL
          }/api/messages/all-messages/${conversationId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();

        if (data.status === "fail" || data.status === "error") return;

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
