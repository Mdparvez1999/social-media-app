import { Box, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

const MobileProfileDetailsSkeleton = () => {
  return (
    <Box
      width={"100%"}
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
    >
      {/* Username Skeleton */}
      <Box p={"5px 0 2px 15px"} width={"100%"}>
        <Skeleton height="20px" width="150px" />
      </Box>

      {/* Profile Avatar and Stats Skeleton */}
      <Box
        height={"100px"}
        width={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        pl={"15px"}
      >
        {/* Avatar Skeleton */}
        <Box>
          <SkeletonCircle size="lg" width="60px" height="60px" />
        </Box>
        <Box width={"100%"}>
          <Box
            display={"flex"}
            justifyContent={"space-evenly"}
            alignItems={"center"}
          >
            <Box textAlign="center">
              <Skeleton height="20px" width="30px" />
              <SkeletonText mt="4px" noOfLines={1} width="30px" />
            </Box>
            <Box textAlign="center">
              <Skeleton height="20px" width="30px" />
              <SkeletonText mt="4px" noOfLines={1} width="50px" />
            </Box>
            <Box textAlign="center">
              <Skeleton height="20px" width="30px" />
              <SkeletonText mt="4px" noOfLines={1} width="50px" />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Bio Skeleton */}
      <Box
        className="bio"
        px={"20px"}
        width={"100%"}
        height={"100%"}
        display={"flex"}
        flexDirection={"column"}
        gap={"4px"}
      >
        <Skeleton height="20px" width="100px" />
        <SkeletonText mt="4px" noOfLines={3} spacing="4" width={"70%"} />
      </Box>

      {/* Edit Profile Button Skeleton */}
      <Box
        display={"flex"}
        justifyContent={"flex-start"}
        px={"20px"}
        my={"14px"}
      >
        <Skeleton height="20px" width="100px" borderRadius="md" />
      </Box>
    </Box>
  );
};

export default MobileProfileDetailsSkeleton;
