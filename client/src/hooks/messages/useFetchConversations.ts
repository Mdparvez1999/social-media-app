import { toast } from "react-toastify";
import { ConversationsState } from "../../redux-store/features/messages/messagesSlice";
import useFetchGetObjectUrlForAllProfilePics from "../usersprofile/useFetchGetObjectUrlForAllProfilePics";
import { useCallback } from "react";

const useFetchConversations = () => {
  const { fetchGetObjectUrlForAllProfilePics } =
    useFetchGetObjectUrlForAllProfilePics();
  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_BASE_URL
        }/api/messages/conversations`,
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

      const conversationData = data.data;

      const uniqueProfilePicUrls = new Map();

      conversationData.forEach((conversation: ConversationsState) => {
        const userId = conversation.participant.id;

        if (!uniqueProfilePicUrls.has(userId)) {
          uniqueProfilePicUrls.set(userId, conversation.participant.profilePic);
        }
      });

      const profilePicUrls = await fetchGetObjectUrlForAllProfilePics([
        ...uniqueProfilePicUrls.values(),
      ]);

      const upadatedConversations = conversationData.map(
        (conversation: ConversationsState) => {
          const userId: string = conversation.participant.id;

          const updatedParticipant = { ...conversation.participant };
          const upadatedConversation = {
            ...conversation,
            participant: updatedParticipant,
          };

          const newProfilePic = profilePicUrls?.find((url) => {
            return url.includes(uniqueProfilePicUrls.get(userId));
          });

          if (newProfilePic) updatedParticipant.profilePic = newProfilePic;

          return upadatedConversation;
        }
      );

      return upadatedConversations;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  }, [fetchGetObjectUrlForAllProfilePics]);

  return { fetchConversations };
};

export default useFetchConversations;
