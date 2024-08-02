import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { setSuggestedUsers } from "../../redux-store/features/suggestedUsers/suggestedUsersSlice";
import { toast } from "react-toastify";
import { Avatar, Box, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
// import useFollowUser from "../../hooks/usersprofile/useFollowUser";
// import useUnfollowUser from "../../hooks/usersprofile/useUnfollowUser";

const Suggestion = () => {
  const dispatch = useAppDispatch();

  const suggestedUsers = useAppSelector(
    (state) => state.suggestedUsers.suggestedUsers
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/user/profile/suggested-users", {
          method: "GET",
          credentials: "include",
        });

        const { data } = await response.json();

        dispatch(setSuggestedUsers(data));
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        else toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [dispatch]);

  const navigate = useNavigate();

  const handleViewUserProfile = (userId: string) => {
    navigate(`/app/usersprofile/${userId}`);
  };

  // const selectedUserData = useAppSelector((state) => state.users.selectedUser);

  // const currentUsersFollowing = useAppSelector(
  //   (state) => state.profile.following
  // );

  // const followedUser = currentUsersFollowing?.find(
  //   (user) => user.id === selectedUserData?.id
  // );

  // const [btnLoading, setBtnLoading] = useState(false);

  // const { followUser } = useFollowUser();

  // const { unfollowUser } = useUnfollowUser();

  // const followOrUnfollowUserClick = async (userId: string) => {
  //   setBtnLoading(true);

  //   try {
  //     if (followedUser) {
  //       await unfollowUser(userId);
  //     } else {
  //       await followUser(userId);
  //     }
  //   } catch (error) {
  //     toast.error("Something went wrong");
  //   } finally {
  //     setBtnLoading(false);
  //   }
  // };

  return (
    <Box p={"10px 10px"}>
      {loading && <p>Loading...</p>}

      <Text fontSize={"1.2rem"} fontWeight={"500"} mb={"20px"}>
        Suggested for you
      </Text>

      {!loading &&
        suggestedUsers &&
        suggestedUsers.length > 0 &&
        suggestedUsers.map((user) => (
          <Box
            key={user.id}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box
              display={"flex"}
              gap={"10px"}
              alignItems={"center"}
              mb={"18px"}
              cursor={"pointer"}
              onClick={() => handleViewUserProfile(user.id)}
            >
              <Avatar name={user.userName} />
              <Text>{user.userName}</Text>
            </Box>
            <Button
            // isLoading={btnLoading}
            // onClick={() => followOrUnfollowUserClick(user.id)}
            >
              {/* {followedUser ? "Unfollow" : "Follow"} */}
              follow
            </Button>
          </Box>
        ))}
    </Box>
  );
};

export default Suggestion;
