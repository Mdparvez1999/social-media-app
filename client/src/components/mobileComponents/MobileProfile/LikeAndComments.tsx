import { Box, Text, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { CiBookmark } from "react-icons/ci";
import { LuSend } from "react-icons/lu";
import { FaRegComment } from "react-icons/fa";
import PostCommentsInMobile from "./PostCommentsInMobile";
import CustomLikeButton from "../../posts/CustomLikeButton";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import useLikePostHook from "../../../hooks/post/useLikePost";
import useUnlikePost from "../../../hooks/post/useUnlikePost";
import {
  likePostAction,
  PostState,
  unlikePostAction,
} from "../../../redux-store/features/post/postsSlice";
import { toast } from "react-toastify";

const LikeAndComments = ({ post }: { post: PostState }) => {
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const currentUser = useAppSelector((state) => state.profile.profile);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likeCount || 0);

  const { likePost } = useLikePostHook();
  const { unlikePost } = useUnlikePost();

  useEffect(() => {
    if (post && currentUser) {
      const userHasLiked = post.postLikes?.some(
        (like) => like.user.id === currentUser.id
      );

      setIsLiked(userHasLiked);

      setLikeCount(post?.likeCount || 0);
    }
  }, [post, currentUser]);

  const handleLikeClick = async () => {
    try {
      if (isLiked) {
        await unlikePost(post.id);
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
        dispatch(
          unlikePostAction({
            postId: post.id,
            userId: currentUser?.id as string,
          })
        );
      } else {
        const postLikedData = await likePost(post.id);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
        dispatch(likePostAction(postLikedData.data));
      }
    } catch (error) {
      console.log("error in like post", error);

      toast.error("Something went wrong");
    }
  };

  const showCommentIcon = useBreakpointValue({ xs: true, md: false });
  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
      >
        <Box display={"flex"} alignItems={"center"} gap={"10px"}>
          <CustomLikeButton onClick={handleLikeClick} isLiked={isLiked} />
          {showCommentIcon && (
            <FaRegComment size={"1.9rem"} cursor={"pointer"} onClick={onOpen} />
          )}
          <LuSend size={"1.9rem"} />
        </Box>
        <Box>
          <CiBookmark size={"2rem"} />
        </Box>
      </Box>
      <Box pl={"5px"} mt={"8px"}>
        <Text fontWeight={"bold"} fontSize={"1.2rem"}>
          {likeCount > 0 ? (
            `${likeCount} ${likeCount === 1 ? "like" : "likes"}`
          ) : (
            <span>be the first to like</span>
          )}
        </Text>
      </Box>
      <PostCommentsInMobile isOpen={isOpen} onClose={onClose} post={post} />
    </Box>
  );
};

export default LikeAndComments;
