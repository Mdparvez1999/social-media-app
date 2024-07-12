import { Avatar, Box, Heading } from "@chakra-ui/react";
import { useComment } from "../../hooks/comments/useComment";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../hooks/hooks";
import { formatCreatedAtTime } from "../../utils/formatTimes.utils";

interface propsType {
  postId: string | undefined;
}
const Comments = ({ postId }: propsType) => {
  const { fetchComments } = useComment();

  const comments = useAppSelector((state) => state.comments.comments);

  const post = useAppSelector((state) => state.posts.singlePost);

  useEffect(() => {
    const getComments = async () => {
      if (postId) {
        try {
          await fetchComments(postId);
        } catch (error) {
          toast.error("Something went wrong");
        }
      }
    };

    getComments();
  }, [postId, fetchComments]);

  return (
    <Box
      height={"100%"}
      maxHeight={"270px"}
      overflowY={"auto"}
      css={{ "&::-webkit-scrollbar": { display: "none" } }}
    >
      <Box display={"flex"} alignItems={"center"} gap={"14px"} mb={"14px"}>
        <Avatar src={post?.user?.profilePic} size={"sm"} />
        <Box>
          <Heading fontSize={"1.1rem"} mb={"5px"}>
            {post?.user?.userName}
          </Heading>
          <Heading fontSize={"0.9rem"} fontWeight={"500"}>
            {post?.caption}
          </Heading>
        </Box>
      </Box>
      {comments?.map((comment) => (
        <Box
          key={comment.id}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={"20px"}
        >
          <Box display={"flex"} alignItems={"center"} gap={"14px"}>
            <Avatar src={comment?.user?.profilePic} size={"sm"} />
            <Box>
              <Heading fontSize={"1.1rem"} mb={"5px"}>
                {comment?.user?.userName}
              </Heading>
              <Heading fontSize={"0.9rem"} fontWeight={"500"}>
                {comment.comment}
              </Heading>
            </Box>
          </Box>
          <Box>
            <Heading fontSize={"0.8rem"} color={"gray.500"}>
              {formatCreatedAtTime(comment.commentedAt)}
            </Heading>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Comments;
