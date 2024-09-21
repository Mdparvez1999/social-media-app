import { toast } from "react-toastify";
import { useAppSelector } from "../hooks";
import { FollowersAndFollowingState } from "../../redux-store/features/profile/profileSlice";
import useFetchGetObjectUrlForAllProfilePics from "../usersprofile/useFetchGetObjectUrlForAllProfilePics";

const useFetchFollowers = () => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const { fetchGetObjectUrlForAllProfilePics } =
    useFetchGetObjectUrlForAllProfilePics();
  const fetchFollowers = async () => {
    if (!currentUser) return;
    try {
      const response = await fetch(`/api/users/followers/${currentUser.id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();

      if (data.status === "error" || data.status === "fail")
        return toast.error(data.message);

      const followersData = data.data;

      const uniqueProfilePicUrls = new Map();

      followersData.map((user: FollowersAndFollowingState) => {
        const { id: userId, profilePic } = user;

        if (!uniqueProfilePicUrls.has(userId)) {
          uniqueProfilePicUrls.set(userId, profilePic);
        }
      });

      const followersProfilePicUrl = [...uniqueProfilePicUrls.values()];

      const profilePicUrls = await fetchGetObjectUrlForAllProfilePics(
        followersProfilePicUrl
      );

      const updatedFollowers = followersData.map(
        (user: FollowersAndFollowingState) => {
          const userId: string = user.id;

          const updatedFollower = { ...user };

          const newProfilePic = profilePicUrls?.find((url) => {
            return url.includes(uniqueProfilePicUrls.get(userId));
          });

          if (newProfilePic) updatedFollower.profilePic = newProfilePic;

          return updatedFollower;
        }
      );

      return updatedFollowers;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };

  return { fetchFollowers };
};

export default useFetchFollowers;
