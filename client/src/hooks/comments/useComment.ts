import { toast } from "react-toastify";
import { setComment } from "../../redux-store/features/comments/commentsSlice";
import { useAppDispatch } from "../hooks";
import { useCallback } from "react";

export const useComment = () => {
  const dispatch = useAppDispatch();
  const fetchComments = useCallback(
    async (postId: string | undefined) => {
      try {
        const response = await fetch(`/api/post/comments/get-all/${postId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const { data } = await response.json();

        dispatch(setComment(data));
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
      }
    },
    [dispatch]
  );
  return { fetchComments };
};
