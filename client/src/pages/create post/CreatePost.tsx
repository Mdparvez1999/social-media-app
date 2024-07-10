import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  Divider,
  Button,
  Textarea,
  Grid,
  Box,
  Image,
} from "@chakra-ui/react";
import { FiMinusCircle } from "react-icons/fi";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "react-toastify";
import useCreatePost from "../../hooks/post/useCreatePost";

interface createPostProps {
  isOpen: boolean;
  onClose: () => void;
}
const CreatePost = ({ isOpen, onClose }: createPostProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);

  const [previewFiles, setPreviewFiles] = useState<string[]>([]);

  const [caption, setCaption] = useState<string>("");

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...filesArray]);

      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const target = event.target;
          if (target && target.result) {
            setPreviewFiles((prev) => [...prev, target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const { loading, createPost } = useCreatePost();

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("caption", caption);

      await createPost(formData);
      setPreviewFiles([]);
      onClose();
      setTimeout(() => {
        window.location.assign("/app/profile");
      }, 2000);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviewFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Create new post</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody>
            <Button onClick={handleFileButtonClick}>
              select from gallery
              <Input
                type="file"
                display={"none"}
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                name="files"
              />
            </Button>
            <Divider my={"8px"} />
            <Grid templateColumns={"repeat(3, 1fr)"} gap={2} mt={"8px"}>
              {previewFiles.map((file, index) => {
                return (
                  <Box key={index} position={"relative"}>
                    <Image src={file} alt={`file-${index}`} width={"100%"} />
                    <Button
                      position={"absolute"}
                      top={0.5}
                      right={0.5}
                      size={"xs"}
                      onClick={() => removeFile(index)}
                    >
                      <FiMinusCircle />
                    </Button>
                  </Box>
                );
              })}
            </Grid>
            <Textarea
              placeholder="What's on your mind?"
              mt={"10px"}
              name="caption"
              onChange={(e) => setCaption(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button width={"50%"} onClick={handlePost} isLoading={loading}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
