import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { toast } from "react-toastify";
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { setSelectedUsersSinglePost } from "../../redux-store/features/users/userSlice";
import SelectedUsersPostImage from "./SelectedUsersPostImage";
import useFetchSelectedusersPost from "../../hooks/usersprofile/useFetchSelectedusersPost";
import SelectedUsersPostDetails from "./SelectedUsersPostDetails";

interface PropsType {
  isOpen: boolean;
  onClose: () => void;
  id: string | null;
}

const ViewSelectedUsersPost = ({ isOpen, onClose, id }: PropsType) => {
  const selecteduser = useAppSelector((state) => state.users.selectedUser);
  const userId: string | undefined = selecteduser?.id;

  const dispatch = useAppDispatch();
  const { fetchSelectedUsersPost } = useFetchSelectedusersPost();

  useEffect(() => {
    if (!isOpen || !userId || !id) return;

    const fetchPost = async () => {
      try {
        const data = await fetchSelectedUsersPost({ postId: id, userId });
        dispatch(setSelectedUsersSinglePost(data));
      } catch (error) {
        toast.error("Failed to load the post. Please try again.");
      }
    };

    if (isOpen && id) {
      fetchPost();
    }
  }, [dispatch, fetchSelectedUsersPost, id, isOpen, userId]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          sx={{
            display: "flex",
            flexDirection: "row",
            maxHeight: "80vh",
            height: "80vh",
            width: "90vw",
            maxWidth: "1100px",
          }}
        >
          <ModalCloseButton />
          <ModalBody display={"flex"} padding={"0"} flex={1} height={"100%"}>
            <Box flex={1.5} width={"60%"} height={"100%"}>
              <SelectedUsersPostImage />
            </Box>
            <Box flex={0.8} width={"40%"} padding={"10px"} height={"100%"}>
              <SelectedUsersPostDetails />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewSelectedUsersPost;
