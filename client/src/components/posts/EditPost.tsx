import {
  Box,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import useEditPost from "../../hooks/post/useEditPost";
import { editPostCaption } from "../../redux-store/features/post/postsSlice";
import { toast } from "react-toastify";
import CustomCarousel from "../layouts/general/CustomCarousel";

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditPost = ({ isOpen, onClose }: CreatePostProps) => {
  const dispatch = useAppDispatch();

  const post = useAppSelector((state) => state.posts.singlePost);

  const [caption, setCaption] = useState<string>(post?.caption || "");

  const { editPost } = useEditPost();

  useEffect(() => {
    setCaption(post?.caption || "");
  }, [post?.caption]);

  const handlePost = useCallback(async () => {
    if (!post?.id) return;

    try {
      await editPost(post?.id, caption);
      dispatch(editPostCaption({ id: post?.id, caption }));
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }, [post, caption, dispatch, editPost, onClose]);

  if (!post) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth={{ xs: "95vw", md: "90%" }}>
          <ModalHeader textAlign={"center"}>Update post</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody
            display={"flex"}
            flexDirection={{ xs: "column", md: "row" }}
            gap={"20px"}
          >
            <Box width={{ xs: "100%", md: "65%" }} height={"100%"} mb={"10px"}>
              {post?.files && (
                <CustomCarousel
                  images={post?.files.map(
                    (file) =>
                      `http://localhost:8000/uploads/postFiles/${file.fileName}`
                  )}
                  width={"100%"}
                  height={"100%"}
                  objectFit={"contain"}
                />
              )}
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={"20px"}
              width={{ xs: "100%", md: "35%" }}
            >
              <Textarea
                placeholder="What's on your mind?"
                rows={6}
                name="caption"
                onChange={(e) => setCaption(e.target.value)}
              />
              <Button
                width={"40%"}
                ml={"auto"}
                mb={{ xs: "15px", md: "" }}
                onClick={handlePost}
              >
                update
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditPost;
