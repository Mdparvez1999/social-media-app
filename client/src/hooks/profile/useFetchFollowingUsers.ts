import { toast } from "react-toastify";
import { useAppSelector } from "../hooks";
import useFetchGetObjectUrlForAllProfilePics from "../usersprofile/useFetchGetObjectUrlForAllProfilePics";
import { FollowersAndFollowingState } from "../../redux-store/features/profile/profileSlice";

const useFetchFollowingUsers = () => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const { fetchGetObjectUrlForAllProfilePics } =
    useFetchGetObjectUrlForAllProfilePics();

  const fetchFollowingUsers = async () => {
    if (!currentUser) return;
    try {
      const response = await fetch(`/api/users/following/${currentUser.id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();

      if (data.status === "error" || data.status === "fail")
        return toast.error(data.message);

      const uniqueProfilePicUrl = new Map();

      data.data.map((user: FollowersAndFollowingState) => {
        const { id: userId, profilePic } = user;

        if (!uniqueProfilePicUrl.has(userId)) {
          uniqueProfilePicUrl.set(userId, profilePic);
        }
      });

      const followingUserProfilePicUrl = [...uniqueProfilePicUrl.values()];

      const profilePicUrls = await fetchGetObjectUrlForAllProfilePics(
        followingUserProfilePicUrl
      );

      const updatedFollowingUsers: FollowersAndFollowingState[] = data.data.map(
        (user: FollowersAndFollowingState) => {
          const userId = user.id;

          const updatedFollowingUsers = { ...user };

          const newProfilePic = profilePicUrls?.find((url) => {
            return url.includes(uniqueProfilePicUrl.get(userId));
          });

          if (newProfilePic) updatedFollowingUsers.profilePic = newProfilePic;

          return updatedFollowingUsers;
        }
      );

      return updatedFollowingUsers;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };

  return { fetchFollowingUsers };
};

export default useFetchFollowingUsers;
