import { toast } from "react-toastify";
import { useAppSelector } from "../hooks";
import useFetchGetObjectUrlForAllProfilePics from "./useFetchGetObjectUrlForAllProfilePics";
import { FollowersAndFollowingState } from "../../redux-store/features/users/userSlice";

const UseFetchSelectedUsersFollowers = () => {
  const selectedUser = useAppSelector((state) => state.users.selectedUser);

  const { fetchGetObjectUrlForAllProfilePics } =
    useFetchGetObjectUrlForAllProfilePics();

  const fetchSelectedUsersFollowers = async () => {
    if (!selectedUser) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/users/followers/${
          selectedUser.id
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

      if (data.status === "fail" || data.status === "error")
        throw new Error(data.message);

      const followersData = data.data;
      const uniqueProfilePicUrls = new Map();

      followersData.map((user: FollowersAndFollowingState) => {
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

      const updatedSelectedUsersFollowers = followersData.map(
        (user: FollowersAndFollowingState) => {
          const userId = user.id;

          const updatedSelectedUsersFollowers = { ...user };

          const newProfilePic = profilePicUrls?.find((url) => {
            return url.includes(uniqueProfilePicUrls.get(userId));
          });

          if (newProfilePic)
            updatedSelectedUsersFollowers.profilePic = newProfilePic;

          return updatedSelectedUsersFollowers;
        }
      );

      return updatedSelectedUsersFollowers;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };

  return { fetchSelectedUsersFollowers };
};

export default UseFetchSelectedUsersFollowers;
