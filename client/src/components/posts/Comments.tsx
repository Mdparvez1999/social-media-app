import { Avatar, Box, Heading, useDisclosure } from "@chakra-ui/react";
import { useComment } from "../../hooks/comments/useComment";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../hooks/hooks";
import { formatCreatedAtTime } from "../../utils/formatTimes.utils";
import { PiDotsThreeBold } from "react-icons/pi";
import DeleteCommentModal from "./DeleteCommentModal";

interface propsType {
  postId: string | undefined;
}
const Comments = ({ postId }: propsType) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { fetchComments } = useComment();

  const comments = useAppSelector((state) => state.comments.comments);
  const post = useAppSelector((state) => state.posts.singlePost);
  const currentUser = useAppSelector((state) => state.profile.profile);

  const [commentToDelete, setCommentToDelete] = useState<string>("");

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

  const handleCommentToDelete = (commentId: string) => {
    if (commentId) {
      setCommentToDelete(commentId);
      onOpen();
    }
  };

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
            src={post.user.profilePic}
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
                src={comment?.user?.profilePic}
                name={comment?.user?.userName}
              />
              <Box>
                <Heading fontSize={"1.1rem"} mb={"5px"}>
                  {comment?.user?.userName}
                </Heading>
                <Box display={"flex"} gap={"8px"}>
                  <Heading fontSize={"0.9rem"} fontWeight={"500"}>
                    {comment.comment}
                  </Heading>
                  <Box mt={"4px"} cursor={"pointer"}>
                    {(comment.user.id === currentUser?.id ||
                      post?.user.id === currentUser?.id) && (
                      <PiDotsThreeBold
                        onClick={() => handleCommentToDelete(comment.id)}
                      />
                    )}
                  </Box>
                </Box>
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

      <DeleteCommentModal
        isOpen={isOpen}
        onClose={onClose}
        commentId={commentToDelete}
      />
    </Box>
  );
};

export default Comments;
