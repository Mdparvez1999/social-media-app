import { Avatar, Box, Divider, Text } from "@chakra-ui/react";
import Comments from "./Comments";
import LikePost from "./LikePost";
import AddComment from "./AddComment";
import { useAppSelector } from "../../hooks/hooks";
import PostOptions from "./PostOptions";

const CurrentPostDeatils = () => {
  const currentUser = useAppSelector((state) => state.profile.profile);

  const post = useAppSelector((state) => state.posts.singlePost);

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={"16px"}
      >
        <Box display={"flex"} alignItems={"center"} gap={"16px"}>
          <Avatar src={currentUser?.profilePic} size={"sm"} />
          <Text fontWeight="bold" fontSize={"1.5rem"}>
            {currentUser?.userName}
          </Text>
        </Box>
        <PostOptions />
      </Box>
      <Divider mb={"5px"} />
      <Box height={"270px"}>
        <Comments postId={post?.id} />
      </Box>
      <Divider mb={"8px"} />
      <Box>
        <LikePost />
      </Box>
      <Divider mb={"6px"} />
      <Box>
        <AddComment postId={post?.id} />
      </Box>
    </>
  );
};

export default CurrentPostDeatils;
