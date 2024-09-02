import { Box, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ViewEachPostInMobileSkeleton = () => {
  const navigate = useNavigate();
  return (
    <Box>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={"16px"}
        p={"10px"}
      >
        <Box display={"flex"} gap={"15px"} alignItems={"center"}>
          <IoArrowBack
            size={"1.8rem"}
            cursor={"pointer"}
            onClick={() => navigate(-1)}
          />
          <SkeletonCircle size={"40px"} />
          <SkeletonText noOfLines={1} width="100px" skeletonHeight="20px" />
        </Box>
        <Box>
          <Skeleton width={"30px"} height={"30px"} />
        </Box>
      </Box>
      <Box>
        <Skeleton width={"100%"} height={"240px"} />
      </Box>
      <Box px={"6px"} mt={"14px"}>
        <SkeletonText noOfLines={2} spacing="4" skeletonHeight="20px" />
      </Box>
      <Box p={"4px 0px 0px 10px"}>
        <SkeletonText noOfLines={1} skeletonHeight="20px" width="60%" />
        <SkeletonText
          noOfLines={1}
          skeletonHeight="20px"
          width="40%"
          mt={"2px"}
        />
      </Box>
    </Box>
  );
};

export default ViewEachPostInMobileSkeleton;
