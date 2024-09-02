import { toast } from "react-toastify";
import { setComment } from "../../redux-store/features/comments/commentsSlice";
import { useAppDispatch } from "../hooks";
import { useCallback } from "react";

export const useComment = () => {
  const dispatch = useAppDispatch();

  const fetchComments = useCallback(
    async (postId: string | undefined) => {
      if (!postId) return;
      try {
        const response = await fetch(`/api/post/comments/get-all/${postId}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (data.status === "error" || data.status === "fail")
          throw new Error(data.message);

        dispatch(setComment(data.data));
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
      }
    },
    [dispatch]
  );
  return { fetchComments };
};
