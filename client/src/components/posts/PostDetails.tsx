import { Avatar, Box, Divider, Heading, Text } from "@chakra-ui/react";
import Comments from "./Comments";
import AddComment from "./AddComment";
import { useAppSelector } from "../../hooks/hooks";
import PostOptions from "./PostOptions";
import { formatCreatedAtTime } from "../../utils/formatTimes.utils";
import LikeAndComments from "../mobileComponents/MobileProfile/LikeAndComments";
import { useEffect, useState } from "react";
import PostDetailsSkeleton from "../../skeletons/PostDetailsSkeleton";

const CurrentPostDetails = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const currentUser = useAppSelector((state) => state.profile.profile);
  const post = useAppSelector((state) => state.posts.singlePost);

  useEffect(() => {
    if (post) {
      setLoading(false);
    }
  }, [post]);

  if (!post) return null;

  if (loading) return <PostDetailsSkeleton />;

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={"12px"}
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
      <Box height={"280px"}>
        <Comments postId={post.id} />
      </Box>
      <Divider mb={"8px"} />
      <Box>
        <LikeAndComments post={post} />
      </Box>
      <Box pl={"5px"}>
        <Heading fontSize={"0.8rem"} fontWeight={"500"}>
          {post.createdAt ? formatCreatedAtTime(post.createdAt) : ""}
        </Heading>
      </Box>
      <Divider my={"6px"} />
      <Box>
        <AddComment postId={post?.id} />
      </Box>
    </>
  );
};

export default CurrentPostDetails;
