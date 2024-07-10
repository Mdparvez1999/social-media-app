import { Box, Divider } from "@chakra-ui/react";
import ProfileDetails from "../../components/profile/ProfileDetails";
import ProfilePosts from "../../components/profile/ProfilePosts";
import { useAppDispatch } from "../../hooks/hooks";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { setProfile } from "../../redux-store/features/profile/profileSlice";

const Profile = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (data.status === "fail" || data.status === "error") {
          throw new Error(data.message);
        }

        dispatch(setProfile(data.data));
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        else toast.error("Something went wrong");
      }
    };

    fetchUserProfile();
  }, [dispatch]);
  return (
    <Box
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
    >
      <ProfileDetails />
      <Divider />
      <ProfilePosts />
    </Box>
  );
};

export default Profile;
