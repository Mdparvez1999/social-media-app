import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useAppSelector } from "../../../hooks/hooks";
import { useComment } from "../../../hooks/comments/useComment";
import { toast } from "react-toastify";
import { formatCreatedAtTime } from "../../../utils/formatTimes.utils";
import WriteCommentInMobile from "./WriteCommentInMobile";
import { PostState } from "../../../redux-store/features/post/postsSlice";
import { PiDotsThreeBold } from "react-icons/pi";
import DeleteCommentModal from "../../posts/DeleteCommentModal";

interface PostCommentsInMobileProps {
  post: PostState;
  isOpen: boolean;
  onClose: () => void;
}

const PostCommentsInMobile = ({
  post,
  isOpen,
  onClose,
}: PostCommentsInMobileProps) => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const comments = useAppSelector((state) => state.comments.comments);

  const { fetchComments } = useComment();
  const deleteCommentProps = useDisclosure();

  const [commentToDelete, setCommentToDelete] = useState<string>("");

  useEffect(() => {
    const getComments = async () => {
      if (post) {
        try {
          await fetchComments(post.id);
        } catch (error) {
          toast.error("Something went wrong");
        }
      }
    };

    getComments();
  }, [post, fetchComments]);

  if (!post || !comments) return null;

  const handleCommentToDelete = (commentId: string) => {
    if (commentId) {
      setCommentToDelete(commentId);
      deleteCommentProps.onOpen();
    }
  };

  const noPostAndComments = post?.caption === "" && comments.length === 0;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="bottom" size="full">
      <DrawerOverlay />
      <DrawerContent h={"70%"}>
        <DrawerCloseButton />
        <DrawerHeader>
          <Text textAlign={"center"}>Comments</Text>
        </DrawerHeader>
        <Divider mx={"auto"} w={"85%"} h={"1px"} />
        <DrawerBody
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box>
            {post?.caption !== "" ? (
              <Box display={"flex"} alignItems={"center"} gap={"14px"}>
                <Avatar
                  size={"sm"}
                  name={post?.user.userName}
                  crossOrigin="anonymous"
                  src={post.user.profilePic}
                />
                <Box display={"flex"} flexDirection={"column"} gap={"6px"}>
                  <Box display={"flex"} gap={"10px"} alignItems={"center"}>
                    <Heading fontSize={"1.3rem"}>{post?.user.userName}</Heading>
                    <Text>{post?.caption}</Text>
                  </Box>
                  <Box>
                    <Text fontSize={"0.9rem"} color={"gray.700"}>
                      {formatCreatedAtTime(post.createdAt)}
                    </Text>
                  </Box>
                </Box>
              </Box>
            ) : null}
          </Box>
          <Box
            flex="1"
            overflowY={"auto"}
            my={"15px"}
            pl={"6px"}
            sx={{ "&::-webkit-scrollbar": { display: "none" } }}
          >
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  gap={"14px"}
                  key={comment.id}
                  mb={"12px"}
                >
                  <Avatar
                    src={comment?.user?.profilePic}
                    size={"sm"}
                    name={comment?.user?.userName}
                    crossOrigin="anonymous"
                  />
                  <Box display={"flex"} flexDirection={"column"} gap={"6px"}>
                    <Box display={"flex"} gap={"10px"} alignItems={"center"}>
                      <Heading fontSize={"1.3rem"}>
                        {comment?.user?.userName}
                      </Heading>
                      <Text>{comment?.comment}</Text>
                    </Box>
                    <Box display={"flex"} gap={"10px"}>
                      <Text fontSize={"0.9rem"} color={"gray.700"}>
                        {formatCreatedAtTime(comment?.commentedAt)}
                      </Text>
                      <Box mt={"8px"} cursor={"pointer"}>
                        {comment?.user?.id === currentUser?.id && (
                          <PiDotsThreeBold
                            onClick={() => handleCommentToDelete(comment.id)}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))
            ) : noPostAndComments ? (
              <Text textAlign={"center"}>No comments yet</Text>
            ) : null}
          </Box>
          <Box width={"100%"} m={0} p={0}>
            <WriteCommentInMobile postId={post.id} />
          </Box>
        </DrawerBody>
      </DrawerContent>
      <DeleteCommentModal
        isOpen={deleteCommentProps.isOpen}
        onClose={deleteCommentProps.onClose}
        commentId={commentToDelete}
      />
    </Drawer>
  );
};

export default PostCommentsInMobile;
