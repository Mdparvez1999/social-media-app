import { Box, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

const SelectedUsersProfileDetailsInMobileSkeleton = () => {
  return (
    <Box
      width={"100%"}
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
    >
      {/* Header Skeleton (Back arrow and Username) */}
      <Box
        p={"10px 0 2px 15px"}
        width={"100%"}
        display={"flex"}
        alignItems={"center"}
        gap={"15px"}
        cursor={"pointer"}
      >
        <Skeleton height="24px" width="24px" />
        <Skeleton height="24px" width="150px" />
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
        <SkeletonCircle />

        {/* Stats Skeleton */}
        <Box width={"100%"}>
          <Box
            display={"flex"}
            justifyContent={"space-evenly"}
            alignItems={"center"}
          >
            <Box textAlign="center">
              <Skeleton height="20px" width="30px" />
              <SkeletonText mt="2px" noOfLines={1} width="30px" />
            </Box>
            <Box textAlign="center">
              <Skeleton height="20px" width="50px" />
              <SkeletonText mt="2px" noOfLines={1} width="50px" />
            </Box>
            <Box textAlign="center">
              <Skeleton height="20px" width="50px" />
              <SkeletonText mt="2px" noOfLines={1} width="50px" />
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
        <SkeletonText mt="2px" noOfLines={3} spacing="2" />
      </Box>

      {/* Buttons Skeleton */}
      <Box
        display={"flex"}
        alignItems={"center"}
        gap={"15px"}
        px={"20px"}
        my={"12px"}
      >
        <Skeleton height="30px" width="160px" borderRadius="md" />
        <Skeleton height="30px" width="160px" borderRadius="md" />
      </Box>
    </Box>
  );
};

export default SelectedUsersProfileDetailsInMobileSkeleton;
