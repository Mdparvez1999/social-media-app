import {
  Avatar,
  Box,
  Divider,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useAppSelector } from "../../hooks/hooks";
import { formatCreatedAtTime } from "../../utils/formatTimes.utils";

interface PostCommentsPropsType {
  isOpen: boolean;
  onClose: () => void;
  postId: string | undefined;
}

const FeedPostCommentsModal = ({
  isOpen,
  onClose,
  postId,
}: PostCommentsPropsType) => {
  const comments = useAppSelector((state) => state.feed.comments);

  const post = useAppSelector((state) =>
    state.feed.posts.find((post) => post.id === postId)
  );

  if (!post) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth={{ xs: "95vw", md: "32%" }}>
        <ModalCloseButton />
        <ModalHeader>
          <Text textAlign={"center"}>Comments</Text>
        </ModalHeader>
        <Divider mx={"auto"} w={"85%"} h={"1px"} />
        <ModalBody>
          <Box>
            {post.caption !== "" ? (
              <Box display={"flex"} alignItems={"center"} gap={"14px"}>
                <Avatar
                  size={"sm"}
                  crossOrigin="anonymous"
                  src={
                    post?.user?.profilePic ? post?.user?.profilePic : undefined
                  }
                  name={post?.user?.userName}
                />
                <Box display={"flex"} flexDirection={"column"} gap={"6px"}>
                  <Box display={"flex"} gap={"10px"} alignItems={"center"}>
                    <Heading fontSize={"1.3rem"}>
                      {post?.user?.userName}
                    </Heading>
                    <Text pt={"2px"}>{post?.caption}</Text>
                  </Box>
                  <Box>
                    <Text fontSize={"0.9rem"} color={"gray.700"}>
                      {formatCreatedAtTime(post?.createdAt)}
                    </Text>
                  </Box>
                </Box>
              </Box>
            ) : null}
          </Box>
          <Box
            maxHeight={"350px"}
            overflow={"auto"}
            my={"15px"}
            sx={{ "&::-webkit-scrollbar": { display: "none" } }}
          >
            {comments.length < 1 && !post.caption ? (
              <Text textAlign={"center"}>no comments yet</Text>
            ) : (
              comments.map((comment) => (
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  gap={"14px"}
                  key={comment.id}
                  mb={"12px"}
                >
                  <Avatar
                    size={"sm"}
                    crossOrigin="anonymous"
                    src={
                      comment.user.profilePic
                        ? comment.user.profilePic
                        : undefined
                    }
                    name={comment.user.userName}
                  />
                  <Box display={"flex"} flexDirection={"column"} gap={"6px"}>
                    <Box display={"flex"} gap={"10px"} alignItems={"center"}>
                      <Heading fontSize={"1.3rem"}>
                        {comment.user.userName}
                      </Heading>
                      <Text pt={"3px"}>{comment.comment}</Text>
                    </Box>
                    <Box>
                      <Text fontSize={"0.9rem"} color={"gray.700"}>
                        {formatCreatedAtTime(comment.commentedAt)}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FeedPostCommentsModal;
