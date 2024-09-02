import { Box, Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useCallback, useEffect, useState } from "react";
import useLikePostHook from "../../hooks/post/useLikePost";
import useUnlikePost from "../../hooks/post/useUnlikePost";
import { toast } from "react-toastify";
import CustomLikeButton from "../posts/CustomLikeButton";
import {
  likeSelectedFeedAction,
  setFeedSinglePost,
  unlikeSelectedFeedAction,
} from "../../redux-store/features/feed/feedSlice";
import useFetchSingleFeedPost from "../../hooks/feed/useFetchSingleFeedPost";
import FeedPostComments from "./FeedPostComments";

interface LikeFeedPostProps {
  postId: string;
}

const LikeAndCommentsFeedPost = ({ postId }: LikeFeedPostProps) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.profile.profile);

  const post = useAppSelector((state) =>
    state.feed.posts.find((post) => post.id === postId)
  );

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likeCount || 0);

  useEffect(() => {
    if (post && currentUser) {
      const liked = post.postlikes?.some(
        (like) => like.user.id === currentUser.id
      );
      setIsLiked(liked);

      setLikeCount(post?.likeCount || 0);
    }
  }, [post, currentUser]);

  const { likePost } = useLikePostHook();
  const { unlikePost } = useUnlikePost();

  const { fetchFeedPost } = useFetchSingleFeedPost();

  const handleClickLike = useCallback(async () => {
    try {
      if (isLiked) {
        await unlikePost(post?.id);
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
        dispatch(
          unlikeSelectedFeedAction({
            postId: postId,
            userId: currentUser?.id as string,
          })
        );
      } else {
        const postLikedData = await likePost(postId);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
        dispatch(likeSelectedFeedAction(postLikedData?.data));
      }
      const singleFeedPost = await fetchFeedPost(post?.id as string);
      dispatch(setFeedSinglePost(singleFeedPost?.data));
    } catch (error) {
      toast.error("Something went wrong");
    }
  }, [
    isLiked,
    post?.id,
    postId,
    currentUser?.id,
    likePost,
    unlikePost,
    dispatch,
    fetchFeedPost,
  ]);

  return (
    <Box>
      <Box display={"flex"} flexDirection={"column"}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box display={"flex"} alignItems={"center"} gap={"8px"}>
            <CustomLikeButton isLiked={isLiked} onClick={handleClickLike} />
            <FeedPostComments postId={postId} />
          </Box>
        </Box>
      </Box>
      <Box pl={"5px"} my={"5px"}>
        <Text fontWeight={"bold"} fontSize={"1.2rem"}>
          {likeCount > 0 ? (
            `${likeCount} ${likeCount === 1 ? "like" : "likes"}`
          ) : (
            <span>be the first to like</span>
          )}
        </Text>
      </Box>
    </Box>
  );
};

export default LikeAndCommentsFeedPost;
