import { toast } from "react-toastify";
import { ConversationsState } from "../../redux-store/features/messages/messagesSlice";
import useFetchGetObjectUrlForAllProfilePics from "../usersprofile/useFetchGetObjectUrlForAllProfilePics";
import { useCallback } from "react";

const useFetchConversations = () => {
  const { fetchGetObjectUrlForAllProfilePics } =
    useFetchGetObjectUrlForAllProfilePics();
  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch("/api/messages/conversations", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "error" || data.status === "fail")
        throw new Error(data.message);

      const conversationData = data.data;

      const uniqueProfilePicUrls = new Map();

      conversationData.forEach((conversation: ConversationsState) => {
        const userId = conversation.participants.id;

        if (!uniqueProfilePicUrls.has(userId)) {
          uniqueProfilePicUrls.set(
            userId,
            conversation.participants.profilePic
          );
        }
      });

      const profilePicUrls = await fetchGetObjectUrlForAllProfilePics([
        ...uniqueProfilePicUrls.values(),
      ]);

      const upadatedConversations = conversationData.map(
        (conversation: ConversationsState) => {
          const userId: string = conversation.participants.id;

          const updatedParticipant = { ...conversation.participants };
          const upadatedConversation = {
            ...conversation,
            participants: updatedParticipant,
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
