import { toast } from "react-toastify";
import {
  CommentState,
  setComment,
} from "../../redux-store/features/comments/commentsSlice";
import { useAppDispatch } from "../hooks";
import { useCallback } from "react";
import useFetchGetObjectUrlForAllProfilePics from "../usersprofile/useFetchGetObjectUrlForAllProfilePics";

export const useComment = () => {
  const dispatch = useAppDispatch();

  const { fetchGetObjectUrlForAllProfilePics } =
    useFetchGetObjectUrlForAllProfilePics();
  const fetchComments = useCallback(
    async (postId: string | undefined) => {
      if (!postId) return;
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_API_BASE_URL
          }/api/post/comments/get-all/${postId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (data.status === "error" || data.status === "fail")
          throw new Error(data.message);

        dispatch(setComment(data.data));

        const uniqueProfilePicUrls = new Map();

        data.data.forEach((comment: CommentState) => {
          const { id: userId, profilePic } = comment.user;

          if (!uniqueProfilePicUrls.has(userId)) {
            uniqueProfilePicUrls.set(userId, profilePic);
          }
        });

        const userProfilePicsUrl = [...uniqueProfilePicUrls.values()];

        const profilePicUrls = await fetchGetObjectUrlForAllProfilePics(
          userProfilePicsUrl
        );

        const updatedComments = data.data.map((comment: CommentState) => {
          const userId = comment.user.id;

          const updatedUser = { ...comment.user };
          const updatedComment = { ...comment, user: updatedUser };

          const newProfilePicUrl = profilePicUrls?.find((url) => {
            return url.includes(uniqueProfilePicUrls.get(userId));
          });

          if (newProfilePicUrl) updatedUser.profilePic = newProfilePicUrl;

          return updatedComment;
        });

        dispatch(setComment(updatedComments));
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
      }
    },
    [dispatch, fetchGetObjectUrlForAllProfilePics]
  );
  return { fetchComments };
};
