import { toast } from "react-toastify";

export const useFetchPost = () => {
  const fetchPostById = async (id: string | null) => {
    if (id) {
      try {
        const response = await fetch(`/api/users/post/${id}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        console.log(data);

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
