import { useAppSelector } from "../../../hooks/hooks";
import { Avatar, Box, Text } from "@chakra-ui/react";
import { formatCreatedAtTime } from "../../../utils/formatTimes.utils";
import { IoArrowBack } from "react-icons/io5";
import CustomCarouselForMobile from "../../layouts/general/CustomCarouselForMobile";
import PostOptions from "../../posts/PostOptions";
import { useNavigate } from "react-router-dom";
import SelectedUsersPostLikeAndComment from "../MobileProfile/SelectedUsersPostLikeAndComment";
import { useEffect, useState } from "react";
import ViewEachPostInMobileSkeleton from "../../../mobileComponentSkeletons/ViewEachPostInMobileSkeleton";

const ViewSelectedUsersPostInMobile = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const selectedUsersPosts = useAppSelector(
    (state) => state.users.selectedUsersSinglePost
  );
  const selectedUser = useAppSelector((state) => state.users.selectedUser);

  useEffect(() => {
    if (selectedUsersPosts) {
      setLoading(false);
    }
  }, [selectedUsersPosts]);

  const navigate = useNavigate();

  if (!selectedUsersPosts) return null;

  const handleBackClick = () => {
    navigate(-1);
  };

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
          <Avatar src={selectedUser?.profilePic} size={"sm"} />
          <Text fontWeight="bold" fontSize={"1.5rem"}>
            {selectedUser?.userName}
          </Text>
        </Box>
        <Box>
          <PostOptions />
        </Box>
      </Box>
      <Box>
        <CustomCarouselForMobile
          images={selectedUsersPosts?.files.map(
            (file) => `http://localhost:8000/uploads/postFiles/${file}`
          )}
          width={"100%"}
          height={"240px"}
          objectFit="contain"
        />
      </Box>
      <Box px={"6px"} mt={"14px"}>
        <SelectedUsersPostLikeAndComment post={selectedUsersPosts} />
      </Box>
      <Box p={"4px 0px 0px 10px"} fontWeight={"500"} fontSize={"1.2rem"}>
        <Text>{selectedUsersPosts?.caption}</Text>
        <Text>{formatCreatedAtTime(selectedUsersPosts.createdAt)}</Text>
      </Box>
    </Box>
  );
};

export default ViewSelectedUsersPostInMobile;
