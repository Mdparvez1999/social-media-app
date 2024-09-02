import { Box, SkeletonCircle, SkeletonText, Divider } from "@chakra-ui/react";
import { IoArrowBackOutline } from "react-icons/io5";

const ConversationsInMobileSkeleton = () => {
  return (
    <Box
      height={"100%"}
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box
        p={"8px 0px 0px 20px"}
        mb={"8px"}
        display={"flex"}
        alignItems={"center"}
        gap={"10px"}
      >
        <IoArrowBackOutline size={"2rem"} cursor={"pointer"} />
        <SkeletonText
          noOfLines={1}
          skeletonHeight="28px"
          width={"120px"}
          pl={"10px"}
          pb={"10px"}
        />
      </Box>
      <Divider width={"90%"} m={"0 auto"} />
      <Box
        fontSize={{ xs: "1.4rem", md: "1.2rem" }}
        fontWeight={"500"}
        p={"10px 24px"}
      >
        <SkeletonText noOfLines={1} skeletonHeight="24px" width={"100px"} />
      </Box>
      <Box maxHeight={"100vh"} width={"100%"} p={"10px 22px"}>
        {[...Array(9)].map((_, index) => (
          <Box
            key={index}
            display={"flex"}
            gap={"18px"}
            mb={"24px"}
            cursor={"pointer"}
          >
            <SkeletonCircle size={"50px"} />
            <SkeletonText
              noOfLines={1}
              skeletonHeight="35px"
              width={"260px"}
              pt={"12px"}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ConversationsInMobileSkeleton;
