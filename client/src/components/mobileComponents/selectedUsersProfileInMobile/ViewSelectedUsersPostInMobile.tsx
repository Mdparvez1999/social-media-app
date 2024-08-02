import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../hooks/hooks";
import { scroller } from "react-scroll";
import { Avatar, Box, Image, Text } from "@chakra-ui/react";
import LikeAndComments from "../../mobileComponents/MobileProfile/LikeAndComments";
import { formatCreatedAtTime } from "../../../utils/formatTimes.utils";
import { IoArrowBack } from "react-icons/io5";

const ViewSelectedUsersPostInMobile = () => {
  const { postId } = useParams();

  const selectedUsersPosts = useAppSelector(
    (state) => state.users.selectedUsersPosts
  );

  const selectedUser = useAppSelector((state) => state.users.selectedUser);

  // Find the index of the post based on the postId
  const initialPostIndex = selectedUsersPosts.findIndex(
    (post) => post.id === postId
  );

  // Scroll to the post on mount
  useEffect(() => {
    if (initialPostIndex !== -1) {
      scroller.scrollTo(`post-${postId}`, {
        duration: 800,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -50, // adjust this value according to your needs
      });
    }
  }, [initialPostIndex, postId]);

  return (
    <Box>
      <Box p={"10px"}></Box>
      {selectedUsersPosts.length > 0
        ? selectedUsersPosts.map((post) => (
            <Box key={post.id} id={`post-${post.id}`}>
              <Box
                display={"flex"}
                alignItems={"center"}
                gap={"16px"}
                p={"10px"}
              >
                <IoArrowBack
                  size={"1.8rem"}
                  cursor={"pointer"}
                  onClick={() => window.history.back()}
                />
                <Box display={"flex"} gap={"15px"} alignItems={"center"}>
                  <Avatar src={selectedUser?.profilePic} size={"sm"} />
                  <Text fontWeight="bold" fontSize={"1.5rem"}>
                    {selectedUser?.userName}
                  </Text>
                </Box>
              </Box>
              <Box>
                {post.files.map((file) => (
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
                <LikeAndComments post={post} />
              </Box>
              <Box p={"8px"}>
                <Text>{post.caption}</Text>
                <Text>{formatCreatedAtTime(post.createdAt)}</Text>
              </Box>
            </Box>
          ))
        : null}
    </Box>
  );
};

export default ViewSelectedUsersPostInMobile;
