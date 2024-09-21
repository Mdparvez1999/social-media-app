import { Box, Grid, Text, useDisclosure } from "@chakra-ui/react";
import { useAppSelector } from "../../hooks/hooks";
import ViewSelectedUsersPost from "./ViewSelectedUsersPost";
import { useState } from "react";
import CustomCarousel from "../layouts/general/CustomCarousel";

const SelectedUsersPosts = () => {
  const selectedUserPosts = useAppSelector(
    (state) => state.users.selectedUsersPosts
  );

  const [postId, setPostId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleViewEachPost = (id: string) => {
    setPostId(id);
    onOpen();
  };

  const sortedPosts = [...selectedUserPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={4} margin="10px" padding="10px">
      {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => (
          <Box
            height={"100%"}
            key={post.id}
            onClick={() => handleViewEachPost(post.id)}
            cursor="pointer"
          >
            <CustomCarousel
              images={post?.files?.map((file) => `${file}`)}
              width="500px"
              height="220px"
            />
          </Box>
        ))
      ) : (
        <Text fontSize="2xl" m={"60px 0 0 300px"} w={"100%"}>
          No posts
        </Text>
      )}
      <ViewSelectedUsersPost isOpen={isOpen} onClose={onClose} id={postId} />
    </Grid>
  );
};

export default SelectedUsersPosts;
