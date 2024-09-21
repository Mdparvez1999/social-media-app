import {
  Avatar,
  Box,
  Button,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import ViewFollowersModal from "../../profile/ViewFollowersModal";
import ViewFollowingUsersModal from "../../profile/ViewFollowingUsersModal";
import { useAppSelector } from "../../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MobileProfileDetailsSkeleton from "../../../mobileComponentSkeletons/MobileProfileDetailsSkeleton";

const MobileProfileDetails = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const followersDisclosure = useDisclosure();
  const followingUsersDisclosure = useDisclosure();

  const userProfile = useAppSelector((state) => state.profile.profile);

  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [userProfile]);

  return loading ? (
    <MobileProfileDetailsSkeleton />
  ) : (
    <Box
      width={"100%"}
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box p={"5px 0 2px 15px"} width={"100%"}>
        <Heading fontSize={"2rem"}>{userProfile?.userName}</Heading>
      </Box>
      <Box
        height={"100px"}
        width={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        pl={"15px"}
      >
        <Box>
          <Avatar
            size={"lg"}
            crossOrigin="anonymous"
            src={userProfile?.profilePic}
            name={userProfile?.userName}
          />
        </Box>
        <Box width={"100%"}>
          <Box
            display={"flex"}
            justifyContent={"space-evenly"}
            alignItems={"center"}
          >
            <Box>
              <Text
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {userProfile?.postsCount}
              </Text>
              <Text> posts</Text>
            </Box>
            <Box cursor={"pointer"} onClick={followersDisclosure.onOpen}>
              <Text
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {userProfile?.followersCount}
              </Text>
              <Text> followers</Text>
            </Box>
            <Box onClick={followingUsersDisclosure.onOpen} cursor={"pointer"}>
              <Text
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {userProfile?.followingCount}
              </Text>
              <Text> following</Text>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        className="bio"
        px={"20px"}
        width={"100%"}
        height={"100%"}
        display={"flex"}
        flexDirection={"column"}
        gap={"4px"}
      >
        <Box>
          <Text fontWeight={"bold"}>{userProfile?.fullName}</Text>
        </Box>
        <Box>
          <Text>{userProfile?.bio}</Text>
        </Box>
      </Box>
      <Box
        display={"flex"}
        justifyContent={"flex-start"}
        px={"20px"}
        my={"14px"}
      >
        <Button
          onClick={() => {
            navigate("/app/profiledata");
          }}
        >
          Edit Profile
        </Button>
      </Box>
      <ViewFollowersModal
        isOpen={followersDisclosure.isOpen}
        onClose={followersDisclosure.onClose}
      />
      <ViewFollowingUsersModal
        isOpen={followingUsersDisclosure.isOpen}
        onClose={followingUsersDisclosure.onClose}
      />
    </Box>
  );
};

export default MobileProfileDetails;
