import { Box, Grid, Skeleton } from "@chakra-ui/react";

const PostsSkeleton = () => {
  return (
    <Grid
      templateColumns={"repeat(3, 1fr)"}
      gap={4}
      margin={"10px"}
      padding={"10px"}
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <Box key={index} height={"100%"} cursor={"pointer"}>
          <Skeleton height={"220px"} width={"100%"} borderRadius={"md"} />
        </Box>
      ))}
    </Grid>
  );
};

export default PostsSkeleton;
