import { Box, Heading } from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";
import { LuSend } from "react-icons/lu";
import { CiBookmark } from "react-icons/ci";
import { useAppSelector } from "../../hooks/hooks";
import { formatDistanceToNow } from "date-fns";

const LikePost = () => {
  const post = useAppSelector((state) => state.posts.singlePost);

  const formatDate = (date: Date) => {
    const postedDate = new Date(date);
    return formatDistanceToNow(postedDate, { addSuffix: true });
  };

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box display={"flex"} alignItems={"center"} gap={"10px"}>
          <CiHeart size={"2.4rem"} cursor={"pointer"} />
          <LuSend size={"1.8rem"} />
        </Box>
        <Box>
          <CiBookmark size={"1.9rem"} />
        </Box>
      </Box>
      <Box p={"10px"}>
        {post?.likeCount === 0 ? (
          <Heading fontSize={"1.1rem"}>Be the first to like</Heading>
        ) : (
          <Heading fontSize={"1.1rem"}>{post?.likeCount}</Heading>
        )}
        <Heading fontSize={"0.8rem"} fontWeight={"500"}>
          {post?.createdAt ? formatDate(post?.createdAt) : ""}
        </Heading>
      </Box>
    </Box>
  );
};

export default LikePost;
