import { toast } from "react-toastify";

const useFetchPostLikes = () => {
  const fetchPostLikes = async (id: string | undefined) => {
    if (!id) return;
    try {
      const response = await fetch(
        `http://localhost:8000/api/users/post/post-likes/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.status === "fail" || data.status === "error") {
        throw new Error(data.message);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) throw toast.error(error.message);
    }
  };

  return { fetchPostLikes };
};

export default useFetchPostLikes;
