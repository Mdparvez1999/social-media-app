import { Avatar, Box, Button, Heading, Text, WrapItem } from "@chakra-ui/react";
import { useAppSelector } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";

const ProfileDetails = () => {
  const userProfile = useAppSelector((state) => state.profile.profile);

  const navigate = useNavigate();

  return (
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
            src={`http://localhost:8000/uploads/profilePic/${userProfile?.profilePic}`}
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
          <h1>{userProfile?.postsCount} posts</h1>
          <h1>{userProfile?.followersCount} followers</h1>
          <h1>{userProfile?.followingCount} following</h1>
        </Box>
        <Box
          display={"flex"}
          justifyContent={"flex-start"}
          alignItems={"center"}
        >
          <h1>{userProfile?.fullName}</h1>
        </Box>
        <Box mt={"20px"}>
          <Text>Bio</Text>
          <Text fontSize={"18px"}>
            {userProfile?.bio ? userProfile.bio : "add bio"}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileDetails;
