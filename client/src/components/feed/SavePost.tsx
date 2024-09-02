import { Box } from "@chakra-ui/react";
import { CiBookmark } from "react-icons/ci";

const SavePost = () => {
  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <CiBookmark size={"1.9rem"} />
      </Box>
    </Box>
  );
};

export default SavePost;
