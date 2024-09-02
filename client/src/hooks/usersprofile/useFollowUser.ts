import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addSelectedUsersFollower } from "../../redux-store/features/users/userSlice";
import { addFollowing } from "../../redux-store/features/profile/profileSlice";

const useFollowUser = () => {
  const dispatch = useAppDispatch();

  const currentUsersFollowing = useAppSelector(
    (state) => state.profile.following
  );
  const followUser = async (id: string | undefined) => {
    if (!id) return;

    try {
      const response = await fetch(`/api/users/follow/${id}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "fail" || data.status === "error") {
        return toast.success(data.message);
      }

      const existingFollowingUser = currentUsersFollowing?.some(
        (user) => user?.id === data.data.following?.id
      );

      if (!existingFollowingUser) {
        dispatch(addSelectedUsersFollower(data.follower));
        dispatch(addFollowing(data.data.following));
      }

      return data;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return { followUser };
};

export default useFollowUser;
