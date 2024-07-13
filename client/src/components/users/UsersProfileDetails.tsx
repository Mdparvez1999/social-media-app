import { Avatar, Box, Button, Heading, Text, WrapItem } from "@chakra-ui/react";
import { useAppSelector } from "../../hooks/hooks";

const UsersProfileDetails = () => {
  const selectedUserData = useAppSelector((state) => state.users.selectedUser);

  console.log(selectedUserData);

  return (
    <Box
      width={"70%"}
      minHeight={"45vh"}
      display={"flex"}
      justifyContent={"space-evenly"}
      padding={"35px"}
      mx={"80px"}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        margin={"15px"}
      >
        <WrapItem>
          <Avatar
            size={"2xl"}
            crossOrigin="anonymous"
            src={`http://localhost:8000/uploads/profilePic/${selectedUserData?.profilePic}`}
          />
        </WrapItem>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        width={"58%"}
        minHeight={"100%"}
        padding={"15px"}
        mx={"35px"}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={"20px"}
          width={"90%"}
        >
          <Box>
            <Heading size={"lg"} fontWeight={"500"}>
              {selectedUserData?.userName}
            </Heading>
          </Box>
          <Box display={"flex"} gap={"20px"}>
            <Button>Follow</Button>
            <Button>Message</Button>
          </Box>
        </Box>
        <Box
          display={"flex"}
          justifyContent={"flex-start"}
          gap={"60px"}
          alignItems={"center"}
          mb={"30px"}
        >
          <h1>{selectedUserData?.postsCount} posts</h1>
          <h1>{selectedUserData?.followersCount} followers</h1>
          <h1>{selectedUserData?.followingCount} following</h1>
        </Box>
        <Box
          display={"flex"}
          justifyContent={"flex-start"}
          alignItems={"center"}
        >
          <h1>{selectedUserData?.fullName}</h1>
        </Box>
        <Box mt={"20px"}>
          <Text>Bio</Text>
          <Text fontSize={"18px"}>
            {selectedUserData?.bio ? selectedUserData.bio : "add bio"}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default UsersProfileDetails;
