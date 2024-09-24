import { toast } from "react-toastify";
import { useAppSelector } from "../hooks";
import { FollowersAndFollowingState } from "../../redux-store/features/users/userSlice";
import useFetchGetObjectUrlForAllProfilePics from "./useFetchGetObjectUrlForAllProfilePics";

const useFetchSelectedUsersFollowing = () => {
  const selectedUser = useAppSelector((state) => state.users.selectedUser);

  const { fetchGetObjectUrlForAllProfilePics } =
    useFetchGetObjectUrlForAllProfilePics();

  const fetchSelectedUsersFollowing = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/users/following/${
          selectedUser?.id
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();

      if (data.status === "error" || data.status === "fail")
        throw new Error(data.message);

      const followingUsersData = data.data;

      const uniqueProfilePicUrls = new Map();

      followingUsersData.map((user: FollowersAndFollowingState) => {
        const { id: userId, profilePic } = user;

        if (!uniqueProfilePicUrls.has(userId)) {
          uniqueProfilePicUrls.set(userId, profilePic);
        }
      });

      const followersProfilePicUrl: string[] = [
        ...uniqueProfilePicUrls.values(),
      ];

      const profilePicUrls: string[] | undefined =
        await fetchGetObjectUrlForAllProfilePics(followersProfilePicUrl);

      const updatedSelectedUsersFollowing = followingUsersData.map(
        (user: FollowersAndFollowingState) => {
          const userId = user.id;

          const updatedSelectedUsersFollowing = { ...user };

          const newProfilePic = profilePicUrls?.find((url) => {
            return url.includes(uniqueProfilePicUrls.get(userId));
          });

          if (newProfilePic)
            updatedSelectedUsersFollowing.profilePic = newProfilePic;

          return updatedSelectedUsersFollowing;
        }
      );

      return updatedSelectedUsersFollowing;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return { fetchSelectedUsersFollowing };
};

export default useFetchSelectedUsersFollowing;
