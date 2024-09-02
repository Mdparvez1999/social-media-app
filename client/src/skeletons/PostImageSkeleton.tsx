import { Box, Skeleton } from "@chakra-ui/react";

const PostImageSkeleton = () => {
  return (
    <Box w={"100%"} h={"100%"}>
      <Skeleton height={"100%"} width={"100%"} />
    </Box>
  );
};

export default PostImageSkeleton;
