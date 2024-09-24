import { toast } from "react-toastify";

const useFetchCurrentUsersProfile = () => {
  const fetchCurrentUserProfile = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/user/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.status === "fail" || data.status === "error")
        throw new Error(data.message);

      return data.data;
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
