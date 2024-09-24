import { toast } from "react-toastify";

const useFetchSingleConversation = () => {
  const fetchSingleConversation = async (conversationId: string) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/messages/conversation/${conversationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
