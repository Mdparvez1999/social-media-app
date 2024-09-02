import { Box, SkeletonText } from "@chakra-ui/react";
import { useRef } from "react";

const MessageBodySkeleton = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const messages = Array.from({ length: 10 });

  return (
    <Box
      p={{ xs: "0px", md: 4 }}
      overflowY="auto"
      height="calc(100vh - 130px)"
      display="flex"
      flexDirection="column"
      ref={containerRef}
    >
      {messages.map((_, index) => (
        <Box
          key={index}
          mb={"12px"}
          display={"flex"}
          flexDirection={index % 2 === 0 ? "row-reverse" : "row"}
          gap={"12px"}
        >
          <SkeletonText noOfLines={3} spacing="4" skeletonHeight="20px" />
        </Box>
      ))}
    </Box>
  );
};

export default MessageBodySkeleton;
