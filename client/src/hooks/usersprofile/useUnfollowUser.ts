import { toast } from "react-toastify";
import { useAppDispatch } from "../hooks";
import { removeFollowing } from "../../redux-store/features/profile/profileSlice";
import { removeSelectedUsersFollower } from "../../redux-store/features/users/userSlice";

const useUnfollowUser = () => {
  const dispatch = useAppDispatch();
  const unfollowUser = async (id: string | undefined) => {
    if (!id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/users/unfollow/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.status === "fail" || data.status === "error")
        return toast.error(data.message);

      dispatch(removeFollowing(data.data.following.id));
      dispatch(removeSelectedUsersFollower(data.data.follower.id));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return { unfollowUser };
};

export default useUnfollowUser;
