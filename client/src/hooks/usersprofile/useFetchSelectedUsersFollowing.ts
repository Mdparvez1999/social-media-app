import { toast } from "react-toastify";
import { setSelectedUsersFollowing } from "../../redux-store/features/users/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks";

const useFetchSelectedUsersFollowing = () => {
  const dispatch = useAppDispatch();

  const selectedUser = useAppSelector((state) => state.users.selectedUser);
  const fetchSelectedUsersFollowing = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`/api/users/following/${selectedUser?.id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error(response.statusText);

      const { data } = await response.json();

      dispatch(setSelectedUsersFollowing(data));
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };

  return { fetchSelectedUsersFollowing };
};

export default useFetchSelectedUsersFollowing;
