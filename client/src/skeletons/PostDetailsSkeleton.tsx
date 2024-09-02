import {
  Box,
  Divider,
  Heading,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";

const PostDetailsSkeleton = () => {
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={"12px"}
      >
        <Box display={"flex"} alignItems={"center"} gap={"16px"}>
          <SkeletonCircle size={"40px"} />
          <SkeletonText noOfLines={1} width="100px" skeletonHeight="20px" />
        </Box>
        <Skeleton width={"30px"} height={"30px"} mb={"10px"} />
      </Box>
      <Divider mb={"5px"} />
      <Box height={"320px"}>
        <Skeleton height="100%" width="100%" />
      </Box>
      <Divider mb={"8px"} />
      <Box>
        <Skeleton height="20px" width="100%" />
      </Box>
      <Box p={"8px"}>
        <Heading fontSize={"0.8rem"} fontWeight={"500"}>
          <Skeleton height="10px" width="60px" />
        </Heading>
      </Box>
      <Divider my={"6px"} />
      <Box>
        <SkeletonText mt="4" noOfLines={1} skeletonHeight="20px" />
      </Box>
    </>
  );
};

export default PostDetailsSkeleton;
