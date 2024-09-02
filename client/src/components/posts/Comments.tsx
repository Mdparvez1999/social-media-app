import { Avatar, Box, Heading } from "@chakra-ui/react";
import { useComment } from "../../hooks/comments/useComment";
import { useEffect, useMemo } from "react";
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

  const noCommentsAndCaption = useMemo(
    () => comments?.length === 0 && !post?.caption,
    [comments, post]
  );

  if (!comments) return null;

  return (
    <Box
      key={post?.id}
      height={"100%"}
      maxHeight={"270px"}
      overflowY={"auto"}
      css={{ "&::-webkit-scrollbar": { display: "none" } }}
    >
      {post?.caption && (
        <Box display={"flex"} alignItems={"center"} gap={"14px"} mb={"12px"}>
          <Avatar
            size={"sm"}
            crossOrigin="anonymous"
            src={
              post.user.profilePic
                ? `http://localhost:8000/uploads/profilePic/${post.user.profilePic}`
                : undefined
            }
            name={post?.user.userName}
          />
          <Box>
            <Heading fontSize={"1.1rem"} mb={"5px"}>
              {post?.user?.userName}
            </Heading>
            <Heading fontSize={"0.9rem"} fontWeight={"500"}>
              {post?.caption}
            </Heading>
          </Box>
        </Box>
      )}
      {comments.length > 0 ? (
        comments?.map((comment) => (
          <Box
            key={comment.id}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mb={"15px"}
          >
            <Box display={"flex"} alignItems={"center"} gap={"14px"}>
              <Avatar
                size={"sm"}
                crossOrigin="anonymous"
                src={
                  comment?.user?.profilePic
                    ? `http://localhost:8000/uploads/profilePic/${comment.user.profilePic}`
                    : undefined
                }
                name={comment?.user?.userName}
              />
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
        ))
      ) : noCommentsAndCaption ? (
        <Heading fontSize={"1.1rem"} textAlign={"center"} mt={"20px"}>
          No comments yet
        </Heading>
      ) : null}
    </Box>
  );
};

export default Comments;
