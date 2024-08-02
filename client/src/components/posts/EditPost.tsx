import {
  Box,
  Button,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import useEditPost from "../../hooks/post/useEditPost";
import { editPostCaption } from "../../redux-store/features/post/postsSlice";
import { toast } from "react-toastify";

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditPost = ({ isOpen, onClose }: CreatePostProps) => {
  const dispatch = useAppDispatch();
  const post = useAppSelector((state) => state.posts.singlePost);

  const [caption, setCaption] = useState<string>("");

  const { editPost } = useEditPost();

  const handlePost = async () => {
    try {
      await editPost(post?.id, caption);
      dispatch(editPostCaption({ id: post?.id, caption }));
      setCaption("");
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

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
            <Box
              width={{ xs: "100%", md: "65%" }}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              mb={{ xs: "10px", md: "30px" }}
            >
              <Carousel
                key={post?.id}
                width={"100%"}
                showThumbs={false}
                showStatus={false}
                autoPlay
                infiniteLoop
                useKeyboardArrows
              >
                {post?.files.map((file) => (
                  <Image
                    height={{ xs: "auto", md: "100%" }}
                    w={"100%"}
                    key={file.fileName || Math.random()}
                    crossOrigin="anonymous"
                    src={
                      file.fileName
                        ? `http://localhost:8000/uploads/postFiles/${file.fileName}`
                        : `http://localhost:8000/uploads/postFiles/${file}`
                    }
                    alt="user_post"
                  />
                ))}
              </Carousel>
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
