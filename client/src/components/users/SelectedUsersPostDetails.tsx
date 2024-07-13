import { Avatar, Box, Divider, Text } from "@chakra-ui/react";
import Comments from "../profile/Comments";
import LikePost from "../profile/LikePost";
import AddComment from "../profile/AddComment";
import { useAppSelector } from "../../hooks/hooks";

const SelectedUsersPostDetails = () => {
  const selectedUser = useAppSelector((state) => state.users.selectedUser);

  const selectedUsersPost = useAppSelector(
    (state) => state.users.selectedUsersSinglePost
  );
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={"16px"}
      >
        <Box display={"flex"} alignItems={"center"} gap={"16px"}>
          <Avatar src={selectedUser?.profilePic} size={"sm"} />
          <Text fontWeight="bold" fontSize={"1.5rem"}>
            {selectedUser?.userName}
          </Text>
        </Box>
      </Box>
      <Divider mb={"5px"} />
      <Box height={"270px"}>
        <Comments postId={selectedUsersPost?.id} />
      </Box>
      <Divider mb={"8px"} />
      <Box>
        <LikePost />
      </Box>
      <Divider mb={"6px"} />
      <Box>
        <AddComment postId={selectedUsersPost?.id} />
      </Box>
    </>
  );
};

export default SelectedUsersPostDetails;
