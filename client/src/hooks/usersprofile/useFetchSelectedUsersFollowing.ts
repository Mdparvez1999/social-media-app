import { toast } from "react-toastify";
import { useAppSelector } from "../hooks";

const useFetchSelectedUsersFollowing = () => {
  const selectedUser = useAppSelector((state) => state.users.selectedUser);

  const fetchSelectedUsersFollowing = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/users/following/${selectedUser?.id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();

      if (data.status === "error" || data.status === "fail")
        throw new Error(data.message);

      return data;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return { fetchSelectedUsersFollowing };
};

export default useFetchSelectedUsersFollowing;
