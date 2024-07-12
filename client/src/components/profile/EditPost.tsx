import {
  Button,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
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
        <ModalContent>
          <ModalHeader textAlign={"center"}>Update post</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody>
            <Carousel
              width={"100%"}
              showThumbs={false}
              showStatus={false}
              autoPlay
              infiniteLoop
              useKeyboardArrows
            >
              {post?.files.map((file) => (
                <Image
                  w={"100%"}
                  key={file.fileName}
                  src={`http://localhost:8000/uploads/postFiles/${file.fileName}`}
                  crossOrigin="anonymous"
                />
              ))}
            </Carousel>
            <Textarea
              placeholder="What's on your mind?"
              mt={"30px"}
              name="caption"
              onChange={(e) => setCaption(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button width={"45%"} onClick={handlePost}>
              update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditPost;
