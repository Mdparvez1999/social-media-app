import { Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

const AllNotificationsInMobileSkeleton = () => {
  return (
    <Box overflow={"auto"} height={"81vh"}>
      {/* Skeleton for each notification item */}
      {[...Array(10)].map((_, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          mb={"20px"}
          gap={"6px"}
          width={"100%"}
          p={"6px 0px 5px 15px"}
          borderRadius={"5px"}
          bgColor={"gray.100"}
        >
          {/* Avatar Skeleton */}
          <SkeletonCircle size={"10"} />

          {/* Text Skeleton */}
          <Box
            display={"flex"}
            flexDirection={"row"}
            ml={"12px"}
            width={"100%"}
          >
            <SkeletonText
              noOfLines={2}
              spacing={"4"}
              skeletonHeight="20px"
              width={"80%"}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default AllNotificationsInMobileSkeleton;
