import { Box, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

const UsersProfileDetailsSkeleton = () => {
  return (
    <Box
      width={"70%"}
      minHeight={"45vh"}
      display={"flex"}
      justifyContent={"space-evenly"}
      padding={"35px"}
      mx={"80px"}
    >
      {/* Avatar Skeleton */}
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        margin={"15px"}
      >
        <SkeletonCircle size={"150px"} />
      </Box>

      {/* Details Skeleton */}
      <Box
        display={"flex"}
        flexDirection={"column"}
        width={"58%"}
        minHeight={"100%"}
        padding={"15px"}
        mx={"35px"}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={"20px"}
          width={"90%"}
          gap={"14px"}
        >
          <Box>
            <Skeleton height={"24px"} width={"150px"} />
          </Box>
          <Box display={"flex"} gap={"20px"}>
            <Skeleton height={"40px"} width={"100px"} />
            <Skeleton height={"40px"} width={"100px"} />
          </Box>
        </Box>

        <Box
          display={"flex"}
          justifyContent={"flex-start"}
          gap={"60px"}
          alignItems={"center"}
          mb={"30px"}
        >
          <Skeleton height={"20px"} width={"80px"} />
          <Skeleton height={"20px"} width={"80px"} />
          <Skeleton height={"20px"} width={"80px"} />
        </Box>

        <Box
          display={"flex"}
          justifyContent={"flex-start"}
          alignItems={"center"}
        >
          <Skeleton height={"20px"} width={"150px"} />
        </Box>

        <Box mt={"20px"}>
          <SkeletonText noOfLines={2} spacing={"4"} />
        </Box>
      </Box>
    </Box>
  );
};

export default UsersProfileDetailsSkeleton;
