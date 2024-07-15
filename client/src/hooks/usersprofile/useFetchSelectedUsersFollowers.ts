import { toast } from "react-toastify";
import { setSelectedUsersFollowers } from "../../redux-store/features/users/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks";

const UseFetchSelectedUsersFollowers = () => {
  const dispatch = useAppDispatch();

  const selectedUser = useAppSelector((state) => state.users.selectedUser);
  const fetchSelectedUsersFollowers = async () => {
    try {
      const response = await fetch(`/api/users/followers/${selectedUser?.id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error(response.statusText);

      const { data } = await response.json();

      dispatch(setSelectedUsersFollowers(data));
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };

  return { fetchSelectedUsersFollowers };
};

export default UseFetchSelectedUsersFollowers;
