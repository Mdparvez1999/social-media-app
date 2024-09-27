import { toast } from "react-toastify";
import useFetchGetObjectProfilePicUrl from "../profile/useFetchGetObjectProfilePicUrl";

const useFetchCreateConversation = () => {
  const { fetchGetObjectProfilePicUrl } = useFetchGetObjectProfilePicUrl();
  const createConversation = async (recieverId: string) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/messages/create-conversation/${recieverId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.status === "error" || data.status === "fail")
        throw new Error(data.message);

      const conversationData = data.data.conversation;

      const profilePicUrl = await fetchGetObjectProfilePicUrl(
        conversationData.participant.profilePic
      );

      const updatedConversationData = {
        ...conversationData,
        participant: {
          ...conversationData.participant,
          profilePic: profilePicUrl,
        },
      };

      return updatedConversationData;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return { createConversation };
};

export default useFetchCreateConversation;
