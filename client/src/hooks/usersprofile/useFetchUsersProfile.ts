import { toast } from "react-toastify";

const useFetchUsersProfile = () => {
  const fetchUsersProfile = async (id: string) => {
    if (!id) return;

    try {
      const response = await fetch(`/api/users/profile/${id}`, {
        method: "GET",
        credentials: "include",
      });

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
