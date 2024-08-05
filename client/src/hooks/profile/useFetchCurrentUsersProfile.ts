import { toast } from "react-toastify";

const useFetchCurrentUsersProfile = () => {
  const fetchCurrentUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error(response.statusText);

      const { data } = await response.json();

      if (data.status === "fail" || data.status === "error") {
        throw new Error(data.message);
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return toast.error(error.message);
      }

      return toast.error("Something went wrong");
    }
  };

  return { fetchCurrentUserProfile };
};

export default useFetchCurrentUsersProfile;
