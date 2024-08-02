import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import useDeletePost from "../../hooks/post/useDeletePost";
import { useAppSelector } from "../../hooks/hooks";
import { toast } from "react-toastify";
import EditPost from "./EditPost";

const PostOptions = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const post = useAppSelector((state) => state.posts.singlePost);

  const { deletePost } = useDeletePost();

  const handleDeleteClick = async () => {
    try {
      await deletePost(post?.id);
      setTimeout(() => {
        window.location.replace("/app/profile");
      }, 2500);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleEditClick = async () => {
    try {
      onOpen();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<BsThreeDotsVertical />}
        />
        <MenuList>
          <MenuItem
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            onClick={handleEditClick}
          >
            Edit
            <CiEdit />
          </MenuItem>
          <MenuItem
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            onClick={handleDeleteClick}
          >
            Delete
            <MdDeleteOutline />
          </MenuItem>
        </MenuList>
      </Menu>
      <EditPost isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default PostOptions;
