import { useEffect } from "react";
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
} from "@chakra-ui/react";
import { useAppSelector } from "../../../hooks/hooks";
import { useComment } from "../../../hooks/comments/useComment";
import { toast } from "react-toastify";
import { formatCreatedAtTime } from "../../../utils/formatTimes.utils";
import WriteCommentInMobile from "./WriteCommentInMobile";

interface File {
  id: string;
  fileName: string;
  type: string;
}

interface PostLikes {
  id: string;
  isLiked: boolean;
  liked_at: Date;
  post: string;
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
interface PostCommentsInMobileProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

const PostCommentsInMobile = ({
  post,
  isOpen,
  onClose,
}: PostCommentsInMobileProps) => {
  const { fetchComments } = useComment();
  const comments = useAppSelector((state) => state.comments.comments);

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

  const noPostAndComments = post.caption === "" && comments.length === 0;

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
                  src={
                    post.user.profilePic
                      ? `http://localhost:8000/uploads/profilePic/${post.user.profilePic}`
                      : undefined
                  }
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
                    src={`http://localhost:8000/uploads/profilePic/${comment.user.profilePic}`}
                    size={"sm"}
                    name={comment.user.userName}
                    crossOrigin="anonymous"
                  />
                  <Box display={"flex"} flexDirection={"column"} gap={"6px"}>
                    <Box display={"flex"} gap={"10px"} alignItems={"center"}>
                      <Heading fontSize={"1.3rem"}>
                        {comment.user.userName}
                      </Heading>
                      <Text>{comment.comment}</Text>
                    </Box>
                    <Box>
                      <Text fontSize={"0.9rem"} color={"gray.700"}>
                        {formatCreatedAtTime(comment.commentedAt)}
                      </Text>
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
    </Drawer>
  );
};

export default PostCommentsInMobile;
