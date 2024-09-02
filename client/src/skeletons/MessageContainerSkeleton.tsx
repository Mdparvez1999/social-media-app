import { Box, Divider, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { IoCall } from "react-icons/io5";
import { FaVideo } from "react-icons/fa6";

const MessageContainerSkeleton = () => {
  return (
    <Box height={"100vh"} width={"100%"} p={"10px"}>
      {/* Header Skeleton */}
      <Box
        className="header"
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        p={"10px 20px"}
      >
        <Box display={"flex"} gap={"14px"} alignItems={"center"}>
          <SkeletonCircle size={"10"} />
          <Box>
            <Skeleton height={"20px"} width={"150px"} />
          </Box>
        </Box>
        <Box display={"flex"} gap={"16px"} alignItems={"center"} pr={"10px"}>
          <IoCall size={"1.8rem"} />
          <FaVideo size={"1.9rem"} />
        </Box>
      </Box>
      <Divider />

      {/* Messages Skeleton */}
      <Box maxHeight={"calc(100vh - 140px)"} overflowY={"auto"} p={"10px"}>
        <Box>
          {/* User's message on the left */}
          <Box display={"flex"} justifyContent={"flex-start"} mb={"10px"}>
            <Box width={"170px"} p={"10px"} borderRadius={"md"} bg={"gray.200"}>
              <SkeletonCircle mb={"10px"} />
              <Skeleton height={"20px"} width={"100%"} />
            </Box>
          </Box>

          <Box display={"flex"} justifyContent={"flex-end"} mb={"10px"}>
            <Box width={"170px"} p={"10px"} borderRadius={"md"} bg={"blue.200"}>
              <SkeletonCircle mb={"10px"} />
              <Skeleton height={"20px"} width={"100%"} />
            </Box>
          </Box>

          <Box display={"flex"} justifyContent={"flex-start"} mb={"10px"}>
            <Box width={"170px"} p={"10px"} borderRadius={"md"} bg={"gray.200"}>
              <SkeletonCircle mb={"10px"} />
              <Skeleton height={"20px"} width={"100%"} />
            </Box>
          </Box>

          <Box display={"flex"} justifyContent={"flex-end"} mb={"10px"}>
            <Box width={"170px"} p={"10px"} borderRadius={"md"} bg={"blue.200"}>
              <SkeletonCircle mb={"10px"} />
              <Skeleton height={"20px"} width={"100%"} />
            </Box>
          </Box>

          <Box display={"flex"} justifyContent={"flex-start"} mb={"10px"}>
            <Box width={"170px"} p={"10px"} borderRadius={"md"} bg={"gray.200"}>
              <SkeletonCircle mb={"10px"} />
              <Skeleton height={"20px"} width={"100%"} />
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Footer Skeleton */}
      <Box className="footer" p={"10px"}>
        <Skeleton height={"50px"} width={"100%"} />
      </Box>
    </Box>
  );
};

export default MessageContainerSkeleton;
