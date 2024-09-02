import { Box, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

const ProfileDetailsSkeleton = () => {
  return (
    <Box
      width={"70%"}
      minHeight={"45vh"}
      display={"flex"}
      justifyContent={"space-evenly"}
      padding={"20px 0 0 70px"}
      mx={"80px"}
    >
      <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
        <SkeletonCircle size={"150px"} />
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        width={"100%"}
        minHeight={"100%"}
        padding={"15px"}
        mx={"60px"}
      >
        <Box
          display={"flex"}
          justifyContent={"flex-start"}
          gap={"160px"}
          alignItems={"center"}
          mb={"20px"}
        >
          <Skeleton height={"1.5rem"} width={"10rem"} />
          <Skeleton height={"2.5rem"} width={"8rem"} />
        </Box>
        <Box
          display={"flex"}
          justifyContent={"flex-start"}
          gap={"60px"}
          alignItems={"center"}
          mb={"30px"}
        >
          <Skeleton height={"1rem"} width={"4rem"} />
          <Skeleton height={"1rem"} width={"6rem"} />
          <Skeleton height={"1rem"} width={"6rem"} />
        </Box>
        <Box
          display={"flex"}
          justifyContent={"flex-start"}
          alignItems={"center"}
        >
          <Skeleton height={"1rem"} width={"8rem"} />
        </Box>
        <Box mt={"20px"}>
          <SkeletonText noOfLines={2} spacing="4" width={"50%"} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileDetailsSkeleton;
