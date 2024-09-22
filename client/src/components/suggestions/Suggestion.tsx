import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { setSuggestedUsers } from "../../redux-store/features/suggestedUsers/suggestedUsersSlice";
import { toast } from "react-toastify";
import { Avatar, Box, Button, Text, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

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

        if (!response.ok) {
          throw new Error("Failed to fetch suggested users");
        }

        const { data } = await response.json();
        dispatch(setSuggestedUsers(data));
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
  }, [dispatch]);

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
                  src={
                    user.profilePic
                      ? `http://localhost:8000/uploads/profilePic/${user.profilePic}`
                      : undefined
                  }
                  crossOrigin="anonymous"
                />
                <Text fontWeight={"medium"} fontSize={"1.2rem"} mb={"10px"}>
                  {user.userName}
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
