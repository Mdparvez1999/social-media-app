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
}

const FeedPostCommentsModal = ({ isOpen, onClose }: PostCommentsPropsType) => {
  const comments = useAppSelector((state) => state.feed.comments);

  const post = useAppSelector((state) => state.feed.singlePost);

  if (!comments) return null;

  if (!post) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>
          <Text textAlign={"center"}>Comments</Text>
        </ModalHeader>
        <Divider mx={"auto"} w={"85%"} h={"1px"} />
        <ModalBody>
          <Box>
            {post?.caption !== "" ? (
              <Box display={"flex"} alignItems={"center"} gap={"14px"}>
                <Avatar
                  src={`http://localhost:8000/uploads/profilePic/${post.user.profilePic} `}
                  size={"sm"}
                  name={post?.user.userName}
                  crossOrigin="anonymous"
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
            maxHeight={"350px"}
            overflow={"auto"}
            my={"15px"}
            pl={"6px"}
            sx={{ "&::-webkit-scrollbar": { display: "none" } }}
          >
            {comments?.map((comment) => (
              <Box
                display={"flex"}
                alignItems={"center"}
                gap={"14px"}
                key={comment.id}
                mb={"12px"}
              >
                <Avatar
                  src={`http://localhost:8000/uploads/profilePic/${comment.user.profilePic} `}
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
            ))}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FeedPostCommentsModal;
