import { Box, Avatar, Text } from "@chakra-ui/react";
import { useAppSelector } from "../../../hooks/hooks";
import PostOptions from "../../posts/PostOptions";
import LikeAndComments from "./LikeAndComments";
import { formatCreatedAtTime } from "../../../utils/formatTimes.utils";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import CustomCarouselForMobile from "../../layouts/general/CustomCarouselForMobile";
import { useEffect, useState } from "react";
import ViewEachPostInMobileSkeleton from "../../../mobileComponentSkeletons/ViewEachPostInMobileSkeleton";

const ViewCurrentUsersPostsInMobile = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const currentUserPost = useAppSelector((state) => state.posts.singlePost);
  const currentUser = useAppSelector((state) => state.profile.profile);

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (currentUser && currentUserPost) setLoading(false);
  }, [currentUser, currentUserPost]);

  if (!currentUserPost) return null;

  return loading ? (
    <ViewEachPostInMobileSkeleton />
  ) : (
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
        <CustomCarouselForMobile
          images={currentUserPost?.files.map(
            (file) => `http://localhost:8000/uploads/postFiles/${file}`
          )}
          width={"100%"}
          height={"240px"}
          objectFit="contain"
        />
      </Box>
      <Box px={"6px"} mt={"14px"}>
        <LikeAndComments post={currentUserPost} />
      </Box>
      <Box p={"4px 0px 0px 10px"} fontWeight={"500"} fontSize={"1.2rem"}>
        <Text>{currentUserPost?.caption}</Text>
        <Text>{formatCreatedAtTime(currentUserPost.createdAt)}</Text>
      </Box>
    </Box>
  );
};

export default ViewCurrentUsersPostsInMobile;
