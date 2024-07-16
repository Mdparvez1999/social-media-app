import { toast } from "react-toastify";
import { useAppSelector } from "../hooks";

const useFetchFollowers = () => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const fetchFollowers = async () => {
    try {
      const response = await fetch(`/api/users/followers/${currentUser?.id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error(response.statusText);

      const { data } = await response.json();

      return data;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
  };

  return { fetchFollowers };
};

export default useFetchFollowers;
