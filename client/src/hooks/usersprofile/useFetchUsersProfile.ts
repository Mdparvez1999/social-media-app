import { toast } from "react-toastify";

const useFetchUsersProfile = () => {
  const fetchUsersProfile = async (id: string) => {
    if (!id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/users/profile/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();

      if (data.status === "error" || data.status === "fail")
        throw new Error(data.message);

      return data;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      console.log(error);
    }
  };

  return { fetchUsersProfile };
};

export default useFetchUsersProfile;
