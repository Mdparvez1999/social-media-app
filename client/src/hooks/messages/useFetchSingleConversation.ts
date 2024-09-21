import { toast } from "react-toastify";

const useFetchSingleConversation = () => {
  const fetchSingleConversation = async (conversationId: string) => {
    try {
      const response = await fetch(
        `/api/messages/conversation/${conversationId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.status === "error" || data.status === "fail")
        throw new Error(data.message);

      return data.data;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return { fetchSingleConversation };
};

export default useFetchSingleConversation;
