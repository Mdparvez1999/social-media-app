import {
  Avatar,
  Box,
  Button,
  Heading,
  Text,
  useDisclosure,
  WrapItem,
} from "@chakra-ui/react";
import { useAppSelector } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import ViewFollowersModal from "./ViewFollowersModal";
import ViewFollowingUsersModal from "./ViewFollowingUsersModal";
import { useEffect, useState } from "react";
import ProfileDetailsSkeleton from "../../skeletons/profile/ProfileDetailSkeleton";

const ProfileDetails = () => {
  const navigate = useNavigate();

  const userProfile = useAppSelector((state) => state.profile.profile);

  const followersDisclosure = useDisclosure();
  const followingUsersDisclosure = useDisclosure();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (userProfile) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [userProfile]);

  return loading ? (
    <ProfileDetailsSkeleton />
  ) : (
    <>
      <Box
        width={"70%"}
        minHeight={"45vh"}
        display={"flex"}
        justifyContent={"space-evenly"}
        padding={"20px 0 0 70px"}
        mx={"80px"}
      >
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <WrapItem>
            <Avatar
              size={"2xl"}
              crossOrigin="anonymous"
              src={userProfile?.profilePic}
            />
          </WrapItem>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          width={"100%"}
          minHeight={"100%"}
          padding={"15px"}
          mx={"60px"}
        >
          <Box
            display={"flex"}
            justifyContent={"flex-start"}
            gap={"160px"}
            alignItems={"center"}
            mb={"20px"}
          >
            <Heading size={"lg"} fontWeight={"500"}>
              {userProfile?.userName}
            </Heading>
            <Button
              onClick={() => {
                navigate("/app/profiledata");
              }}
            >
              Edit Profile
            </Button>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"flex-start"}
            gap={"60px"}
            alignItems={"center"}
            mb={"30px"}
          >
            <Text>{userProfile?.postsCount} posts</Text>
            <Text cursor={"pointer"} onClick={followersDisclosure.onOpen}>
              {userProfile?.followersCount} followers
            </Text>
            <Text cursor={"pointer"} onClick={followingUsersDisclosure.onOpen}>
              {userProfile?.followingCount} following
            </Text>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"flex-start"}
            alignItems={"center"}
          >
            <Text>{userProfile?.fullName}</Text>
          </Box>
          <Box mt={"20px"}>
            <Text>Bio</Text>
            <Text fontSize={"18px"}>
              {userProfile?.bio ? userProfile.bio : "add bio"}
            </Text>
          </Box>
        </Box>
      </Box>
      <ViewFollowersModal
        isOpen={followersDisclosure.isOpen}
        onClose={followersDisclosure.onClose}
      />
      <ViewFollowingUsersModal
        isOpen={followingUsersDisclosure.isOpen}
        onClose={followingUsersDisclosure.onClose}
      />
    </>
  );
};

export default ProfileDetails;
