import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import PostDetails from "./PostDetails";
import PostImage from "./PostImage";
import { useFetchPost } from "../../hooks/post/useFetchPost";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../hooks/hooks";
import {
  setPostLikes,
  setSinglePost,
} from "../../redux-store/features/post/postsSlice";
import useFetchPostLikes from "../../hooks/post/useFetchPostLikes";

interface propsType {
  isOpen: boolean;
  onClose: () => void;
  id: string | null;
}

const ViewEachCurrentUserPost = ({ isOpen, onClose, id }: propsType) => {
  const dispatch = useAppDispatch();

  const { fetchPostById } = useFetchPost();
  const { fetchPostLikes } = useFetchPostLikes();

  const fetchPost = useCallback(async () => {
    if (id && isOpen) {
      try {
        const [data, postLikesData] = await Promise.all([
          fetchPostById(id),
          fetchPostLikes(id),
        ]);

        dispatch(setSinglePost(data));
        dispatch(setPostLikes(postLikesData.data));
      } catch (error) {
        toast.error("Failed to fetch post data. Please try again.");
      }
    }
  }, [id, isOpen, fetchPostById, dispatch, fetchPostLikes]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          sx={{
            display: "flex",
            flexDirection: "row",
            height: "80vh",
            maxHeight: "80vh",
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
              <PostDetails />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewEachCurrentUserPost;
