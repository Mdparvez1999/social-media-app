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
import { toast } from "react-toastify";
import {
  likeSelectedPostAction,
  unlikeSelectedPostAction,
} from "../../../redux-store/features/users/userSlice";

interface File {
  id: string;
  fileName: string;
  type: string;
}

interface PostLikes {
  postLikeId: string;
  likedAt: Date;
  postId: string;
  user: {
    id: string;
    profilePic: string;
    userName: string;
  };
}
interface Post {
  id: string;
  caption: string;
  commentCount: number;
  likeCount: number;
  files: File[];
  postlikes: PostLikes[];
  user: {
    id: string;
    profilePic: string;
    userName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SelectedUsersPostLikeAndComment = ({ post }: { post: Post }) => {
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const currentUser = useAppSelector((state) => state.profile.profile);

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(post.likeCount || 0);

  const { likePost } = useLikePostHook();
  const { unlikePost } = useUnlikePost();

  useEffect(() => {
    if (post && currentUser) {
      const liked = post.postlikes?.some(
        (like) => like.user.id === currentUser.id
      );
      setIsLiked(liked);

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
          unlikeSelectedPostAction({
            postId: post.id,
            userId: currentUser?.id as string,
          })
        );
      } else {
        const postLikedData = await likePost(post.id);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
        dispatch(likeSelectedPostAction(postLikedData.data));
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
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

export default SelectedUsersPostLikeAndComment;
