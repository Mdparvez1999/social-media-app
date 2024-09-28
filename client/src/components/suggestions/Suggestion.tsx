import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  setSuggestedUsers,
  SuggestedUsersState,
} from "../../redux-store/features/suggestedUsers/suggestedUsersSlice";
import { toast } from "react-toastify";
import { Avatar, Box, Button, Text, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useFetchGetObjectUrlForAllProfilePics from "../../hooks/usersprofile/useFetchGetObjectUrlForAllProfilePics";

const Suggestion = () => {
  const dispatch = useAppDispatch();

  const suggestedUsers = useAppSelector(
    (state) => state.suggestedUsers.suggestedUsers
  );

  const [loading, setLoading] = useState<boolean>(false);

  const { fetchGetObjectUrlForAllProfilePics } =
    useFetchGetObjectUrlForAllProfilePics();

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_API_BASE_URL
          }/api/user/profile/suggested-users`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch suggested users");
        }

        const data = await response.json();

        if (data.status === "error" || data.status === "fail")
          throw new Error(data.message);

        const uniqueUrls = new Map();

        data.data.forEach((user: SuggestedUsersState) => {
          const { id: userId, profilePic } = user;

          if (!uniqueUrls.has(userId)) {
            uniqueUrls.set(userId, profilePic);
          }
        });

        const profilePicUrls: string[] | undefined =
          await fetchGetObjectUrlForAllProfilePics([...uniqueUrls.values()]);

        const updatedSuggestedUsers = data.data.map(
          (user: SuggestedUsersState) => {
            return {
              ...user,
              profilePic: profilePicUrls?.find((url) =>
                url.includes(uniqueUrls.get(user.id))
              ),
            };
          }
        );

        dispatch(setSuggestedUsers(updatedSuggestedUsers));
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 900);
      }
    };

    fetchSuggestions();
  }, [dispatch, fetchGetObjectUrlForAllProfilePics]);

  const navigate = useNavigate();

  const handleViewUserProfile = (userId: string) => {
    navigate(`/app/usersprofile/${userId}`);
  };

  return (
    <Box p={"10px"}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100px"
        >
          <Spinner />
        </Box>
      ) : suggestedUsers && suggestedUsers.length > 0 ? (
        <>
          <Text fontSize={"1.2rem"} fontWeight={"500"} mb={"20px"}>
            Suggested for you
          </Text>
          {suggestedUsers.map((user) => (
            <Box
              key={user.id}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              mb={"6px"}
              p={"10px"}
            >
              <Box
                display={"flex"}
                gap={"10px"}
                alignItems={"center"}
                cursor={"pointer"}
                onClick={() => handleViewUserProfile(user.id)}
              >
                <Avatar
                  name={user.userName}
                  src={user?.profilePic ? user?.profilePic : undefined}
                  crossOrigin="anonymous"
                />
                <Text fontWeight={"medium"} fontSize={"1.2rem"} mb={"10px"}>
                  {user?.userName}
                </Text>
              </Box>
              <Button>Follow</Button>
            </Box>
          ))}
        </>
      ) : (
        <Text textAlign={"center"}>No suggested users at the moment.</Text>
      )}
    </Box>
  );
};

export default Suggestion;
