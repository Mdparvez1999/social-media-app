import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import useDeleteComment from "../../hooks/comments/useDeleteComment";
import { useAppDispatch } from "../../hooks/hooks";
import { removeFeedPostComment } from "../../redux-store/features/feed/feedSlice";

interface CommentToDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  commentId: string | undefined;
}

const DeleteFeedCommentModal = ({
  isOpen,
  onClose,
  commentId,
}: CommentToDeleteProps) => {
  const { deleteComment } = useDeleteComment();
  const dispatch = useAppDispatch();
  const handleDelete = async () => {
    if (commentId) {
      try {
        await deleteComment(commentId);
        dispatch(removeFeedPostComment(commentId));
        onClose();
      } catch (error) {
        console.log("error in delete comment", error);

        toast.error("Something went wrong");
      }
    }
  };
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent
        mt={{ xs: "120px", md: "170px" }}
        width={{ xs: "94%", md: "100%" }}
      >
        <ModalBody p={0}>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-end"}
            width={"100%"}
          >
            <Button onClick={handleDelete} borderBottom={"1px solid #cccccc"}>
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DeleteFeedCommentModal;
