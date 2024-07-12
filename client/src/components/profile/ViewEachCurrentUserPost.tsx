import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";
import { useEffect } from "react";
import PostDeatils from "./PostDeatils";
import PostImage from "./PostImage";
import { useFetchPost } from "../../hooks/post/useFetchPost";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/hooks";
import { setSinglePost } from "../../redux-store/features/post/postsSlice";

interface propsType {
  isOpen: boolean;
  onClose: () => void;
  id: string | null;
}

const ViewEachCurrentUserPost = ({ isOpen, onClose, id }: propsType) => {
  const { fetchPostById } = useFetchPost();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchPost = async () => {
      if (id && isOpen) {
        try {
          const data = await fetchPostById(id);
          dispatch(setSinglePost(data));
        } catch (error) {
          toast.error("Something went wrong");
        }
      }
    };

    if (isOpen && id) {
      fetchPost();
    }
  }, [id, isOpen, fetchPostById, dispatch]);

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
              <PostImage />
            </Box>
            <Box flex={0.8} width={"40%"} padding={"10px"} height={"100%"}>
              <PostDeatils />
            </Box>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewEachCurrentUserPost;
