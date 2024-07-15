import { Box, useDisclosure } from "@chakra-ui/react";
import { CiBookmark, CiHeart } from "react-icons/ci";
import { LuSend } from "react-icons/lu";
import { FaRegComment } from "react-icons/fa";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { toast } from "react-toastify";
import { setFeedPostComments } from "../../redux-store/features/feed/feedSlice";
import FeedPostCommentsModal from "./FeedPostCommentsModal";

const LikeCommentPost = () => {
  const dispatch = useAppDispatch();
  const post = useAppSelector((state) => state.feed.singlePost);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchFeedPostComments = async () => {
      try {
        const response = await fetch(`/api/post/comments/get-all/${post?.id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error(response.statusText);

        const { data } = await response.json();

        dispatch(setFeedPostComments(data));
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        else toast.error("Something went wrong");
      }
    };

    if (post) {
      fetchFeedPostComments();
    }
  }, [post, dispatch]);
  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box display={"flex"} alignItems={"center"} gap={"14px"}>
          <CiHeart size={"2.4rem"} cursor={"pointer"} />
          <FaRegComment size={"1.8rem"} cursor={"pointer"} onClick={onOpen} />
          <LuSend size={"1.8rem"} />
        </Box>
        <Box>
          <CiBookmark size={"1.9rem"} />
        </Box>
      </Box>
      <FeedPostCommentsModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default LikeCommentPost;
