import { Box, Grid, Skeleton } from "@chakra-ui/react";

const PostsMobileSkeleton = () => {
  return (
    <Grid templateColumns={"repeat(3, 1fr)"} gap={1} margin={"5px"}>
      {/* Create skeletons for multiple posts */}
      {[...Array(5)].map((_, index) => (
        <Box height={"100%"} key={index} cursor={"pointer"}>
          <Skeleton
            width={"120px"}
            height={"70px"}
            startColor="gray.200"
            endColor="gray.400"
            borderRadius={"md"}
          />
        </Box>
      ))}
    </Grid>
  );
};

export default PostsMobileSkeleton;
