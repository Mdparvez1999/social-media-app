import { useEffect } from "react";
import { Box, Avatar, Text, Image } from "@chakra-ui/react";
import { useAppSelector } from "../../../hooks/hooks";
import PostOptions from "../../posts/PostOptions";
import LikeAndComments from "./LikeAndComments";
import { formatCreatedAtTime } from "../../../utils/formatTimes.utils";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ViewCurrentUsersPostsInMobile = () => {
  const currentUserPost = useAppSelector((state) => state.posts.singlePost);

  const currentUser = useAppSelector((state) => state.profile.profile);

  useEffect(() => {
    if (currentUserPost) {
      document
        .getElementById(`post-${currentUserPost.id}`)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentUserPost]);

  const navigate = useNavigate();

  if (!currentUserPost) return null;

  const handleBackClick = () => {
    navigate(-1);
  };

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
            onClick={handleBackClick}
          />
          <Avatar src={currentUser?.profilePic} size={"sm"} />
          <Text fontWeight="bold" fontSize={"1.5rem"}>
            {currentUser?.userName}
          </Text>
        </Box>
        <Box>
          <PostOptions />
        </Box>
      </Box>
      <Box>
        {currentUserPost?.files.map((file) => (
          <Image
            key={file.fileName + Math.random()}
            src={`http://localhost:8000/uploads/postFiles/${file}`}
            w={"100%"}
            h={"auto"}
            objectFit={"cover"}
            crossOrigin="anonymous"
          />
        ))}
      </Box>
      <Box px={"10px"} mt={"8px"}>
        <LikeAndComments post={currentUserPost} />
      </Box>
      <Box p={"8px"}>
        <Text>{currentUserPost?.caption}</Text>
        <Text>{formatCreatedAtTime(currentUserPost.createdAt)}</Text>
      </Box>
    </Box>
  );
};

export default ViewCurrentUsersPostsInMobile;
