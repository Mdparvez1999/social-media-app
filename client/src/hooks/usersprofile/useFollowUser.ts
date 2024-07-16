import { toast } from "react-toastify";
import { useAppDispatch } from "../hooks";
import { addSelectedUsersFollower } from "../../redux-store/features/users/userSlice";
import { addFollowing } from "../../redux-store/features/profile/profileSlice";

const useFollowUser = () => {
  const dispatch = useAppDispatch();
  const followUser = async (id: string | undefined) => {
    try {
      const response = await fetch(`/api/users/follow/${id}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      console.log("data in useFollowUser", data);

      dispatch(addSelectedUsersFollower(data.follower));
      dispatch(addFollowing(data.following));

      window.location.reload();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
      console.log(error);
    }
  };

  return { followUser };
};

export default useFollowUser;
