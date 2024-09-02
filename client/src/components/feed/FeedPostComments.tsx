import { Box, useDisclosure } from "@chakra-ui/react";
import { FaRegComment } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import FeedPostCommentsModal from "./FeedPostCommentsModal";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useCallback, useEffect } from "react";
import { setFeedPostComments } from "../../redux-store/features/feed/feedSlice";
import { toast } from "react-toastify";

interface FeedPostCommentsProps {
  postId: string;
}

const FeedPostComments = ({ postId }: FeedPostCommentsProps) => {
  const dispatch = useAppDispatch();

  const post = useAppSelector((state) =>
    state.feed.posts.find((post) => post.id === postId)
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchFeedPostComments = useCallback(async () => {
    if (!post) return;
    try {
      const response = await fetch(`/api/post/comments/get-all/${post.id}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "fail" || data.status === "error")
        throw new Error(data.message);

      dispatch(setFeedPostComments(data.data));
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "something went wrong";
      toast.error(errorMsg);
    }
  }, [post, dispatch]);

  useEffect(() => {
    if (isOpen) {
      fetchFeedPostComments();
    }
  }, [isOpen, fetchFeedPostComments]);

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box>
        <Box display={"flex"} alignItems={"center"} gap={"8px"}>
          <FaRegComment size={"1.9rem"} cursor={"pointer"} onClick={onOpen} />
          <LuSend size={"1.8rem"} />
        </Box>
      </Box>
      <FeedPostCommentsModal
        isOpen={isOpen}
        onClose={onClose}
        postId={post?.id}
      />
    </Box>
  );
};

export default FeedPostComments;
