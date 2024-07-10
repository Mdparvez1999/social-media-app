import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import useDeletePost from "../../hooks/post/useDeletePost";
import { useAppSelector } from "../../hooks/hooks";
import { toast } from "react-toastify";

const PostOptions = () => {
  const post = useAppSelector((state) => state.posts.singlePost);

  const { deletePost } = useDeletePost();

  const handleDeleteClick = async () => {
    try {
      await deletePost(post?.id);
      setTimeout(() => {
        window.location.assign("/app/profile");
      }, 2000);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
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
  );
};

export default PostOptions;
