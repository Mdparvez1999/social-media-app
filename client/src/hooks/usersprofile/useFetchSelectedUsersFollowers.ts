import { toast } from "react-toastify";
import { useAppSelector } from "../hooks";

const UseFetchSelectedUsersFollowers = () => {
  const selectedUser = useAppSelector((state) => state.users.selectedUser);

  const fetchSelectedUsersFollowers = async () => {
    if (!selectedUser) return;
    try {
      const response = await fetch(`/api/users/followers/${selectedUser.id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();

      if (data.status === "fail" || data.status === "error")
        throw new Error(data.message);

      return data;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };

  return { fetchSelectedUsersFollowers };
};

export default UseFetchSelectedUsersFollowers;
