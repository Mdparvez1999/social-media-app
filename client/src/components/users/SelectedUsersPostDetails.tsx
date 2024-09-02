import { Avatar, Box, Divider, Heading, Text } from "@chakra-ui/react";
import Comments from "../posts/Comments";
import AddComment from "../posts/AddComment";
import { useAppSelector } from "../../hooks/hooks";
import SelectedUsersPostLikeAndComment from "../mobileComponents/MobileProfile/SelectedUsersPostLikeAndComment";
import { formatCreatedAtTime } from "../../utils/formatTimes.utils";
import { useEffect, useState } from "react";
import PostDetailsSkeleton from "../../skeletons/PostDetailsSkeleton";

const SelectedUsersPostDetails = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const selectedUser = useAppSelector((state) => state.users.selectedUser);
  const selectedUsersPost = useAppSelector(
    (state) => state.users.selectedUsersSinglePost
  );

  useEffect(() => {
    if (selectedUsersPost) setLoading(false);
  }, [selectedUsersPost]);

  if (!selectedUsersPost) return null;

  return loading ? (
    <PostDetailsSkeleton />
  ) : (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={"12px"}
      >
        <Box display={"flex"} alignItems={"center"} gap={"16px"}>
          <Avatar src={selectedUser?.profilePic} size={"sm"} />
          <Text fontWeight="bold" fontSize={"1.5rem"}>
            {selectedUser?.userName}
          </Text>
        </Box>
      </Box>
      <Divider mb={"5px"} />
      <Box height={"280px"}>
        <Comments postId={selectedUsersPost?.id} />
      </Box>
      <Divider mb={"8px"} />
      <Box>
        <SelectedUsersPostLikeAndComment post={selectedUsersPost} />
      </Box>
      <Box pl={"5px"}>
        <Heading fontSize={"0.8rem"} fontWeight={"500"}>
          {selectedUsersPost?.createdAt
            ? formatCreatedAtTime(selectedUsersPost?.createdAt)
            : ""}
        </Heading>
      </Box>
      <Divider my={"6px"} />
      <Box>
        <AddComment postId={selectedUsersPost?.id} />
      </Box>
    </>
  );
};

export default SelectedUsersPostDetails;
