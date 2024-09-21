import { Box, useDisclosure } from "@chakra-ui/react";
import { FaRegComment } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import FeedPostCommentsModal from "./FeedPostCommentsModal";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useCallback, useEffect } from "react";
import { setFeedPostComments } from "../../redux-store/features/feed/feedSlice";
import { toast } from "react-toastify";
import useFetchGetObjectUrlForAllProfilePics from "../../hooks/usersprofile/useFetchGetObjectUrlForAllProfilePics";
import { CommentState } from "../../redux-store/features/comments/commentsSlice";

interface FeedPostCommentsProps {
  postId: string;
}

const FeedPostComments = ({ postId }: FeedPostCommentsProps) => {
  const dispatch = useAppDispatch();

  const { fetchGetObjectUrlForAllProfilePics } =
    useFetchGetObjectUrlForAllProfilePics();

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

      const commentsData = data.data;

      const uniqueProfilePicUrls = new Map();

      commentsData.forEach((comment: CommentState) => {
        const { id: userId, profilePic: profilePicUrl } = comment.user;

        if (!uniqueProfilePicUrls.has(userId)) {
          uniqueProfilePicUrls.set(userId, profilePicUrl);
        }
      });

      const profilePicUrls = await fetchGetObjectUrlForAllProfilePics([
        ...uniqueProfilePicUrls.values(),
      ]);

      const updatedComments = commentsData.map((comment: CommentState) => {
        const userId: string = comment.user.id;
        const updatedComment = { ...comment };
        const newProfilePic = profilePicUrls?.find((url) => {
          return url.includes(uniqueProfilePicUrls.get(userId));
        });

        if (newProfilePic) updatedComment.user.profilePic = newProfilePic;
        return updatedComment;
      });

      console.log(updatedComments);

      dispatch(setFeedPostComments(updatedComments));
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "something went wrong";
      toast.error(errorMsg);
    }
  }, [post, dispatch, fetchGetObjectUrlForAllProfilePics]);

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
