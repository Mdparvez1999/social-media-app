import { toast } from "react-toastify";
import { setFollowingUsers } from "../../redux-store/features/profile/profileSlice";
import { useAppDispatch, useAppSelector } from "../hooks";

const useFetchFollowingUsers = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const fetchFollowingUsers = async () => {
    try {
      const response = await fetch(`/api/users/following/${currentUser?.id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error(response.statusText);

      const { data } = await response.json();

      dispatch(setFollowingUsers(data));
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };

  return { fetchFollowingUsers };
};

export default useFetchFollowingUsers;
