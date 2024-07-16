import { toast } from "react-toastify";
import { useAppDispatch } from "../hooks";
import { removeFollowing } from "../../redux-store/features/profile/profileSlice";
import { removeSelectedUsersFollower } from "../../redux-store/features/users/userSlice";

const useUnfollowUser = () => {
  const dispatch = useAppDispatch();
  const unfollowUser = async (id: string | undefined) => {
    try {
      const response = await fetch(`/api/users/unfollow/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      dispatch(removeFollowing(data.following));
      dispatch(removeSelectedUsersFollower(data.follower));

      window.location.reload();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
      console.log(error);
    }
  };

  return { unfollowUser };
};

export default useUnfollowUser;
