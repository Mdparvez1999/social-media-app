import { toast } from "react-toastify";

export const useFetchPost = () => {
  const fetchPostById = async (id: string | null) => {
    if (id) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/api/users/post/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();

        if (data.status === "fail" || data.status === "error") {
          throw new Error(data.message);
        }

        return data.data;
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
      }
    }
  };
  return { fetchPostById };
};
